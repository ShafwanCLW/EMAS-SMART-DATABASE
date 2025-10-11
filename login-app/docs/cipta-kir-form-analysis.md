# Cipta KIR Form Analysis & Documentation

## Overview
This document provides a comprehensive analysis of the Cipta KIR (Ketua Isi Rumah) form structure, data collections, table mappings, and implementation details. This serves as a reference guide for developers working on the KIR management system.

## 📋 Form Structure & Pages

The Cipta KIR form is a multi-step wizard consisting of **14 main sections/pages**:

### Page-by-Page Breakdown

| **#** | **Page/Section** | **Data Collection** | **Table/Collection Name** | **Status** |
|-------|------------------|---------------------|---------------------------|------------|
| 1 | **Maklumat Asas** | Basic Information | `kir` (main table) | ✅ Active |
| 2 | **KAFA** | Religious Education | `kir_kafa` | ✅ Active |
| 3 | **Pendidikan** | Education | `kir_pendidikan` | ✅ Active |
| 4 | **Pekerjaan** | Employment | `kir_pekerjaan` | ✅ Active |
| 5 | **Kekeluargaan** | Family Status | `kir` (main table) | ✅ Active |
| 6 | **Kesihatan KIR** | Health Information | `kir_kesihatan` | ✅ Active |
| 7 | **Pendapatan** | Income | `kir_pendapatan` | ✅ Active |
| 8 | **Perbelanjaan** | Expenses | `kir_perbelanjaan` | ✅ Active |
| 9 | **Bantuan Bulanan** | Monthly Assistance | `kir_bantuan_bulanan` | ✅ Active |
| 10 | **Ahli Isi Rumah (AIR)** | Household Members | `kir_air` | ✅ Active |
| 11 | **PKIR (Pasangan)** | Spouse Information | `kir_pasangan` | ✅ Active |
| 12 | **Program & Kehadiran** | Programs & Attendance | `kir_program`, `kir_kehadiran` | ✅ Active |
| 13 | **Dokumen** | Document Management | `kir_dokumen` | ✅ Active |
| 14 | **Audit Trail** | Change History | `audit_log`, `activities` | ✅ Active |

## 🗂️ Detailed Field Mappings

### 1. Maklumat Asas (Basic Information)
**Collection:** `kir` (main table)
**Key Fields:**
- `nama_penuh` - Full name
- `no_kp` - IC number (normalized)
- `umur` - Age
- `jantina` - Gender
- `alamat` - Address
- `negeri` - State
- `daerah` - District
- `poskod` - Postal code
- `no_telefon` - Phone number
- `status_rekod` - Record status (Draf/Dihantar)

### 2. KAFA (Religious Education)
**Collection:** `kir_kafa`
**Key Fields:**
- `kafa_sumber` - Source of KAFA education
- `kafa_iman` - Faith knowledge level
- `kafa_islam` - Islamic knowledge level
- `kafa_fatihah` - Al-Fatihah recitation ability
- `kafa_solat` - Prayer knowledge
- `kafa_puasa` - Fasting knowledge
- `kafa_skor` - Overall KAFA score

### 3. Pendidikan (Education)
**Collection:** `kir_pendidikan`
**Field Mapping Issues:** ⚠️
- **Cipta KIR:** `tahap_pendidikan`, `nama_sekolah`, `bidang_pengajian`
- **Profile KIR:** `tahap`, `institusi`, `bidang`
- `tahun_tamat` - Graduation year

### 4. Pekerjaan (Employment)
**Collection:** `kir_pekerjaan`
**Field Mapping Issues:** ⚠️
- **Cipta KIR:** `status_pekerjaan`, `jenis_pekerjaan`, `nama_majikan`, `gaji_bulanan`, `alamat_kerja`
- **Profile KIR:** `status`, `jenis`, `majikan`, `pendapatan_bulanan`, `lokasi`
- `pengalaman_kerja` - Work experience

### 5. Kekeluargaan (Family Status)
**Collection:** `kir` (main table)
**Key Fields:**
- `status_perkahwinan` - Marital status
- `tarikh_nikah` - Marriage date
- `tarikh_cerai` - Divorce date
- `bilangan_anak` - Number of children

