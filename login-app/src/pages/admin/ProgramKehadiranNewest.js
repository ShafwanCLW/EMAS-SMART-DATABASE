// Standalone Program & Kehadiran (Newest) module
// This module mirrors the original Program & Kehadiran tab but is self-contained.
import { ProgramService } from '../../services/backend/ProgramService.js';

const STYLE_ID = 'program-kehadiran-newest-styles';

export class ProgramKehadiranNewest {
  constructor() {
    this.root = null;
    this.sections = {};
    this.elements = {};
    this.state = {
      programs: [],
      attendance: [],
      filters: {
        programId: '',
        date: ''
      }
    };
  }

  createContent() {
    return `
      <div class="program-newest-wrapper">
        <div class="section-header">
          <h3 class="section-title">Program & Kehadiran (Newest)</h3>
          <p class="section-description">
            Pengurusan program dan kehadiran generasi terkini, dibina semula sebagai modul berdikari.
          </p>
        </div>

        <div class="program-newest-section active" data-section="overview">
          <div class="program-newest-grid">
            <article class="program-newest-card">
              <header class="card-header">
                <h4>Program Management</h4>
                <span class="card-icon">&#128736;</span>
              </header>
              <p class="card-description">
                Cipta dan urus program komuniti dengan pantas.
              </p>
              <button class="btn btn-primary" data-action="open-management">
                Manage Programs
              </button>
            </article>
            <article class="program-newest-card">
              <header class="card-header">
                <h4>Attendance Tracking</h4>
                <span class="card-icon">&#128338;</span>
              </header>
              <p class="card-description">
                Pantau kehadiran peserta secara langsung.
              </p>
              <button class="btn btn-primary" data-action="open-attendance">
                View Attendance
              </button>
            </article>
            <article class="program-newest-card">
              <header class="card-header">
                <h4>Program Reports</h4>
                <span class="card-icon">&#128202;</span>
              </header>
              <p class="card-description">
                Jana ringkasan dan statistik kehadiran.
              </p>
              <button class="btn btn-primary" data-action="open-reports">
                Generate Reports
              </button>
            </article>
          </div>
        </div>

        <div class="program-newest-section" data-section="management">
          <div class="section-header">
            <div class="section-header-start">
              <button class="back-btn" data-action="back-to-overview">
                <span>&larr;</span>
                Back to Overview
              </button>
              <h3 class="section-title">Program Management</h3>
            </div>
            <p class="section-description">
              Cipta, kemas kini, dan jejak tindakan program komuniti.
            </p>
          </div>

          <div class="program-action-bar">
            <div class="program-action-buttons">
              <button class="btn btn-secondary" data-action="create-test-program">
                <span>&#10133;</span> Create Test Program
              </button>
              <button class="btn btn-primary" data-action="add-program">
                <span>&#9998;</span> Add New Program
              </button>
            </div>
            <div class="program-refresh">
              <button class="btn btn-outline" data-action="refresh-programs">
                Refresh
              </button>
            </div>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Program Name</th>
                  <th>Description</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody data-role="program-table-body">
                <tr>
                  <td colspan="7" class="placeholder-text">
                    Klik "Manage Programs" untuk memuatkan senarai program.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="program-newest-section" data-section="attendance">
          <div class="section-header">
            <div class="section-header-start">
              <button class="back-btn" data-action="back-to-overview">
                <span>&larr;</span>
                Back to Overview
              </button>
              <h3 class="section-title">Attendance Tracking</h3>
            </div>
            <p class="section-description">
              Pantau rekod kehadiran mengikut program atau tarikh.
            </p>
          </div>

          <div class="filters-container">
            <div class="filter-group">
              <label>Program:</label>
              <select class="form-select" data-role="program-filter">
                <option value="">All Programs</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Tarikh:</label>
              <input type="date" class="form-input" data-role="attendance-date">
            </div>
            <button class="btn btn-secondary" data-action="apply-attendance-filters">
              Apply Filters
            </button>
            <button class="btn btn-outline" data-action="reset-attendance-filters">
              Reset
            </button>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Present</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody data-role="attendance-table-body">
                <tr>
                  <td colspan="6" class="placeholder-text">
                    Pilih "View Attendance" untuk memuatkan rekod.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="program-newest-section" data-section="reports">
          <div class="section-header">
            <div class="section-header-start">
              <button class="back-btn" data-action="back-to-overview">
                <span>&larr;</span>
                Back to Overview
              </button>
              <h3 class="section-title">Program Reports</h3>
            </div>
            <p class="section-description">
              Dapatkan ringkasan prestasi dan statistik kehadiran.
            </p>
          </div>

          <div class="reports-grid">
            <section class="report-card">
              <header class="report-header">
                <h4>Attendance Summary</h4>
                <span class="report-icon">&#128202;</span>
              </header>
              <div class="report-content" data-role="attendance-summary">
                <p class="placeholder-text">Tekan "Generate Reports" untuk memuatkan data.</p>
              </div>
            </section>
            <section class="report-card">
              <header class="report-header">
                <h4>Top Participants</h4>
                <span class="report-icon">&#11088;</span>
              </header>
              <div class="report-content" data-role="top-participants">
                <p class="placeholder-text">Tekan "Generate Reports" untuk memuatkan data.</p>
              </div>
            </section>
            <section class="report-card">
              <header class="report-header">
                <h4>Program Participation</h4>
                <span class="report-icon">&#128200;</span>
              </header>
              <div class="report-content" data-role="program-participation">
                <p class="placeholder-text">Tekan "Generate Reports" untuk memuatkan data.</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    `;
  }

