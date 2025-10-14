// Import KIR Service
import { KIRService } from '../../services/backend/KIRService.js';

export class SenaraiKIR {
    constructor() {
        this.currentKIRData = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalRecords = 0;
        this.currentFilters = {
            search: '',
            status: 'all',
            negeri: 'all'
        };
    }

    createContent() {
        return `
            <div class="content-header">
                <h2>Senarai KIR (New)</h2>
                <p class="content-description">View and manage all KIR records</p>
            </div>

            <div class="filters-section">
                <div class="filters-row">
                    <div class="search-group">
                        <input type="text" id="kir-search-new" placeholder="Cari nama atau No. KP..." class="search-input">
                        <button id="search-btn-new" class="btn btn-primary">🔍 Cari</button>
                    </div>
                    <div class="filter-group">
                        <select id="status-filter-new" class="filter-select">
                            <option value="all">Semua Status</option>
                            <option value="Draf">Draf</option>
                            <option value="Dihantar">Dihantar</option>
                            <option value="Disahkan">Disahkan</option>
                        </select>
                        <select id="negeri-filter-new" class="filter-select">
                            <option value="all">Semua Negeri</option>
                            <option value="Johor">Johor</option>
                            <option value="Kedah">Kedah</option>
                            <option value="Kelantan">Kelantan</option>
                            <option value="Melaka">Melaka</option>
                            <option value="Negeri Sembilan">Negeri Sembilan</option>
                            <option value="Pahang">Pahang</option>
                            <option value="Perak">Perak</option>
                            <option value="Perlis">Perlis</option>
                            <option value="Pulau Pinang">Pulau Pinang</option>
                            <option value="Sabah">Sabah</option>
                            <option value="Sarawak">Sarawak</option>
                            <option value="Selangor">Selangor</option>
                            <option value="Terengganu">Terengganu</option>
                            <option value="Wilayah Persekutuan Kuala Lumpur">WP Kuala Lumpur</option>
                            <option value="Wilayah Persekutuan Labuan">WP Labuan</option>
                            <option value="Wilayah Persekutuan Putrajaya">WP Putrajaya</option>
                        </select>
                        <button id="reset-filters-new" class="btn btn-secondary">Reset</button>
                    </div>
                </div>
            </div>

            <div class="table-container">
                <div class="table-header">
                    <div class="table-info">
                        <span id="table-info-new">Menunjukkan 0 daripada 0 rekod</span>
                    </div>
                    <div class="table-actions">
                        <button class="btn btn-success" onclick="window.showCreateKIRModal()">+ Tambah KIR Baru</button>
                    </div>
                </div>

                <div class="table-wrapper">
                    <table class="kir-table">
                        <thead>
                            <tr>
                                <th>KIR ID</th>
                                <th>NAMA</th>
                                <th>IC NUMBER</th>
                                <th>STATUS</th>
                                <th>CREATED DATE</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody id="senariKirNewTableBody">
                            <tr>
                                <td colspan="6" style="text-align: center; padding: 2rem;">
                                    <div class="loading-spinner">Memuatkan data...</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="pagination-container">
                    <div class="pagination-info">
                        <span id="pagination-info-new">Halaman 1 daripada 1</span>
                    </div>
                    <div class="pagination-controls">
                        <button id="prev-page-new" class="btn btn-outline" disabled>← Sebelum</button>
                        <button id="next-page-new" class="btn btn-outline" disabled>Seterusnya →</button>
                    </div>
                </div>
            </div>

            <div id="error-message-new" class="error-message" style="display: none;"></div>
        `;
    }