### 6. Kesihatan KIR (Health Information)
**Collection:** `kir_kesihatan`
**Field Mapping Issues:** ⚠️
- **Cipta KIR:** `ringkasan_kesihatan`, `catatan_kesihatan`
- **Profile KIR:** `catatan`
- Health conditions and medical history

### 7. Pendapatan (Income)
**Collection:** `kir_pendapatan`
**Key Fields:**
- `kategori` - Income category
- `sumber` - Income source
- `jumlah` - Amount
- `catatan` - Notes

### 8. Perbelanjaan (Expenses)
**Collection:** `kir_perbelanjaan`
**Key Fields:**
- `kategori` - Expense category
- `jumlah` - Amount
- `catatan` - Notes

### 9. Bantuan Bulanan (Monthly Assistance)
**Collection:** `kir_bantuan_bulanan`
**Key Fields:**
- `agensi` - Agency providing assistance
- `kadar` - Amount/rate
- `kekerapan` - Frequency
- `cara_terima` - Method of receipt
- `catatan` - Notes

### 10. Ahli Isi Rumah (Household Members)
**Collection:** `kir_air`
**Key Fields:**
- `nama_penuh` - Full name
- `no_kp` - IC number
- `hubungan` - Relationship to head
- `jantina` - Gender
- `tarikh_lahir` - Birth date
- `umur` - Age
- `status_perkahwinan` - Marital status
- `pekerjaan` - Occupation
- `pendapatan_bulanan` - Monthly income

### 11. PKIR (Spouse Information)
**Collection:** `kir_pasangan`
**Key Fields:**
- Basic spouse information (created during Cipta KIR)
- Full profile managed separately in Profile KIR → PKIR section

### 12. Program & Kehadiran (Programs & Attendance)
**Collections:** `kir_program`, `kir_kehadiran`
**Key Fields:**
- Program participation data
- Attendance records

### 13. Dokumen (Document Management)
**Collection:** `kir_dokumen`
**Key Fields:**
- `kategori` - Document category
- `nama_fail` - File name
- `url` - File URL
- `saiz` - File size
- `jenis` - File type

### 14. Audit Trail (Change History)
**Collections:** `audit_log`, `activities`
**Key Fields:**
- Change tracking
- User activities
- Timestamps

## 🔧 Implementation Details

### File Locations

#### Main Form Implementation
- **File:** `src/pages/admin/AdminDashboard.js`
- **Lines:** 384-5988
- **Form ID:** `ciptaKIRForm`
- **Navigation:** `#/admin` → "Cipta KIR" tab

#### Service Files
| **Service File** | **Purpose** | **Collections Managed** |
|------------------|-------------|------------------------|
| `KIRService.js` | Main KIR management | `kir`, `index_nokp`, all `kir_*` collections |
| `AIRService.js` | Household members | `kir_air` |
| `PasanganService.js` | Spouse management | `kir_pasangan` |
| `ProgramService.js` | Programs & attendance | `kir_program`, `kir_kehadiran` |
| `DokumenService.js` | Document management | `kir_dokumen` |
| `AuditService.js` | Audit trail | `audit_log`, `activities` |

#### Field Mapping System
- **File:** `src/lib/fieldMapper.js`
- **Purpose:** Handle field name differences between Cipta KIR and Profile KIR formats
- **Key Functions:**
  - `mapCiptaToProfile(collection, data)`
  - `mapProfileToCipta(collection, data)`
  - `normalizeFieldNames(collection, data)`
  - `isCiptaKIRField(collection, fieldName)`

### Data Flow & Submission Process

#### Step Navigation Flow
1. Check if `kirId` exists in memory/localStorage
2. If not, check `index_nokp` for existing KIR
3. If no existing KIR, create new KIR with `status='Draf'`
4. **Important:** Only main KIR document is created, NO related documents
5. Store `kirId` for subsequent updates

#### Final Submission Flow
1. Call `ensureKIRExists()` to get/create `kirId`
2. Update KIR with complete form data and `status='Dihantar'`
3. **Only now:** Call `createRelatedDocuments(kirId, formData)`
4. Create all related collections: `kir_kafa`, `kir_pendidikan`, `kir_pekerjaan`, `kir_kesihatan`, `kir_pendapatan`, `kir_perbelanjaan`, `kir_bantuan_bulanan`

