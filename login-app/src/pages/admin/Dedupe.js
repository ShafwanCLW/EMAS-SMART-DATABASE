// S4: Dedupe - Admin tool to handle duplicate KIR records by normalized no_kp
import { DedupeService } from '../../services/backend/DedupeService.js';

export function createDedupeHTML() {
  return `
    <div class="dedupe-container">
      <div class="section-header">
        <h3 class="section-title">🔍 Dedupe KIR Records</h3>
        <p class="section-description">Identify and resolve duplicate KIR records based on normalized no_kp</p>
      </div>

      <div class="dedupe-controls">
        <div class="control-group">
          <button id="scanDuplicatesBtn" class="btn btn-primary">
            <span class="btn-icon">🔍</span>
            Scan for Duplicates
          </button>
          <button id="exportDuplicatesBtn" class="btn btn-secondary" disabled>
            <span class="btn-icon">📊</span>
            Export Results
          </button>
        </div>
      </div>

      <div id="duplicatesResults" class="results-container" style="display: none;">
        <div class="results-header">
          <h4>Duplicate Records Found</h4>
          <div class="results-summary">
            <span id="duplicateCount" class="count-badge">0</span> duplicate groups found
          </div>
        </div>
        
        <div id="duplicatesList" class="duplicates-list">
          <!-- Duplicate groups will be populated here -->
        </div>
      </div>

      <div id="progressModal" class="modal" style="display: none;">
        <div class="modal-content">
          <div class="modal-header">
            <h4>Processing Duplicates</h4>
          </div>
          <div class="modal-body">
            <div class="progress-container">
              <div id="progressBar" class="progress-bar">
                <div id="progressFill" class="progress-fill"></div>
              </div>
              <div id="progressText" class="progress-text">Initializing...</div>
            </div>
          </div>
        </div>
      </div>

      <div id="confirmModal" class="modal" style="display: none;">
        <div class="modal-content">
          <div class="modal-header">
            <h4>Confirm Merge Operation</h4>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to merge these duplicate records?</p>
            <div id="mergePreview" class="merge-preview">
              <!-- Merge preview will be shown here -->
            </div>
            <div class="warning-message">
              ⚠️ This action cannot be undone. The selected records will be merged into one.
            </div>
          </div>
          <div class="modal-footer">
            <button id="confirmMergeBtn" class="btn btn-danger">Confirm Merge</button>
            <button id="cancelMergeBtn" class="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <style>
      .dedupe-container {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .section-header {
        margin-bottom: 30px;
        text-align: center;
      }

      .section-title {
        font-size: 28px;
        color: #2c3e50;
        margin-bottom: 10px;
      }

      .section-description {
        color: #6c757d;
        font-size: 16px;
        margin: 0;
      }

      .dedupe-controls {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin-bottom: 20px;
      }

      .control-group {
        display: flex;
        gap: 15px;
        justify-content: center;
      }

      .btn {
        padding: 14px 28px;
        border: none;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        position: relative;
        overflow: hidden;
      }

      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .btn-primary:hover:not(:disabled) {
        background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
      }

      .btn-secondary {
        background: #6c757d;
        color: white;
      }

      .btn-secondary:hover:not(:disabled) {
        background: #545b62;
      }

      .btn-danger {
        background: #dc3545;
        color: white;
      }

      .btn-danger:hover:not(:disabled) {
        background: #c82333;
      }

      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn-icon {
        font-size: 16px;
      }

      .results-container {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        overflow: hidden;
      }

      .results-header {
        background: #f8f9fa;
        padding: 20px;
        border-bottom: 1px solid #dee2e6;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .results-header h4 {
        margin: 0;
        color: #2c3e50;
      }

      .count-badge {
        background: #dc3545;
        color: white;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: bold;
      }

      .duplicates-list {
        max-height: 600px;
        overflow-y: auto;
      }

      .duplicate-group {
        border-bottom: 1px solid #dee2e6;
        padding: 20px;
      }

      .duplicate-group:last-child {
        border-bottom: none;
      }

      .group-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }

      .group-title {
        font-weight: bold;
        color: #2c3e50;
        margin: 0;
      }

      .group-actions {
        display: flex;
        gap: 10px;
      }

      .btn-small {
        padding: 6px 12px;
        font-size: 12px;
      }

      .records-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 15px;
      }

      .record-card {
        border: 1px solid #dee2e6;
        border-radius: 6px;
        padding: 15px;
        background: #f8f9fa;
        position: relative;
      }

      .record-card.primary {
        border-color: #28a745;
        background: #d4edda;
      }

      .record-card.selected {
        border-color: #007bff;
        background: #d1ecf1;
      }

      .record-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .record-id {
        font-family: monospace;
        font-size: 12px;
        color: #6c757d;
      }

      .record-badge {
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 10px;
        font-weight: bold;
        text-transform: uppercase;
      }

      .record-badge.primary {
        background: #28a745;
        color: white;
      }

      .record-badge.duplicate {
        background: #dc3545;
        color: white;
      }

      .record-details {
        font-size: 14px;
      }

      .record-field {
        margin-bottom: 5px;
      }

      .field-label {
        font-weight: bold;
        color: #495057;
      }

      .field-value {
        color: #6c757d;
      }

      .record-actions {
        margin-top: 10px;
        display: flex;
        gap: 5px;
      }

      .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .modal-content {
        background: white;
        border-radius: 8px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
      }

      .modal-header {
        padding: 20px;
        border-bottom: 1px solid #dee2e6;
      }

      .modal-header h4 {
        margin: 0;
        color: #2c3e50;
      }

      .modal-body {
        padding: 20px;
      }

      .modal-footer {
        padding: 20px;
        border-top: 1px solid #dee2e6;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }

      .progress-container {
        text-align: center;
      }

      .progress-bar {
        width: 100%;
        height: 20px;
        background: #e9ecef;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 10px;
      }

      .progress-fill {
        height: 100%;
        background: #007bff;
        transition: width 0.3s ease;
        width: 0%;
      }

      .progress-text {
        color: #6c757d;
        font-size: 14px;
      }

      .warning-message {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 4px;
        padding: 10px;
        margin-top: 15px;
        color: #856404;
        font-size: 14px;
      }

      .merge-preview {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        padding: 15px;
        margin: 15px 0;
      }

      .merge-preview h5 {
        margin: 0 0 10px 0;
        color: #2c3e50;
      }

      .merge-preview .field {
        margin-bottom: 8px;
        font-size: 14px;
      }

      .error-container {
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
        padding: 20px;
        margin: 20px 0;
        text-align: center;
      }

      .error-container h3 {
        color: #721c24;
        margin: 0 0 10px 0;
      }

      .error-container p {
        color: #721c24;
        margin: 5px 0;
      }

      .error-details {
        font-family: monospace;
        font-size: 12px;
        background: #f5f5f5;
        padding: 10px;
        border-radius: 4px;
        margin-top: 10px;
      }
    </style>
  `;
}