    async initialize() {
        console.log('Initializing SenaraiKIR (New)...');
        
        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
            this.setupEventListeners();
        }, 100);
        
        // Load initial data
        await this.loadKIRData();
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Search functionality
        const searchInput = document.getElementById('kir-search-new');
        const searchBtn = document.getElementById('search-btn-new');
        
        if (searchInput && searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSearch();
            });
        }

        // Filter functionality
        const statusFilter = document.getElementById('status-filter-new');
        const negeriFilter = document.getElementById('negeri-filter-new');
        const resetBtn = document.getElementById('reset-filters-new');

        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.handleFilterChange());
        }
        if (negeriFilter) {
            negeriFilter.addEventListener('change', () => this.handleFilterChange());
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFilters());
        }

        // Pagination
        const prevBtn = document.getElementById('prev-page-new');
        const nextBtn = document.getElementById('next-page-new');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousPage());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextPage());
        }
    }

    async loadKIRData() {
        try {
            this.showLoadingState();
            
            const params = {
                search: this.currentFilters.search,
                status: this.currentFilters.status === 'all' ? '' : this.mapStatusToDatabase(this.currentFilters.status),
                daerah: this.currentFilters.negeri === 'all' ? '' : this.currentFilters.negeri,
                pageSize: this.pageSize
            };

            console.log('Loading KIR data with params:', params);
            const result = await KIRService.getKIRList(params);
            
            this.currentKIRData = result.items || [];
            this.totalRecords = result.items ? result.items.length : 0;
            
            this.renderKIRTable();
            this.updateTableInfo();
            this.updatePagination();
            
        } catch (error) {
            console.error('Error loading KIR data:', error);
            this.showErrorMessage('Ralat memuatkan data KIR. Sila cuba lagi.');
        } finally {
            this.hideLoadingState();
        }
    }

    renderKIRTable() {
        const tableBody = document.getElementById('senariKirNewTableBody');
        if (!tableBody) return;

        if (this.currentKIRData.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: #64748b;">
                        Tiada data KIR dijumpai.
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = this.currentKIRData.map(kir => `
            <tr class="kir-row">
                <td>
                    <div class="user-info">
                        <div class="user-avatar">${(kir.nama_penuh || 'N').charAt(0).toUpperCase()}</div>
                        <div class="user-details">
                            <span class="kir-id">${kir.id || 'N/A'}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="user-details">
                        <span class="user-name">${kir.nama_penuh || 'Tiada Nama'}</span>
                        <span class="user-email">${kir.email || 'Tiada Email'}</span>
                    </div>
                </td>
                <td class="nokp">${kir.no_kp || 'Tiada No. KP'}</td>
                <td><span class="status-badge ${this.mapDatabaseStatusToUI(kir.status_rekod)}">${this.getStatusText(kir.status_rekod)}</span></td>
                <td class="date">${this.formatDate(kir.tarikh_cipta)}</td>
                <td>
                    <div class="action-menu">
                        <button class="action-menu-btn" title="Lihat Maklumat" onclick="senaraiKIRNew.viewKIR('${kir.id}')">👁️</button>
                        <button class="action-menu-btn" title="Edit KIR" onclick="senaraiKIRNew.editKIR('${kir.id}')">✏️</button>
                        <button class="action-menu-btn" title="Padam KIR" onclick="senaraiKIRNew.deleteKIR('${kir.id}')">🗑️</button>
                        <button class="action-menu-btn" title="Tambah AIR" onclick="senaraiKIRNew.addAIR('${kir.id}')">📋</button>
                        <button class="action-menu-btn" title="Kemas Kini Kesihatan" onclick="senaraiKIRNew.updateHealth('${kir.id}')">🏥</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Action handlers
    async viewKIR(kirId) {
        try {
            // Navigate to KIR Profile using the same method as original implementation
            this.navigateToKIRProfile(kirId, false, 'maklumat-asas');
        } catch (error) {
            console.error('Error viewing KIR:', error);
            this.showErrorMessage('Ralat membuka profil KIR.');
        }
    }

    navigateToKIRProfile(kirId, editMode = false, tab = 'maklumat-asas') {
        // Map tab parameter for KIR Profile route
        let profileTab = 'maklumat-asas';
        if (tab === 'air') {
            profileTab = 'air';
        } else if (tab === 'kesihatan') {
            profileTab = 'kesihatan';
        } else if (['maklumat-asas', 'kafa', 'pendidikan', 'pekerjaan', 'kekeluargaan', 'pkir'].includes(tab)) {
            profileTab = tab;
        }
        
        // Navigate to KIR Profile route
        window.location.hash = `#/admin/kir/${kirId}?tab=${profileTab}`;
    }

    editKIR(kirId) {
        // Navigate to KIR Profile in edit mode
        this.navigateToKIRProfile(kirId, true, 'maklumat-asas');
    }

    async deleteKIR(kirId) {
        const kir = this.currentKIRData.find(k => k.id === kirId);
        if (!kir) {
            this.showErrorMessage('KIR tidak dijumpai.');
            return;
        }

        const confirmMessage = `Adakah anda pasti ingin memadam KIR untuk:\n\nNama: ${kir.nama_penuh}\nNo. KP: ${kir.no_kp}\n\nTindakan ini tidak boleh dibatalkan.`;
        
        if (!confirm(confirmMessage)) {
            return;
        }

        try {
            this.showLoadingState();
            await KIRService.deleteKIR(kirId);
            this.showSuccessMessage(`KIR untuk ${kir.nama_penuh} telah berjaya dipadam.`);
            
            // Refresh the table
            await this.loadKIRData();
        } catch (error) {
            console.error('Error deleting KIR:', error);
            this.showErrorMessage('Ralat memadam KIR. Sila cuba lagi.');
        } finally {
            this.hideLoadingState();
        }
    }

    addAIR(kirId) {
        // Navigate to KIR Profile AIR tab
        this.navigateToKIRProfile(kirId, false, 'air');
    }

    updateHealth(kirId) {
        // Navigate to KIR Profile Health tab
        this.navigateToKIRProfile(kirId, false, 'kesihatan');
    }

    // Filter and search handlers
    handleSearch() {
        const searchInput = document.getElementById('kir-search-new');
        if (searchInput) {
            this.currentFilters.search = searchInput.value.trim();
            this.currentPage = 1;
            this.loadKIRData();
        }
    }

    handleFilterChange() {
        const statusFilter = document.getElementById('status-filter-new');
        const negeriFilter = document.getElementById('negeri-filter-new');
        
        if (statusFilter) this.currentFilters.status = statusFilter.value;
        if (negeriFilter) this.currentFilters.negeri = negeriFilter.value;
        
        this.currentPage = 1;
        this.loadKIRData();
    }

    resetFilters() {
        this.currentFilters = {
            search: '',
            status: 'all',
            negeri: 'all'
        };
        
        // Reset form elements
        const searchInput = document.getElementById('kir-search-new');
        const statusFilter = document.getElementById('status-filter-new');
        const negeriFilter = document.getElementById('negeri-filter-new');
        
        if (searchInput) searchInput.value = '';
        if (statusFilter) statusFilter.value = 'all';
        if (negeriFilter) negeriFilter.value = 'all';
        
        this.currentPage = 1;
        this.loadKIRData();
    }

    // Pagination handlers
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadKIRData();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.totalRecords / this.pageSize);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.loadKIRData();
        }
    }

    // Utility methods
    updateTableInfo() {
        const tableInfo = document.getElementById('table-info-new');
        if (tableInfo) {
            const start = (this.currentPage - 1) * this.pageSize + 1;
            const end = Math.min(this.currentPage * this.pageSize, this.totalRecords);
            tableInfo.textContent = `Menunjukkan ${start}-${end} daripada ${this.totalRecords} rekod`;
        }
    }

    updatePagination() {
        const totalPages = Math.ceil(this.totalRecords / this.pageSize);
        const paginationInfo = document.getElementById('pagination-info-new');
        const prevBtn = document.getElementById('prev-page-new');
        const nextBtn = document.getElementById('next-page-new');

        if (paginationInfo) {
            paginationInfo.textContent = `Halaman ${this.currentPage} daripada ${totalPages}`;
        }

        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= totalPages;
        }
    }

    showLoadingState() {
        const tableBody = document.getElementById('senariKirNewTableBody');
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem;">
                        <div class="loading-spinner">Memuatkan data...</div>
                    </td>
                </tr>
            `;
        }
    }

    hideLoadingState() {
        // Loading state will be replaced by renderKIRTable()
    }

    showErrorMessage(message) {
        const errorDiv = document.getElementById('error-message-new');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            errorDiv.className = 'error-message show';
            
            setTimeout(() => {
                errorDiv.style.display = 'none';
                errorDiv.className = 'error-message';
            }, 5000);
        }
    }

    showSuccessMessage(message) {
        const errorDiv = document.getElementById('error-message-new');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            errorDiv.className = 'success-message show';
            
            setTimeout(() => {
                errorDiv.style.display = 'none';
                errorDiv.className = 'error-message';
            }, 3000);
        }
    }

    // Status mapping methods
    mapStatusToDatabase(uiStatus) {
        const statusMap = {
            'Draf': 'draft',
            'Dihantar': 'submitted', 
            'Disahkan': 'approved'
        };
        return statusMap[uiStatus] || uiStatus;
    }

    mapDatabaseStatusToUI(dbStatus) {
        const statusMap = {
            'draft': 'status-draft',
            'submitted': 'status-submitted',
            'approved': 'status-approved'
        };
        return statusMap[dbStatus] || 'status-unknown';
    }

    getStatusText(status) {
        const statusMap = {
            'draft': 'Draf',
            'submitted': 'Dihantar',
            'approved': 'Disahkan'
        };
        return statusMap[status] || status || 'Tidak Diketahui';
    }

    formatDate(dateString) {
        if (!dateString) return 'Tiada Tarikh';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ms-MY', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            return 'Tarikh Tidak Sah';
        }
    }
}

// Make instance globally available for action buttons
window.senaraiKIRNew = null;