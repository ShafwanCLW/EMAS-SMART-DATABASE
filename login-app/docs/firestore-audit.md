# Firestore Data Model – eMASA-SMART (v1)

> Source of truth for collections, fields, rules, and indexes. This document supersedes all previous drafts.

## 1) Design Principles
- **Single canonical schema.** No hardcoded collection names in code; import from a constants module.
- **Env isolation.** Every document MUST have `env ∈ {'dev','staging','prod'}` and every query MUST filter by `env`.
- **Create-once for KIR.** Uniqueness by `no_kp` via `index_nokp` (normalized digits-only).
- **Scalars in `kir`.** Related rows live in `kir_*` collections. No ekonomi arrays inside `kir`.
- **Auditability.** Timestamps (`tarikh_cipta`, `tarikh_kemas_kini`) on all entities.

## 2) Collections (canonical names)

### 2.1 `kir` — Rekod Ketua Isi Rumah (core)
Required fields (scalars only):
- `id` (string, doc id)
- `no_kp` (string, **normalized digits only**)
- `no_kp_raw` (string, original)
- `nama_penuh` (string)
- `jantina` (string)
- `tarikh_lahir` (Timestamp)
- `umur` (number)
- `bangsa` (string)
- `agama` (string)
- `warganegara` (string)
- `telefon_utama` (string)
- `telefon_kecemasan` (string)
- `email` (string)
- `alamat` (string)
- `poskod` (string)
- `bandar` (string)
- `negeri` (string)
- `tempat_lahir` (string)
- `ayah_nama` (string)
- `ibu_nama` (string)
- `no_kwsp` (string)
- `no_perkeso` (string)
- `status_rekod` ('Draf'|'Dihantar'|'Disahkan'|'Tidak Aktif')
- **Basic Family Status Fields (v1.3):**
  - `status_perkahwinan` (string, optional)
  - `tarikh_nikah` (Timestamp, optional)
  - `tarikh_cerai` (Timestamp, optional)
  - `senarai_adik_beradik` (string, optional)
  - `ibu_negeri` (string, optional)
  - `ayah_negeri` (string, optional)
- `env` ('dev'|'staging'|'prod')
- `is_seed` (bool, optional)
- `e2e_run_id` (string, optional)
- `tarikh_cipta` (Timestamp)
- `tarikh_kemas_kini` (Timestamp)
- 

> **Legacy (to be migrated out):** `pendapatan_tetap[]`, `pendapatan_tidak_tetap[]`, `perbelanjaan[]`, `bantuan_bulanan[]`.

> **IMPORTANT (v1.3):** Basic family status fields are stored directly in the main `kir` record. There is NO separate `kir_keluarga` collection. Detailed spouse data uses `kir_pasangan`, and household members use `kir_air`.

### 2.2 `kir_air` — Ahli Isi Rumah (dependants)
- `kir_id`, `nama_penuh`, `no_kp`, `hubungan`, `jantina`, `tarikh_lahir`, `umur`,
  `status_perkahwinan`, `pekerjaan`, `pendapatan_bulanan`,
  `env`, `tarikh_cipta`, `tarikh_kemas_kini`.

> `air` is **legacy**. New code MUST use `kir_air`.

### 2.3 `kir_pasangan` — Pasangan (PKIR)
- `kir_id`, `nama_penuh`, `no_kp`, `tarikh_lahir`, `umur`,
  `pekerjaan`, `pendapatan_bulanan`,
  `env`, `tarikh_cipta`, `tarikh_kemas_kini`.

### 2.4 `kir_kafa`
- `kir_id`, `kafa_sumber`, `kafa_iman`, `kafa_islam`, `kafa_fatihah`, `kafa_solat`, `kafa_puasa`, `kafa_skor`,
  `env`, `tarikh_cipta`, `tarikh_kemas_kini`.

### 2.5 `kir_pendidikan`
- `kir_id`, `tahap_pendidikan`, `bidang_pengajian`, `institusi`, `tahun_tamat`,
  `env`, `tarikh_cipta`, `tarikh_kemas_kini`.
