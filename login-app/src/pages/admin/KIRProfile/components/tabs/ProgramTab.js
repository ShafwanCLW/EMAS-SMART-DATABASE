import { BaseTab } from '../shared/BaseTab.js';

/**
 * ProgramTab - Manages Program & Kehadiran (Program & Attendance) functionality
 * Handles program attendance tracking, filtering, and notes management
 */
export class ProgramTab extends BaseTab {
  constructor(kirId) {
    super(kirId);
    this.programData = [];
    this.currentSection = 'ringkasan';
    this.currentFilter = 'semua';
    this.currentSort = 'tarikh_desc';
  }

  /**
   * Render the Program tab content
   */
  render() {
    return `
      <div class="program-tab-content">
        <div class="program-header">
          <h3>Program & Kehadiran</h3>
          <p class="tab-subtitle">Maklumat penyertaan dalam program komuniti dan kehadiran</p>
        </div>
        
        <div class="program-sections">
          ${this.createProgramSectionNavigation()}
          <div class="program-section-content">
            ${this.createProgramSectionContent()}
          </div>
        </div>
      </div>
    `;
  }

  createProgramSectionNavigation() {
    const sections = [
      { id: 'ringkasan', label: 'Ringkasan Program', icon: 'chart-bar' },
      { id: 'senarai', label: 'Senarai Program', icon: 'list' },
      { id: 'kehadiran', label: 'Rekod Kehadiran', icon: 'calendar-check' },
      { id: 'laporan', label: 'Laporan Penyertaan', icon: 'file-alt' }
    ];

    const sectionsHTML = sections.map(section => {
      const isActive = section.id === this.currentSection;
      
      return `
        <button class="program-section-btn ${isActive ? 'active' : ''}" 
                data-section="${section.id}" 
                onclick="programTab.switchProgramSection('${section.id}')">
          <i class="fas fa-${section.icon}"></i>
          ${section.label}
        </button>
      `;
    }).join('');

    return `
      <div class="program-section-navigation">
        ${sectionsHTML}
      </div>
    `;
  }

  createProgramSectionContent() {
    switch (this.currentSection) {
      case 'ringkasan':
        return this.createRingkasanProgramSection();
      case 'senarai':
        return this.createSenaraiProgramSection();
      case 'kehadiran':
        return this.createKehadiranSection();
      case 'laporan':
        return this.createLaporanSection();
      default:
        return this.createRingkasanProgramSection();
    }
  }

  createRingkasanProgramSection() {
    const totalProgram = this.programData.length;
    const hadirCount = this.programData.filter(p => p.hadir).length;
    const tidakHadirCount = totalProgram - hadirCount;
    const persentaseKehadiran = totalProgram > 0 ? ((hadirCount / totalProgram) * 100).toFixed(1) : 0;

    return `
      <div class="ringkasan-program-section">
        <div class="stats-grid">
          <div class="stat-card primary">
            <div class="stat-icon">
              <i class="fas fa-calendar-alt"></i>
            </div>
            <div class="stat-content">
              <h4>Jumlah Program</h4>
              <div class="stat-number">${totalProgram}</div>
              <p class="stat-description">Program yang didaftarkan</p>
            </div>
          </div>
          
          <div class="stat-card success">
            <div class="stat-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-content">
              <h4>Kehadiran</h4>
              <div class="stat-number">${hadirCount}</div>
              <p class="stat-description">Program yang dihadiri</p>
            </div>
          </div>
          
          <div class="stat-card warning">
            <div class="stat-icon">
              <i class="fas fa-times-circle"></i>
            </div>
            <div class="stat-content">
              <h4>Tidak Hadir</h4>
              <div class="stat-number">${tidakHadirCount}</div>
              <p class="stat-description">Program yang tidak dihadiri</p>
            </div>
          </div>
          
          <div class="stat-card info">
            <div class="stat-icon">
              <i class="fas fa-percentage"></i>
            </div>
            <div class="stat-content">
              <h4>Persentase Kehadiran</h4>
              <div class="stat-number">${persentaseKehadiran}%</div>
              <p class="stat-description">Kadar kehadiran keseluruhan</p>
            </div>
          </div>
        </div>
        
        <div class="program-summary-chart">
          <h4>Ringkasan Kehadiran Bulanan</h4>
          <div class="chart-placeholder">
            <p>Graf kehadiran akan dipaparkan di sini</p>
          </div>
        </div>
        
        <div class="recent-programs">
          <h4>Program Terkini</h4>
          <div class="recent-programs-list">
            ${this.createRecentProgramsList()}
          </div>
        </div>
      </div>
    `;
  }

