// Dokumen Service
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
  serverTimestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../database/firebase.js';
import { COLLECTIONS, addStandardFields, createEnvFilter } from '../database/collections.js';

export class DokumenService {
  // List documents for a specific KIR
  static async listDokumen(kirId, kategori = null) {
    try {
      let q = collection(db, COLLECTIONS.KIR_DOKUMEN);
      const constraints = [where('kir_id', '==', kirId), createEnvFilter()];
      
      // Add kategori filter if specified
      if (kategori) {
        constraints.push(where('kategori', '==', kategori));
      }
      
      // Order by upload date (newest first)
      constraints.push(orderBy('uploadedAt', 'desc'));
      
      q = query(q, ...constraints);
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to JavaScript Date
        uploadedAt: doc.data().uploadedAt?.toDate()
      }));
    } catch (error) {
      console.error('Error listing dokumen:', error);
      throw new Error('Gagal memuat senarai dokumen: ' + error.message);
    }
  }
  
  // Upload document and store metadata
  static async uploadDokumen(kirId, file, kategori, uploadedBy = 'system') {
    try {
      // Validate file
      this.validateFile(file);
      
      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedFileName = this.sanitizeFileName(file.name);
      const fileName = `${timestamp}_${sanitizedFileName}`;
      const filePath = `dokumen/${kirId}/${fileName}`;
      
      // Upload file to Firebase Storage
      const storageRef = ref(storage, filePath);
      const uploadResult = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);
      
      // Store metadata in Firestore
      const metadata = {
        kir_id: kirId,
        name: file.name,
        fileName: fileName,
        url: downloadURL,
        size: file.size,
        mime: file.type,
        kategori: kategori,
        uploadedAt: serverTimestamp(),
        uploadedBy: uploadedBy,
        storagePath: filePath
      };
      
      const docRef = await addDoc(collection(db, COLLECTIONS.KIR_DOKUMEN), addStandardFields(metadata));
      
      return {
        id: docRef.id,
        ...metadata,
        uploadedAt: new Date() // Return current date for immediate UI update
      };
    } catch (error) {
      console.error('Error uploading dokumen:', error);
      throw new Error('Gagal memuat naik dokumen: ' + error.message);
    }
  }
  
  // Delete document and its metadata
  static async deleteDokumen(docId) {
    try {
      // Get document metadata first
      const docRef = doc(db, COLLECTIONS.KIR_DOKUMEN, docId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Dokumen tidak dijumpai');
      }
      
      const docData = docSnap.data();
      
      // Delete file from storage if storagePath exists
      if (docData.storagePath) {
        try {
          const storageRef = ref(storage, docData.storagePath);
          await deleteObject(storageRef);
        } catch (storageError) {
          console.warn('Warning: Could not delete file from storage:', storageError);
          // Continue with metadata deletion even if storage deletion fails
        }
      }
      
      // Delete metadata from Firestore
      await deleteDoc(docRef);
      
      return true;
    } catch (error) {
      console.error('Error deleting dokumen:', error);
      throw new Error('Gagal memadam dokumen: ' + error.message);
    }
  }
  
  // Update document metadata (e.g., kategori, name)
  static async updateDokumen(docId, updates) {
    try {
      const docRef = doc(db, COLLECTIONS.KIR_DOKUMEN, docId);
      
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updateData);
      
      return { id: docId, ...updateData };
    } catch (error) {
      console.error('Error updating dokumen:', error);
      throw new Error('Gagal mengemaskini dokumen: ' + error.message);
    }
  }
  
  // Get document by ID
  static async getDokumenById(docId) {
    try {
      const docRef = doc(db, COLLECTIONS.KIR_DOKUMEN, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          uploadedAt: docSnap.data().uploadedAt?.toDate()
        };
      } else {
        throw new Error('Dokumen tidak dijumpai');
      }
    } catch (error) {
      console.error('Error getting dokumen by ID:', error);
      throw new Error('Gagal memuat dokumen: ' + error.message);
    }
  }
  
  // Get document statistics for a KIR
  static async getDokumenStats(kirId) {
    try {
      const documents = await this.listDokumen(kirId);
      
      const stats = {
        total: documents.length,
        totalSize: documents.reduce((sum, doc) => sum + (doc.size || 0), 0),
        byKategori: {}
      };
      
      // Count by kategori
      documents.forEach(doc => {
        const kategori = doc.kategori || 'Lain-lain';
        stats.byKategori[kategori] = (stats.byKategori[kategori] || 0) + 1;
      });
      
      return stats;
    } catch (error) {
      console.error('Error getting dokumen stats:', error);
      throw new Error('Gagal memuat statistik dokumen: ' + error.message);
    }
  }
  
  // Validate file before upload
  static validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png'
    ];
    
    if (!file) {
      throw new Error('Tiada fail dipilih');
    }
    
    if (file.size > maxSize) {
      throw new Error('Saiz fail melebihi had maksimum 10MB');
    }
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Format fail tidak disokong. Hanya PDF, JPG, JPEG, dan PNG dibenarkan');
    }
    
    return true;
  }
  
  // Sanitize filename for storage
  static sanitizeFileName(fileName) {
    // Remove special characters and spaces, keep extension
    const extension = fileName.split('.').pop();
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
    const sanitized = nameWithoutExt
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    
    return `${sanitized}.${extension}`;
  }
  
  // Format file size for display
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  // Get file icon based on mime type
  static getFileIcon(mimeType) {
    if (!mimeType) return 'fas fa-file';
    
    if (mimeType.startsWith('image/')) {
      return 'fas fa-file-image';
    } else if (mimeType === 'application/pdf') {
      return 'fas fa-file-pdf';
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return 'fas fa-file-word';
    } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
      return 'fas fa-file-excel';
    } else if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) {
      return 'fas fa-file-powerpoint';
    } else if (mimeType.startsWith('text/')) {
      return 'fas fa-file-alt';
    } else if (mimeType.startsWith('video/')) {
      return 'fas fa-file-video';
    } else if (mimeType.startsWith('audio/')) {
      return 'fas fa-file-audio';
    } else {
      return 'fas fa-file';
    }
  }

  // Clean up old documents (optional maintenance)
  static async cleanupOldDocuments(daysOld = 365) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const q = query(
        collection(db, COLLECTIONS.KIR_DOKUMEN),
        where('uploadedAt', '<', cutoffDate),
        createEnvFilter()
      );
      
      const snapshot = await getDocs(q);
      const deletePromises = [];
      
      snapshot.docs.forEach(docSnap => {
        const data = docSnap.data();
        // Delete from storage
        if (data.storagePath) {
          const storageRef = ref(storage, data.storagePath);
          deletePromises.push(deleteObject(storageRef).catch(console.error));
        }
        // Delete document
        deletePromises.push(deleteDoc(doc(db, COLLECTIONS.KIR_DOKUMEN, docSnap.id)));
      });
      
      await Promise.all(deletePromises);
      
      return {
        success: true,
        deletedCount: snapshot.docs.length
      };
    } catch (error) {
      console.error('Error cleaning up old documents:', error);
      throw error;
    }
  }

  // Get kategori options for UI
  static getKategoriOptions() {
    return [
      'IC',
      'Sijil Nikah',
      'Surat Sokongan',
      'Laporan Perubatan',
      'Lain-lain'
    ];
  }

  // Format file size for display
  static formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  // Validate file before upload
  static validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (file.size > maxSize) {
      throw new Error('Saiz fail melebihi had maksimum 10MB');
    }
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Jenis fail tidak dibenarkan. Hanya PDF, JPG, PNG dan Word sahaja.');
    }
    
    return true;
  }
}

export default DokumenService;