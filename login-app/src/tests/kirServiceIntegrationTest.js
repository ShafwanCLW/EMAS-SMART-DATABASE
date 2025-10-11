/**
 * KIR Service Integration Test (Mocked)
 * Tests the complete data flow using field mapping logic
 * Validates: Cipta KIR creation → Field normalization → Profile KIR retrieval
 */

import { 
  mapCiptaToProfile, 
  mapProfileToCipta, 
  normalizeFieldNames,
  FIELD_MAPPINGS 
} from '../utils/fieldMapper.js';

/**
 * Mock KIR Service that simulates database operations
 */
class MockKIRService {
  constructor() {
    this.kirRecords = new Map();
    this.relatedDocuments = new Map();
  }

  async createKIR(data) {
    const id = `kir_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const record = {
      id,
      ...data,
      createdAt: new Date().toISOString()
    };
    this.kirRecords.set(id, record);
    console.log(`📝 Created KIR record: ${id}`);
    return record;
  }

  async storeRelatedDocument(collection, kirId, data) {
    // Normalize data before storage (simulating what happens in real service)
    const normalizedData = normalizeFieldNames(collection, data);
    
    const docId = `${collection}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const document = {
      id: docId,
      kir_id: kirId,
      collection,
      ...normalizedData,
      createdAt: new Date().toISOString()
    };
    
    if (!this.relatedDocuments.has(kirId)) {
      this.relatedDocuments.set(kirId, {});
    }
    
    const kirDocs = this.relatedDocuments.get(kirId);
    if (!kirDocs[collection]) {
      kirDocs[collection] = [];
    }
    
    kirDocs[collection].push(document);
    console.log(`📝 Stored ${collection} document: ${docId}`);
    return document;
  }

  async getRelatedDocuments(kirId) {
    const documents = this.relatedDocuments.get(kirId) || {};
    console.log(`📖 Retrieved related documents for KIR: ${kirId}`);
    
    // Return documents with field normalization applied
    const result = {};
    Object.entries(documents).forEach(([collection, docs]) => {
      result[collection] = docs.map(doc => {
        const { id, kir_id, collection: coll, createdAt, ...data } = doc;
        return { id, kir_id, createdAt, ...data };
      });
    });
    
    return result;
  }
}

/**
 * Test data for integration testing
 */
const integrationTestData = {
  // Main KIR record
  mainKIR: {
    nama: 'Ahmad Bin Ali',
    no_kp: '901234567890',
    alamat: 'No 123, Jalan Merdeka, 50000 Kuala Lumpur',
    no_telefon: '0123456789',
    email: 'ahmad.ali@email.com',
    status: 'Aktif',
    environment: 'test'
  },
  
  // Related documents in Cipta format
  ciptaDocuments: {
    kir_pendidikan: {
      tahap: 'Ijazah Sarjana Muda',
      bidang: 'Sains Komputer',
      institusi: 'Universiti Malaya',
      tahun_tamat: '2020',
      cgpa: '3.75'
    },
    kir_pekerjaan: {
      status: 'Bekerja Sepenuh Masa',
      jenis: 'Sektor Swasta',
      majikan: 'TechCorp Malaysia Sdn Bhd',
      pendapatan_bulanan: '6500',
      lokasi: 'Cyberjaya, Selangor',
      pengalaman: '4 tahun',
      jawatan: 'Software Developer'
    },
    kir_kesihatan: {
      catatan: 'Sihat dan aktif',
      kumpulan_darah: 'O+',
      alergi: 'Tiada',
      ubatan: 'Tiada'
    },
    kir_kafa: {
      kafa_sumber: 'Masjid',
      kafa_iman: 'Baik',
      kafa_islam: 'Sederhana',
      kafa_fatihah: 'Lancar',
      kafa_solat: 'Baik',
      kafa_puasa: 'Sempurna',
      kafa_skor: 85
    },
    kir_air: {
      nama_penuh: 'Ahmad bin Ali',
      no_kp: '001122334455',
      hubungan: 'Anak',
      jantina: 'Lelaki',
      umur: 15,
      status_perkahwinan: 'Bujang',
      pekerjaan: 'Pelajar',
      pendapatan_bulanan: 0
    },
    kir_pasangan: {
      nama_penuh: 'Siti binti Ahmad',
      no_kp: '887766554433',
      umur: 35,
      pekerjaan: 'Guru',
      pendapatan_bulanan: 4500
    },
    kir_pendapatan: {
      kategori: 'Tetap',
      sumber: 'Gaji',
      jumlah: 5000,
      catatan: 'Gaji bulanan'
    },
    kir_perbelanjaan: {
      kategori: 'Makanan',
      jumlah: 800,
      catatan: 'Belanja harian'
    },
    kir_bantuan_bulanan: {
      agensi: 'JKM',
      kadar: 300,
      kekerapan: 'Bulanan',
      cara_terima: 'Bank',
      catatan: 'Bantuan OKU'
    },
    kir_dokumen: {
      kategori: 'KP',
      nama_fail: 'kad_pengenalan.pdf',
      url: 'https://example.com/doc.pdf',
      saiz: 1024,
      jenis: 'application/pdf'
    }
  }
};