  createSenaraiProgramSection() {
    return `
      <div class="senarai-program-section">
        <div class="program-controls">
          <div class="program-actions">
            <button class="btn btn-primary" onclick="programTab.addNewProgram()">
              <i class="fas fa-plus"></i> Tambah Program
            </button>
            <button class="btn btn-secondary" onclick="programTab.importPrograms()">
              <i class="fas fa-upload"></i> Import
            </button>
            <button class="btn btn-secondary" onclick="programTab.exportPrograms()">
              <i class="fas fa-download"></i> Export
            </button>
            <button class="btn btn-outline" onclick="programTab.refreshPrograms()">
              <i class="fas fa-sync"></i> Refresh
            </button>
          </div>
          
          <div class="program-filters">
            <div class="filter-group">
              <label for="program-filter">Tapis mengikut:</label>
              <select id="program-filter" onchange="programTab.filterPrograms(this.value)">
                <option value="semua" ${this.currentFilter === 'semua' ? 'selected' : ''}>Semua Program</option>
                <option value="hadir" ${this.currentFilter === 'hadir' ? 'selected' : ''}>Hadir</option>
                <option value="tidak_hadir" ${this.currentFilter === 'tidak_hadir' ? 'selected' : ''}>Tidak Hadir</option>
                <option value="bulan_ini" ${this.currentFilter === 'bulan_ini' ? 'selected' : ''}>Bulan Ini</option>
                <option value="tahun_ini" ${this.currentFilter === 'tahun_ini' ? 'selected' : ''}>Tahun Ini</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label for="date-range-start">Dari Tarikh:</label>
              <input type="date" id="date-range-start" onchange="programTab.filterByDateRange()">
            </div>
            
            <div class="filter-group">
              <label for="date-range-end">Hingga Tarikh:</label>
              <input type="date" id="date-range-end" onchange="programTab.filterByDateRange()">
            </div>
            
            <div class="filter-group">
              <label for="program-sort">Susun mengikut:</label>
              <select id="program-sort" onchange="programTab.sortPrograms(this.value)">
                <option value="tarikh_desc" ${this.currentSort === 'tarikh_desc' ? 'selected' : ''}>Tarikh (Terbaru)</option>
                <option value="tarikh_asc" ${this.currentSort === 'tarikh_asc' ? 'selected' : ''}>Tarikh (Terlama)</option>
                <option value="nama_asc" ${this.currentSort === 'nama_asc' ? 'selected' : ''}>Nama Program (A-Z)</option>
                <option value="nama_desc" ${this.currentSort === 'nama_desc' ? 'selected' : ''}>Nama Program (Z-A)</option>
              </select>
            </div>
            
            <div class="search-group">
              <label for="program-search">Cari Program:</label>
              <input type="text" id="program-search" placeholder="Cari nama program..." onkeyup="programTab.searchPrograms(this.value)">
            </div>
          </div>
        </div>
        
        <div class="program-content">
          <div class="loading-skeleton" id="program-loading">
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
          </div>
          <div id="program-table"></div>
        </div>
      </div>
    `;
  }

  createKehadiranSection() {
    return `
      <div class="kehadiran-section">
        <div class="kehadiran-header">
          <h4>Rekod Kehadiran Program</h4>
          <p>Kemaskini status kehadiran untuk setiap program</p>
          
          <div class="kehadiran-actions">
            <button class="btn btn-primary" onclick="programTab.exportAttendance()">
              <i class="fas fa-download"></i> Export Kehadiran
            </button>
            <button class="btn btn-secondary" onclick="programTab.bulkUpdateAttendance()">
              <i class="fas fa-edit"></i> Kemaskini Pukal
            </button>
            <button class="btn btn-outline" onclick="programTab.refreshAttendance()">
              <i class="fas fa-sync"></i> Refresh
            </button>
          </div>
        </div>
        
        <div class="kehadiran-content">
          ${this.createKehadiranTable()}
        </div>
      </div>
    `;
  }

