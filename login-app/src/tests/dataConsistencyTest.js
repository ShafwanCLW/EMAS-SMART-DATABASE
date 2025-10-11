/**
 * Data Consistency Test Suite
 * Tests field mapping and data normalization between Cipta KIR and Profile KIR
 */

import { normalizeFieldNames, mapCiptaToProfile, mapProfileToCipta, isCiptaKIRField, isProfileKIRField } from '../utils/fieldMapper.js';
import { validateKIR, validate } from '../schema/validators.js';

// Test data samples
const testData = {
  // Cipta KIR format data
  ciptaKIR: {
    pendidikan: {
      tahap: 'Sarjana Muda',
      bidang: 'Kejuruteraan',
      institusi: 'Universiti Malaya',
      tahun_tamat: '2020'
    },
    pekerjaan: {
      status: 'Bekerja',
      jenis: 'Sektor Awam',
      majikan: 'Kementerian Pendidikan',
      pendapatan_bulanan: 5000,
      lokasi: 'Kuala Lumpur',
      pengalaman: '5 tahun'
    },
    kesihatan: {
      ringkasan: 'Sihat',
      kumpulan_darah: 'A+',
      catatan: 'Tiada masalah kesihatan'
    },
    kafa: {
      kafa_sumber: 'Masjid',
      kafa_iman: 'Baik',
      kafa_islam: 'Sederhana',
      kafa_fatihah: 'Lancar',
      kafa_solat: 'Baik',
      kafa_puasa: 'Sempurna',
      kafa_skor: 85
    },
    air: {
      nama_penuh: 'Ahmad bin Ali',
      no_kp: '001122334455',
      hubungan: 'Anak',
      jantina: 'Lelaki',
      umur: 15,
      status_perkahwinan: 'Bujang',
      pekerjaan: 'Pelajar',
      pendapatan_bulanan: 0
    },
    pasangan: {
      nama_penuh: 'Siti binti Ahmad',
      no_kp: '887766554433',
      umur: 35,
      pekerjaan: 'Guru',
      pendapatan_bulanan: 4500
    },
    pendapatan: {
      kategori: 'Tetap',
      sumber: 'Gaji',
      jumlah: 5000,
      catatan: 'Gaji bulanan'
    },
    perbelanjaan: {
      kategori: 'Makanan',
      jumlah: 800,
      catatan: 'Belanja harian'
    },
    bantuan_bulanan: {
      agensi: 'JKM',
      kadar: 300,
      kekerapan: 'Bulanan',
      cara_terima: 'Bank',
      catatan: 'Bantuan OKU'
    },
    dokumen: {
      kategori: 'KP',
      nama_fail: 'kad_pengenalan.pdf',
      url: 'https://example.com/doc.pdf',
      saiz: 1024,
      jenis: 'application/pdf'
    }
  },
  
  // Profile KIR format data
  profileKIR: {
    pendidikan: {
      tahap_pendidikan: 'Sarjana Muda',
      bidang_pengajian: 'Kejuruteraan',
      nama_sekolah: 'Universiti Malaya',
      tahun_tamat: '2020'
    },
    pekerjaan: {
      status_pekerjaan: 'Bekerja',
      jenis_pekerjaan: 'Sektor Awam',
      nama_majikan: 'Kementerian Pendidikan',
      gaji_bulanan: 5000,
      alamat_kerja: 'Kuala Lumpur',
      pengalaman_kerja: '5 tahun'
    },
    kesihatan: {
      ringkasan_kesihatan: 'Sihat',
      kumpulan_darah: 'A+',
      catatan_kesihatan: 'Tiada masalah kesihatan'
    },
    kafa: {
      kafa_sumber: 'Masjid',
      kafa_iman: 'Baik',
      kafa_islam: 'Sederhana',
      kafa_fatihah: 'Lancar',
      kafa_solat: 'Baik',
      kafa_puasa: 'Sempurna',
      kafa_skor: 85
    },
    air: {
      nama_penuh: 'Ahmad bin Ali',
      no_kp: '001122334455',
      hubungan: 'Anak',
      jantina: 'Lelaki',
      umur: 15,
      status_perkahwinan: 'Bujang',
      pekerjaan: 'Pelajar',
      pendapatan_bulanan: 0
    },
    pasangan: {
      nama_penuh: 'Siti binti Ahmad',
      no_kp: '887766554433',
      umur: 35,
      pekerjaan: 'Guru',
      pendapatan_bulanan: 4500
    },
    pendapatan: {
      kategori: 'Tetap',
      sumber: 'Gaji',
      jumlah: 5000,
      catatan: 'Gaji bulanan'
    },
    perbelanjaan: {
      kategori: 'Makanan',
      jumlah: 800,
      catatan: 'Belanja harian'
    },
    bantuan_bulanan: {
      agensi: 'JKM',
      kadar: 300,
      kekerapan: 'Bulanan',
      cara_terima: 'Bank',
      catatan: 'Bantuan OKU'
    },
    dokumen: {
      kategori: 'KP',
      nama_fail: 'kad_pengenalan.pdf',
      url: 'https://example.com/doc.pdf',
      saiz: 1024,
      jenis: 'application/pdf'
    }
  }
};

