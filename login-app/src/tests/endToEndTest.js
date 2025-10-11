/**
 * End-to-End Test for Cipta KIR to Profile KIR Data Flow
 * Tests the complete workflow: Create in Cipta format → Store in DB → Retrieve for Profile
 */

import { 
  mapCiptaToProfile, 
  mapProfileToCipta, 
  normalizeFieldNames,
  isCiptaKIRField,
  isProfileKIRField,
  FIELD_MAPPINGS 
} from '../utils/fieldMapper.js';

/**
 * Simulate database storage and retrieval operations
 */
class MockDatabase {
  constructor() {
    this.collections = {
      kir_pendidikan: [],
      kir_pekerjaan: [],
      kir_kesihatan: [],
      kir_kafa: [],
      kir_air: [],
      kir_pasangan: [],
      kir_pendapatan: [],
      kir_perbelanjaan: [],
      kir_bantuan_bulanan: [],
      kir_dokumen: []
    };
  }

  // Simulate storing data (normalize before storage)
  async store(collection, data, sourceFormat = 'cipta') {
    const normalizedData = normalizeFieldNames(collection, data);
    const record = {
      id: Date.now() + Math.random(),
      ...normalizedData,
      sourceFormat,
      createdAt: new Date().toISOString()
    };
    
    this.collections[collection].push(record);
    console.log(`📝 Stored in ${collection}:`, record);
    return record;
  }

  // Simulate retrieving data for specific format
  async retrieve(collection, targetFormat = 'profile') {
    const records = this.collections[collection];
    
    return records.map(record => {
      const { id, sourceFormat, createdAt, ...data } = record;
      
      // Convert to target format if needed
      let convertedData = data;
      if (targetFormat === 'profile' && sourceFormat === 'cipta') {
        convertedData = mapCiptaToProfile(collection, data);
      } else if (targetFormat === 'cipta' && sourceFormat === 'profile') {
        convertedData = mapProfileToCipta(collection, data);
      }
      
      console.log(`📖 Retrieved from ${collection} for ${targetFormat}:`, convertedData);
      return { id, ...convertedData, sourceFormat, createdAt };
    });
  }

  // Clear all data
  clear() {
    Object.keys(this.collections).forEach(key => {
      this.collections[key] = [];
    });
  }
}

/**
 * Test data samples
 */