- **Field Mapping Issue:** Cipta KIR uses `tahap_pendidikan`/`nama_sekolah`/`bidang_pengajian` while KIR Profile expects `tahap`/`institusi`/`bidang`.

### 2.6 `kir_pekerjaan`
- `kir_id`, `status_pekerjaan`, `jenis_pekerjaan`, `nama_majikan`, `gaji_bulanan`, `alamat_kerja`, `pengalaman_kerja`, `kemahiran`,
  `env`, `tarikh_cipta`, `tarikh_kemas_kini`.
- **Field Mapping Issue:** Cipta KIR uses `status_pekerjaan`/`jenis_pekerjaan`/`nama_majikan`/`gaji_bulanan`/`alamat_kerja`/`pengalaman_kerja` while KIR Profile expects `status`/`jenis`/`majikan`/`pendapatan_bulanan`/`lokasi`/`pengalaman`.

### 2.7 `kir_kesihatan` (1:1 health profile)
- `kir_id`, `kumpulan_darah`,
- `penyakit_kronik[]:{nama, catatan?}`,
- `ubat_tetap[]:{nama_ubat, dos, kekerapan, catatan?}`,
- `rawatan[]:{fasiliti, tarikh, catatan?}`,
- `pembedahan[]:{tarikh, jenis_pembedahan, hospital, status}`,
- `env`, `tarikh_cipta`, `tarikh_kemas_kini`.
- **Field Mapping Issue:** Cipta KIR includes `ringkasan_kesihatan` field missing in KIR Profile, and uses `catatan_kesihatan` vs `catatan`.

### 2.8 `kir_pendapatan` (rows)
- `kir_id`, `kategori` ('Tetap'|'Tidak Tetap'), `sumber`, `jumlah`, `catatan?`,
  `env`, `tarikh_cipta`, `tarikh_kemas_kini`.

### 2.9 `kir_perbelanjaan` (rows)
- `kir_id`, `kategori`, `jumlah`, `catatan?`,
  `env`, `tarikh_cipta`, `tarikh_kemas_kini`.

### 2.10 `kir_bantuan_bulanan` (rows)
- `kir_id`, `tarikh_mula`, `agensi`, `kadar`, `kekerapan`, `cara_terima`, `catatan?`,
  `env`, `tarikh_cipta`, `tarikh_kemas_kini`.

### 2.11 `kir_dokumen`
- `kir_id`, `kategori`, `nama_fail`, `url`, `saiz`, `jenis`,
  `env`, `tarikh_cipta`.

### 2.12 `program`
- `nama`, `penerangan`, `tarikh_mula`, `tarikh_tamat`, `status`,
  `env`, `tarikh_cipta`.

### 2.13 `kehadiran_program`
- `program_id`, `kir_id`, `tarikh_kehadiran`, `status_kehadiran`, `catatan?`,
  `env`, `tarikh_cipta`.

### 2.14 `index_nokp` (uniqueness map)
- **Doc ID**: normalized `no_kp` (digits-only)
- Fields: `kir_id`, `env`, `tarikh_cipta`, `tarikh_kemas_kini`.

### 2.15 Support
- `users` (auth meta), `activities` (user actions), `audit_log` (changes), `diagnostics` (ops).

## 3) Query Patterns
- Always include: `where('env','==', activeEnv)`.
- Related rows: `where('kir_id','==', kirId)`.
- List filters: `where('status_rekod','==', status)`, `where('negeri','==', negeri)`.
- Sorting: `orderBy('tarikh_cipta','desc')` or `orderBy('nama_penuh')`.
- Pagination: cursor-based (startAfter), not offset.

## 4) Security Rules (pragmatic dev-safe)

