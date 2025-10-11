/**
 * Field Mapper Utility - Handles field name standardization between Cipta KIR and Profile KIR
 * This ensures consistent data retrieval and storage across the application
 * 
 * NOTE: All collections now use standardized Cipta KIR field names for consistency.
 * Field mappings have been removed as both forms use the same field names.
 */

// Field mapping configurations for different collections
// All collections now use consistent field names - no mappings needed
const FIELD_MAPPINGS = {
  // All collections now use consistent Cipta KIR field names
  kir_pendidikan: {
    // No mappings needed - both forms use: tahap_pendidikan, bidang_pengajian, nama_sekolah
  },
  
  kir_pekerjaan: {
    // No mappings needed - both forms use: status_pekerjaan, jenis_pekerjaan, nama_majikan, gaji_bulanan, alamat_kerja, pengalaman_kerja
  },
  
  kir_kesihatan: {
    // No mappings needed - both forms use: catatan_kesihatan
  },
  
  // Collections with consistent field names (no mapping needed)
  kir_kafa: {
    // All fields are consistent between Cipta and Profile KIR
  },
  
  kir_air: {
    // All fields are consistent between Cipta and Profile KIR
  },
  
  kir_pasangan: {
    // All fields are consistent between Cipta and Profile KIR
  },
  
  kir_pendapatan: {
    // All fields are consistent between Cipta and Profile KIR
  },
  
  kir_perbelanjaan: {
    // All fields are consistent between Cipta and Profile KIR
  },
  
  kir_bantuan_bulanan: {
    // All fields are consistent between Cipta and Profile KIR
  },
  
  kir_dokumen: {
    // All fields are consistent between Cipta and Profile KIR
  }
};

/**
 * Maps field names from Cipta KIR format to Profile KIR format
 * @param {string} collection - Collection name (e.g., 'kir_pendidikan')
 * @param {Object} data - Data object with Cipta KIR field names
 * @returns {Object} Data object with Profile KIR field names
 * 
 * NOTE: Since all collections now use consistent field names, this function
 * returns the data unchanged. Kept for backward compatibility.
 */
export function mapCiptaToProfile(collection, data) {
  if (!data || typeof data !== 'object') {
    return data;
  }
  
  // No mapping needed - all collections use consistent field names
  return data;
}

/**
 * Maps field names from Profile KIR format to Cipta KIR format
 * @param {string} collection - Collection name (e.g., 'kir_pendidikan')
 * @param {Object} data - Data object with Profile KIR field names
 * @returns {Object} Data object with Cipta KIR field names
 * 
 * NOTE: Since all collections now use consistent field names, this function
 * returns the data unchanged. Kept for backward compatibility.
 */
export function mapProfileToCipta(collection, data) {
  if (!data || typeof data !== 'object') {
    return data;
  }
  
  // No mapping needed - all collections use consistent field names
  return data;
}

/**
 * Normalizes data to include both field name formats for maximum compatibility
 * @param {string} collection - Collection name
 * @param {Object} data - Data object
 * @returns {Object} Data object with both field name formats
 * 
 * NOTE: Since all collections now use consistent field names, this function
 * returns the data unchanged. Kept for backward compatibility.
 */
export function normalizeFieldNames(collection, data) {
  if (!data || typeof data !== 'object') {
    return data;
  }
  
  // No normalization needed - all collections use consistent field names
  return data;
}

/**
 * Checks if a field name is from Cipta KIR format
 * @param {string} collection - Collection name
 * @param {string} fieldName - Field name to check
 * @returns {boolean} True if it's a Cipta KIR field
 * 
 * NOTE: Since all collections now use consistent Cipta KIR field names,
 * this function always returns true. Kept for backward compatibility.
 */
export function isCiptaKIRField(collection, fieldName) {
  // All fields are now in Cipta KIR format
  return true;
}

/**
 * Checks if a field name is from Profile KIR format
 * @param {string} collection - Collection name
 * @param {string} fieldName - Field name to check
 * @returns {boolean} True if it's a Profile KIR field
 * 
 * NOTE: Since all collections now use consistent Cipta KIR field names,
 * this function always returns false. Kept for backward compatibility.
 */
export function isProfileKIRField(collection, fieldName) {
  // All fields are now in Cipta KIR format, no Profile KIR fields exist
  return false;
}

/**
 * Gets the standardized field name (prefers Cipta KIR format as primary)
 * @param {string} collection - Collection name
 * @param {string} fieldName - Field name to standardize
 * @returns {string} Standardized field name
 */
export function getStandardFieldName(collection, fieldName) {
  const mappings = FIELD_MAPPINGS[collection];
  if (!mappings) {
    return fieldName;
  }
  
  // If it's a Profile KIR field, return the Cipta KIR equivalent
  if (isProfileKIRField(collection, fieldName)) {
    return mappings[fieldName] || fieldName;
  }
  
  // Otherwise, return as-is (already in standard format or not mapped)
  return fieldName;
}

export { FIELD_MAPPINGS };