/**
 * Test field mapping functions
 */
function testFieldMapping() {
  console.log('=== Testing Field Mapping Functions ===');
  
  // Test Cipta to Profile mapping
  console.log('\n1. Testing Cipta KIR to Profile KIR mapping:');
  const mappedToProfile = mapCiptaToProfile('kir_pendidikan', testData.ciptaKIR.pendidikan);
  console.log('Original Cipta data:', testData.ciptaKIR.pendidikan);
  console.log('Mapped to Profile:', mappedToProfile);
  
  // Test Profile to Cipta mapping
  console.log('\n2. Testing Profile KIR to Cipta KIR mapping:');
  const mappedToCipta = mapProfileToCipta('kir_pendidikan', testData.profileKIR.pendidikan);
  console.log('Original Profile data:', testData.profileKIR.pendidikan);
  console.log('Mapped to Cipta:', mappedToCipta);
  
  // Test field normalization
  console.log('\n3. Testing field normalization:');
  const normalizedCipta = normalizeFieldNames('kir_pendidikan', testData.ciptaKIR.pendidikan);
  const normalizedProfile = normalizeFieldNames('kir_pendidikan', testData.profileKIR.pendidikan);
  console.log('Normalized Cipta data:', normalizedCipta);
  console.log('Normalized Profile data:', normalizedProfile);
  
  return {
    mappedToProfile,
    mappedToCipta,
    normalizedCipta,
    normalizedProfile
  };
}

/**
 * Test field detection functions
 */
function testFieldDetection() {
  console.log('\n=== Testing Field Detection Functions ===');
  
  // Test Cipta KIR field detection
  console.log('\n1. Testing Cipta KIR field detection:');
  const ciptaFields = ['tahap', 'bidang', 'status', 'jenis', 'ringkasan', 'catatan'];
  ciptaFields.forEach(field => {
    const isCipta = isCiptaKIRField('kir_pendidikan', field);
    console.log(`Field '${field}' is Cipta KIR: ${isCipta}`);
  });
  
  // Test Profile KIR field detection
  console.log('\n2. Testing Profile KIR field detection:');
  const profileFields = ['tahap_pendidikan', 'bidang_pengajian', 'status_pekerjaan', 'jenis_pekerjaan', 'ringkasan_kesihatan', 'catatan_kesihatan'];
  profileFields.forEach(field => {
    const isProfile = isProfileKIRField('kir_pendidikan', field);
    console.log(`Field '${field}' is Profile KIR: ${isProfile}`);
  });
}

/**
 * Test schema validation
 */
function testSchemaValidation() {
  console.log('\n=== Testing Schema Validation ===');
  
  // Test validation with normalized data
  console.log('\n1. Testing validation with Cipta KIR data:');
  const normalizedCiptaPendidikan = normalizeFieldNames('kir_pendidikan', testData.ciptaKIR.pendidikan);
  const ciptaValidation = validate('kir_pendidikan', normalizedCiptaPendidikan);
  console.log('Cipta validation result:', ciptaValidation);
  
  console.log('\n2. Testing validation with Profile KIR data:');
  const normalizedProfilePendidikan = normalizeFieldNames('kir_pendidikan', testData.profileKIR.pendidikan);
  const profileValidation = validate('kir_pendidikan', normalizedProfilePendidikan);
  console.log('Profile validation result:', profileValidation);
  
  return {
    ciptaValidation,
    profileValidation
  };
}

/**
 * Compare normalized data for semantic equivalence
 */