// Initialize function for AdminDashboard integration
export async function initializeDedupe() {
  console.log('Initializing Dedupe component...');
  
  const container = document.getElementById('dedupe-content');
  if (!container) {
    console.error('Dedupe container not found');
    return;
  }

  try {
    // Create and render the Dedupe component
    const dedupe = new DedupeManager();
    container.innerHTML = createDedupeHTML();
    
    // Initialize event listeners
    dedupe.setupEventListeners();
    
    console.log('Dedupe component initialized successfully');
  } catch (error) {
    console.error('Error initializing Dedupe component:', error);
    container.innerHTML = `
      <div class="error-container">
        <h3>Error Loading Dedupe</h3>
        <p>Unable to load the Dedupe page. Please try again.</p>
        <p class="error-details">${error.message}</p>
      </div>
    `;
  }
}

class DedupeManager {
  constructor() {
    this.duplicateGroups = [];
    this.selectedRecords = new Set();
  }

  setupEventListeners() {
    // Scan for duplicates button
    const scanBtn = document.getElementById('scanDuplicatesBtn');
    if (scanBtn) {
      scanBtn.addEventListener('click', () => this.scanForDuplicates());
    }

    // Export results button
    const exportBtn = document.getElementById('exportDuplicatesBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportResults());
    }

    // Modal event listeners
    const cancelMergeBtn = document.getElementById('cancelMergeBtn');
    if (cancelMergeBtn) {
      cancelMergeBtn.addEventListener('click', () => this.hideConfirmModal());
    }

    const confirmMergeBtn = document.getElementById('confirmMergeBtn');
    if (confirmMergeBtn) {
      confirmMergeBtn.addEventListener('click', () => this.confirmMerge());
    }
  }

