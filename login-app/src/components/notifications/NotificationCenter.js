import { KIRService } from '../../services/backend/KIRService.js';
import { AIRService } from '../../services/backend/AIRService.js';
import { PasanganService } from '../../services/backend/PasanganService.js';

export class NotificationCenter {
  constructor(options = {}) {
    this.mode = options.mode || 'user';
    this.containerId = options.containerId || 'notification-center-root';
    this.kirId = options.kirId || null;
    this.limit = options.limit || 40;
    this.userName = options.userName || '';
    this.state = {
      loading: false,
      error: null,
      notifications: [],
      lastUpdated: null,
      totalHouseholds: 0,
      hasMore: false
    };
    this.hasMounted = false;
    this.domIds = {
      header: `${this.containerId}-header`,
      summary: `${this.containerId}-summary`,
      list: `${this.containerId}-list`
    };
    this.boundHandler = this.handleContainerClick.bind(this);
  }

  mount() {
    const container = this.getContainer();
    if (!container || this.hasMounted) {
      return;
    }
    this.ensureStyles();
    container.innerHTML = this.createTemplate();
    container.addEventListener('click', this.boundHandler);
    this.hasMounted = true;
    this.updateDOM();
  }

  destroy() {
    const container = this.getContainer();
    if (container) {
      container.removeEventListener('click', this.boundHandler);
    }
    this.hasMounted = false;
  }

  async refresh(options = {}) {
    if (!this.hasMounted) {
      this.mount();
    }
    if (this.state.loading && !options.force) {
      return;
    }

    this.state.loading = true;
    this.state.error = null;
    this.updateDOM();

    try {
      const notifications = this.mode === 'admin'
        ? await this.loadAdminNotifications()
        : await this.loadUserNotifications();

      this.state.notifications = notifications;
      this.state.lastUpdated = new Date();
      this.state.error = null;
    } catch (error) {
      console.error('NotificationCenter: Gagal memuat notifikasi', error);
      this.state.error = error?.message || 'Gagal memuatkan notifikasi.';
    } finally {
      this.state.loading = false;
      this.updateDOM();
    }
  }

  async loadAdminNotifications() {
    const result = await KIRService.getKIRList({ pageSize: this.limit });
    const items = Array.isArray(result.items) ? result.items : [];
    const notifications = [];

    for (const kir of items) {
      try {
        const [pkir, airListRaw] = await Promise.all([
          PasanganService.getPKIRByKirId(kir.id).catch(() => null),
          AIRService.listAIR(kir.id).catch(() => [])
        ]);
        const airList = Array.isArray(airListRaw) ? airListRaw : [];
        notifications.push(...this.buildHouseholdNotifications({
          kir,
          pkir,
          airList,
          includeKirMeta: true
        }));
      } catch (error) {
        console.warn('NotificationCenter: gagal memuat data isi rumah', kir?.id, error);
      }
    }

    this.state.totalHouseholds = items.length;
    this.state.hasMore = Boolean(result.hasMore);
    return notifications;
  }

  async loadUserNotifications() {
    if (!this.kirId) {
      throw new Error('Akaun anda belum dipautkan kepada rekod KIR.');
    }

    const kirData = await KIRService.getKIRById(this.kirId);
    if (!kirData) {
      throw new Error('Rekod KIR tidak ditemui.');
    }

    const [pkir, airListRaw] = await Promise.all([
      PasanganService.getPKIRByKirId(this.kirId).catch(() => null),
      AIRService.listAIR(this.kirId).catch(() => [])
    ]);

    const airList = Array.isArray(airListRaw) ? airListRaw : [];
    this.state.totalHouseholds = 1;

    return this.buildHouseholdNotifications({
      kir: { ...kirData, id: this.kirId },
      pkir,
      airList,
      includeKirMeta: false
    });
  }