### Key Functions

#### KIRService.js
- `createKIR(draft)` - Create new KIR with create-once logic
- `updateKIR(id, partial)` - Update existing KIR
- `getKIRById(id)` - Retrieve KIR by ID
- `getKIRList(params)` - List KIRs with filtering/pagination
- `deleteKIR(id)` - Delete KIR and related records
- `createRelatedDocuments(kirId, draft)` - Create all related collection records
- `normalizeNoKP(noKP)` - Normalize IC number (digits only)
- `createNoKPIndex(noKP, kirId)` - Create uniqueness index

## ⚠️ Field Mapping Discrepancies

### Critical Issues to Address

#### 1. Pendidikan Collection (`kir_pendidikan`)
- **Cipta KIR uses:** `tahap_pendidikan`, `nama_sekolah`, `bidang_pengajian`
- **Profile KIR expects:** `tahap`, `institusi`, `bidang`
- **Impact:** Data inconsistency between form input and display

#### 2. Pekerjaan Collection (`kir_pekerjaan`)
- **Cipta KIR uses:** `status_pekerjaan`, `jenis_pekerjaan`, `nama_majikan`, `gaji_bulanan`, `alamat_kerja`, `pengalaman_kerja`
- **Profile KIR expects:** `status`, `jenis`, `majikan`, `pendapatan_bulanan`, `lokasi`, `pengalaman`
- **Impact:** Employment data mapping issues

#### 3. Kesihatan Collection (`kir_kesihatan`)
- **Cipta KIR includes:** `ringkasan_kesihatan` field missing in Profile KIR
- **Field difference:** `catatan_kesihatan` vs `catatan`
- **Impact:** Health information display inconsistencies

### Synchronized Collections ✅
The following collections have proper field synchronization:
- **Maklumat Asas:** All basic info fields properly synchronized
- **KAFA:** All religious education fields properly synchronized
- **Kekeluargaan:** Family status fields properly synchronized
- **Ekonomi (Pendapatan/Perbelanjaan/Bantuan):** All economic data fields properly synchronized

## 🧪 Testing & Validation

### Test Files
- `src/tests/kirServiceIntegrationTest.js` - Integration testing
- `src/tests/endToEndTest.js` - End-to-end workflow testing
- `src/tests/dataConsistencyTest.js` - Data consistency validation

### Validation Schema
- **File:** `src/lib/validators.js`
- **Purpose:** Schema validation for all collections
- **Coverage:** All KIR-related collections have defined validation rules

## 🔄 Environment & Collections

### Environment Filtering
- All collections use `env` field for environment separation
- Environment filter applied to all read operations
- Current environment: determined by `getEnvironment()` function

### Collection Constants
- **File:** `src/services/database/collections.js`
- **Purpose:** Centralized collection name management
- **Usage:** All services import collection names from this module

## 📊 Standard Fields

All collections include these standard fields:
- `env` - Environment identifier
- `tarikh_cipta` - Creation timestamp
- `tarikh_kemas_kini` - Last update timestamp
- `kir_id` - Reference to main KIR record (for related collections)

## 🚀 Recommendations

### Immediate Actions
1. **Resolve Field Mapping Issues:** Update either Cipta KIR form field names or Profile KIR display logic
2. **Standardize Field Names:** Implement consistent naming across all forms
3. **Update Documentation:** Keep this document updated with any changes

### Future Enhancements
1. **Form Validation:** Enhance client-side validation
2. **Auto-save:** Implement more robust auto-save functionality
3. **Performance:** Optimize form loading and submission
4. **User Experience:** Improve form navigation and progress indicators

## 📝 Notes

- This form handles comprehensive household data collection
- Data is distributed across 14+ Firebase collections
- Field mapping system ensures compatibility between different form formats
- Proper environment filtering maintains data isolation
- Comprehensive audit trail tracks all changes

---

**Last Updated:** December 2024  
**Version:** 2.0  
**Maintainer:** Development Team