  createLaporanSection() {
    const attendanceRate = this.calculateAttendanceRate();
    const monthlyStats = this.getMonthlyAttendanceStats();
    
    return `
      <div class="laporan-section">
        <div class="laporan-header">
          <h4>Laporan Penyertaan Program</h4>
          <p>Analisis dan laporan kehadiran program</p>
          
          <div class="laporan-actions">
            <button class="btn btn-primary" onclick="programTab.generateReport()">
              <i class="fas fa-chart-bar"></i> Jana Laporan
            </button>
            <button class="btn btn-secondary" onclick="programTab.exportReport()">
              <i class="fas fa-file-pdf"></i> Export PDF
            </button>
            <button class="btn btn-outline" onclick="programTab.scheduleReport()">
              <i class="fas fa-clock"></i> Jadual Laporan
            </button>
          </div>
        </div>
        
        <div class="laporan-content">
          <div class="analytics-grid">
            <div class="analytics-card">
              <h5>Kadar Kehadiran Keseluruhan</h5>
              <div class="attendance-rate">
                <div class="rate-circle">
                  <span class="rate-percentage">${attendanceRate}%</span>
                </div>
                <p>Daripada ${this.programData.length} program</p>
              </div>
            </div>
            
            <div class="analytics-card">
              <h5>Trend Kehadiran Bulanan</h5>
              <div class="monthly-chart">
                ${this.createMonthlyChart(monthlyStats)}
              </div>
            </div>
            
            <div class="analytics-card">
              <h5>Kategori Program Terpopular</h5>
              <div class="category-stats">
                ${this.createCategoryStats()}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Switch between program sections
   */
  switchProgramSection(sectionId) {
    this.currentSection = sectionId;
    
    // Update navigation buttons
    document.querySelectorAll('.program-section-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    
    // Update content
    const contentContainer = document.querySelector('.program-section-content');
    if (contentContainer) {
      contentContainer.innerHTML = this.createProgramSectionContent();
      this.setupEventListeners();
    }
  }

  /**
   * Load program data from API
   */
  async loadProgramData() {
    try {
      // Show loading state
      const loadingElement = document.getElementById('program-loading');
      if (loadingElement) {
        loadingElement.style.display = 'block';
      }

      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      this.programData = [
        {
          id: '1',
          nama_program: 'Program Kemahiran Menjahit',
          tarikh: '2024-01-15',
          kategori: 'Kemahiran',
          lokasi: 'Dewan Komuniti',
          kehadiran: true,
          catatan: 'Hadir penuh'
        },
        {
          id: '2',
          nama_program: 'Kelas Memasak Tradisional',
          tarikh: '2024-01-20',
          kategori: 'Kemahiran',
          lokasi: 'Pusat Komuniti',
          kehadiran: false,
          catatan: 'Tidak dapat hadir kerana sakit'
        }
      ];

      this.filteredData = [...this.programData];
      this.renderProgramTable();

    } catch (error) {
      console.error('Error loading program data:', error);
      this.showToast('Ralat memuatkan data program', 'error');
    } finally {
      // Hide loading state
      const loadingElement = document.getElementById('program-loading');
      if (loadingElement) {
        loadingElement.style.display = 'none';
      }
    }
  }

  /**
   * Create recent programs list for summary section
   */
  createRecentProgramsList() {
    const recentPrograms = this.programData
      .sort((a, b) => new Date(b.tarikh) - new Date(a.tarikh))
      .slice(0, 5);
    
    if (recentPrograms.length === 0) {
      return `
        <div class="empty-state">
          <i class="fas fa-calendar-alt"></i>
          <p>Tiada program terkini</p>
        </div>
      `;
    }
    
    return recentPrograms.map(program => `
      <div class="recent-program-item">
        <div class="program-info">
          <h5>${this.escapeHtml(program.nama_program || 'Tidak dinyatakan')}</h5>
          <p class="program-date">${this.formatDate(program.tarikh)}</p>
          <span class="kategori-badge kategori-${(program.kategori || '').toLowerCase()}">
            ${this.escapeHtml(program.kategori || 'Lain-lain')}
          </span>
        </div>
        <div class="program-status">
          <span class="kehadiran-status ${program.kehadiran ? 'hadir' : 'tidak-hadir'}">
            ${program.kehadiran ? 'Hadir' : 'Tidak Hadir'}
          </span>
        </div>
      </div>
    `).join('');
  }

  /**
   * Create attendance table for kehadiran section
   */
  createKehadiranTable() {
    if (!this.programData || this.programData.length === 0) {
      return `
        <div class="empty-state">
          <i class="fas fa-calendar-alt"></i>
          <h4>Tiada program berkaitan</h4>
          <p>Belum ada program yang didaftarkan atau tiada program yang berkaitan dengan KIR ini.</p>
        </div>
      `;
    }
    
    return `
      <table class="kehadiran-table">
        <thead>
          <tr>
            <th>Program</th>
            <th>Tarikh</th>
            <th>Kategori</th>
            <th>Status Kehadiran</th>
            <th>Catatan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${this.programData.map(program => `
            <tr data-program-id="${program.id}">
              <td>
                <div class="program-name">
                  <strong>${this.escapeHtml(program.nama_program || 'Tidak dinyatakan')}</strong>
                  <small>${this.escapeHtml(program.lokasi || 'Lokasi tidak dinyatakan')}</small>
                </div>
              </td>
              <td>${this.formatDate(program.tarikh)}</td>
              <td>
                <span class="kategori-badge kategori-${(program.kategori || '').toLowerCase()}">
                  ${this.escapeHtml(program.kategori || 'Lain-lain')}
                </span>
              </td>
              <td>
                <label class="toggle-switch">
                  <input type="checkbox" ${program.kehadiran ? 'checked' : ''} 
                         onchange="programTab.toggleKehadiran('${program.id}', this.checked)">
                  <span class="toggle-slider"></span>
                </label>
                <span class="kehadiran-status ${program.kehadiran ? 'hadir' : 'tidak-hadir'}">
                  ${program.kehadiran ? 'Hadir' : 'Tidak Hadir'}
                </span>
              </td>
              <td>
                <input type="text" class="catatan-input" 
                       value="${this.escapeHtml(program.catatan || '')}" 
                       placeholder="Catatan (pilihan)"
                       onblur="programTab.updateCatatan('${program.id}', this.value)">
              </td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="programTab.viewProgramDetails('${program.id}')">
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  /**
   * Render the program table
   */
  renderProgramTable() {
    const tableContainer = document.getElementById('program-table');
    if (!tableContainer) return;
    
    if (!this.programData || this.programData.length === 0) {
      tableContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-calendar-alt"></i>
          <h4>Tiada program berkaitan</h4>
          <p>Belum ada program yang didaftarkan atau tiada program yang berkaitan dengan KIR ini.</p>
        </div>
      `;
      return;
    }
    
    const tableHTML = `
      <table class="program-table">
        <thead>
          <tr>
            <th>Tarikh Program</th>
            <th>Nama Program</th>
            <th>Kategori</th>
            <th>Kehadiran</th>
            <th>Catatan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${this.programData.map(program => `
            <tr data-program-id="${program.id}">
              <td>${this.formatDate(program.tarikh)}</td>
              <td>
                <div class="program-details">
                  <strong>${this.escapeHtml(program.nama_program || 'Tidak dinyatakan')}</strong>
                  <small>Peserta: ${program.jumlah_peserta || 0} orang</small>
                </div>
              </td>
              <td><span class="kategori-badge kategori-${(program.kategori || '').toLowerCase()}">${this.escapeHtml(program.kategori || 'Lain-lain')}</span></td>
              <td>
                <label class="toggle-switch">
                  <input type="checkbox" ${program.kehadiran ? 'checked' : ''} 
                         onchange="programTab.toggleKehadiran('${program.id}', this.checked)">
                  <span class="toggle-slider"></span>
                </label>
                <span class="kehadiran-status ${program.kehadiran ? 'hadir' : 'tidak-hadir'}">
                  ${program.kehadiran ? 'Hadir' : 'Tidak Hadir'}
                </span>
              </td>
              <td>
                <input type="text" class="catatan-input" 
                       value="${this.escapeHtml(program.catatan || '')}" 
                       placeholder="Catatan (pilihan)"
                       onblur="programTab.updateCatatan('${program.id}', this.value)">
              </td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="programTab.viewProgramDetails('${program.id}')">
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    tableContainer.innerHTML = tableHTML;
  }

  /**
   * Toggle attendance for a program
   */
  async toggleKehadiran(programId, hadir) {
    try {
      const program = this.programData.find(p => p.id === programId);
      if (!program) return;
      
      // Optimistic update
      program.hadir = hadir;
      this.renderProgramTable();
      
      // Get catatan from input
      const catatanInput = document.querySelector(`tr[data-program-id="${programId}"] .catatan-input`);
      const catatan = catatanInput ? catatanInput.value : '';
      
      await this.setKehadiranAPI(this.kirId, programId, hadir, catatan);
      
      // Log audit trail
      await this.logProgramChangeAPI(
        this.kirId, 
        'kehadiran', 
        !hadir, 
        hadir, 
        'user'
      );
      
      this.showToast(`Kehadiran ${hadir ? 'direkod' : 'dibatalkan'} berjaya`, 'success');
    } catch (error) {
      console.error('Error toggling kehadiran:', error);
      // Rollback optimistic update
      const program = this.programData.find(p => p.id === programId);
      if (program) {
        program.hadir = !hadir;
        this.renderProgramTable();
      }
      this.showToast('Gagal mengemas kini kehadiran: ' + error.message, 'error');
    }
  }

  /**
   * Update notes for a program
   */
  async updateCatatan(programId, catatan) {
    try {
      const program = this.programData.find(p => p.id === programId);
      if (!program) return;
      
      const oldCatatan = program.catatan;
      program.catatan = catatan;
      
      await this.setKehadiranAPI(this.kirId, programId, program.hadir, catatan);
      
      // Log audit trail if catatan changed
      if (oldCatatan !== catatan) {
        await this.logProgramChangeAPI(
          this.kirId, 
          'catatan', 
          oldCatatan, 
          catatan, 
          'user'
        );
      }
    } catch (error) {
      console.error('Error updating catatan:', error);
      this.showToast('Gagal mengemas kini catatan: ' + error.message, 'error');
    }
  }

  /**
   * View program details
   */
  viewProgramDetails(programId) {
    const program = this.programData.find(p => p.id === programId);
    if (!program) return;
    
    // Simple alert for now - can be enhanced with modal
    const details = [
      `Program: ${program.nama_program}`,
      `Kategori: ${program.kategori}`,
      `Tarikh: ${this.formatDate(program.tarikh)}`,
      `Lokasi: ${program.lokasi || 'Tidak dinyatakan'}`,
      `Penerangan: ${program.penerangan || 'Tiada penerangan'}`
    ].join('\n');
    
    alert(details);
  }

  /**
   * Filter programs based on criteria
   */
  filterPrograms(filterValue) {
    this.currentFilter = filterValue;
    
    if (!this.programData) return;
    
    let filteredData = [...this.programData];
    const now = new Date();
    
    switch (filterValue) {
      case 'hadir':
        filteredData = filteredData.filter(p => p.hadir);
        break;
      case 'tidak_hadir':
        filteredData = filteredData.filter(p => !p.hadir);
        break;
      case 'bulan_ini':
        filteredData = filteredData.filter(p => {
          const programDate = new Date(p.tarikh);
          return programDate.getMonth() === now.getMonth() && 
                 programDate.getFullYear() === now.getFullYear();
        });
        break;
      case 'tahun_ini':
        filteredData = filteredData.filter(p => {
          const programDate = new Date(p.tarikh);
          return programDate.getFullYear() === now.getFullYear();
        });
        break;
      default:
        // 'semua' - no filtering
        break;
    }
    
    // Apply sorting
    this.applySorting(filteredData);
    
    // Temporarily replace data for rendering
    const originalData = this.programData;
    this.programData = filteredData;
    this.renderProgramTable();
    this.programData = originalData;
  }

  /**
   * Sort programs based on criteria
   */
  sortPrograms(sortValue) {
    this.currentSort = sortValue;
    
    if (!this.programData) return;
    
    let sortedData = [...this.programData];
    this.applySorting(sortedData);
    
    // Temporarily replace data for rendering
    const originalData = this.programData;
    this.programData = sortedData;
    this.renderProgramTable();
    this.programData = originalData;
  }

  /**
   * Apply sorting to data array
   */
  applySorting(data) {
    switch (this.currentSort) {
      case 'tarikh_asc':
        data.sort((a, b) => new Date(a.tarikh) - new Date(b.tarikh));
        break;
      case 'tarikh_desc':
        data.sort((a, b) => new Date(b.tarikh) - new Date(a.tarikh));
        break;
      case 'nama_asc':
        data.sort((a, b) => (a.nama_program || '').localeCompare(b.nama_program || ''));
        break;
      case 'nama_desc':
        data.sort((a, b) => (b.nama_program || '').localeCompare(a.nama_program || ''));
        break;
    }
  }

  /**
   * Search programs by name
   */
  searchPrograms(searchTerm) {
    if (!this.programData) return;
    
    const search = searchTerm.toLowerCase();
    let filteredData = [...this.programData];
    
    if (search) {
      filteredData = filteredData.filter(p => 
        p.nama_program?.toLowerCase().includes(search) ||
        p.penerangan?.toLowerCase().includes(search) ||
        p.kategori?.toLowerCase().includes(search)
      );
    }
    
    // Apply current filter and sorting
    this.applySorting(filteredData);
    
    // Temporarily replace data for rendering
    const originalData = this.programData;
    this.programData = filteredData;
    this.renderProgramTable();
    this.programData = originalData;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Filter event listeners
    const filterSelect = document.getElementById('program-filter');
    const sortSelect = document.getElementById('program-sort');
    const searchInput = document.getElementById('program-search');
    
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => this.filterPrograms(e.target.value));
    }
    
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => this.sortPrograms(e.target.value));
    }
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.searchPrograms(e.target.value));
    }
  }

  /**
   * Save method for tab integration
   */
  async save() {
    // Program tab doesn't have a traditional save - changes are saved immediately
    return true;
  }

  /**
   * Load method for tab integration
   */
  async load() {
    await this.loadProgramData();
    this.setupEventListeners();
  }

  /**
   * Validate method for tab integration
   */
  validate() {
    // Program tab doesn't require validation
    return true;
  }

  /**
   * Filter programs by date range
   */
  filterByDateRange() {
    const startDate = document.getElementById('date-range-start')?.value;
    const endDate = document.getElementById('date-range-end')?.value;
    
    if (!startDate && !endDate) {
      this.renderProgramTable();
      return;
    }
    
    let filteredData = [...this.programData];
    
    if (startDate) {
      filteredData = filteredData.filter(p => new Date(p.tarikh) >= new Date(startDate));
    }
    
    if (endDate) {
      filteredData = filteredData.filter(p => new Date(p.tarikh) <= new Date(endDate));
    }
    
    this.applySorting(filteredData);
    
    const originalData = this.programData;
    this.programData = filteredData;
    this.renderProgramTable();
    this.programData = originalData;
  }

  /**
   * Calculate overall attendance rate
   */
  calculateAttendanceRate() {
    if (!this.programData || this.programData.length === 0) return 0;
    const attendedCount = this.programData.filter(p => p.kehadiran).length;
    return Math.round((attendedCount / this.programData.length) * 100);
  }

  /**
   * Get monthly attendance statistics
   */
  getMonthlyAttendanceStats() {
    const stats = {};
    this.programData.forEach(program => {
      const date = new Date(program.tarikh);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!stats[monthKey]) {
        stats[monthKey] = { total: 0, attended: 0 };
      }
      
      stats[monthKey].total++;
      if (program.kehadiran) {
        stats[monthKey].attended++;
      }
    });
    
    return stats;
  }

  /**
   * Create monthly attendance chart
   */
  createMonthlyChart(monthlyStats) {
    const months = Object.keys(monthlyStats).sort().slice(-6); // Last 6 months
    
    if (months.length === 0) {
      return '<p class="no-data">Tiada data untuk dipaparkan</p>';
    }
    
    return months.map(month => {
      const stats = monthlyStats[month];
      const rate = Math.round((stats.attended / stats.total) * 100);
      const monthName = new Date(month + '-01').toLocaleDateString('ms-MY', { month: 'short', year: 'numeric' });
      
      return `
        <div class="chart-bar">
          <div class="bar-label">${monthName}</div>
          <div class="bar-container">
            <div class="bar-fill" style="height: ${rate}%"></div>
          </div>
          <div class="bar-value">${rate}%</div>
        </div>
      `;
    }).join('');
  }

  /**
   * Create category statistics
   */
  createCategoryStats() {
    const categoryStats = {};
    
    this.programData.forEach(program => {
      const category = program.kategori || 'Lain-lain';
      if (!categoryStats[category]) {
        categoryStats[category] = { total: 0, attended: 0 };
      }
      categoryStats[category].total++;
      if (program.kehadiran) {
        categoryStats[category].attended++;
      }
    });
    
    return Object.entries(categoryStats)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 5)
      .map(([category, stats]) => {
        const rate = Math.round((stats.attended / stats.total) * 100);
        return `
          <div class="category-item">
            <span class="category-name">${category}</span>
            <div class="category-progress">
              <div class="progress-bar" style="width: ${rate}%"></div>
            </div>
            <span class="category-rate">${rate}%</span>
          </div>
        `;
      }).join('');
  }

  /**
   * Add new program
   */
  addNewProgram() {
    // Implementation for adding new program
    this.showToast('Fungsi tambah program akan dilaksanakan', 'info');
  }

  /**
   * Import programs from file
   */
  importPrograms() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        this.showToast('Import program sedang diproses...', 'info');
        // Implementation for file import
      }
    };
    input.click();
  }

  /**
   * Export programs to file
   */
  exportPrograms() {
    this.showToast('Export program sedang diproses...', 'info');
    // Implementation for export
  }

  /**
   * Refresh programs data
   */
  refreshPrograms() {
    this.loadProgramData();
  }

  /**
   * Export attendance data
   */
  exportAttendance() {
    this.showToast('Export kehadiran sedang diproses...', 'info');
    // Implementation for attendance export
  }

  /**
   * Bulk update attendance
   */
  bulkUpdateAttendance() {
    this.showToast('Fungsi kemaskini pukal akan dilaksanakan', 'info');
  }

  /**
   * Refresh attendance data
   */
  refreshAttendance() {
    this.loadProgramData();
  }

  /**
   * Generate detailed report
   */
  generateReport() {
    this.showToast('Laporan sedang dijana...', 'info');
  }

  /**
   * Export report as PDF
   */
  exportReport() {
    this.showToast('Export laporan sedang diproses...', 'info');
  }

  /**
   * Schedule automatic reports
   */
  scheduleReport() {
    this.showToast('Fungsi jadual laporan akan dilaksanakan', 'info');
  }

  /**
   * Cleanup method for tab integration
   */
  cleanup() {
    // Clear any temporary data or states
    this.programData = [];
  }

  // API Methods (to be replaced with actual service calls)
  async getProgramsByKIRIdAPI(kirId) {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            nama_program: 'Program Kemahiran Menjahit',
            kategori: 'Kemahiran',
            tarikh: '2024-01-15',
            lokasi: 'Dewan Komuniti',
            penerangan: 'Program kemahiran menjahit untuk ibu tunggal',
            hadir: true,
            catatan: 'Sangat aktif'
          },
          {
            id: '2',
            nama_program: 'Kelas Kesihatan Mental',
            kategori: 'Kesihatan',
            tarikh: '2024-01-20',
            lokasi: 'Klinik Kesihatan',
            penerangan: 'Sesi kaunseling dan sokongan kesihatan mental',
            hadir: false,
            catatan: 'Tidak dapat hadir kerana sakit'
          }
        ]);
      }, 500);
    });
  }

  async setKehadiranAPI(kirId, programId, hadir, catatan) {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true });
      }, 300);
    });
  }

  async logProgramChangeAPI(kirId, changeType, oldValue, newValue, userId) {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true });
      }, 200);
    });
  }

  /**
   * Format date for display
   */
  formatDate(dateString) {
    if (!dateString) return 'Tidak dinyatakan';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ms-MY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    if (typeof text !== 'string') return text;
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  /**
   * Add CSS styles for the program tab
   */
  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .program-tab-container {
        padding: 20px;
        background: #f8f9fa;
        min-height: 100vh;
      }
      
      .program-header {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin-bottom: 20px;
      }
      
      .program-header h3 {
        margin: 0 0 10px 0;
        color: #2c3e50;
        font-size: 24px;
        font-weight: 600;
      }
      
      .program-header p {
        margin: 0;
        color: #6c757d;
        font-size: 14px;
      }
      
      /* Section Navigation */
      .program-section-nav {
        background: white;
        padding: 0;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin-bottom: 20px;
        overflow: hidden;
      }
      
      .program-section-buttons {
        display: flex;
        border-bottom: 1px solid #dee2e6;
      }
      
      .program-section-btn {
        flex: 1;
        padding: 15px 20px;
        background: white;
        border: none;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        color: #6c757d;
        transition: all 0.3s ease;
        border-bottom: 3px solid transparent;
      }
      
      .program-section-btn:hover {
        background: #f8f9fa;
        color: #495057;
      }
      
      .program-section-btn.active {
        color: #007bff;
        border-bottom-color: #007bff;
        background: #f8f9fa;
      }
      
      .program-section-content {
        padding: 20px;
      }
      
      /* Summary Section */
      .summary-section {
        display: grid;
        gap: 20px;
      }
      
      .summary-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
      }
      
      .stat-card {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        text-align: center;
      }
      
      .stat-card .stat-number {
        font-size: 32px;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 5px;
      }
      
      .stat-card .stat-label {
        font-size: 14px;
        color: #6c757d;
        font-weight: 500;
      }
      
      .stat-card.primary .stat-number {
        color: #007bff;
      }
      
      .stat-card.success .stat-number {
        color: #28a745;
      }
      
      .stat-card.warning .stat-number {
        color: #ffc107;
      }
      
      .recent-programs {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .recent-programs h4 {
        margin: 0 0 15px 0;
        color: #2c3e50;
        font-size: 18px;
        font-weight: 600;
      }
      
      .recent-program-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
        border-bottom: 1px solid #f1f3f4;
      }
      
      .recent-program-item:last-child {
        border-bottom: none;
      }
      
      .program-info h5 {
        margin: 0 0 5px 0;
        color: #2c3e50;
        font-size: 16px;
        font-weight: 600;
      }
      
      .program-date {
        margin: 0 0 8px 0;
        color: #6c757d;
        font-size: 13px;
      }
      
      .kategori-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
        text-transform: uppercase;
      }
      
      .kategori-kemahiran {
        background: #e3f2fd;
        color: #1976d2;
      }
      
      .kategori-kesihatan {
        background: #e8f5e8;
        color: #2e7d32;
      }
      
      .kategori-pendidikan {
        background: #fff3e0;
        color: #f57c00;
      }
      
      .kategori-lain-lain {
        background: #f3e5f5;
        color: #7b1fa2;
      }
      
      /* Program List Section */
      .program-list-section {
        display: grid;
        gap: 20px;
      }
      
      .program-filters {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .filter-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        align-items: end;
      }
      
      .filter-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      
      .filter-group label {
        font-weight: 500;
        color: #495057;
        font-size: 14px;
      }
      
      .filter-group input,
      .filter-group select {
        padding: 10px 12px;
        border: 1px solid #ced4da;
        border-radius: 6px;
        font-size: 14px;
        transition: border-color 0.3s ease;
      }
      
      .filter-group input:focus,
      .filter-group select:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
      }
      
      .program-table-container {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      
      .program-table {
        width: 100%;
        border-collapse: collapse;
      }
      
      .program-table th {
        background: #f8f9fa;
        padding: 15px;
        text-align: left;
        font-weight: 600;
        color: #495057;
        border-bottom: 2px solid #dee2e6;
        font-size: 14px;
      }
      
      .program-table td {
        padding: 15px;
        border-bottom: 1px solid #dee2e6;
        vertical-align: middle;
        font-size: 14px;
      }
      
      .program-table tr:hover {
        background: #f8f9fa;
      }
      
      .program-name strong {
        color: #2c3e50;
        font-weight: 600;
      }
      
      .program-name small {
        display: block;
        color: #6c757d;
        font-size: 12px;
        margin-top: 2px;
      }
      
      /* Kehadiran Section */
      .kehadiran-section {
        display: grid;
        gap: 20px;
      }
      
      .kehadiran-header {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .kehadiran-header h4 {
        margin: 0 0 8px 0;
        color: #2c3e50;
        font-size: 20px;
        font-weight: 600;
      }
      
      .kehadiran-header p {
        margin: 0;
        color: #6c757d;
        font-size: 14px;
      }
      
      .kehadiran-content {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      
      .kehadiran-table {
        width: 100%;
        border-collapse: collapse;
      }
      
      .kehadiran-table th {
        background: #f8f9fa;
        padding: 15px;
        text-align: left;
        font-weight: 600;
        color: #495057;
        border-bottom: 2px solid #dee2e6;
        font-size: 14px;
      }
      
      .kehadiran-table td {
        padding: 15px;
        border-bottom: 1px solid #dee2e6;
        vertical-align: middle;
        font-size: 14px;
      }
      
      .kehadiran-table tr:hover {
        background: #f8f9fa;
      }
      
      /* Laporan Section */
      .laporan-section {
        display: grid;
        gap: 20px;
      }
      
      .laporan-header {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .laporan-header h4 {
        margin: 0 0 8px 0;
        color: #2c3e50;
        font-size: 20px;
        font-weight: 600;
      }
      
      .laporan-header p {
        margin: 0;
        color: #6c757d;
        font-size: 14px;
      }
      
      .laporan-content {
        background: white;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .laporan-placeholder {
        text-align: center;
        color: #6c757d;
      }
      
      .laporan-placeholder i {
        font-size: 48px;
        margin-bottom: 15px;
        opacity: 0.5;
      }
      
      /* Toggle Switch */
      .toggle-switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
        margin-right: 10px;
      }
      
      .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 24px;
      }
      
      .toggle-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }
      
      input:checked + .toggle-slider {
        background-color: #28a745;
      }
      
      input:checked + .toggle-slider:before {
        transform: translateX(26px);
      }
      
      .kehadiran-status {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
      }
      
      .kehadiran-status.hadir {
        background: #d4edda;
        color: #155724;
      }
      
      .kehadiran-status.tidak-hadir {
        background: #f8d7da;
        color: #721c24;
      }
      
      .catatan-input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 14px;
        transition: border-color 0.3s ease;
      }
      
      .catatan-input:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
      }
      
      /* Buttons */
      .btn {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: all 0.3s ease;
      }
      
      .btn-primary {
        background: #007bff;
        color: white;
      }
      
      .btn-primary:hover {
        background: #0056b3;
      }
      
      .btn-secondary {
        background: #6c757d;
        color: white;
      }
      
      .btn-secondary:hover {
        background: #545b62;
      }
      
      .btn-sm {
        padding: 6px 12px;
        font-size: 12px;
      }
      
      /* Empty State */
      .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #6c757d;
      }
      
      .empty-state i {
        font-size: 64px;
        margin-bottom: 20px;
        opacity: 0.3;
      }
      
      .empty-state h4 {
        margin: 0 0 10px 0;
        color: #495057;
        font-size: 18px;
        font-weight: 600;
      }
      
      .empty-state p {
        margin: 0;
        font-size: 14px;
        line-height: 1.5;
      }
      
      /* Loading */
      .loading-spinner {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 60px;
      }
      
      .spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #007bff;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      /* Toast */
      .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      
      .toast.success {
        background: #28a745;
      }
      
      .toast.error {
        background: #dc3545;
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      /* Enhanced Analytics Styles */
      .analytics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
      
      .analytics-card {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        border: 1px solid #e0e0e0;
      }
      
      .analytics-card h5 {
        margin: 0 0 15px 0;
        color: #333;
        font-size: 16px;
        font-weight: 600;
      }
      
      .attendance-rate {
        text-align: center;
      }
      
      .rate-circle {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: conic-gradient(#4CAF50 0deg, #4CAF50 calc(var(--rate, 0) * 3.6deg), #e0e0e0 calc(var(--rate, 0) * 3.6deg));
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 10px;
        position: relative;
      }
      
      .rate-circle::before {
        content: '';
        width: 80px;
        height: 80px;
        background: white;
        border-radius: 50%;
        position: absolute;
      }
      
      .rate-percentage {
        font-size: 24px;
        font-weight: bold;
        color: #4CAF50;
        z-index: 1;
      }
      
      .monthly-chart {
        display: flex;
        gap: 10px;
        align-items: end;
        height: 120px;
        padding: 10px 0;
      }
      
      .chart-bar {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
      }
      
      .bar-container {
        width: 30px;
        height: 80px;
        background: #f0f0f0;
        border-radius: 4px;
        position: relative;
        overflow: hidden;
      }
      
      .bar-fill {
        position: absolute;
        bottom: 0;
        width: 100%;
        background: linear-gradient(to top, #4CAF50, #81C784);
        border-radius: 4px;
        transition: height 0.3s ease;
      }
      
      .bar-label, .bar-value {
        font-size: 12px;
        color: #666;
      }
      
      .bar-value {
        font-weight: bold;
        color: #4CAF50;
      }
      
      .category-stats {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .category-item {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .category-name {
        min-width: 80px;
        font-size: 14px;
        color: #333;
      }
      
      .category-progress {
        flex: 1;
        height: 8px;
        background: #f0f0f0;
        border-radius: 4px;
        overflow: hidden;
      }
      
      .progress-bar {
        height: 100%;
        background: linear-gradient(to right, #4CAF50, #81C784);
        border-radius: 4px;
        transition: width 0.3s ease;
      }
      
      .category-rate {
        min-width: 40px;
        text-align: right;
        font-weight: bold;
        color: #4CAF50;
        font-size: 14px;
      }
      
      /* Enhanced Program Details */
      .program-details {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      
      .program-details strong {
        color: #333;
        font-weight: 600;
      }
      
      .program-details small {
        color: #666;
        font-size: 12px;
      }
      
      /* Enhanced Action Buttons */
      .program-actions, .kehadiran-actions, .laporan-actions {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }
      
      .program-actions .btn, .kehadiran-actions .btn, .laporan-actions .btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
      }
      
      .program-actions .btn:hover, .kehadiran-actions .btn:hover, .laporan-actions .btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      
      /* Date Range Filters */
      .filter-group input[type="date"] {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        transition: border-color 0.2s ease;
      }
      
      .filter-group input[type="date"]:focus {
        outline: none;
        border-color: #4CAF50;
        box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
      }
      
      /* No Data State */
      .no-data {
        text-align: center;
        color: #666;
        font-style: italic;
        padding: 20px;
      }
      
      /* Responsive Design for Analytics */
      @media (max-width: 768px) {
        .analytics-grid {
          grid-template-columns: 1fr;
        }
        
        .program-actions, .kehadiran-actions, .laporan-actions {
          flex-direction: column;
        }
        
        .program-actions .btn, .kehadiran-actions .btn, .laporan-actions .btn {
          width: 100%;
          justify-content: center;
        }
        
        .monthly-chart {
          height: 100px;
        }
        
        .rate-circle {
          width: 100px;
          height: 100px;
        }
        
        .rate-circle::before {
          width: 70px;
          height: 70px;
        }
        
        .rate-percentage {
          font-size: 20px;
        }
        
        .program-tab-container {
          padding: 15px;
        }
        
        .program-section-buttons {
          flex-direction: column;
        }
        
        .program-section-btn {
          border-bottom: 1px solid #dee2e6;
          border-right: none;
        }
        
        .program-section-btn.active {
          border-bottom-color: #dee2e6;
          border-left: 3px solid #007bff;
        }
        
        .summary-stats {
          grid-template-columns: 1fr;
        }
        
        .filter-row {
          grid-template-columns: 1fr;
        }
        
        .program-table-container {
          overflow-x: auto;
        }
        
        .program-table {
          min-width: 600px;
        }
      }
    `;
    
    if (!document.querySelector('#program-tab-styles')) {
      style.id = 'program-tab-styles';
      document.head.appendChild(style);
    }
  }
}