  buildHouseholdNotifications({ kir, pkir, airList = [], includeKirMeta = false }) {
    if (!kir) return [];
    const notifications = [];
    const kirName = kir?.nama_penuh || kir?.nama || 'Ketua Isi Rumah';
    const kirId = kir?.id || kir?.kir_id || null;
    const maritalStatusRaw =
      kir?.status_perkahwinan ||
      kir?.kekeluargaan?.status_perkahwinan ||
      kir?.maklumat_asas?.status_perkahwinan ||
      '';
    const shouldExpectPKIR =
      typeof maritalStatusRaw === 'string' &&
      maritalStatusRaw.trim().toLowerCase() === 'berkahwin';

    const baseMeta = {
      kirName: includeKirMeta ? kirName : null,
      kirId
    };

    const pushNotification = (config) => {
      notifications.push({
        id: config.id || `noti-${kirId || 'household'}-${config.entityType}-${Math.random().toString(36).slice(2, 8)}`,
        entityType: config.entityType || 'KIR',
        personName: config.personName || kirName,
        relationship: config.relationship || '',
        message: config.message || '',
        targetTab: config.targetTab || 'maklumat-asas',
        severity: 'warning',
        createdAt: new Date(),
        personId: config.personId || null,
        ...baseMeta
      });
    };

    const kirIdentity = this.pickIdentityValue([
      kir?.no_kp,
      kir?.no_kp_raw,
      kir?.no_kp_display,
      kir?.nokp
    ]);

    if (!kirIdentity) {
      pushNotification({
        entityType: 'KIR',
        personName: kirName,
        relationship: 'Ketua Isi Rumah',
        message: `${kirName} belum mempunyai No. Kad Pengenalan.`,
        targetTab: 'maklumat-asas'
      });
    }

    if (shouldExpectPKIR && pkir && (pkir?.id || pkir?.asas?.nama)) {
      const pkirName = pkir?.nama_pasangan || pkir?.nama || pkir?.asas?.nama || 'Pasangan';
      const pkirIdentity = this.pickIdentityValue([
        pkir?.no_kp_pasangan,
        pkir?.no_kp,
        pkir?.asas?.no_kp
      ]);

      if (!pkirIdentity) {
        pushNotification({
          entityType: 'PKIR',
          personName: pkirName,
          relationship: 'Pasangan KIR',
          message: `${pkirName} belum mempunyai No. Kad Pengenalan.`,
          targetTab: 'pkir'
        });
      }
    }

    airList.forEach((air, index) => {
      const airIdentity = this.pickIdentityValue([
        air?.no_kp,
        air?.no_kp_display,
        air?.nokp,
        air?.asas?.no_kp
      ]);
      if (airIdentity) return;

      const airName = air?.nama || air?.nama_penuh || `Ahli Isi Rumah ${index + 1}`;
      const relationship = air?.hubungan || 'Ahli Isi Rumah';

      pushNotification({
        entityType: 'AIR',
        personName: airName,
        relationship,
        message: `${airName} (${relationship}) belum mempunyai No. Kad Pengenalan.`,
        targetTab: 'air',
        personId: air?.id || null
      });
    });

    return notifications;
  }

  createTemplate() {
    return `
      <div class="notification-center" data-notification-root="${this.containerId}">
        <div id="${this.domIds.header}">
          ${this.renderHeader()}
        </div>
        <div id="${this.domIds.summary}">
          ${this.renderSummarySection()}
        </div>
        <div id="${this.domIds.list}">
          ${this.renderNotificationList()}
        </div>
      </div>
    `;
  }

  renderHeader() {
    const warningCount = this.state.notifications.length;
    const households = this.state.totalHouseholds;
    const hasMoreText = this.state.hasMore ? '+' : '';
    const metaLine = households
      ? `${households}${hasMoreText} isi rumah diperiksa`
      : 'Belum memuatkan data';

    const title = this.mode === 'admin' ? 'Notifikasi Isi Rumah' : 'Notifikasi Saya';
    const description = this.mode === 'admin'
      ? 'Pantau rekod keluarga yang belum melengkapkan No. Kad Pengenalan.'
      : 'Jejak amaran penting berkaitan profil isi rumah anda.';
    const eyebrow = this.mode === 'admin' ? 'Pentadbir' : 'Isi Rumah';

    return `
      <div class="notification-header">
        <div>
          <p class="notification-eyebrow">${eyebrow}</p>
          <h3>${title}</h3>
          <p>${description}</p>
        </div>
        <div class="notification-header-meta">
          <div class="notification-pill">
            <span class="pill-label">Amaran Aktif</span>
            <strong>${warningCount}</strong>
            <small>${metaLine}</small>
          </div>
          <button type="button"
                  class="btn btn-light"
                  data-action="refresh-notifications">
            <i class="fas fa-sync-alt"></i> Segarkan
          </button>
        </div>
      </div>
    `;
  }

