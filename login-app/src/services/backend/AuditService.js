// Audit Trail Service
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../database/firebase.js';

export class AuditService {
  // List audit logs for a specific KIR
  static async listAuditForKir(kirId, options = {}) {
    try {
      const { entiti, dateFrom, dateTo, limit: queryLimit = 100 } = options;
      
      let q = collection(db, 'audit_log');
      const constraints = [where('entiti_id', '==', kirId)];
      
      // Add entiti filter
      if (entiti) {
        constraints.push(where('entiti', '==', entiti));
      }
      
      // Add date range filter
      if (dateFrom) {
        constraints.push(where('tarikh', '>=', new Date(dateFrom)));
      }
      if (dateTo) {
        constraints.push(where('tarikh', '<=', new Date(dateTo)));
      }
      
      // Order by date (newest first) and add limit
      constraints.push(orderBy('tarikh', 'desc'));
      constraints.push(limit(queryLimit));
      
      q = query(q, ...constraints);
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to JavaScript Date
        tarikh: doc.data().tarikh?.toDate()
      }));
    } catch (error) {
      console.error('Error listing audit logs:', error);
      throw new Error('Gagal memuat log audit: ' + error.message);
    }
  }
  
  // Create audit log entry
  static async createAuditLog(entiti, entiti_id, medan, sebelum, selepas, pengguna = 'system') {
    try {
      const auditData = {
        entiti: entiti,
        entiti_id: entiti_id,
        medan: medan,
        sebelum: this.sanitizeValue(sebelum),
        selepas: this.sanitizeValue(selepas),
        pengguna: pengguna,
        tarikh: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'audit_log'), auditData);
      
      return {
        id: docRef.id,
        ...auditData,
        tarikh: new Date() // Return current date for immediate use
      };
    } catch (error) {
      console.error('Error creating audit log:', error);
      // Don't throw error for audit logging failures to avoid breaking main operations
      console.warn('Audit logging failed, continuing with main operation');
      return null;
    }
  }
  
  // Create multiple audit logs for bulk changes
  static async createBulkAuditLogs(entiti, entiti_id, changes, pengguna = 'system') {
    try {
      const promises = Object.entries(changes).map(([medan, { sebelum, selepas }]) => {
        return this.createAuditLog(entiti, entiti_id, medan, sebelum, selepas, pengguna);
      });
      
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Error creating bulk audit logs:', error);
      console.warn('Bulk audit logging failed, continuing with main operation');
      return false;
    }
  }
  
  // Log KIR changes
  static async logKIRChange(kirId, medan, sebelum, selepas, pengguna = 'system') {
    return this.createAuditLog('kir', kirId, medan, sebelum, selepas, pengguna);
  }
  
  // Log AIR changes
  static async logAIRChange(kirId, medan, sebelum, selepas, pengguna = 'system') {
    return this.createAuditLog('kir_air', kirId, medan, sebelum, selepas, pengguna);
  }
  
  // Log Pasangan changes
  static async logPasanganChange(kirId, medan, sebelum, selepas, pengguna = 'system') {
    return this.createAuditLog('kir_pasangan', kirId, medan, sebelum, selepas, pengguna);
  }
  
  // Log Pendapatan changes
  static async logPendapatanChange(kirId, medan, sebelum, selepas, pengguna = 'system') {
    return this.createAuditLog('kir_pendapatan', kirId, medan, sebelum, selepas, pengguna);
  }
  
  // Log Perbelanjaan changes
  static async logPerbelanjaanChange(kirId, medan, sebelum, selepas, pengguna = 'system') {
    return this.createAuditLog('kir_perbelanjaan', kirId, medan, sebelum, selepas, pengguna);
  }
  
  // Log Bantuan changes
  static async logBantuanChange(kirId, medan, sebelum, selepas, pengguna = 'system') {
    return this.createAuditLog('kir_bantuan', kirId, medan, sebelum, selepas, pengguna);
  }
  
  // Log Program & Kehadiran changes
  static async logProgramChange(kirId, medan, sebelum, selepas, pengguna = 'system') {
    return this.createAuditLog('kir_program', kirId, medan, sebelum, selepas, pengguna);
  }
  
  // Log Dokumen changes
  static async logDokumenChange(kirId, medan, sebelum, selepas, pengguna = 'system') {
    return this.createAuditLog('kir_dokumen', kirId, medan, sebelum, selepas, pengguna);
  }
  
  // Get audit statistics for a KIR
  static async getAuditStats(kirId, days = 30) {
    try {
      const dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - days);
      
      const logs = await this.listAuditForKir(kirId, { 
        dateFrom: dateFrom.toISOString().split('T')[0],
        limit: 1000 
      });
      
      const stats = {
        total: logs.length,
        byEntiti: {},
        byPengguna: {},
        recentActivity: logs.slice(0, 10) // Last 10 activities
      };
      
      logs.forEach(log => {
        // Count by entiti
        stats.byEntiti[log.entiti] = (stats.byEntiti[log.entiti] || 0) + 1;
        
        // Count by pengguna
        stats.byPengguna[log.pengguna] = (stats.byPengguna[log.pengguna] || 0) + 1;
      });
      
      return stats;
    } catch (error) {
      console.error('Error getting audit stats:', error);
      throw new Error('Gagal memuat statistik audit: ' + error.message);
    }
  }
  
  // Compare objects and generate change log
  static generateChangeLog(oldData, newData, excludeFields = ['tarikh_kemas_kini', 'updatedAt']) {
    const changes = {};
    
    // Get all unique keys from both objects
    const allKeys = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]);
    
    allKeys.forEach(key => {
      // Skip excluded fields
      if (excludeFields.includes(key)) return;
      
      const oldValue = oldData?.[key];
      const newValue = newData?.[key];
      
      // Check if values are different
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes[key] = {
          sebelum: oldValue,
          selepas: newValue
        };
      }
    });
    
    return changes;
  }
  
  // Sanitize values for storage (handle large objects)
  static sanitizeValue(value) {
    if (value === null || value === undefined) {
      return null;
    }
    
    // Convert to string and limit length for large values
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    
    // Limit to 500 characters to avoid large audit logs
    if (stringValue.length > 500) {
      return stringValue.substring(0, 497) + '...';
    }
    
    return stringValue;
  }
  
  // Format audit log for display
  static formatAuditLog(log) {
    const entitiFriendlyNames = {
      'kir': 'KIR',
      'kir_air': 'Ahli Isi Rumah',
      'kir_pasangan': 'Pasangan',
      'kir_pendapatan': 'Pendapatan',
      'kir_perbelanjaan': 'Perbelanjaan',
      'kir_bantuan': 'Bantuan',
      'kir_program': 'Program & Kehadiran',
      'kir_dokumen': 'Dokumen'
    };
    
    return {
      ...log,
      entitiFriendlyName: entitiFriendlyNames[log.entiti] || log.entiti,
      formattedDate: log.tarikh ? this.formatDate(log.tarikh) : 'Tidak diketahui'
    };
  }
  
  // Format date for display
  static formatDate(date) {
    if (!date) return 'Tidak diketahui';
    
    try {
      return new Date(date).toLocaleString('ms-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Tarikh tidak sah';
    }
  }
  
  // Clean up old audit logs (maintenance function)
  static async cleanupOldLogs(daysToKeep = 365) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      const oldLogsQuery = query(
        collection(db, 'audit_log'),
        where('tarikh', '<', cutoffDate),
        limit(100) // Process in batches
      );
      
      const snapshot = await getDocs(oldLogsQuery);
      
      if (snapshot.empty) {
        return { deleted: 0, message: 'Tiada log lama untuk dipadam' };
      }
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      return { 
        deleted: snapshot.docs.length, 
        message: `${snapshot.docs.length} log lama telah dipadam` 
      };
    } catch (error) {
      console.error('Error cleaning up old logs:', error);
      throw new Error('Gagal membersihkan log lama: ' + error.message);
    }
  }

  // Format audit log for display
  static formatAuditLog(log) {
    const entitiFriendlyNames = {
      'kir': 'KIR',
      'kir_air': 'AIR',
      'kir_pasangan': 'Pasangan',
      'kir_pendapatan': 'Pendapatan',
      'kir_perbelanjaan': 'Perbelanjaan',
      'kir_bantuan': 'Bantuan',
      'program': 'Program',
      'kehadiran_program': 'Kehadiran Program',
      'kir_dokumen': 'Dokumen'
    };
    
    const formattedDate = log.tarikh && log.tarikh.toDate ? 
      log.tarikh.toDate().toLocaleString('ms-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }) : 
      new Date(log.tarikh).toLocaleString('ms-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    
    return {
      ...log,
      entitiFriendlyName: entitiFriendlyNames[log.entiti] || log.entiti,
      formattedDate
    };
  }

  // Get entity options for filter
  static getEntityOptions() {
    return [
      { value: '', label: 'Semua Entiti' },
      { value: 'kir', label: 'KIR' },
      { value: 'kir_air', label: 'AIR' },
      { value: 'kir_pasangan', label: 'Pasangan' },
      { value: 'kir_pendapatan', label: 'Pendapatan' },
      { value: 'kir_perbelanjaan', label: 'Perbelanjaan' },
      { value: 'kir_bantuan', label: 'Bantuan' },
      { value: 'kir_program', label: 'Program & Kehadiran' },
      { value: 'kir_dokumen', label: 'Dokumen' }
    ];
  }
}

export default AuditService;