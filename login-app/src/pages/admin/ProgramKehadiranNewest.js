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
        date: '',
        search: ''
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
        <div class="section-card">
          <div class="section-header">
            <div class="section-header-left">
              <div class="header-icon">&#128197;</div>
              <div>
                <h3 class="section-title">Attendance Tracking</h3>
                <p class="section-description">Pantau rekod kehadiran mengikut program atau tarikh.</p>
              </div>
            </div>
            <div class="section-header-actions">
              <button class="btn btn-ghost" data-action="back-to-overview">&larr; Back to Overview</button>
              <button class="btn btn-ghost" data-action="export-attendance">&#8681; Export</button>
            </div>
          </div>

          <div class="filters-container">
            <label class="filter-group" style="flex:1">
              <span>Tarikh:</span>
              <input type="date" class="form-input" data-role="attendance-date">
            </label>
            <button class="btn btn-secondary" data-action="apply-attendance-filters">
              Apply Filters
            </button>
            <button class="btn btn-outline" data-action="reset-attendance-filters">
              Reset
            </button>
          </div>

          <div class="attendance-program-list" data-role="attendance-program-list"></div>

          <div class="search-bar">
            <input type="text" class="form-input" placeholder="Search by name or NO KP..." data-role="attendance-search" />
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>No KP</th>
                  <th>Source</th>
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
            <div class="table-footer" data-role="attendance-footer"></div>
          </div>
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
      attendanceDate: this.root.querySelector('[data-role="attendance-date"]'),
      attendanceSummary: this.root.querySelector('[data-role="attendance-summary"]'),
      topParticipants: this.root.querySelector('[data-role="top-participants"]'),
      programParticipation: this.root.querySelector('[data-role="program-participation"]'),
      attendanceProgramList: this.root.querySelector('[data-role="attendance-program-list"]'),
      attendanceSearch: this.root.querySelector('[data-role="attendance-search"]'),
      attendanceFooter: this.root.querySelector('[data-role="attendance-footer"]')
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
        if (!this.state.programs || this.state.programs.length === 0) {
          await this.loadPrograms();
        } else {
          this.renderAttendanceProgramList();
        }
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
    const exportBtn = this.root.querySelector('[data-action="export-attendance"]');

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        this.state.filters.date = this.elements.attendanceDate?.value || '';
        if (!this.state.filters.programId) {
          this.showToast('Sila pilih program dari senarai.', 'error');
          return;
        }
        this.loadAttendanceData(true);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (this.elements.attendanceDate) {
          this.elements.attendanceDate.value = '';
        }
        if (this.elements.attendanceSearch) {
          this.elements.attendanceSearch.value = '';
        }
        this.state.filters = { programId: '', date: '', search: '' };
        this.renderAttendanceProgramList();
        this.loadAttendanceData();
      });
    }

    if (this.elements.attendanceSearch) {
      this.elements.attendanceSearch.addEventListener('input', () => {
        this.state.filters.search = this.elements.attendanceSearch.value || '';
        this.renderAttendanceTable();
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportAttendance());
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
      this.renderAttendanceProgramList();
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

  renderAttendanceProgramList() {
    const container = this.elements.attendanceProgramList;
    if (!container) return;

    if (!this.state.programs || this.state.programs.length === 0) {
      container.innerHTML = `<div class="empty-text">Tiada program ditemui.</div>`;
      return;
    }

    const cards = this.state.programs.map(program => {
      const active = this.state.filters.programId === program.id;
      const start = this.formatDate(program.tarikh_mula || program.startDate);
      const end = this.formatDate(program.tarikh_tamat || program.endDate);
      return `
        <button class="attendance-program-card ${active ? 'active' : ''}" data-program-id="${program.id}">
          <div class="card-title">${this.escapeHtml(program.nama_program || program.nama || 'Program')}</div>
          <div class="card-sub">
            <span class="pill">
              <span>${start}${end ? ' - ' + end : ''}</span>
            </span>
          </div>
          <div class="card-meta">${this.escapeHtml(program.lokasi || '')}</div>
        </button>
      `;
    }).join('');

    container.innerHTML = cards;

    container.querySelectorAll('.attendance-program-card').forEach(btn => {
      btn.addEventListener('click', async () => {
        const programId = btn.getAttribute('data-program-id');
        this.state.filters.programId = programId;
        this.renderAttendanceProgramList();
        await this.loadAttendanceData(true);
      });
    });
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
            <button class="btn btn-sm btn-secondary" data-action="qr-program" data-program-id="${program.id}">
              QR Check-in
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

        this.openProgramDetailsModal(program);
      });
    });

    this.root.querySelectorAll('[data-action="edit-program"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const programId = btn.getAttribute('data-program-id');
        await this.openEditProgramModal(programId);
      });
    });

    this.root.querySelectorAll('[data-action="qr-program"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const programId = btn.getAttribute('data-program-id');
        const program = this.state.programs.find(item => item.id === programId);
        if (!program) {
          this.showToast('Program tidak ditemui', 'error');
          return;
        }
        this.openQRModal(program);
      });
    });

    this.root.querySelectorAll('[data-action="delete-program"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const programId = btn.getAttribute('data-program-id');
        await this.deleteProgram(programId);
      });
    });
  }

  openProgramDetailsModal(program) {
    const existing = document.getElementById('program-newest-details-modal');
    if (existing) existing.remove();

    const start = this.formatDate(program.tarikh_mula || program.startDate);
    const end = this.formatDate(program.tarikh_tamat || program.endDate);
    const status = this.resolveStatus(program);

    const modal = document.createElement('div');
    modal.id = 'program-newest-details-modal';
    modal.className = 'program-newest-modal visible';
    modal.innerHTML = `
      <div class="modal-panel program-details-panel">
        <div class="modal-header">
          <h3>Butiran Program</h3>
          <button type="button" class="modal-close" data-action="close-modal">&times;</button>
        </div>
        <div class="program-details-grid">
          <div class="detail-item">
            <span class="detail-label">Nama Program</span>
            <span class="detail-value">${program.nama_program || program.nama || '-'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Kategori</span>
            <span class="detail-value">${program.kategori || '-'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Status</span>
            <span class="status-badge ${status.className}">${status.label}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Lokasi</span>
            <span class="detail-value">${program.lokasi || '-'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Skala Masa</span>
            <span class="detail-value">${program.time_scale || program.timeScale || '-'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Tempoh</span>
            <span class="detail-value">${start} - ${end}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Co-organizer</span>
            <span class="detail-value">${program.co_organizer || program.coOrganizer || '-'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Perbelanjaan</span>
            <span class="detail-value">${program.expenses || program.perbelanjaan || '-'}</span>
          </div>
          <div class="detail-item detail-span">
            <span class="detail-label">Penerangan</span>
            <p class="detail-value description">${program.penerangan || program.deskripsi || '-'}</p>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" data-action="close-modal">Tutup</button>
        </div>
      </div>
    `;

    modal.addEventListener('click', (event) => {
      if (event.target === modal || event.target.dataset.action === 'close-modal') {
        modal.remove();
      }
    });

    document.body.appendChild(modal);
  }

  openQRModal(program) {
    const existing = document.getElementById('program-newest-qr-modal');
    if (existing) existing.remove();

    const checkinLink = `${window.location.origin}/#/checkin?programId=${program.id}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(checkinLink)}`;

    const modal = document.createElement('div');
    modal.id = 'program-newest-qr-modal';
    modal.className = 'program-newest-modal visible';
    modal.innerHTML = `
      <div class="modal-panel program-details-panel">
        <div class="modal-header">
          <h3>QR Check-in</h3>
          <button type="button" class="modal-close" data-action="close-modal">&times;</button>
        </div>
        <p><strong>${program.nama_program || program.nama || 'Program'}</strong></p>
        <div class="qr-container">
          <img src="${qrUrl}" alt="QR code for check-in" />
        </div>
        <div class="qr-link">${checkinLink}</div>
        <div class="modal-actions">
          <button class="btn btn-primary" data-action="close-modal">Tutup</button>
        </div>
      </div>
    `;

    modal.addEventListener('click', (event) => {
      if (event.target === modal || event.target.dataset.action === 'close-modal') {
        modal.remove();
      }
    });

    document.body.appendChild(modal);
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
              <input id="program-newest-category" name="category" type="text" class="form-input" placeholder="Contoh: Pendidikan" required>
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
          <div class="form-row">
            <div class="form-group">
              <label for="program-newest-time-scale">Skala Masa</label>
              <select id="program-newest-time-scale" name="time_scale" class="form-input">
                <option value="">Pilih skala masa</option>
                <option value="One Off">One Off</option>
                <option value="Daily">Daily</option>
                <option value="Monthly">Monthly</option>
                <option value="Berkala">Berkala</option>
              </select>
            </div>
            <div class="form-group">
              <label for="program-newest-location">Lokasi (Pilihan)</label>
              <input id="program-newest-location" name="location" type="text" class="form-input" placeholder="Contoh: Dewan Komuniti">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="program-newest-co-organizer">Co-organizer (Pilihan)</label>
              <input id="program-newest-co-organizer" name="co_organizer" type="text" class="form-input" placeholder="Contoh: NGO Tempatan">
            </div>
            <div class="form-group">
              <label for="program-newest-expenses">Perbelanjaan (Pilihan)</label>
              <input id="program-newest-expenses" name="expenses" type="text" class="form-input" placeholder="Contoh: RM 5000">
            </div>
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
      const timeScale = (formData.get("time_scale") || "").toString();
      const coOrganizer = (formData.get("co_organizer") || "").toString().trim();
      const expenses = (formData.get("expenses") || "").toString().trim();

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
        location,
        time_scale: timeScale,
        co_organizer: coOrganizer,
        expenses
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
    const currentTimeScale = (program.time_scale || program.timeScale || "").toLowerCase();
    const currentLocation = program.lokasi || program.location || "";
    const currentCoOrganizer = program.co_organizer || program.coOrganizer || "";
    const currentExpenses = program.expenses || program.perbelanjaan || "";

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
              <input id="program-newest-edit-category" name="category" type="text" class="form-input" value="${currentCategory}" required>
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
          <div class="form-row">
            <div class="form-group">
              <label for="program-newest-edit-time-scale">Skala Masa</label>
              <select id="program-newest-edit-time-scale" name="time_scale" class="form-input">
                <option value="" ${currentTimeScale === "" ? "selected" : ""}>Pilih skala masa</option>
                <option value="One Off" ${currentTimeScale === "one off" ? "selected" : ""}>One Off</option>
                <option value="Daily" ${currentTimeScale === "daily" ? "selected" : ""}>Daily</option>
                <option value="Monthly" ${currentTimeScale === "monthly" ? "selected" : ""}>Monthly</option>
                <option value="Berkala" ${currentTimeScale === "berkala" ? "selected" : ""}>Berkala</option>
              </select>
            </div>
            <div class="form-group">
              <label for="program-newest-edit-location">Lokasi (Pilihan)</label>
              <input id="program-newest-edit-location" name="location" type="text" class="form-input" value="${currentLocation}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="program-newest-edit-co-organizer">Co-organizer (Pilihan)</label>
              <input id="program-newest-edit-co-organizer" name="co_organizer" type="text" class="form-input" value="${currentCoOrganizer}">
            </div>
            <div class="form-group">
              <label for="program-newest-edit-expenses">Perbelanjaan (Pilihan)</label>
              <input id="program-newest-edit-expenses" name="expenses" type="text" class="form-input" value="${currentExpenses}">
            </div>
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
      const timeScale = (formData.get("time_scale") || "").toString();
      const coOrganizer = (formData.get("co_organizer") || "").toString().trim();
      const expenses = (formData.get("expenses") || "").toString().trim();

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
        location,
        time_scale: timeScale,
        co_organizer: coOrganizer,
        expenses
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

    const { programId, date } = this.state.filters;
    if (!programId) {
      target.innerHTML = `
        <tr>
          <td colspan="6" class="empty-text">Sila pilih program untuk melihat kehadiran.</td>
        </tr>
      `;
      return;
    }

    target.innerHTML = `
      <tr>
        <td colspan="6" class="loading-text">Memuatkan rekod kehadiran...</td>
      </tr>
    `;

    try {
      const records = await (await import('../../services/backend/AttendanceService.js')).listAttendanceByProgram(programId, date || null);
      this.state.attendance = records || [];
      this.renderAttendanceTable();

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

  renderAttendanceTable() {
    const target = this.elements.attendanceTableBody;
    if (!target) return;

    const search = (this.state.filters.search || '').toLowerCase();
    const records = (this.state.attendance || []).filter(rec => {
      if (!search) return true;
      const name = (rec.participant_name || '').toLowerCase();
      const kp = (rec.no_kp_display || rec.participant_id || '').toLowerCase();
      return name.includes(search) || kp.includes(search);
    });

    if (!records || records.length === 0) {
      target.innerHTML = `
        <tr>
          <td colspan="6" class="empty-text">Tiada rekod kehadiran ditemui.</td>
        </tr>
      `;
      if (this.elements.attendanceFooter) {
        this.elements.attendanceFooter.textContent = '';
      }
      return;
    }

    const rows = records.map(record => this.buildAttendanceRow(record)).join('');
    target.innerHTML = rows;
    this.bindAttendanceRowEvents();

    if (this.elements.attendanceFooter) {
      const presentCount = records.filter(r => r.hadir).length;
      this.elements.attendanceFooter.innerHTML = `
        <div class="footer-meta">
          <span>Showing ${records.length} attendees</span>
          <span>Total Present: ${presentCount} &nbsp; Attendance Rate: ${records.length ? Math.round((presentCount / records.length) * 100) : 0}%</span>
        </div>
      `;
    }
  }

  buildAttendanceRow(record) {
    const checked = record.hadir ? 'checked' : '';
    const notes = record.catatan || '-';
    return `
      <tr data-attendance-id="${record.id}">
        <td>${record.participant_name || '-'}</td>
        <td>${record.no_kp_display || record.participant_id || '-'}</td>
        <td>${record.source || '-'}</td>
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
        const existingNotes = current?.catatan || '';
        const newNotes = prompt('Kemas kini catatan kehadiran:', existingNotes);
        if (newNotes !== null) {
          this.updateAttendanceNotes(attendanceId, newNotes);
        }
      });
    });
  }

  async updateAttendanceStatus(attendanceId, present) {
    try {
      const { updateAttendanceStatus } = await import('../../services/backend/AttendanceService.js');
      await updateAttendanceStatus(attendanceId, present);
      this.showToast('Status kehadiran dikemas kini.', 'success');
    } catch (error) {
      console.error('ProgramKehadiranNewest: gagal kemas kini kehadiran', error);
      this.showToast(error.message || 'Gagal mengemas kini status kehadiran.', 'error');
      await this.loadAttendanceData(Boolean(this.state.filters.programId || this.state.filters.date));
    }
  }

  async updateAttendanceNotes(attendanceId, notes) {
    try {
      const { updateAttendanceNotes } = await import('../../services/backend/AttendanceService.js');
      await updateAttendanceNotes(attendanceId, notes);
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
      const { listAttendanceByProgram } = await import('../../services/backend/AttendanceService.js');
      const programs = await ProgramService.listProgram();

      const programResults = await Promise.all(
        programs.map(async (program) => {
          const records = await listAttendanceByProgram(program.id, null);
          const participantCount = records.length;
          const presentCount = records.filter(r => r.hadir).length;
          return { program, records, participantCount, presentCount };
        })
      );

      const allRecords = programResults.flatMap(r => r.records);
      const totalPrograms = programs.length;
      const totalParticipantsSet = new Set();
      allRecords.forEach(r => totalParticipantsSet.add(r.participant_id || r.no_kp_display || r.id));
      const totalParticipants = totalParticipantsSet.size;
      const totalRecords = allRecords.length;
      const totalPresent = allRecords.filter(r => r.hadir).length;
      const averageAttendance = programResults.length
        ? Math.round(
          (programResults.reduce((sum, item) => {
            if (!item.participantCount) return sum;
            return sum + (item.presentCount / item.participantCount);
          }, 0) / programResults.length) * 100
        )
        : 0;

      const participantMap = new Map();
      allRecords.forEach(r => {
        const id = r.participant_id || r.no_kp_display || r.id;
        if (!participantMap.has(id)) {
          participantMap.set(id, {
            id,
            name: r.participant_name || 'Unknown',
            type: r.participant_type || '-',
            present: 0,
            total: 0
          });
        }
        const p = participantMap.get(id);
        p.total += 1;
        if (r.hadir) p.present += 1;
      });

      const topParticipants = Array.from(participantMap.values())
        .map(p => ({
          ...p,
          attendanceCount: p.present,
          attendancePercentage: p.total ? Math.round((p.present / p.total) * 100) : 0
        }))
        .sort((a, b) => b.attendanceCount - a.attendanceCount || b.attendancePercentage - a.attendancePercentage)
        .slice(0, 5);

      const participation = programResults.map(({ program, participantCount, presentCount }) => ({
        name: program.nama_program || program.nama || 'Unknown',
        startDate: program.tarikh_mula || program.startDate,
        endDate: program.tarikh_tamat || program.endDate,
        participantCount,
        attendancePercentage: participantCount ? Math.round((presentCount / participantCount) * 100) : 0
      }));

      this.renderAttendanceSummary({ totalPrograms, totalParticipants, averageAttendance, totalPresent });
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
        <div class="stat-card">
          <span class="stat-value">${summary.totalPresent ?? 0}</span>
          <span class="stat-label">Jumlah Hadir</span>
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

  escapeHtml(text = '') {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  exportAttendance() {
    if (!this.state.attendance || this.state.attendance.length === 0) {
      this.showToast('Tiada rekod kehadiran untuk dieksport.', 'info');
      return;
    }

    const program = this.state.programs.find(p => p.id === this.state.filters.programId);
    const programName = program?.nama_program || program?.nama || 'program';

    const header = ['Nama', 'No KP', 'Sumber', 'Status', 'Catatan'];
    const rows = this.state.attendance.map(rec => ([
      rec.participant_name || '',
      rec.no_kp_display || rec.participant_id || '',
      rec.source || '',
      rec.hadir ? 'Hadir' : 'Tidak',
      rec.catatan || ''
    ]));

    const toCsv = (value) => `"${(value ?? '').toString().replace(/"/g, '""')}"`;
    const csv = [header, ...rows].map(row => row.map(toCsv).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance-${programName.replace(/\s+/g, '-').toLowerCase()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    this.showToast('Fail CSV dimuat turun.', 'success');
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
        gap: 16px;
        width: 100%;
        max-width: none;
        margin: 0;
        padding: 0 20px 16px;
      }

      .section-header {
        margin: 4px 0 6px 0;
        padding: 6px 4px 2px;
      }

      .section-header p {
        margin: 4px 0 0 0;
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
        display: grid;
        grid-template-columns: repeat(4, minmax(88px, 1fr));
        gap: 8px;
        align-items: stretch;
      }

      .program-row-actions .btn {
        display: inline-flex;
        gap: 4px;
        align-items: center;
        justify-content: center;
        height: 36px;
        width: 100%;
        padding: 6px 12px;
        border-radius: 8px;
        font-weight: 700;
        border: 1px solid #e2e8f0;
        background: #fff;
        color: #0f172a;
        transition: all 0.15s ease;
      }

      .program-row-actions .btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 8px 14px rgba(15, 23, 42, 0.08);
      }

      .program-row-actions .btn.btn-primary {
        background: linear-gradient(135deg, #2563eb, #06b6d4);
        border: none;
        color: #fff;
        box-shadow: 0 10px 18px rgba(37, 99, 235, 0.22);
      }

      .program-row-actions .btn.btn-danger {
        border-color: #fecdd3;
        color: #b91c1c;
      }

      .program-row-actions .btn.btn-danger:hover {
        background: #fee2e2;
      }

      .program-row-actions .btn.btn-secondary {
        background: linear-gradient(135deg, #0f172a, #1e293b);
        color: #e2e8f0;
        border: none;
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

      .program-details-panel {
        width: min(640px, 92vw);
      }

      .program-details-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        gap: 12px 16px;
        margin-top: 8px;
      }

      .detail-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 10px 12px;
      }

      .detail-item.detail-span {
        grid-column: 1 / -1;
      }

      .detail-label {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #64748b;
        font-weight: 700;
      }

      .detail-value {
        color: #0f172a;
        font-weight: 600;
      }

      .detail-value.description {
        font-weight: 500;
        color: #334155;
        margin: 0;
        line-height: 1.5;
      }

      .qr-container {
        display: flex;
        justify-content: center;
        margin: 16px 0;
      }

      .qr-container img {
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 8px;
        background: #fff;
      }

      .qr-link {
        word-break: break-all;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        padding: 10px 12px;
        border-radius: 10px;
        font-size: 12px;
        color: #475569;
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
        position: relative;
        background: #ffffff;
        border-radius: 14px;
        padding: 22px;
        box-shadow: 0 18px 38px rgba(15, 23, 42, 0.06);
        border: 1px solid #e2e8f0;
        transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        overflow: hidden;
      }

      .program-newest-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 22px 42px rgba(15, 23, 42, 0.1);
        border-color: #d0d7e2;
      }

      .program-newest-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.08), transparent 35%),
                    radial-gradient(circle at 80% 0%, rgba(14, 165, 233, 0.06), transparent 30%);
        pointer-events: none;
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
      }

      .card-icon {
        height: 36px;
        width: 36px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: linear-gradient(135deg, #6366f1, #22d3ee);
        color: #fff;
        font-size: 18px;
        box-shadow: 0 10px 20px rgba(34, 211, 238, 0.25);
      }

      .program-newest-card h4 {
        margin: 0;
        font-size: 16px;
        color: #0f172a;
      }

      .card-description {
        color: #475569;
        margin: 0 0 12px 0;
        line-height: 1.5;
      }

      .program-newest-card .btn.btn-primary {
        background: linear-gradient(135deg, #6366f1, #22d3ee);
        border: none;
        color: #fff;
        font-weight: 700;
        border-radius: 10px;
        padding: 10px 14px;
        box-shadow: 0 10px 20px rgba(99, 102, 241, 0.22);
        transition: transform 0.12s ease, box-shadow 0.12s ease;
      }

      .program-newest-card .btn.btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 12px 24px rgba(99, 102, 241, 0.3);
      }

      .attendance-program-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 14px;
        margin: 14px 0 8px 0;
      }

      .attendance-program-card {
        width: 100%;
        text-align: left;
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 14px 16px;
        cursor: pointer;
        box-shadow: 0 10px 20px rgba(15, 23, 42, 0.05);
        transition: all 0.15s ease;
        position: relative;
        overflow: hidden;
      }

      .attendance-program-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 14px 26px rgba(15, 23, 42, 0.09);
      }

      .attendance-program-card.active {
        border-color: #6366f1;
        box-shadow: 0 16px 30px rgba(99, 102, 241, 0.18);
        background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(34,211,238,0.08));
      }

      .attendance-program-card .card-title {
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 6px;
        font-size: 15px;
      }

      .attendance-program-card .card-sub {
        font-size: 13px;
        color: #475569;
      }

      .attendance-program-card .card-meta {
        font-size: 12px;
        color: #64748b;
        margin-top: 4px;
      }

      .attendance-program-card .pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 999px;
        background: #eef2ff;
        color: #3730a3;
        font-size: 12px;
        font-weight: 700;
      }

      .filters-container {
        background: #fff;
        padding: 12px 14px;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        box-shadow: 0 12px 20px rgba(15, 23, 42, 0.06);
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .section-card {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        box-shadow: 0 16px 36px rgba(76, 29, 149, 0.08);
        padding: 14px;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .section-header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .header-icon {
        height: 38px;
        width: 38px;
        border-radius: 12px;
        background: linear-gradient(135deg, #9333ea, #22d3ee);
        color: #fff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 12px 24px rgba(147, 51, 234, 0.25);
      }

      .section-header-actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .btn.btn-ghost {
        background: #f8f5ff;
        color: #6b21a8;
        border: 1px solid #e9d5ff;
        font-weight: 700;
      }

      .search-bar {
        margin: 10px 0;
      }

      .search-bar input {
        width: 100%;
      }

      .table-footer {
        padding: 10px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #475569;
      }

      .program-action-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 6px;
        padding: 8px 10px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
      }

      .program-action-buttons {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .program-action-buttons .btn {
        height: 40px;
        border-radius: 8px;
        padding: 0 14px;
        font-weight: 700;
        letter-spacing: 0.01em;
        box-shadow: 0 8px 20px rgba(59, 130, 246, 0.12);
      }

      .program-action-buttons .btn.btn-secondary {
        background: #fff;
        color: #0f172a;
        border: 1px solid #e2e8f0;
        box-shadow: none;
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
        box-shadow: 0 6px 14px rgba(0,0,0,0.08);
      }

      .status-badge.upcoming { background: linear-gradient(135deg, #e0e7ff, #c7d2fe); color: #1d4ed8; }
      .status-badge.active { background: linear-gradient(135deg, #bbf7d0, #86efac); color: #166534; }
      .status-badge.completed { background: linear-gradient(135deg, #e5e7eb, #d1d5db); color: #374151; }
      .status-badge.cancelled { background: linear-gradient(135deg, #fecdd3, #fca5a5); color: #b91c1c; }

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

      /* Table polish */
      .program-newest-section .table-container {
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
        border: 1px solid #e2e8f0;
        overflow: hidden;
        margin-top: 8px;
      }

      .program-newest-section .data-table {
        width: 100%;
        border-collapse: collapse;
      }

      .program-newest-section .data-table thead {
        background: linear-gradient(135deg, #a855f7, #6366f1);
        color: #ffffff;
      }

      .program-newest-section .data-table th,
      .program-newest-section .data-table td {
        padding: 12px 14px;
        border-bottom: 1px solid #e2e8f0;
      }

      .program-newest-section .data-table tbody tr:nth-child(odd) {
        background: #f9fbff;
      }

      .program-newest-section .data-table tbody tr:last-child td {
        border-bottom: none;
      }

      .program-newest-section .data-table tbody tr:hover {
        background: #f4f7ff;
        box-shadow: inset 0 1px 0 rgba(99, 102, 241, 0.08);
      }

      .program-newest-section .data-table th {
        font-size: 13px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
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