  renderSummarySection() {
    if (this.state.loading) {
      return `
        <div class="notification-summary-card loading">
          <div class="loading-line"></div>
          <div class="loading-line short"></div>
        </div>
      `;
    }

    if (this.state.error) {
      return `
        <div class="notification-summary-card error">
          <i class="fas fa-exclamation-triangle"></i>
          <div>
            <h4>Gagal Memuatkan Notifikasi</h4>
            <p>${this.state.error}</p>
          </div>
        </div>
      `;
    }

    const warnings = this.state.notifications.length;
    const statusClass = warnings > 0 ? 'warning' : 'success';
    const statusLabel = warnings > 0 ? 'Tindakan Diperlukan' : 'Tiada amaran aktif';
    const helperText = warnings > 0
      ? 'Lengkapkan No. Kad Pengenalan bagi rekod yang disenaraikan.'
      : 'Semua rekod mempunyai No. Kad Pengenalan.';
    const lastUpdated = this.state.lastUpdated
      ? `Dikemas kini ${this.formatTimestamp(this.state.lastUpdated)}`
      : 'Belum dikemas kini';

    return `
      <div class="notification-summary-card ${statusClass}">
        <div>
          <span class="status-label">${statusLabel}</span>
          <h4>${warnings} amaran dikesan</h4>
          <p>${helperText}</p>
        </div>
        <div class="summary-meta">
          <span><i class="fas fa-clock"></i> ${lastUpdated}</span>
        </div>
      </div>
    `;
  }

  renderNotificationList() {
    if (this.state.loading) {
      return `
        <div class="notification-list">
          ${this.createLoadingCards(3)}
        </div>
      `;
    }

    if (this.state.error) {
      return '';
    }

    if (!this.state.notifications.length) {
      const message = this.mode === 'admin'
        ? 'Tiada KIR dengan amaran terkini.'
        : 'Tiada amaran untuk isi rumah anda.';
      return `
        <div class="notification-empty-state">
          <div class="empty-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h4>Tiada Notifikasi</h4>
          <p>${message}</p>
        </div>
      `;
    }

    return `
      <div class="notification-list">
        ${this.state.notifications.map(notification => this.renderNotificationCard(notification)).join('')}
      </div>
    `;
  }

  renderNotificationCard(notification) {
    const createdText = notification.createdAt ? this.formatTimestamp(notification.createdAt) : '';
    const actionLabel = this.mode === 'admin' ? 'Buka Profil KIR' : 'Kemaskini Profil';
    const kirMeta = notification.kirName
      ? `<span class="kir-meta"><i class="fas fa-home"></i> ${this.escapeHtml(notification.kirName)}</span>`
      : '';

    return `
      <div class="notification-card severity-${notification.severity || 'warning'}" data-notification-id="${notification.id}">
        <div class="notification-card-header">
          <div>
            <span class="entity-chip">${notification.entityType || 'KIR'}</span>
            <h4>${this.escapeHtml(notification.personName || 'Rekod')}</h4>
            ${notification.relationship ? `<span class="notification-relationship">${this.escapeHtml(notification.relationship)}</span>` : ''}
          </div>
          <div class="notification-meta">
            <span class="meta-badge">
              <i class="fas fa-id-card"></i> No. KP belum diisi
            </span>
            ${kirMeta}
            ${createdText ? `<small>${createdText}</small>` : ''}
          </div>
        </div>
        <p class="notification-message">${this.escapeHtml(notification.message || '')}</p>
        <div class="notification-actions">
          <button type="button"
                  class="btn btn-primary"
                  data-action="notification-action"
                  data-notification-id="${notification.id}">
            ${actionLabel}
          </button>
        </div>
      </div>
    `;
  }

