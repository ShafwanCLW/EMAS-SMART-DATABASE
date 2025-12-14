// Profile photo management service
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../database/firebase.js';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export class ProfilePhotoService {
  static validateFile(file) {
    if (!file) {
      throw new Error('Tiada fail dipilih.');
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Saiz foto melebihi had maksimum 5MB.');
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Format foto tidak disokong. Hanya JPG, PNG atau WEBP dibenarkan.');
    }
  }

  static sanitizeFileName(name = '') {
    const safeName = name
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return safeName || 'profile-photo';
  }

  static async uploadProfilePhoto(kirId, file) {
    if (!kirId) {
      throw new Error('KIR ID tidak sah.');
    }
    this.validateFile(file);
    const timestamp = Date.now();
    const sanitized = this.sanitizeFileName(file.name);
    const storagePath = `profile-photos/${kirId}/${timestamp}-${sanitized}`;
    const storageRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return {
      url,
      storagePath,
      originalName: file.name
    };
  }

  static async deleteProfilePhoto(storagePath) {
    if (!storagePath) return;
    try {
      const photoRef = ref(storage, storagePath);
      await deleteObject(photoRef);
    } catch (error) {
      console.warn('ProfilePhotoService: gagal memadam fail lama', error);
    }
  }
}

export default ProfilePhotoService;