  async scanForDuplicates() {
    console.log('Scanning for duplicate KIR records...');
    
    this.showProgressModal();
    this.updateProgress(0, 'Initializing scan...');
    
    try {
      // Step 1: Get all KIR records
      this.updateProgress(20, 'Fetching KIR records...');
      const duplicates = await DedupeService.findDuplicateRecords();
      
      // Step 2: Process duplicates
      this.updateProgress(60, 'Processing duplicates...');
      this.duplicateGroups = duplicates;
      
      // Step 3: Display results
      this.updateProgress(90, 'Displaying results...');
      this.displayDuplicates();
      
      this.updateProgress(100, 'Scan complete!');
      
      setTimeout(() => {
        this.hideProgressModal();
      }, 1000);
      
    } catch (error) {
      console.error('Error scanning for duplicates:', error);
      this.hideProgressModal();
      alert(`Error scanning for duplicates: ${error.message}`);
    }
  }

  displayDuplicates() {
    const resultsContainer = document.getElementById('duplicatesResults');
    const duplicatesList = document.getElementById('duplicatesList');
    const duplicateCount = document.getElementById('duplicateCount');
    const exportBtn = document.getElementById('exportDuplicatesBtn');
    
    if (!resultsContainer || !duplicatesList || !duplicateCount) {
      console.error('Required elements not found for displaying duplicates');
      return;
    }

    // Update count
    duplicateCount.textContent = this.duplicateGroups.length;
    
    // Show results container
    resultsContainer.style.display = 'block';
    
    // Enable export button
    if (exportBtn) {
      exportBtn.disabled = this.duplicateGroups.length === 0;
    }

    // Clear previous results
    duplicatesList.innerHTML = '';

    if (this.duplicateGroups.length === 0) {
      duplicatesList.innerHTML = `
        <div class="no-duplicates">
          <p>✅ No duplicate records found!</p>
          <p>All KIR records have unique normalized no_kp values.</p>
        </div>
      `;
      return;
    }

    // Display each duplicate group
    this.duplicateGroups.forEach((group, groupIndex) => {
      const groupElement = this.createDuplicateGroupElement(group, groupIndex);
      duplicatesList.appendChild(groupElement);
    });
  }

  createDuplicateGroupElement(group, groupIndex) {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'duplicate-group';
    
    groupDiv.innerHTML = `
      <div class="group-header">
        <h5 class="group-title">Group ${groupIndex + 1}: ${group.normalizedNoKp}</h5>
        <div class="group-actions">
          <button class="btn btn-primary btn-small" onclick="dedupeManager.showMergePreview(${groupIndex})">
            <span class="btn-icon">🔗</span>
            Merge Records
          </button>
        </div>
      </div>
      <div class="records-grid">
        ${group.records.map((record, recordIndex) => this.createRecordCardHTML(record, recordIndex === 0, groupIndex, recordIndex)).join('')}
      </div>
    `;
    
    return groupDiv;
  }

  createRecordCardHTML(record, isPrimary, groupIndex, recordIndex) {
    return `
      <div class="record-card ${isPrimary ? 'primary' : ''}" data-group="${groupIndex}" data-record="${recordIndex}">
        <div class="record-header">
          <span class="record-id">${record.id}</span>
          <span class="record-badge ${isPrimary ? 'primary' : 'duplicate'}">
            ${isPrimary ? 'Primary' : 'Duplicate'}
          </span>
        </div>
        <div class="record-details">
          <div class="record-field">
            <span class="field-label">Name:</span>
            <span class="field-value">${record.nama || 'N/A'}</span>
          </div>
          <div class="record-field">
            <span class="field-label">No KP:</span>
            <span class="field-value">${record.no_kp || 'N/A'}</span>
          </div>
          <div class="record-field">
            <span class="field-label">Status:</span>
            <span class="field-value">${record.status_rekod || 'N/A'}</span>
          </div>
          <div class="record-field">
            <span class="field-label">Created:</span>
            <span class="field-value">${record.created_at ? new Date(record.created_at.seconds * 1000).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>
        <div class="record-actions">
          <button class="btn btn-secondary btn-small" onclick="dedupeManager.viewRecord('${record.id}')">
            View Details
          </button>
        </div>
      </div>
    `;
  }