/**
 * Validate that retrieved data contains expected Profile format fields
 */
function validateProfileFormat(collection, data) {
  const expectedFields = {
    kir_pendidikan: ['tahap_pendidikan', 'bidang_pengajian', 'nama_sekolah'],
    kir_pekerjaan: ['status_pekerjaan', 'jenis_pekerjaan', 'nama_majikan', 'gaji_bulanan', 'alamat_kerja', 'pengalaman_kerja'],
    kir_kesihatan: ['catatan_kesihatan'],
    kir_kafa: ['kafa_sumber', 'kafa_iman', 'kafa_islam', 'kafa_fatihah', 'kafa_solat', 'kafa_puasa', 'kafa_skor'],
    kir_air: ['nama_penuh', 'no_kp', 'hubungan', 'jantina', 'umur', 'status_perkahwinan', 'pekerjaan', 'pendapatan_bulanan'],
    kir_pasangan: ['nama_penuh', 'no_kp', 'umur', 'pekerjaan', 'pendapatan_bulanan'],
    kir_pendapatan: ['kategori', 'sumber', 'jumlah', 'catatan'],
    kir_perbelanjaan: ['kategori', 'jumlah', 'catatan'],
    kir_bantuan_bulanan: ['agensi', 'kadar', 'kekerapan', 'cara_terima', 'catatan'],
    kir_dokumen: ['kategori', 'nama_fail', 'url', 'saiz', 'jenis']
  };
  
  const requiredFields = expectedFields[collection] || [];
  const missingFields = [];
  const presentFields = [];
  
  requiredFields.forEach(field => {
    if (data.hasOwnProperty(field) && data[field] !== undefined && data[field] !== '') {
      presentFields.push(field);
    } else {
      missingFields.push(field);
    }
  });
  
  return {
    isValid: missingFields.length === 0,
    presentFields,
    missingFields,
    coverage: requiredFields.length > 0 ? (presentFields.length / requiredFields.length) * 100 : 100
  };
}

/**
 * Compare original Cipta data with retrieved data to ensure integrity
 */
function compareDataIntegrity(collection, originalCipta, retrievedData) {
  const mappings = FIELD_MAPPINGS[collection];
  if (!mappings) return { isValid: false, message: 'No mappings found' };
  
  const issues = [];
  const matches = [];
  
  // Check each mapping from Cipta to Profile format
  Object.entries(mappings).forEach(([sourceField, targetField]) => {
    // Skip reverse mappings (Profile to Cipta)
    if (originalCipta.hasOwnProperty(sourceField)) {
      const originalValue = String(originalCipta[sourceField] || '').trim();
      const retrievedValue = String(retrievedData[targetField] || '').trim();
      
      if (originalValue && retrievedValue) {
        if (originalValue === retrievedValue) {
          matches.push({ sourceField, targetField, value: originalValue });
        } else {
          issues.push({ 
            sourceField, 
            targetField, 
            original: originalValue, 
            retrieved: retrievedValue 
          });
        }
      } else if (originalValue && !retrievedValue) {
        issues.push({ 
          sourceField, 
          targetField, 
          issue: 'Data lost during conversion',
          original: originalValue 
        });
      }
    }
  });
  
  const totalChecks = matches.length + issues.length;
  return {
    isValid: issues.length === 0,
    matches,
    issues,
    integrity: totalChecks > 0 ? (matches.length / totalChecks) * 100 : 100
  };
}

/**
 * Run comprehensive KIR Service integration tests
 */