const testData = {
  kir_pendidikan: {
    cipta: {
      tahap: 'Sarjana Muda',
      bidang: 'Kejuruteraan Perisian',
      institusi: 'Universiti Teknologi Malaysia',
      tahun_tamat: '2021'
    },
    profile: {
      tahap_pendidikan: 'Sarjana Muda',
      bidang_pengajian: 'Kejuruteraan Perisian',
      nama_sekolah: 'Universiti Teknologi Malaysia',
      tahun_tamat: '2021'
    }
  },
  kir_pekerjaan: {
    cipta: {
      status: 'Bekerja',
      jenis: 'Sektor Swasta',
      majikan: 'Tech Solutions Sdn Bhd',
      pendapatan_bulanan: '5000',
      lokasi: 'Kuala Lumpur',
      pengalaman: '3 tahun'
    },
    profile: {
      status_pekerjaan: 'Bekerja',
      jenis_pekerjaan: 'Sektor Swasta',
      nama_majikan: 'Tech Solutions Sdn Bhd',
      gaji_bulanan: '5000',
      alamat_kerja: 'Kuala Lumpur',
      pengalaman_kerja: '3 tahun'
    }
  },
  kir_kesihatan: {
    cipta: {
      catatan: 'Sihat dan cergas'
    },
    profile: {
      catatan_kesihatan: 'Sihat dan cergas'
    }
  },
  kir_kafa: {
    cipta: {
      kafa_sumber: 'Masjid',
      kafa_iman: 'Baik',
      kafa_islam: 'Sederhana',
      kafa_fatihah: 'Lancar',
      kafa_solat: 'Baik',
      kafa_puasa: 'Sempurna',
      kafa_skor: 85
    },
    profile: {
      kafa_sumber: 'Masjid',
      kafa_iman: 'Baik',
      kafa_islam: 'Sederhana',
      kafa_fatihah: 'Lancar',
      kafa_solat: 'Baik',
      kafa_puasa: 'Sempurna',
      kafa_skor: 85
    }
  },
  kir_air: {
    cipta: {
      nama_penuh: 'Ahmad bin Ali',
      no_kp: '001122334455',
      hubungan: 'Anak',
      jantina: 'Lelaki',
      umur: 15,
      status_perkahwinan: 'Bujang',
      pekerjaan: 'Pelajar',
      pendapatan_bulanan: 0
    },
    profile: {
      nama_penuh: 'Ahmad bin Ali',
      no_kp: '001122334455',
      hubungan: 'Anak',
      jantina: 'Lelaki',
      umur: 15,
      status_perkahwinan: 'Bujang',
      pekerjaan: 'Pelajar',
      pendapatan_bulanan: 0
    }
  },
  kir_pasangan: {
    cipta: {
      nama_penuh: 'Siti binti Ahmad',
      no_kp: '887766554433',
      umur: 35,
      pekerjaan: 'Guru',
      pendapatan_bulanan: 4500
    },
    profile: {
      nama_penuh: 'Siti binti Ahmad',
      no_kp: '887766554433',
      umur: 35,
      pekerjaan: 'Guru',
      pendapatan_bulanan: 4500
    }
  },
  kir_pendapatan: {
    cipta: {
      kategori: 'Tetap',
      sumber: 'Gaji',
      jumlah: 5000,
      catatan: 'Gaji bulanan'
    },
    profile: {
      kategori: 'Tetap',
      sumber: 'Gaji',
      jumlah: 5000,
      catatan: 'Gaji bulanan'
    }
  },
  kir_perbelanjaan: {
    cipta: {
      kategori: 'Makanan',
      jumlah: 800,
      catatan: 'Belanja harian'
    },
    profile: {
      kategori: 'Makanan',
      jumlah: 800,
      catatan: 'Belanja harian'
    }
  },
  kir_bantuan_bulanan: {
    cipta: {
      agensi: 'JKM',
      kadar: 300,
      kekerapan: 'Bulanan',
      cara_terima: 'Bank',
      catatan: 'Bantuan OKU'
    },
    profile: {
      agensi: 'JKM',
      kadar: 300,
      kekerapan: 'Bulanan',
      cara_terima: 'Bank',
      catatan: 'Bantuan OKU'
    }
  },
  kir_dokumen: {
    cipta: {
      kategori: 'KP',
      nama_fail: 'kad_pengenalan.pdf',
      url: 'https://example.com/doc.pdf',
      saiz: 1024,
      jenis: 'application/pdf'
    },
    profile: {
      kategori: 'KP',
      nama_fail: 'kad_pengenalan.pdf',
      url: 'https://example.com/doc.pdf',
      saiz: 1024,
      jenis: 'application/pdf'
    }
  }
};

/**
 * Validate data equivalence after conversion
 */
function validateDataEquivalence(original, converted, collection) {
  const mappings = FIELD_MAPPINGS[collection];
  if (!mappings) return false;

  let matches = 0;
  let total = 0;

  // For collections with consistent field names (empty mappings), compare fields directly
  if (Object.keys(mappings).length === 0) {
    // Compare common fields directly
    Object.keys(original).forEach(field => {
      if (converted[field] !== undefined) {
        const originalValue = String(original[field] || '').trim();
        const convertedValue = String(converted[field] || '').trim();
        
        if (originalValue && convertedValue) {
          total++;
          if (originalValue === convertedValue) {
            matches++;
          } else {
            console.log(`❌ Mismatch: ${field}='${originalValue}' vs ${field}='${convertedValue}'`);
          }
        }
      }
    });
  } else {
    // Check each mapped field pair
    Object.entries(mappings).forEach(([sourceField, targetField]) => {
      const originalValue = String(original[sourceField] || '').trim();
      const convertedValue = String(converted[targetField] || '').trim();
      
      if (originalValue && convertedValue) {
        total++;
        if (originalValue === convertedValue) {
          matches++;
        } else {
          console.log(`❌ Mismatch: ${sourceField}='${originalValue}' vs ${targetField}='${convertedValue}'`);
        }
      }
    });
  }

  const matchPercentage = total > 0 ? (matches / total) * 100 : 0;
  console.log(`✅ Data equivalence: ${matches}/${total} fields match (${matchPercentage.toFixed(1)}%)`);
  
  return matchPercentage >= 80; // 80% threshold for success
}