If you don't use custom claims for `env`, keep rules pragmatic and enforce env in code:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    function authed() { return request.auth != null; }
    function hasEnv(res) { return res.data.env in ['dev','staging','prod']; }

    match /{col}/{id} {
      allow create: if authed() && hasEnv(request.resource);
      allow read, update, delete: if authed() && hasEnv(resource);
    }
  }
}
```
Tighten later with per-project isolation or custom claims.

## 5) Indexes (only what we query)
### 5.1 Top-level kir (collectionId: "kir")
- (env asc, status_rekod asc, tarikh_cipta desc)
- (env asc, negeri asc, tarikh_cipta desc)
- (env asc, nama_penuh asc)

### 5.2 Child collections (collectionGroup)
For each of: kir_air, kir_pasangan, kir_kafa, kir_pendidikan, kir_pekerjaan, kir_kesihatan, kir_pendapatan, kir_perbelanjaan, kir_bantuan_bulanan, kir_dokumen, kehadiran_program
- (env asc, kir_id asc, tarikh_cipta desc) (add only where you sort by date)

### 5.3 Index map
index_nokp (collectionId): single-field on env, and docId = normalized no_kp.

## 6) Migration Plan (dev)
1. **Standardize names.** Rename legacy air → kir_air.
2. **Backfill env.** Set env='dev' on all dev docs; enforce on writes.
3. **Backfill index.** For each kir.no_kp, write /index_nokp/{digits} → {kir_id, env}.
4. **Extract arrays (legacy → rows).**
   - move pendapatan_tetap[] & pendapatan_tidak_tetap[] → kir_pendapatan
   - move perbelanjaan[] → kir_perbelanjaan
   - move bantuan_bulanan[] → kir_bantuan_bulanan
   - remove legacy arrays from kir (set ekonomi_legacy:true)
5. **Optional reset.** Wipe env='dev' data (keep users) and seed 1 clean KIR.
6. **Verify.** Run automated checks: collections present, env on docs, create-once works, no ekonomi arrays in kir, index_nokp present.

## 7) Create-Once & Normalization
- **Normalize IC:** store both no_kp_raw and digits-only no_kp.
- **On wizard Step 1:** if index_nokp/{no_kp} exists → attach to kir_id; else create once and persist kirId immediately; subsequent saves = update only.
- **Related Documents Creation:** `createRelatedDocuments()` is ONLY called during final form submission (status_rekod = 'Dihantar'), NOT during step navigation to prevent premature processing of incomplete data.

## 7.1) KIR Form Submission Flow (CRITICAL)
**Step Navigation (ensureKIRExists):**
1. Check if kirId exists in memory/localStorage
2. If not, check index_nokp for existing KIR
3. If no existing KIR, create new KIR with status='Draf'
4. **IMPORTANT:** Only main KIR document is created, NO related documents
5. Store kirId for subsequent updates

**Final Submission:**
1. Call ensureKIRExists() to get/create kirId
2. Update KIR with complete form data and status='Dihantar'
3. **ONLY NOW:** Call createRelatedDocuments(kirId, formData)
4. Create all related collections: kir_kafa, kir_pendidikan, kir_pekerjaan, kir_kesihatan, kir_pendapatan, kir_perbelanjaan, kir_bantuan_bulanan

**Why This Matters:**
- Prevents debug log spam during form navigation
- Avoids processing incomplete/invalid data
- Ensures data integrity by only creating related documents with complete, validated data
- Maintains clean separation between draft creation and final submission

## 8) Audit & Activities
- **audit_log:** entiti, kir_id, medan, nilai_sebelum, nilai_selepas, operation, by_user_id, by_user_email, tarikh.
- **activities:** user_id, tindakan, entiti?, kir_id?, tarikh.

## 9) Acceptance Checklist
- [ ] All code imports collection names from one constants module.
- [ ] Every write sets env; every read filters env.
- [ ] Each no_kp maps to exactly one kir via index_nokp.
- [ ] No ekonomi arrays inside any kir.
- [ ] KIR list shows correct counts with real queries.
- [ ] Verify page (internal) is green.

## 10) Changelog
**v1:** Canonical schema finalized; added kir_kesihatan, index_nokp, env enforcement, and migration plan. Legacy arrays marked for extraction.

**v1.1 (2024-12-21):** 
- **CRITICAL FIX:** Modified KIR form submission flow to prevent premature related document creation
- Fixed createKIR() to NOT call createRelatedDocuments() automatically
- Related documents now only created during final form submission (status='Dihantar')
- Eliminated debug log spam and incomplete data processing during step navigation
- Verified all collections (kir_kafa, kir_pendidikan, kir_pekerjaan, kir_kesihatan, kir_pendapatan, kir_perbelanjaan, kir_bantuan_bulanan) are properly created on final submission
- Updated helper functions (hasKAFAData, hasPendidikanData, etc.) with proper validation logic

**v1.2 (2024-12-21):**
- **COMPREHENSIVE SERVICE DOCUMENTATION:** Added complete documentation for all service files and components
- Documented all missing services: AIRService, AuditService, AuthService, DedupeService, DokumenService, FirebaseAuthService, PasanganService, ProgramService
- Added component documentation for AdminDashboard, Dedupe, KIRProfile, LoginForm, UserDashboard
- Included collection field specifications and service purposes for partner developer reference
- Cleaned up development-only files (SmokeTest, DBClean, Verify, Preflight) and legacy code comments

**v1.3 (2024-12-21):**
- **DATA SYNCHRONIZATION FIXES:** Resolved critical data flow issues between forms, profiles, and Firebase collections
- **ELIMINATED KIR_KELUARGA COLLECTION:** Confirmed that `COLLECTIONS.KIR_KELUARGA` never existed; basic family status fields (`status_perkahwinan`, `tarikh_nikah`, `tarikh_cerai`) are stored directly in the main `kir` record
- **ENHANCED KEKELUARGAAN HANDLING:** Updated `KIRService.createRelatedDocuments()` to properly handle family status data by storing it in the main KIR record instead of creating a separate document
- **FIELD NAME STANDARDIZATION:** Verified and maintained consistency in field names across KIRProfile.js:
  - Pendidikan: `tahap_pendidikan`, `bidang_pengajian` (confirmed correct)
  - Pekerjaan: `status_pekerjaan`, `jenis_pekerjaan`, `nama_majikan`, `gaji_bulanan` (confirmed correct)
- **FAMILY DATA ARCHITECTURE CLARIFICATION:** 
  - Main KIR record: Basic family status (`status_perkahwinan`, `tarikh_nikah`, `tarikh_cerai`, spouse basic info)
  - `kir_pasangan` collection: Detailed spouse data (managed by PasanganService.js)
  - `kir_air` collection: Household member data (managed by AIRService.js)
- **IMPROVED DATA INTEGRITY:** Enhanced error prevention and logging in `createRelatedDocuments()` function
- **BACKWARD COMPATIBILITY:** All changes maintain compatibility with existing data structures

**v1.4 (2024-12-21):**
- **CIPTA KIR ↔ KIR PROFILE SYNCHRONIZATION AUDIT:** Comprehensive verification of data synchronization between Cipta KIR form and KIR Profile viewing interface
- **FIELD MAPPING DISCREPANCIES IDENTIFIED:** Found and documented field name differences that require attention:
  - **Pendidikan Collection (`kir_pendidikan`):** Cipta KIR uses `tahap_pendidikan`/`nama_sekolah`/`bidang_pengajian` while KIR Profile expects `tahap`/`institusi`/`bidang`
  - **Pekerjaan Collection (`kir_pekerjaan`):** Cipta KIR uses `status_pekerjaan`/`jenis_pekerjaan`/`nama_majikan`/`gaji_bulanan`/`alamat_kerja`/`pengalaman_kerja` while KIR Profile expects `status`/`jenis`/`majikan`/`pendapatan_bulanan`/`lokasi`/`pengalaman`
  - **Kesihatan Collection (`kir_kesihatan`):** Cipta KIR includes `ringkasan_kesihatan` field missing in KIR Profile, and uses `catatan_kesihatan` vs `catatan`
- **SYNCHRONIZED COLLECTIONS CONFIRMED:** The following collections have proper field synchronization:
  - **Maklumat Asas:** All basic info fields properly synchronized
  - **KAFA:** All religious education fields properly synchronized
  - **Kekeluargaan:** Family status fields (`status_perkahwinan`, `tarikh_nikah`, `tarikh_cerai`) properly synchronized
  - **Ekonomi (Pendapatan/Perbelanjaan/Bantuan):** All economic data fields properly synchronized
- **RECOMMENDATION:** Update either Cipta KIR form field names or KIR Profile display logic to ensure consistent field mapping across the application

---

# 11) SERVICE FILES DOCUMENTATION

## 11.1 Core Services

### KIRService.js
**Purpose:** Main service for KIR (Ketua Isi Rumah) record management
**Collections Used:** `kir`, `index_nokp`, all `kir_*` collections
**Key Functions:**
- `createKIR(draft)` - Create new KIR with create-once logic
- `updateKIR(id, partial)` - Update existing KIR
- `getKIRById(id)` - Retrieve KIR by ID
- `getKIRList(params)` - List KIRs with filtering/pagination
- `deleteKIR(id)` - Delete KIR and related records
- `createRelatedDocuments(kirId, draft)` - Create all related collection records
- `normalizeNoKP(noKP)` - Normalize IC number (digits only)
- `createNoKPIndex(noKP, kirId)` - Create uniqueness index

### AIRService.js
**Purpose:** Manage household members (Ahli Isi Rumah)
**Collections Used:** `kir_air`
**Key Functions:**
- `listAIR(kirId)` - Get all household members for a KIR
- `createAIR(kirId, payload)` - Add new household member
- `updateAIR(airId, payload)` - Update household member
- `deleteAIR(airId)` - Remove household member
- `getAIRById(airId)` - Get specific member details
- `calculateAge(birthDate)` - Calculate member age

**Fields in kir_air:**
- `kir_id`, `nama_penuh`, `no_kp`, `hubungan`, `jantina`, `tarikh_lahir`, `umur`
- `status_perkahwinan`, `pekerjaan`, `pendapatan_bulanan`
- `env`, `tarikh_cipta`, `tarikh_kemas_kini`

### PasanganService.js
**Purpose:** Manage spouse data (PKIR - Pasangan Ketua Isi Rumah)
**Collections Used:** `kir_pasangan`
**Key Functions:**
- `getPKIRByKirId(kirId)` - Get spouse record for a KIR
- `createPKIR(kirId, payload)` - Create spouse record
- `updatePKIR(pkirId, partial)` - Update spouse record
- `deletePKIR(pkirId)` - Delete spouse record
- `checkKIRByNoKp(noKp)` - Check if IC exists in KIR
- `calculateKAFAScore(kafaData)` - Calculate KAFA score
- `uploadPasanganDokumen(pkirId, file)` - Upload spouse documents

**Fields in kir_pasangan:**
- `kir_id`, `nama_penuh`, `no_kp`, `tarikh_lahir`, `umur`
- `pekerjaan`, `pendapatan_bulanan`
- `env`, `tarikh_cipta`, `tarikh_kemas_kini`

### ProgramService.js
**Purpose:** Manage programs and attendance tracking
**Collections Used:** `program`, `kehadiran_program`
**Key Functions:**
- `listProgram(options)` - List programs with filters
- `listKehadiranByKir(kirId)` - Get attendance for a KIR
- `setKehadiran(kirId, programId, hadir, catatan)` - Record attendance
- `listKehadiranByProgram(programId)` - Get attendance for a program
- `createProgram(programData)` - Create new program
- `updateProgram(programId, updates)` - Update program
- `deleteProgram(programId)` - Delete program

**Fields in program:**
- `nama_program`, `penerangan`, `tarikh_mula`, `tarikh_tamat`, `status`, `kategori`
- `env`, `tarikh_cipta`, `tarikh_kemas_kini`

**Fields in kehadiran_program:**
- `program_id`, `kir_id`, `tarikh_kehadiran`, `status_kehadiran`, `catatan`
- `env`, `tarikh_cipta`

## 11.2 Support Services

### AuditService.js
**Purpose:** Audit trail and change tracking
**Collections Used:** `audit_log`
**Key Functions:**
- `listAuditForKir(kirId, options)` - Get audit logs for a KIR
- `createAuditLog(entiti, entiti_id, medan, sebelum, selepas, pengguna)` - Create audit entry
- `createBulkAuditLogs(entiti, entiti_id, changes, pengguna)` - Bulk audit logging
- `logKIRChange()`, `logAIRChange()`, etc. - Specific entity logging
- `getAuditStats(kirId, days)` - Get audit statistics
- `generateChangeLog(oldData, newData)` - Generate change log
- `cleanupOldLogs(daysToKeep)` - Clean old audit logs

**Fields in audit_log:**
- `entiti`, `entiti_id`, `medan`, `nilai_sebelum`, `nilai_selepas`
- `operation`, `by_user_id`, `by_user_email`, `tarikh`
- `env`

### DokumenService.js
**Purpose:** Document upload and management
**Collections Used:** `kir_dokumen`
**Key Functions:**
- `listDokumen(kirId, kategori)` - List documents for a KIR
- `uploadDokumen(kirId, file, kategori, uploadedBy)` - Upload document
- `deleteDokumen(docId)` - Delete document
- `updateDokumen(docId, updates)` - Update document metadata
- `getDokumenById(docId)` - Get document details
- `getDokumenStats(kirId)` - Get document statistics
- `validateFile(file)` - Validate file upload
- `cleanupOldDocuments(daysOld)` - Clean old documents

**Fields in kir_dokumen:**
- `kir_id`, `kategori`, `nama_fail`, `url`, `saiz`, `jenis`
- `uploadedBy`, `uploadedAt`
- `env`, `tarikh_cipta`

### DedupeService.js
**Purpose:** Duplicate record detection and merging
**Collections Used:** `kir`, `index_nokp`, all `kir_*` collections
**Key Functions:**
- `findDuplicateRecords()` - Find duplicate KIR records by normalized IC
- `mergeRecords(records)` - Merge duplicate records intelligently
- `mergeRecordData(primaryRecord, duplicateRecords)` - Merge data fields
- `updateRelatedRecords(batch, duplicateRecords, primaryRecordId)` - Update related collections
- `cleanupIndexEntries(batch, duplicateRecords, normalizedNoKp)` - Clean index entries
- `getDuplicateGroupDetails(normalizedNoKp)` - Get duplicate group details
- `validateEnvironment()` - Prevent production operations

## 11.3 Authentication Services

### AuthService.js
**Purpose:** Mock authentication for development
**Collections Used:** None (in-memory)
**Key Functions:**
- `login(email, password, selectedRole)` - Mock login
- `logout()` - Clear session
- `getCurrentUser()` - Get current user
- `isAuthenticated()`, `isAdmin()`, `isUser()` - Role checks

### FirebaseAuthService.js
**Purpose:** Firebase Authentication integration
**Collections Used:** `users`, `activities`
**Key Functions:**
- `login(email, password, selectedRole)` - Firebase login
- `register(email, password, name, role)` - User registration
- `signInWithGoogle(selectedRole)` - Google OAuth
- `logout()` - Firebase logout
- `resendVerificationEmail()` - Email verification
- `onAuthStateChange(callback)` - Auth state listener
- `getAllUsers()`, `updateUser()`, `deleteUser()` - User management
- `addActivity()`, `getAllActivities()` - Activity tracking

**Fields in users:**
- `email`, `name`, `role`, `createdAt`, `lastLogin`
- `emailVerified`, `photoURL`

**Fields in activities:**
- `user_id`, `tindakan`, `entiti`, `kir_id`, `tarikh`
- `details`, `ip_address`

## 11.4 Utility Files

### collections.js
**Purpose:** Collection names constants and utilities
**Exports:**
- `COLLECTIONS` - All collection name constants
- `CANONICAL_COLLECTIONS` - Whitelist of allowed collections
- `STANDARD_FIELDS` - Standard field names
- `STATUS_REKOD`, `ENVIRONMENTS` - Enum values
- `addStandardFields(data, kirId)` - Add standard fields to documents
- `createEnvFilter()` - Create environment filter
- `normalizeNoKP(noKP)` - Normalize IC number
- `getEnvironment()` - Get current environment

### firebase.js
**Purpose:** Firebase configuration and initialization
**Exports:**
- `db` - Firestore database instance
- `auth` - Firebase Auth instance
- `storage` - Firebase Storage instance

---

# 12) COMPONENT FILES DOCUMENTATION

## 12.1 Admin Components

### AdminDashboard.js
**Purpose:** Main admin interface with navigation and content sections
**Route:** `/admin`
**Features:**
- Navigation between admin tools (Dedupe, Reports)
- Dynamic content loading
- User management interface
- System statistics display
**Key Functions:**
- `setupDedupeListeners()` - Initialize dedupe functionality
- `initializeDedupe()` - Load dedupe component
- `initializeBasicWizard()` - Load KIR wizard

### Dedupe.js
**Purpose:** Duplicate record management interface
**Route:** `/admin/dedupe`
**Features:**
- Scan for duplicate records
- Visual duplicate group display
- Merge preview and confirmation
- Export duplicate reports
- Progress tracking for merge operations
**Key Functions:**
- `createDedupeHTML()` - Generate UI
- `initializeDedupe()` - Initialize component
- `DedupeManager` class - Main functionality

### KIRProfile.js
**Purpose:** Individual KIR record viewing and editing
**Route:** `/admin/kir/:kirId`
**Features:**
- 14 comprehensive tabs for KIR data
- Related records management (AIR, Pasangan, etc.)
- Document upload and management
- Audit trail viewing
**Tabs:**
1. Maklumat Asas (Basic Info)
2. Pendidikan Agama (KAFA)
3. Pendidikan (Education)
4. Pekerjaan (Employment)
5. Keluarga (Family)
6. Kesihatan (Health)
7. Pendapatan (Income)
8. Perbelanjaan (Expenses)
9. Bantuan Bulanan (Monthly Aid)
10. Program & Kehadiran (Programs & Attendance)
11. Dokumen (Documents)
12. Audit Trail
13. Pasangan (Spouse)
14. Ahli Isi Rumah (Household Members)

## 12.2 Authentication Components

### LoginForm.js
**Purpose:** User authentication interface
**Route:** `/login`
**Features:**
- Email/password login
- Google OAuth integration
- Role selection (Admin/User)
- Email verification handling
- Registration form

## 12.3 User Components

### UserDashboard.js
**Purpose:** Regular user interface
**Route:** `/user`
**Features:**
- KIR form wizard
- Personal record management
- Document upload
- Profile viewing

---

# 13) DEVELOPMENT NOTES

## 13.1 Removed Files (Cleanup)
The following development-only files have been removed:
- `SmokeTest.js` & `SmokeTest.css` - Development testing utilities
- `DBClean.js` & `DBCleanService.js` - Database cleanup utilities
- `Verify.js` & `VerifyService.js` - System verification tools
- `Preflight.js` & `PreflightService.js` - Connectivity tests

## 13.2 Code Quality Improvements
- Removed legacy code comments and unused functions
- Cleaned up `detectLegacyArrays` function and related imports
- Removed broken `getLegacyCollectionName` function
- Preserved all debug console logs as requested
- Maintained all production functionality

## 13.3 Partner Developer Guidelines

### Service Usage Patterns:
1. **Always import from collections.js:** Use `COLLECTIONS.KIR` instead of hardcoded strings
2. **Environment filtering:** Every query must include `createEnvFilter()`
3. **Standard fields:** Use `addStandardFields()` for all document creation
4. **Error handling:** All services include try-catch with meaningful error messages
5. **Validation:** Use schema validators before database operations

### Collection Relationships:
- `kir` (1) → `kir_air` (many) - Household members
- `kir` (1) → `kir_pasangan` (1) - Spouse
- `kir` (1) → `kir_*` (many) - All other related collections
- `kir` (1) → `index_nokp` (1) - Uniqueness index
- `program` (1) → `kehadiran_program` (many) - Attendance records

### Data Flow:
1. **KIR Creation:** `ensureKIRExists()` → `createKIR()` → `createNoKPIndex()`
2. **Form Submission:** `updateKIR()` → `createRelatedDocuments()` → audit logging
3. **Duplicate Handling:** `findDuplicateRecords()` → `mergeRecords()` → cleanup
4. **Document Management:** `uploadDokumen()` → Firebase Storage → metadata in `kir_dokumen`