  showMergePreview(groupIndex) {
    const group = this.duplicateGroups[groupIndex];
    if (!group) return;

    const modal = document.getElementById('confirmModal');
    const mergePreview = document.getElementById('mergePreview');
    
    if (!modal || !mergePreview) return;

    // Show merge preview
    const primaryRecord = group.records[0];
    const duplicateRecords = group.records.slice(1);
    
    mergePreview.innerHTML = `
      <h5>Primary Record (will be kept):</h5>
      <div class="field"><strong>ID:</strong> ${primaryRecord.id}</div>
      <div class="field"><strong>Name:</strong> ${primaryRecord.nama || 'N/A'}</div>
      <div class="field"><strong>No KP:</strong> ${primaryRecord.no_kp || 'N/A'}</div>
      
      <h5>Records to be merged (will be deleted):</h5>
      ${duplicateRecords.map(record => `
        <div class="field">• ${record.id} - ${record.nama || 'N/A'}</div>
      `).join('')}
    `;
    
    // Store the group index for confirmation
    modal.dataset.groupIndex = groupIndex;
    
    // Show modal
    modal.style.display = 'flex';
  }

  hideConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  async confirmMerge() {
    const modal = document.getElementById('confirmModal');
    const groupIndex = parseInt(modal.dataset.groupIndex);
    
    if (isNaN(groupIndex)) return;
    
    const group = this.duplicateGroups[groupIndex];
    if (!group) return;

    this.hideConfirmModal();
    this.showProgressModal();
    
    try {
      this.updateProgress(0, 'Starting merge operation...');
      
      const result = await DedupeService.mergeRecords(group.records);
      
      this.updateProgress(100, 'Merge completed successfully!');
      
      setTimeout(() => {
        this.hideProgressModal();
        alert(`Successfully merged ${result.mergedCount} records into primary record.`);
        
        // Remove the merged group from display
        this.duplicateGroups.splice(groupIndex, 1);
        this.displayDuplicates();
      }, 1000);
      
    } catch (error) {
      console.error('Error merging records:', error);
      this.hideProgressModal();
      alert(`Error merging records: ${error.message}`);
    }
  }

  viewRecord(recordId) {
    // Navigate to KIR profile page
    window.location.hash = `#/admin/kir/${recordId}`;
  }

  showProgressModal() {
    const modal = document.getElementById('progressModal');
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  hideProgressModal() {
    const modal = document.getElementById('progressModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  updateProgress(percentage, message) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
    
    if (progressText) {
      progressText.textContent = message;
    }
  }

  exportResults() {
    if (this.duplicateGroups.length === 0) {
      alert('No duplicate records to export.');
      return;
    }

    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        totalGroups: this.duplicateGroups.length,
        totalRecords: this.duplicateGroups.reduce((sum, group) => sum + group.records.length, 0),
        groups: this.duplicateGroups.map((group, index) => ({
          groupIndex: index + 1,
          normalizedNoKp: group.normalizedNoKp,
          recordCount: group.records.length,
          records: group.records.map(record => ({
            id: record.id,
            nama: record.nama,
            no_kp: record.no_kp,
            status_rekod: record.status_rekod,
            created_at: record.created_at ? new Date(record.created_at.seconds * 1000).toISOString() : null
          }))
        }))
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kir-duplicates-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('Duplicate records exported successfully');
    } catch (error) {
      console.error('Error exporting results:', error);
      alert(`Error exporting results: ${error.message}`);
    }
  }
}

// Make DedupeManager globally accessible for onclick handlers
window.dedupeManager = new DedupeManager();

export { DedupeManager };