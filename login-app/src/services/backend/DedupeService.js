// S4: DedupeService - Handle duplicate KIR records by normalized no_kp
import { db } from '../database/firebase.js';
import { collection, getDocs, query, where, doc, deleteDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { COLLECTIONS, getEnvironment } from '../database/collections.js';

export class DedupeService {
  
  // Find duplicate KIR records based on normalized no_kp
  static async findDuplicateRecords() {
    console.log('Finding duplicate KIR records...');
    
    try {
      const currentEnv = getEnvironment();
      
      // Get all KIR records for current environment
      const kirQuery = query(
        collection(db, COLLECTIONS.KIR),
        where('env', '==', currentEnv)
      );
      const kirSnapshot = await getDocs(kirQuery);
      
      // Group records by normalized no_kp
      const recordsByNoKp = new Map();
      
      for (const docSnapshot of kirSnapshot.docs) {
        const data = docSnapshot.data();
        const normalizedNoKp = data.no_kp_normalized;
        
        if (normalizedNoKp) {
          if (!recordsByNoKp.has(normalizedNoKp)) {
            recordsByNoKp.set(normalizedNoKp, []);
          }
          
          recordsByNoKp.get(normalizedNoKp).push({
            id: docSnapshot.id,
            ...data
          });
        }
      }
      
      // Find groups with more than one record (duplicates)
      const duplicateGroups = [];
      
      for (const [normalizedNoKp, records] of recordsByNoKp.entries()) {
        if (records.length > 1) {
          // Sort records by creation date (oldest first) to determine primary
          records.sort((a, b) => {
            const aTime = a.created_at?.seconds || 0;
            const bTime = b.created_at?.seconds || 0;
            return aTime - bTime;
          });
          
          duplicateGroups.push({
            normalizedNoKp,
            records,
            count: records.length
          });
        }
      }
      
      console.log(`Found ${duplicateGroups.length} duplicate groups`);
      return duplicateGroups;
      
    } catch (error) {
      console.error('Error finding duplicate records:', error);
      throw new Error(`Failed to find duplicates: ${error.message}`);
    }
  }
  
  // Merge duplicate records into the primary record
  static async mergeRecords(records) {
    console.log(`Merging ${records.length} duplicate records...`);
    
    if (records.length < 2) {
      throw new Error('At least 2 records are required for merging');
    }
    
    try {
      const currentEnv = getEnvironment();
      
      // Validate environment
      if (currentEnv === 'production') {
        throw new Error('Merge operations are not allowed in production environment');
      }
      
      // Primary record is the first one (oldest)
      const primaryRecord = records[0];
      const duplicateRecords = records.slice(1);
      
      console.log(`Primary record: ${primaryRecord.id}`);
      console.log(`Duplicate records to merge: ${duplicateRecords.map(r => r.id).join(', ')}`);
      
      // Start batch operation
      const batch = writeBatch(db);
      
      // Step 1: Merge data from duplicates into primary record
      const mergedData = await this.mergeRecordData(primaryRecord, duplicateRecords);
      
      // Update primary record with merged data
      const primaryDocRef = doc(db, COLLECTIONS.KIR, primaryRecord.id);
      batch.update(primaryDocRef, {
        ...mergedData,
        updated_at: new Date(),
        merge_history: {
          merged_at: new Date(),
          merged_records: duplicateRecords.map(r => r.id),
          merge_count: duplicateRecords.length
        }
      });
      
      // Step 2: Update related records to point to primary record
      await this.updateRelatedRecords(batch, duplicateRecords, primaryRecord.id);
      
      // Step 3: Delete duplicate KIR records
      for (const duplicate of duplicateRecords) {
        const duplicateDocRef = doc(db, COLLECTIONS.KIR, duplicate.id);
        batch.delete(duplicateDocRef);
      }
      
      // Step 4: Clean up duplicate index entries
      await this.cleanupIndexEntries(batch, duplicateRecords, primaryRecord.no_kp_normalized);
      
      // Commit the batch
      await batch.commit();
      
      console.log(`Successfully merged ${duplicateRecords.length} records into ${primaryRecord.id}`);
      
      return {
        primaryRecordId: primaryRecord.id,
        mergedCount: duplicateRecords.length,
        mergedRecordIds: duplicateRecords.map(r => r.id)
      };
      
    } catch (error) {
      console.error('Error merging records:', error);
      throw new Error(`Failed to merge records: ${error.message}`);
    }
  }
  
  // Merge data from multiple records into a single record
  static async mergeRecordData(primaryRecord, duplicateRecords) {
    console.log('Merging record data...');
    
    const mergedData = { ...primaryRecord };
    
    // Fields to merge (prefer non-empty values)
    const fieldsToMerge = [
      'nama', 'no_kp', 'jantina', 'bangsa', 'agama', 'status_perkahwinan',
      'alamat_rumah', 'poskod', 'daerah', 'negeri', 'no_telefon', 'email',
      'pekerjaan', 'pendapatan_bulanan', 'status_rumah', 'bilangan_anak',
      'nama_waris', 'hubungan_waris', 'no_telefon_waris'
    ];
    
    // Merge basic fields
    for (const field of fieldsToMerge) {
      for (const duplicate of duplicateRecords) {
        if (duplicate[field] && !mergedData[field]) {
          mergedData[field] = duplicate[field];
        }
      }
    }
    
    // Merge arrays (combine unique values)
    const arrayFields = ['pendapatan_tetap', 'pendapatan_tidak_tetap', 'bantuan_kerajaan'];
    
    for (const field of arrayFields) {
      const combinedArray = new Set();
      
      // Add values from primary record
      if (Array.isArray(mergedData[field])) {
        mergedData[field].forEach(item => combinedArray.add(JSON.stringify(item)));
      }
      
      // Add values from duplicate records
      for (const duplicate of duplicateRecords) {
        if (Array.isArray(duplicate[field])) {
          duplicate[field].forEach(item => combinedArray.add(JSON.stringify(item)));
        }
      }
      
      // Convert back to array
      mergedData[field] = Array.from(combinedArray).map(item => JSON.parse(item));
    }
    
    // Update metadata
    mergedData.updated_at = new Date();
    mergedData.merge_source_count = duplicateRecords.length;
    
    return mergedData;
  }
  
  // Update related records to point to the primary record
  static async updateRelatedRecords(batch, duplicateRecords, primaryRecordId) {
    console.log('Updating related records...');
    
    const relatedCollections = [
      COLLECTIONS.KIR_KAFA,
      COLLECTIONS.KIR_PENDIDIKAN,
      COLLECTIONS.KIR_PEKERJAAN,
      COLLECTIONS.KIR_KELUARGA
    ];
    
    for (const collectionName of relatedCollections) {
      try {
        const collectionRef = collection(db, collectionName);
        
        for (const duplicate of duplicateRecords) {
          // Find related records for this duplicate
          const relatedQuery = query(collectionRef, where('kir_id', '==', duplicate.id));
          const relatedSnapshot = await getDocs(relatedQuery);
          
          // Update each related record to point to primary record
          for (const relatedDoc of relatedSnapshot.docs) {
            const relatedDocRef = doc(db, collectionName, relatedDoc.id);
            batch.update(relatedDocRef, {
              kir_id: primaryRecordId,
              updated_at: new Date(),
              merge_note: `Updated from ${duplicate.id} to ${primaryRecordId} during merge`
            });
          }
        }
      } catch (error) {
        console.warn(`Could not update related records in ${collectionName}:`, error.message);
      }
    }
  }
  
  // Clean up duplicate index entries
  static async cleanupIndexEntries(batch, duplicateRecords, normalizedNoKp) {
    console.log('Cleaning up index entries...');
    
    try {
      // The index should only have one entry per normalized no_kp
      // We keep the entry pointing to the primary record and remove any others
      
      const indexSnapshot = await getDocs(collection(db, COLLECTIONS.INDEX_NOKP));
      
      for (const indexDoc of indexSnapshot.docs) {
        const indexData = indexDoc.data();
        
        // Check if this index entry points to any of the duplicate records
        const isDuplicateIndex = duplicateRecords.some(duplicate => 
          indexData.kir_id === duplicate.id
        );
        
        if (isDuplicateIndex) {
          // Delete this index entry as it points to a record being deleted
          const indexDocRef = doc(db, COLLECTIONS.INDEX_NOKP, indexDoc.id);
          batch.delete(indexDocRef);
        }
      }
      
    } catch (error) {
      console.warn('Could not cleanup index entries:', error.message);
    }
  }
  
  // Get detailed information about a specific duplicate group
  static async getDuplicateGroupDetails(normalizedNoKp) {
    console.log(`Getting details for duplicate group: ${normalizedNoKp}`);
    
    try {
      const currentEnv = getEnvironment();
      
      // Get KIR records with this normalized no_kp
      const kirQuery = query(
        collection(db, COLLECTIONS.KIR),
        where('env', '==', currentEnv),
        where('no_kp_normalized', '==', normalizedNoKp)
      );
      const kirSnapshot = await getDocs(kirQuery);
      
      const records = [];
      
      for (const docSnapshot of kirSnapshot.docs) {
        const data = docSnapshot.data();
        
        // Get related records count
        const relatedCounts = await this.getRelatedRecordsCounts(docSnapshot.id);
        
        records.push({
          id: docSnapshot.id,
          ...data,
          relatedCounts
        });
      }
      
      // Sort by creation date
      records.sort((a, b) => {
        const aTime = a.created_at?.seconds || 0;
        const bTime = b.created_at?.seconds || 0;
        return aTime - bTime;
      });
      
      return {
        normalizedNoKp,
        records,
        count: records.length,
        primary: records[0]
      };
      
    } catch (error) {
      console.error('Error getting duplicate group details:', error);
      throw new Error(`Failed to get group details: ${error.message}`);
    }
  }
  
  // Get counts of related records for a KIR record
  static async getRelatedRecordsCounts(kirId) {
    const counts = {};
    
    const relatedCollections = [
      { name: COLLECTIONS.KIR_KAFA, label: 'kafa' },
      { name: COLLECTIONS.KIR_PENDIDIKAN, label: 'pendidikan' },
      { name: COLLECTIONS.KIR_PEKERJAAN, label: 'pekerjaan' },
      { name: COLLECTIONS.KIR_KELUARGA, label: 'keluarga' }
    ];
    
    for (const col of relatedCollections) {
      try {
        const relatedQuery = query(
          collection(db, col.name),
          where('kir_id', '==', kirId)
        );
        const relatedSnapshot = await getDocs(relatedQuery);
        counts[col.label] = relatedSnapshot.size;
      } catch (error) {
        console.warn(`Could not count ${col.label} records:`, error.message);
        counts[col.label] = 0;
      }
    }
    
    return counts;
  }
  
  // Validate environment before performing destructive operations
  static validateEnvironment() {
    const currentEnv = getEnvironment();
    
    if (currentEnv === 'production') {
      throw new Error('Dedupe operations are not allowed in production environment');
    }
    
    return currentEnv;
  }
  
  // Get statistics about duplicate records
  static async getDuplicateStatistics() {
    console.log('Getting duplicate statistics...');
    
    try {
      const duplicateGroups = await this.findDuplicateRecords();
      
      const stats = {
        totalGroups: duplicateGroups.length,
        totalDuplicateRecords: duplicateGroups.reduce((sum, group) => sum + group.count - 1, 0),
        totalRecordsAffected: duplicateGroups.reduce((sum, group) => sum + group.count, 0),
        groupSizes: {},
        largestGroup: null
      };
      
      // Analyze group sizes
      let largestGroupSize = 0;
      
      for (const group of duplicateGroups) {
        const size = group.count;
        stats.groupSizes[size] = (stats.groupSizes[size] || 0) + 1;
        
        if (size > largestGroupSize) {
          largestGroupSize = size;
          stats.largestGroup = {
            normalizedNoKp: group.normalizedNoKp,
            count: size,
            records: group.records.map(r => ({ id: r.id, nama: r.nama }))
          };
        }
      }
      
      return stats;
      
    } catch (error) {
      console.error('Error getting duplicate statistics:', error);
      throw new Error(`Failed to get statistics: ${error.message}`);
    }
  }
}