  createLoadingCards(count = 2) {
    return Array.from({ length: count })
      .map(() => `
        <div class="notification-card loading">
          <div class="loading-line wide"></div>
          <div class="loading-line"></div>
          <div class="loading-line short"></div>
        </div>
      `)
      .join('');
  }

  updateDOM() {
    const header = document.getElementById(this.domIds.header);
    if (header) {
      header.innerHTML = this.renderHeader();
    }

    const summary = document.getElementById(this.domIds.summary);
    if (summary) {
      summary.innerHTML = this.renderSummarySection();
    }

    const list = document.getElementById(this.domIds.list);
    if (list) {
      list.innerHTML = this.renderNotificationList();
    }
  }

  handleContainerClick(event) {
    const refreshBtn = event.target.closest('[data-action="refresh-notifications"]');
    if (refreshBtn) {
      this.refresh({ force: true });
      return;
    }

    const actionBtn = event.target.closest('[data-action="notification-action"]');
    if (actionBtn) {
      const notificationId = actionBtn.dataset.notificationId;
      const notification = this.state.notifications.find(item => item.id === notificationId);
      if (notification) {
        this.handleNotificationAction(notification);
      }
    }
  }

  handleNotificationAction(notification) {
    if (this.mode === 'admin') {
      if (notification.kirId) {
        const tab = notification.targetTab || 'maklumat-asas';
        window.location.hash = `#/admin/kir/${notification.kirId}?tab=${tab}`;
      }
      return;
    }

    const kirProfileNav = document.querySelector('.nav-item[data-section="kir-profile"]');
    if (kirProfileNav) {
      kirProfileNav.click();
    }

    setTimeout(() => {
      if (window.kirProfile && typeof window.kirProfile.switchTab === 'function') {
        window.kirProfile.switchTab(notification.targetTab || 'maklumat-asas');
        if (notification.entityType === 'AIR' && notification.personId && window.airTab) {
          setTimeout(() => window.airTab?.openAIRDrawer?.(notification.personId), 400);
        }
      }
    }, 400);
  }

  getContainer() {
    return document.getElementById(this.containerId);
  }

  pickIdentityValue(candidates = []) {
    return (candidates || [])
      .map(value => this.normalizeIdentity(value))
      .find(Boolean) || '';
  }

  normalizeIdentity(value) {
    if (value === null || value === undefined) {
      return '';
    }
    const raw = value.toString().trim();
    if (!raw || raw === 'null' || raw === 'undefined') {
      return '';
    }
    return raw.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  }