  async initialize() {
    this.root = document.getElementById('program-kehadiran-newest-content');
    if (!this.root) {
      console.error('ProgramKehadiranNewest: container not found');
      return;
    }

    this.injectStyles();
    this.cacheDom();
    this.bindOverviewNavigation();
    this.bindManagementActions();
    this.bindAttendanceActions();
    this.bindReportActions();
  }

  cacheDom() {
    this.sections = {
      overview: this.root.querySelector('[data-section="overview"]'),
      management: this.root.querySelector('[data-section="management"]'),
      attendance: this.root.querySelector('[data-section="attendance"]'),
      reports: this.root.querySelector('[data-section="reports"]')
    };

    this.elements = {
      programsTableBody: this.root.querySelector('[data-role="program-table-body"]'),
      attendanceTableBody: this.root.querySelector('[data-role="attendance-table-body"]'),
      programFilter: this.root.querySelector('[data-role="program-filter"]'),
      attendanceDate: this.root.querySelector('[data-role="attendance-date"]'),
      attendanceSummary: this.root.querySelector('[data-role="attendance-summary"]'),
      topParticipants: this.root.querySelector('[data-role="top-participants"]'),
      programParticipation: this.root.querySelector('[data-role="program-participation"]')
    };
  }

  bindOverviewNavigation() {
    this.root.querySelectorAll('[data-action="open-management"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        this.showSection('management');
        await this.loadPrograms();
      });
    });

    this.root.querySelectorAll('[data-action="open-attendance"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        this.showSection('attendance');
        await this.loadAttendanceData();
      });
    });

    this.root.querySelectorAll('[data-action="open-reports"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        this.showSection('reports');
        await this.loadReports();
      });
    });

    this.root.querySelectorAll('[data-action="back-to-overview"]').forEach(btn => {
      btn.addEventListener('click', () => this.showSection('overview'));
    });
  }

  bindManagementActions() {
    const createTestBtn = this.root.querySelector('[data-action="create-test-program"]');
    const addProgramBtn = this.root.querySelector('[data-action="add-program"]');
    const refreshBtn = this.root.querySelector('[data-action="refresh-programs"]');

    if (createTestBtn) {
      createTestBtn.addEventListener('click', () => this.createTestProgram());
    }
    if (addProgramBtn) {
      addProgramBtn.addEventListener('click', () => this.handleAddProgram());
    }
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.loadPrograms());
    }
  }

  bindAttendanceActions() {
    const applyBtn = this.root.querySelector('[data-action="apply-attendance-filters"]');
    const resetBtn = this.root.querySelector('[data-action="reset-attendance-filters"]');

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        this.state.filters.programId = this.elements.programFilter?.value || '';
        this.state.filters.date = this.elements.attendanceDate?.value || '';
        this.loadAttendanceData(true);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (this.elements.programFilter) {
          this.elements.programFilter.value = '';
        }
        if (this.elements.attendanceDate) {
          this.elements.attendanceDate.value = '';
        }
        this.state.filters = { programId: '', date: '' };
        this.loadAttendanceData();
      });
    }
  }

  bindReportActions() {
    // Reports load automatically when the section opens, so no extra listeners are required here.
  }

  showSection(sectionKey) {
    Object.entries(this.sections).forEach(([key, section]) => {
      if (!section) {
        return;
      }
      if (key === sectionKey) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });
  }

  async loadPrograms() {
    const target = this.elements.programsTableBody;
    if (!target) return;

    target.innerHTML = `
      <tr>
        <td colspan="7" class="loading-text">Memuatkan senarai program...</td>
      </tr>
    `;

    try {
      const programs = await ProgramService.listProgram();
      this.state.programs = programs;

      if (!programs || programs.length === 0) {
        target.innerHTML = `
          <tr>
            <td colspan="7" class="empty-text">
              Tiada program ditemui. Gunakan butang "Create Test Program" untuk menambah contoh.
            </td>
          </tr>
        `;
        this.populateProgramFilter([]);
        return;
      }

      const rows = programs.map(program => this.buildProgramRow(program)).join('');
      target.innerHTML = rows;
      this.populateProgramFilter(programs);
      this.bindProgramActions();
    } catch (error) {
      console.error('ProgramKehadiranNewest: gagal memuat program', error);
      target.innerHTML = `
        <tr>
          <td colspan="7" class="error-text">
            ${error.message || 'Gagal memuat program.'}
          </td>
        </tr>
      `;
    }
  }

  buildProgramRow(program) {
    const startDate = this.formatDate(program.tarikh_mula || program.startDate);
    const endDate = this.formatDate(program.tarikh_tamat || program.endDate);
    const status = this.resolveStatus(program);

    return `
      <tr data-program-id="${program.id}">
        <td>${program.nama_program || program.nama || 'Tidak dinyatakan'}</td>
        <td>${program.penerangan || program.deskripsi || '-'}</td>
        <td>${startDate}</td>
        <td>${endDate}</td>
        <td>${program.kategori || '-'}</td>
        <td>
          <span class="status-badge ${status.className}">${status.label}</span>
        </td>
        <td>
          <div class="program-row-actions">
            <button class="btn btn-sm btn-outline" data-action="view-program" data-program-id="${program.id}">
              Details
            </button>
            <button class="btn btn-sm btn-primary" data-action="edit-program" data-program-id="${program.id}">
              Edit
            </button>
            <button class="btn btn-sm btn-danger" data-action="delete-program" data-program-id="${program.id}">
              Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  bindProgramActions() {
    this.root.querySelectorAll('[data-action="view-program"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const programId = btn.getAttribute('data-program-id');
        const program = this.state.programs.find(item => item.id === programId);
        if (!program) {
          this.showToast('Program tidak ditemui', 'error');
          return;
        }

        const message = [
          `Nama: ${program.nama_program || program.nama || '-'}`,
          `Kategori: ${program.kategori || '-'}`,
          `Tarikh: ${this.formatDate(program.tarikh_mula)} - ${this.formatDate(program.tarikh_tamat)}`,
          `Lokasi: ${program.lokasi || '-'}`,
          `Penerangan: ${program.penerangan || program.deskripsi || '-'}`,
        ].join('\n');
        alert(message);
      });
    });

    this.root.querySelectorAll('[data-action="edit-program"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const programId = btn.getAttribute('data-program-id');
        await this.openEditProgramModal(programId);
      });
    });

    this.root.querySelectorAll('[data-action="delete-program"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const programId = btn.getAttribute('data-program-id');
        await this.deleteProgram(programId);
      });
    });
  }

  async createTestProgram() {
    try {
      const timestamp = new Date().toISOString();
      await ProgramService.createProgram({
        name: `Demo Program ${timestamp.slice(0, 10)}`,
        description: 'Program contoh yang dijana secara automatik.',
        startDate: timestamp,
        endDate: timestamp,
        category: 'Demo',
        status: 'Upcoming',
        location: 'Ibu Pejabat'
      });
      this.showToast('Program contoh berjaya dicipta.', 'success');
      await this.loadPrograms();
    } catch (error) {
      console.error('ProgramKehadiranNewest: gagal cipta program contoh', error);
      this.showToast(error.message || 'Gagal mencipta program contoh.', 'error');
    }
  }

  handleAddProgram() {
    this.openCreateProgramModal();
  }

  openCreateProgramModal() {
    if (document.getElementById("program-newest-create-modal")) {
      return;
    }

    const modal = document.createElement("div");
    modal.id = "program-newest-create-modal";
    modal.className = "program-newest-modal";
    modal.innerHTML = `
      <div class="modal-panel">
        <div class="modal-header">
          <h3>Cipta Program Baharu</h3>
          <button type="button" class="modal-close" data-action="close-modal">&times;</button>
        </div>
        <form id="program-newest-create-form">
          <div class="form-group">
            <label for="program-newest-name">Nama Program</label>
            <input id="program-newest-name" name="name" type="text" class="form-input" placeholder="Contoh: Program Komuniti" required>
          </div>
          <div class="form-group">
            <label for="program-newest-description">Penerangan</label>
            <textarea id="program-newest-description" name="description" class="form-input" rows="3" required></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="program-newest-start">Tarikh Mula</label>
              <input id="program-newest-start" name="startDate" type="date" class="form-input" required>
            </div>
            <div class="form-group">
              <label for="program-newest-end">Tarikh Tamat</label>
              <input id="program-newest-end" name="endDate" type="date" class="form-input" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="program-newest-category">Kategori</label>
              <select id="program-newest-category" name="category" class="form-input" required>
                <option value="">Pilih kategori</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Community">Community</option>
                <option value="Religious">Religious</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label for="program-newest-status">Status</label>
              <select id="program-newest-status" name="status" class="form-input" required>
                <option value="Upcoming" selected>Upcoming</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="program-newest-location">Lokasi (Pilihan)</label>
            <input id="program-newest-location" name="location" type="text" class="form-input" placeholder="Contoh: Dewan Komuniti">
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-outline" data-action="close-modal">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan Program</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add("visible"));

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        this.closeCreateProgramModal();
      }
    });

    modal.querySelectorAll('[data-action="close-modal"]').forEach(btn => {
      btn.addEventListener("click", () => this.closeCreateProgramModal());
    });

    const form = modal.querySelector("#program-newest-create-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      await this.submitCreateProgram(form);
    });
  }

  closeCreateProgramModal() {
    const modal = document.getElementById("program-newest-create-modal");
    if (modal) {
      modal.classList.remove("visible");
      setTimeout(() => {
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      }, 200);
    }
  }

  async submitCreateProgram(form) {
    if (!form) {
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalLabel = submitBtn ? submitBtn.textContent : "";

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Menyimpan...";
      }

      const formData = new FormData(form);
      const name = (formData.get("name") || "").toString().trim();
      const description = (formData.get("description") || "").toString().trim();
      const startDate = formData.get("startDate");
      const endDate = formData.get("endDate");
      const category = (formData.get("category") || "").toString();
      const status = (formData.get("status") || "").toString();
      const location = (formData.get("location") || "").toString().trim();

      if (!name || !description || !startDate || !endDate || !category || !status) {
        this.showToast("Sila lengkapkan semua maklumat wajib.", "error");
        return;
      }

      const payload = {
        name,
        description,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        category,
        status,
        location
      };

      await ProgramService.createProgram(payload);
      this.showToast("Program baharu berjaya dicipta.", "success");
      this.closeCreateProgramModal();
      await this.loadPrograms();
    } catch (error) {
      console.error("ProgramKehadiranNewest: gagal mencipta program baharu", error);
      this.showToast(error.message || "Gagal mencipta program baharu.", "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    }
  }

  formatDateForInput(value) {
    if (!value) {
      return "";
    }

    try {
      if (typeof value === "string") {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
          return "";
        }
        return date.toISOString().slice(0, 10);
      }

      if (value.seconds) {
        const date = new Date(value.seconds * 1000);
        return date.toISOString().slice(0, 10);
      }

      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
    } catch (error) {
      console.warn("ProgramKehadiranNewest: tidak dapat memformat tarikh input", value, error);
      return "";
    }
  }

  async openEditProgramModal(programId) {
    if (!programId) {
      return;
    }

    if (document.getElementById("program-newest-edit-modal")) {
      this.closeEditProgramModal();
    }

    let program = this.state.programs.find(item => item.id === programId);

    if (!program) {
      try {
        program = await ProgramService.getProgramById(programId);
      } catch (error) {
        console.error("ProgramKehadiranNewest: gagal mendapatkan program", error);
      }
    }

    if (!program) {
      this.showToast("Program tidak ditemui.", "error");
      return;
    }

    const startValue = this.formatDateForInput(program.tarikh_mula || program.startDate);
    const endValue = this.formatDateForInput(program.tarikh_tamat || program.endDate);
    const currentCategory = program.kategori || program.category || "Education";
    const currentStatus = (program.status || this.resolveStatus(program).label || "Upcoming").toLowerCase();

    const modal = document.createElement("div");
    modal.id = "program-newest-edit-modal";
    modal.className = "program-newest-modal";
    modal.innerHTML = `
      <div class="modal-panel">
        <div class="modal-header">
          <h3>Kemas Kini Program</h3>
          <button type="button" class="modal-close" data-action="close-modal">&times;</button>
        </div>
        <form id="program-newest-edit-form">
          <div class="form-group">
            <label for="program-newest-edit-name">Nama Program</label>
            <input id="program-newest-edit-name" name="name" type="text" class="form-input" value="${program.nama_program || program.nama || ""}" required>
          </div>
          <div class="form-group">
            <label for="program-newest-edit-description">Penerangan</label>
            <textarea id="program-newest-edit-description" name="description" class="form-input" rows="3" required>${program.penerangan || program.deskripsi || ""}</textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="program-newest-edit-start">Tarikh Mula</label>
              <input id="program-newest-edit-start" name="startDate" type="date" class="form-input" value="${startValue}" required>
            </div>
            <div class="form-group">
              <label for="program-newest-edit-end">Tarikh Tamat</label>
              <input id="program-newest-edit-end" name="endDate" type="date" class="form-input" value="${endValue}" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="program-newest-edit-category">Kategori</label>
              <select id="program-newest-edit-category" name="category" class="form-input" required>
                <option value="Education" ${currentCategory === "Education" ? "selected" : ""}>Education</option>
                <option value="Health" ${currentCategory === "Health" ? "selected" : ""}>Health</option>
                <option value="Community" ${currentCategory === "Community" ? "selected" : ""}>Community</option>
                <option value="Religious" ${currentCategory === "Religious" ? "selected" : ""}>Religious</option>
                <option value="Other" ${currentCategory === "Other" ? "selected" : ""}>Other</option>
              </select>
            </div>
            <div class="form-group">
              <label for="program-newest-edit-status">Status</label>
              <select id="program-newest-edit-status" name="status" class="form-input" required>
                <option value="Upcoming" ${currentStatus === "upcoming" ? "selected" : ""}>Upcoming</option>
                <option value="Active" ${currentStatus === "active" ? "selected" : ""}>Active</option>
                <option value="Completed" ${currentStatus === "completed" ? "selected" : ""}>Completed</option>
                <option value="Cancelled" ${currentStatus === "cancelled" ? "selected" : ""}>Cancelled</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="program-newest-edit-location">Lokasi (Pilihan)</label>
            <input id="program-newest-edit-location" name="location" type="text" class="form-input" value="${program.lokasi || program.location || ""}">
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-outline" data-action="close-modal">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add("visible"));

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        this.closeEditProgramModal();
      }
    });

    modal.querySelectorAll('[data-action="close-modal"]').forEach(btn => {
      btn.addEventListener("click", () => this.closeEditProgramModal());
    });

    const form = modal.querySelector("#program-newest-edit-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      await this.submitEditProgram(form, programId);
    });
  }

  closeEditProgramModal() {
    const modal = document.getElementById("program-newest-edit-modal");
    if (modal) {
      modal.classList.remove("visible");
      setTimeout(() => {
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      }, 200);
    }
  }

  async submitEditProgram(form, programId) {
    if (!form || !programId) {
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalLabel = submitBtn ? submitBtn.textContent : "";

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Menyimpan...";
      }

      const formData = new FormData(form);
      const name = (formData.get("name") || "").toString().trim();
      const description = (formData.get("description") || "").toString().trim();
      const startDate = formData.get("startDate");
      const endDate = formData.get("endDate");
      const category = (formData.get("category") || "").toString();
      const status = (formData.get("status") || "").toString();
      const location = (formData.get("location") || "").toString().trim();

      if (!name || !description || !startDate || !endDate || !category || !status) {
        this.showToast("Sila lengkapkan semua maklumat wajib.", "error");
        return;
      }

      const payload = {
        name,
        description,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        category,
        status,
        location
      };

      await ProgramService.updateProgram(programId, payload);
      this.showToast("Program dikemas kini.", "success");
      this.closeEditProgramModal();
      await this.loadPrograms();
    } catch (error) {
      console.error("ProgramKehadiranNewest: gagal mengemas kini program", error);
      this.showToast(error.message || "Gagal mengemas kini program.", "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    }
  }

  async deleteProgram(programId) {
    if (!programId) {
      return;
    }

    const confirmDelete = window.confirm("Padam program ini? Tindakan ini tidak boleh diundur.");
    if (!confirmDelete) {
      return;
    }

    try {
      await ProgramService.deleteProgram(programId);
      this.showToast("Program berjaya dipadam.", "success");
      await this.loadPrograms();
    } catch (error) {
      console.error("ProgramKehadiranNewest: gagal memadam program", error);
      this.showToast(error.message || "Gagal memadam program.", "error");
    }
  }

  populateProgramFilter(programs) {
    const select = this.elements.programFilter;
    if (!select) return;

    const current = select.value;
    select.innerHTML = '<option value="">All Programs</option>';

    programs.forEach(program => {
      const option = document.createElement('option');
      option.value = program.id;
      option.textContent = program.nama_program || program.nama || 'Tanpa Nama';
      select.appendChild(option);
    });

    if (current && Array.from(select.options).some(opt => opt.value === current)) {
      select.value = current;
    }
  }

  async loadAttendanceData(userTriggered = false) {
    const target = this.elements.attendanceTableBody;
    if (!target) return;

    target.innerHTML = `
      <tr>
        <td colspan="6" class="loading-text">Memuatkan rekod kehadiran...</td>
      </tr>
    `;

    try {
      const { programId, date } = this.state.filters;
      let records;

      if (userTriggered && (programId || date)) {
        records = await ProgramService.listAttendanceByFilters(programId || null, date || null);
      } else {
        records = await ProgramService.listAllAttendance();
      }

      this.state.attendance = records;

      if (!records || records.length === 0) {
        target.innerHTML = `
          <tr>
            <td colspan="6" class="empty-text">Tiada rekod kehadiran ditemui.</td>
          </tr>
        `;
        return;
      }

      const rows = records.map(record => this.buildAttendanceRow(record)).join('');
      target.innerHTML = rows;
      this.bindAttendanceRowEvents();
    } catch (error) {
      console.error('ProgramKehadiranNewest: gagal memuat kehadiran', error);
      target.innerHTML = `
        <tr>
          <td colspan="6" class="error-text">
            ${error.message || 'Gagal memuat rekod kehadiran.'}
          </td>
        </tr>
      `;
    }
  }

  buildAttendanceRow(record) {
    const checked = record.present ? 'checked' : '';
    const notes = record.notes || '-';
    return `
      <tr data-attendance-id="${record.id}">
        <td>${record.participantName || '-'}</td>
        <td>${record.participantId || '-'}</td>
        <td>${record.participantType || '-'}</td>
        <td>
          <input type="checkbox" data-role="attendance-checkbox" data-id="${record.id}" ${checked}>
        </td>
        <td>${notes}</td>
        <td>
          <button class="btn btn-sm btn-outline" data-role="edit-attendance-note" data-id="${record.id}">
            Edit Notes
          </button>
        </td>
      </tr>
    `;
  }

  bindAttendanceRowEvents() {
    this.root.querySelectorAll('[data-role="attendance-checkbox"]').forEach(input => {
      input.addEventListener('change', (event) => {
        const attendanceId = event.target.getAttribute('data-id');
        const present = event.target.checked;
        this.updateAttendanceStatus(attendanceId, present);
      });
    });

    this.root.querySelectorAll('[data-role="edit-attendance-note"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const attendanceId = btn.getAttribute('data-id');
        const current = this.state.attendance.find(item => item.id === attendanceId);
        const existingNotes = current?.notes || '';
        const newNotes = prompt('Kemas kini catatan kehadiran:', existingNotes);
        if (newNotes !== null) {
          this.updateAttendanceNotes(attendanceId, newNotes);
        }
      });
    });
  }

  async updateAttendanceStatus(attendanceId, present) {
    try {
      await ProgramService.updateAttendanceStatus(attendanceId, present);
      this.showToast('Status kehadiran dikemas kini.', 'success');
    } catch (error) {
      console.error('ProgramKehadiranNewest: gagal kemas kini kehadiran', error);
      this.showToast(error.message || 'Gagal mengemas kini status kehadiran.', 'error');
      await this.loadAttendanceData(Boolean(this.state.filters.programId || this.state.filters.date));
    }
  }

  async updateAttendanceNotes(attendanceId, notes) {
    try {
      await ProgramService.updateAttendanceNotes(attendanceId, notes);
      this.showToast('Catatan kehadiran dikemas kini.', 'success');
      await this.loadAttendanceData(Boolean(this.state.filters.programId || this.state.filters.date));
    } catch (error) {
      console.error('ProgramKehadiranNewest: gagal kemas kini catatan', error);
      this.showToast(error.message || 'Gagal mengemas kini catatan.', 'error');
    }
  }

  async loadReports() {
    if (!this.elements.attendanceSummary || !this.elements.topParticipants || !this.elements.programParticipation) {
      return;
    }

    this.elements.attendanceSummary.innerHTML = '<p class="loading-text">Memuatkan ringkasan...</p>';
    this.elements.topParticipants.innerHTML = '<p class="loading-text">Memuatkan peserta terbaik...</p>';
    this.elements.programParticipation.innerHTML = '<p class="loading-text">Memuatkan statistik program...</p>';

    try {
      const [summary, topParticipants, participation] = await Promise.all([
        ProgramService.getAttendanceSummary(),
        ProgramService.getTopParticipants(5),
        ProgramService.getProgramParticipation()
      ]);

      this.renderAttendanceSummary(summary);
      this.renderTopParticipants(topParticipants);
      this.renderProgramParticipation(participation);
    } catch (error) {
      console.error('ProgramKehadiranNewest: gagal memuat laporan', error);
      const message = `<p class="error-text">${error.message || 'Gagal memuat laporan.'}</p>`;
      this.elements.attendanceSummary.innerHTML = message;
      this.elements.topParticipants.innerHTML = message;
      this.elements.programParticipation.innerHTML = message;
    }
  }

  renderAttendanceSummary(summary) {
    if (!summary) {
      this.elements.attendanceSummary.innerHTML = '<p class="empty-text">Tiada data ringkasan.</p>';
      return;
    }

    this.elements.attendanceSummary.innerHTML = `
      <div class="stat-grid">
        <div class="stat-card">
          <span class="stat-value">${summary.totalPrograms ?? 0}</span>
          <span class="stat-label">Jumlah Program</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${summary.totalParticipants ?? 0}</span>
          <span class="stat-label">Jumlah Peserta</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${summary.averageAttendance ?? 0}%</span>
          <span class="stat-label">Purata Kehadiran</span>
        </div>
      </div>
    `;
  }

  renderTopParticipants(participants) {
    if (!participants || participants.length === 0) {
      this.elements.topParticipants.innerHTML = '<p class="empty-text">Tiada peserta direkodkan.</p>';
      return;
    }

    const items = participants.map(participant => `
      <div class="participant-item">
        <div>
          <div class="participant-name">${participant.name || '-'}</div>
          <div class="participant-type">${participant.type || '-'}</div>
        </div>
        <div class="participant-score">
          ${participant.attendanceCount ?? 0} hadir (${participant.attendancePercentage ?? 0}%)
        </div>
      </div>
    `).join('');

    this.elements.topParticipants.innerHTML = items;
  }

  renderProgramParticipation(programs) {
    if (!programs || programs.length === 0) {
      this.elements.programParticipation.innerHTML = '<p class="empty-text">Tiada statistik program.</p>';
      return;
    }

    const items = programs.map(program => `
      <div class="program-item">
        <div class="program-name">${program.name || '-'}</div>
        <div class="program-dates">${this.formatDate(program.startDate)} - ${this.formatDate(program.endDate)}</div>
        <div class="program-stats">
          <div>
            <span class="stat-label">Peserta</span>
            <span class="stat-value">${program.participantCount ?? 0}</span>
          </div>
          <div>
            <span class="stat-label">Hadir</span>
            <span class="stat-value">${program.attendancePercentage ?? 0}%</span>
          </div>
        </div>
      </div>
    `).join('');

    this.elements.programParticipation.innerHTML = `
      <div class="program-participation-grid">${items}</div>
    `;
  }

  formatDate(value) {
    if (!value) return 'N/A';

    try {
      if (typeof value === 'string') {
        return new Date(value).toLocaleDateString('ms-MY', { year: 'numeric', month: 'short', day: 'numeric' });
      }

      if (value.seconds) {
        return new Date(value.seconds * 1000).toLocaleDateString('ms-MY', { year: 'numeric', month: 'short', day: 'numeric' });
      }

      return new Date(value).toLocaleDateString('ms-MY', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
      console.warn('ProgramKehadiranNewest: tidak dapat memformat tarikh', value, error);
      return 'N/A';
    }
  }

  resolveStatus(program) {
    const now = new Date();
    const start = program.tarikh_mula || program.startDate;
    const end = program.tarikh_tamat || program.endDate;
    const status = (program.status || '').toLowerCase();

    const normalizeDate = (input) => {
      if (!input) return null;
      if (typeof input === 'string') return new Date(input);
      if (input.seconds) return new Date(input.seconds * 1000);
      return new Date(input);
    };

    const startDate = normalizeDate(start);
    const endDate = normalizeDate(end);

    let label = 'Upcoming';
    let className = 'upcoming';

    if (status === 'active' || status === 'ongoing') {
      label = 'Active';
      className = 'active';
    } else if (status === 'completed') {
      label = 'Completed';
      className = 'completed';
    } else if (status === 'cancelled') {
      label = 'Cancelled';
      className = 'cancelled';
    } else if (startDate && endDate) {
      if (now > endDate) {
        label = 'Completed';
        className = 'completed';
      } else if (now >= startDate && now <= endDate) {
        label = 'Active';
        className = 'active';
      }
    }

    return { label, className };
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `program-newest-toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('visible'));

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 2600);
  }

  injectStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .program-newest-wrapper {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .program-newest-section {
        display: none;
      }

      .program-newest-section.active {
        display: block;
      }

      .program-newest-grid {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      }

      .program-row-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .program-row-actions .btn {
        display: inline-flex;
        gap: 4px;
        align-items: center;
      }

      .program-newest-modal {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease;
        z-index: 2100;
      }

      .program-newest-modal.visible {
        opacity: 1;
        pointer-events: auto;
      }

      .modal-panel {
        background: #ffffff;
        border-radius: 12px;
        padding: 24px;
        width: min(520px, 90vw);
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 24px 48px rgba(15, 23, 42, 0.18);
        transform: translateY(12px);
        transition: transform 0.2s ease;
      }

      .program-newest-modal.visible .modal-panel {
        transform: translateY(0);
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .modal-header h3 {
        margin: 0;
      }

      .modal-panel form {
        display: flex;
        flex-direction: column;
      }

      .modal-close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #64748b;
      }

      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 24px;
      }

      .form-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 14px;
      }

      .program-newest-card {
        background: linear-gradient(135deg, #ffffff 0%, #f7f9fc 100%);
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
        border: 1px solid #e2e8f0;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .program-newest-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 18px 36px rgba(15, 23, 42, 0.12);
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }

      .card-icon {
        font-size: 24px;
      }

      .program-action-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 16px;
      }

      .program-action-buttons {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .placeholder-text,
      .loading-text,
      .empty-text,
      .error-text {
        text-align: center;
        padding: 18px;
        color: #475569;
      }

      .error-text {
        color: #b91c1c;
      }

      .status-badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .status-badge.upcoming { background: #eff6ff; color: #1d4ed8; }
      .status-badge.active { background: #dcfce7; color: #15803d; }
      .status-badge.completed { background: #e2e8f0; color: #475569; }
      .status-badge.cancelled { background: #fee2e2; color: #b91c1c; }

      .filters-container {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: flex-end;
        margin-bottom: 20px;
      }

      .filter-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .reports-grid {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }

      .report-card {
        background: #ffffff;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 12px 25px rgba(15, 23, 42, 0.06);
        padding: 24px;
      }

      .report-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
      }

      .stat-grid {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      }

      .stat-card {
        background: #f8fafc;
        border-radius: 10px;
        padding: 16px;
        text-align: center;
      }

      .stat-value {
        font-size: 24px;
        font-weight: 700;
        color: #2563eb;
        display: block;
      }

      .stat-label {
        font-size: 12px;
        color: #475569;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .participant-item {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid #e2e8f0;
      }

      .participant-name {
        font-weight: 600;
        color: #1e293b;
      }

      .participant-type {
        font-size: 12px;
        color: #64748b;
      }

      .participant-score {
        font-weight: 600;
        color: #2563eb;
      }

      .program-participation-grid {
        display: grid;
        gap: 14px;
      }

      .program-item {
        background: #f8fafc;
        border-radius: 10px;
        padding: 16px;
      }

      .program-name {
        font-weight: 600;
        margin-bottom: 6px;
      }

      .program-dates {
        font-size: 12px;
        color: #64748b;
        margin-bottom: 10px;
      }

      .program-stats {
        display: flex;
        gap: 16px;
      }

      .program-newest-toast {
        position: fixed;
        top: 24px;
        right: 24px;
        background: #2563eb;
        color: #ffffff;
        padding: 12px 18px;
        border-radius: 999px;
        box-shadow: 0 16px 32px rgba(37, 99, 235, 0.25);
        opacity: 0;
        transform: translateY(-10px);
        transition: opacity 0.25s ease, transform 0.25s ease;
        z-index: 2000;
      }

      .program-newest-toast.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .program-newest-toast.success { background: #16a34a; box-shadow: 0 16px 32px rgba(22, 163, 74, 0.25); }
      .program-newest-toast.error { background: #dc2626; box-shadow: 0 16px 32px rgba(220, 38, 38, 0.25); }
      .program-newest-toast.info { background: #2563eb; }
    `;

    document.head.appendChild(style);
  }
}