/**
 * Run comprehensive end-to-end tests
 */
export async function runEndToEndTests() {
  console.log('🚀 Starting End-to-End Test Suite');
  console.log('='.repeat(50));
  
  const db = new MockDatabase();
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    details: []
  };

  // Test each collection - now includes all KIR collections
  for (const [collection, data] of Object.entries(testData)) {
    console.log(`\n🧪 Testing ${collection.toUpperCase()}`);
    console.log('-'.repeat(30));
    
    // Clear database
    db.clear();
    
    // Test 1: Cipta → Database → Profile retrieval
    console.log('\n📝 Test 1: Cipta KIR → Database → Profile KIR');
    results.total++;
    
    try {
      // Step 1: Store Cipta data
      await db.store(collection, data.cipta, 'cipta');
      
      // Step 2: Retrieve for Profile format
      const profileResults = await db.retrieve(collection, 'profile');
      
      // Step 3: Validate data equivalence
      const isValid = validateDataEquivalence(data.cipta, profileResults[0], collection);
      
      if (isValid) {
        console.log('✅ Test 1 PASSED: Cipta → Profile conversion successful');
        results.passed++;
      } else {
        console.log('❌ Test 1 FAILED: Data equivalence check failed');
        results.failed++;
      }
      
      results.details.push({
        collection,
        test: 'Cipta → Profile',
        status: isValid ? 'PASSED' : 'FAILED',
        data: { original: data.cipta, converted: profileResults[0] }
      });
      
    } catch (error) {
      console.log('❌ Test 1 FAILED with error:', error.message);
      results.failed++;
      results.details.push({
        collection,
        test: 'Cipta → Profile',
        status: 'ERROR',
        error: error.message
      });
    }
    
    // Test 2: Profile → Database → Cipta retrieval
    console.log('\n📝 Test 2: Profile KIR → Database → Cipta KIR');
    results.total++;
    
    try {
      // Clear and store Profile data
      db.clear();
      await db.store(collection, data.profile, 'profile');
      
      // Retrieve for Cipta format
      const ciptaResults = await db.retrieve(collection, 'cipta');
      
      // Validate data equivalence
      const isValid = validateDataEquivalence(data.profile, ciptaResults[0], collection);
      
      if (isValid) {
        console.log('✅ Test 2 PASSED: Profile → Cipta conversion successful');
        results.passed++;
      } else {
        console.log('❌ Test 2 FAILED: Data equivalence check failed');
        results.failed++;
      }
      
      results.details.push({
        collection,
        test: 'Profile → Cipta',
        status: isValid ? 'PASSED' : 'FAILED',
        data: { original: data.profile, converted: ciptaResults[0] }
      });
      
    } catch (error) {
      console.log('❌ Test 2 FAILED with error:', error.message);
      results.failed++;
      results.details.push({
        collection,
        test: 'Profile → Cipta',
        status: 'ERROR',
        error: error.message
      });
    }
  }
  
  // Print final results
  console.log('\n' + '='.repeat(50));
  console.log('📊 END-TO-END TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${results.total}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  
  if (results.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Data flow is working correctly.');
    console.log('✅ Cipta KIR data will be properly retrieved in Profile KIR format.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the issues above.');
  }
  
  return results;
}

// Export for use in other modules
export { MockDatabase, testData, validateDataEquivalence };

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runEndToEndTests();
}