  escapeHtml(text) {
    if (!text || typeof text !== 'string') return text || '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  formatTimestamp(date) {
    if (!date) return '';
    const instance = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(instance.getTime())) return '';
    return instance.toLocaleString('ms-MY', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  ensureStyles() {
    if (document.getElementById('notification-center-styles')) {
      return;
    }
    const style = document.createElement('style');
    style.id = 'notification-center-styles';
    style.textContent = `
      .notification-center {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }
      .notification-header {
        background: #fff;
        border-radius: 20px;
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        gap: 1.25rem;
        align-items: flex-start;
        box-shadow: 0 18px 30px rgba(15, 23, 42, 0.08);
      }
      .notification-eyebrow {
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: 0.75rem;
        color: #818cf8;
      }
      .notification-header-meta {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .notification-header-meta .btn,
      .notification-header-meta button {
        border: none;
        border-radius: 14px;
        background: linear-gradient(135deg, #818cf8, #6366f1);
        color: #fff;
        font-weight: 600;
        padding: 0.85rem 1.35rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        box-shadow: 0 12px 24px rgba(99, 102, 241, 0.25);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .notification-header-meta .btn i,
      .notification-header-meta button i {
        font-size: 0.9rem;
      }
      .notification-header-meta .btn:hover,
      .notification-header-meta button:hover {
        transform: translateY(-2px);
        box-shadow: 0 16px 30px rgba(99, 102, 241, 0.3);
      }
      .notification-pill {
        border: 1px solid #e0e7ff;
        border-radius: 16px;
        padding: 0.85rem 1.25rem;
        background: #eef2ff;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .notification-pill strong {
        font-size: 1.6rem;
        line-height: 1;
        color: #312e81;
      }
      .notification-pill small {
        color: #6366f1;
        font-size: 0.8rem;
      }
      .notification-summary-card {
        border-radius: 18px;
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        border: 1px solid rgba(148, 163, 184, 0.4);
        background: #fff;
      }
      .notification-summary-card.warning {
        border-color: rgba(249, 115, 22, 0.4);
        background: linear-gradient(120deg, #fff7ed, #fff);
      }
      .notification-summary-card.success {
        border-color: rgba(34, 197, 94, 0.4);
        background: linear-gradient(120deg, #ecfdf5, #fff);
      }
      .notification-summary-card.error {
        border-color: rgba(248, 113, 113, 0.4);
        background: #fef2f2;
        color: #991b1b;
        align-items: center;
      }
      .notification-summary-card.loading .loading-line {
        height: 12px;
        background: #e0e7ff;
        border-radius: 999px;
        margin-bottom: 8px;
        animation: notification-pulse 1.5s infinite;
      }
      .notification-summary-card.loading .loading-line.short {
        width: 60%;
      }
      .status-label {
        font-size: 0.82rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #ea580c;
      }
      .notification-summary-card.success .status-label {
        color: #16a34a;
      }
      .summary-meta {
        text-align: right;
        color: #475569;
        font-size: 0.9rem;
      }
      .notification-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .notification-card {
        border-radius: 16px;
        border: 1px solid rgba(226, 232, 240, 0.9);
        background: #fff;
        padding: 1.25rem;
        box-shadow: 0 14px 24px rgba(15, 23, 42, 0.08);
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .notification-card-header {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .entity-chip {
        display: inline-flex;
        padding: 0.3rem 0.75rem;
        border-radius: 999px;
        background: #eef2ff;
        color: #4338ca;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .notification-relationship {
        display: block;
        color: #94a3b8;
        font-size: 0.9rem;
      }
      .notification-meta {
        text-align: right;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        align-items: flex-end;
      }
      .meta-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.3rem 0.75rem;
        border-radius: 999px;
        background: rgba(249, 115, 22, 0.15);
        color: #b45309;
        font-size: 0.85rem;
        font-weight: 600;
      }
      .kir-meta {
        font-size: 0.85rem;
        color: #475569;
      }
      .notification-message {
        margin: 0;
        color: #475569;
      }
      .notification-actions {
        display: flex;
        justify-content: flex-end;
      }
      .notification-actions .btn,
      .notification-actions button {
        border: none;
        border-radius: 12px;
        padding: 0.65rem 1.25rem;
        background: linear-gradient(135deg, #f97316, #fb923c);
        color: #fff;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 12px 22px rgba(249, 115, 22, 0.25);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .notification-actions .btn:hover,
      .notification-actions button:hover {
        transform: translateY(-2px);
        box-shadow: 0 16px 26px rgba(249, 115, 22, 0.3);
      }
      .notification-card.loading .loading-line {
        height: 10px;
        background: #e2e8f0;
        border-radius: 999px;
        margin-bottom: 6px;
        animation: notification-pulse 1.5s infinite;
      }
      .notification-card.loading .loading-line.wide {
        width: 80%;
      }
      .notification-card.loading .loading-line.short {
        width: 40%;
      }
      .notification-empty-state {
        border-radius: 18px;
        border: 1px dashed rgba(148, 163, 184, 0.6);
        text-align: center;
        padding: 2rem;
        background: #f8fafc;
      }
      .notification-empty-state .empty-icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: #ecfdf5;
        color: #16a34a;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.5rem;
        margin: 0 auto 1rem;
      }
      @keyframes notification-pulse {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
      }
      @media (max-width: 768px) {
        .notification-header {
          flex-direction: column;
        }
        .notification-header-meta {
          width: 100%;
          justify-content: space-between;
        }
        .notification-meta {
          align-items: flex-start;
          text-align: left;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

export default NotificationCenter;