function compareNormalizedData(collection, ciptaData, profileData) {
  const ciptaNormalized = normalizeFieldNames(collection, ciptaData);
  const profileNormalized = normalizeFieldNames(collection, profileData);
  
  // Get all unique field names from both datasets
  const allFields = new Set([...Object.keys(ciptaNormalized), ...Object.keys(profileNormalized)]);
  
  let matchCount = 0;
  let totalFields = 0;
  
  allFields.forEach(field => {
    const ciptaValue = ciptaNormalized[field];
    const profileValue = profileNormalized[field];
    
    // Skip if field exists in only one dataset
    if (ciptaValue !== undefined && profileValue !== undefined) {
      totalFields++;
      
      // Convert to string for comparison to handle type differences
      const normalizedCiptaValue = String(ciptaValue || '').trim();
      const normalizedProfileValue = String(profileValue || '').trim();
      
      if (normalizedCiptaValue === normalizedProfileValue) {
        matchCount++;
      }
    }
  });
  
  // Return true if at least 80% of common fields match
  return totalFields > 0 && (matchCount / totalFields) >= 0.8;
}

/**
 * Test data consistency across all collections
 */
function testDataConsistency() {
  console.log('\n=== Testing Data Consistency Across Collections ===');
  
  const collections = [
    'kir_pendidikan', 'kir_pekerjaan', 'kir_kesihatan',
    'kir_kafa', 'kir_air', 'kir_pasangan', 'kir_pendapatan',
    'kir_perbelanjaan', 'kir_bantuan_bulanan', 'kir_dokumen'
  ];
  const results = {};
  
  collections.forEach(collection => {
    console.log(`\n--- Testing ${collection} ---`);
    
    const ciptaData = testData.ciptaKIR[collection.replace('kir_', '')];
    const profileData = testData.profileKIR[collection.replace('kir_', '')];
    
    if (ciptaData && profileData) {
      // Normalize both formats
      const normalizedCipta = normalizeFieldNames(collection, ciptaData);
      const normalizedProfile = normalizeFieldNames(collection, profileData);
      
      // Check semantic equivalence using improved comparison
      const fieldsMatch = compareNormalizedData(collection, ciptaData, profileData);
      
      console.log(`Original Cipta:`, ciptaData);
      console.log(`Original Profile:`, profileData);
      console.log(`Normalized Cipta:`, normalizedCipta);
      console.log(`Normalized Profile:`, normalizedProfile);
      console.log(`Fields match after normalization: ${fieldsMatch}`);
      
      results[collection] = {
        fieldsMatch,
        normalizedCipta,
        normalizedProfile
      };
    }
  });
  
  return results;
}

/**
 * Run comprehensive test suite
 */
export function runDataConsistencyTests() {
  console.log('🧪 Starting Data Consistency Test Suite');
  console.log('========================================');
  
  try {
    // Run all tests
    const mappingResults = testFieldMapping();
    testFieldDetection();
    const validationResults = testSchemaValidation();
    const consistencyResults = testDataConsistency();
    
    // Summary
    console.log('\n=== Test Summary ===');
    console.log('✅ Field mapping tests completed');
    console.log('✅ Field detection tests completed');
    console.log('✅ Schema validation tests completed');
    console.log('✅ Data consistency tests completed');
    
    // Check for any validation errors
    const hasValidationErrors = !validationResults.ciptaValidation.isValid || !validationResults.profileValidation.isValid;
    if (hasValidationErrors) {
      console.log('⚠️  Some validation errors found:');
      if (!validationResults.ciptaValidation.isValid) {
        console.log('   - Cipta validation errors:', validationResults.ciptaValidation.errors);
      }
      if (!validationResults.profileValidation.isValid) {
        console.log('   - Profile validation errors:', validationResults.profileValidation.errors);
      }
    }
    
    // Check consistency results
    const allConsistent = Object.values(consistencyResults).every(result => result.fieldsMatch);
    if (allConsistent) {
      console.log('✅ All data formats are consistent after normalization');
    } else {
      console.log('⚠️  Some data formats are not consistent:');
      Object.entries(consistencyResults).forEach(([collection, result]) => {
        if (!result.fieldsMatch) {
          console.log(`   - ${collection}: Fields do not match after normalization`);
        }
      });
    }
    
    return {
      success: true,
      mappingResults,
      validationResults,
      consistencyResults,
      allConsistent,
      hasValidationErrors
    };
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Export test functions for individual use
export {
  testFieldMapping,
  testFieldDetection,
  testSchemaValidation,
  testDataConsistency
};

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDataConsistencyTests();
}