export async function runKIRServiceIntegrationTests() {
  console.log('🔧 Starting KIR Service Integration Tests (Mocked)');
  console.log('=' .repeat(60));
  
  const mockService = new MockKIRService();
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    details: [],
    summary: {
      dataIntegrity: [],
      formatValidation: []
    }
  };
  
  try {
    // Step 1: Create main KIR record
    console.log('\n📝 Step 1: Creating main KIR record...');
    const mainKIR = await mockService.createKIR(integrationTestData.mainKIR);
    console.log('✅ Main KIR created:', mainKIR.id);
    
    // Step 2: Test each related document collection
    for (const [collection, ciptaData] of Object.entries(integrationTestData.ciptaDocuments)) {
      console.log(`\n🧪 Testing ${collection.toUpperCase()}`);
      console.log('-'.repeat(40));
      
      results.total++;
      
      try {
        // Step 2a: Store Cipta format data
        console.log('📤 Storing Cipta format data...');
        console.log('Original Cipta data:', ciptaData);
        
        const storedDoc = await mockService.storeRelatedDocument(collection, mainKIR.id, ciptaData);
        
        // Step 2b: Retrieve data (simulating Profile KIR access)
        console.log('📥 Retrieving data for Profile format...');
        const retrievedData = await mockService.getRelatedDocuments(mainKIR.id);
        
        // Extract the specific collection data
        const collectionData = retrievedData[collection] || [];
        const firstRecord = collectionData[0] || {};
        
        console.log('Retrieved normalized data:', firstRecord);
        
        // Step 2c: Validate Profile format
        const formatValidation = validateProfileFormat(collection, firstRecord);
        console.log(`📋 Format validation: ${formatValidation.coverage.toFixed(1)}% coverage`);
        
        if (formatValidation.missingFields.length > 0) {
          console.log('⚠️  Missing Profile fields:', formatValidation.missingFields);
        }
        if (formatValidation.presentFields.length > 0) {
          console.log('✅ Present Profile fields:', formatValidation.presentFields);
        }
        
        // Step 2d: Check data integrity
        const integrityCheck = compareDataIntegrity(collection, ciptaData, firstRecord);
        console.log(`🔍 Data integrity: ${integrityCheck.integrity.toFixed(1)}%`);
        
        if (integrityCheck.matches.length > 0) {
          console.log('✅ Successful field mappings:');
          integrityCheck.matches.forEach(match => {
            console.log(`   ${match.sourceField} → ${match.targetField}: '${match.value}'`);
          });
        }
        
        if (integrityCheck.issues.length > 0) {
          console.log('❌ Data integrity issues:');
          integrityCheck.issues.forEach(issue => {
            console.log(`   - ${issue.sourceField} → ${issue.targetField}: ${issue.issue || `'${issue.original}' ≠ '${issue.retrieved}'`}`);
          });
        }
        
        // Determine test result
        const testPassed = formatValidation.coverage >= 80 && integrityCheck.integrity >= 80;
        
        if (testPassed) {
          console.log('✅ Integration test PASSED');
          results.passed++;
        } else {
          console.log('❌ Integration test FAILED');
          results.failed++;
        }
        
        // Store detailed results
        results.details.push({
          collection,
          status: testPassed ? 'PASSED' : 'FAILED',
          formatValidation,
          integrityCheck,
          originalData: ciptaData,
          retrievedData: firstRecord
        });
        
        results.summary.formatValidation.push({
          collection,
          coverage: formatValidation.coverage
        });
        
        results.summary.dataIntegrity.push({
          collection,
          integrity: integrityCheck.integrity
        });
        
      } catch (error) {
        console.log('❌ Integration test ERROR:', error.message);
        results.failed++;
        results.details.push({
          collection,
          status: 'ERROR',
          error: error.message
        });
      }
    }
    
  } catch (error) {
    console.log('❌ Failed to create main KIR record:', error.message);
    return { error: 'Setup failed', details: error.message };
  }
  
  // Print comprehensive results
  console.log('\n' + '='.repeat(60));
  console.log('📊 KIR SERVICE INTEGRATION TEST RESULTS');
  console.log('='.repeat(60));
  
  console.log(`\n📈 Overall Results:`);
  console.log(`   Total Tests: ${results.total}`);
  console.log(`   ✅ Passed: ${results.passed}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(`   Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  
  console.log(`\n📋 Format Validation Summary:`);
  results.summary.formatValidation.forEach(item => {
    console.log(`   ${item.collection}: ${item.coverage.toFixed(1)}% field coverage`);
  });
  
  console.log(`\n🔍 Data Integrity Summary:`);
  results.summary.dataIntegrity.forEach(item => {
    console.log(`   ${item.collection}: ${item.integrity.toFixed(1)}% data integrity`);
  });
  
  // Final assessment
  const overallSuccess = results.failed === 0;
  const avgIntegrity = results.summary.dataIntegrity.length > 0 ? 
    results.summary.dataIntegrity.reduce((sum, item) => sum + item.integrity, 0) / results.summary.dataIntegrity.length : 0;
  const avgCoverage = results.summary.formatValidation.length > 0 ? 
    results.summary.formatValidation.reduce((sum, item) => sum + item.coverage, 0) / results.summary.formatValidation.length : 0;
  
  console.log('\n' + '='.repeat(60));
  if (overallSuccess && avgIntegrity >= 80 && avgCoverage >= 80) {
    console.log('🎉 INTEGRATION TESTS PASSED!');
    console.log('✅ Cipta KIR data will be correctly stored and retrieved in Profile KIR format.');
    console.log(`✅ Average data integrity: ${avgIntegrity.toFixed(1)}%`);
    console.log(`✅ Average field coverage: ${avgCoverage.toFixed(1)}%`);
    console.log('\n🔄 Data Flow Validation:');
    console.log('   1. ✅ Cipta KIR data is properly normalized before storage');
    console.log('   2. ✅ Profile KIR format fields are available after retrieval');
    console.log('   3. ✅ Data integrity is maintained throughout the process');
  } else {
    console.log('⚠️  INTEGRATION TESTS HAVE ISSUES!');
    console.log('❌ Some data may not be properly converted between formats.');
    if (avgIntegrity < 80) console.log(`❌ Low data integrity: ${avgIntegrity.toFixed(1)}%`);
    if (avgCoverage < 80) console.log(`❌ Low field coverage: ${avgCoverage.toFixed(1)}%`);
  }
  
  return results;
}

// Export test utilities
export { integrationTestData, validateProfileFormat, compareDataIntegrity, MockKIRService };

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runKIRServiceIntegrationTests();
}