import { recordAttendance, getProgram } from '../../services/backend/AttendanceService.js';

const normalizeNoKP = (value = '') => value.toString().replace(/\D/g, '');

export function createCheckinPage(programId) {
  return `
    <style>
      .checkin-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%); padding: 20px; }
      .checkin-card { background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12); width: min(440px, 96vw); }
      .checkin-card h2 { margin: 0 0 6px 0; color: #0f172a; }
      .checkin-subtitle { margin: 0 0 12px 0; color: #475569; }
      .checkin-status { margin-bottom: 12px; padding: 10px 12px; border-radius: 10px; background: #f1f5f9; color: #0f172a; }
      .checkin-status.success { background: #dcfce7; color: #166534; }
      .checkin-status.error { background: #fee2e2; color: #b91c1c; }
      .checkin-program { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; margin-bottom: 12px; }
      #checkin-form { display: flex; flex-direction: column; gap: 10px; }
      #checkin-form label { font-weight: 600; color: #0f172a; }
      #checkin-form input { padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px; }
      #checkin-form button { padding: 12px; border: none; border-radius: 12px; background: linear-gradient(135deg, #6366f1, #22d3ee); color: #fff; font-weight: 700; cursor: pointer; box-shadow: 0 10px 20px rgba(99,102,241,0.25); }
      #checkin-form button:hover { transform: translateY(-1px); }
    </style>
    <div class="checkin-page">
      <div class="checkin-card">
        <h2>Program Check-in</h2>
        <p class="checkin-subtitle">Scan & daftar kehadiran anda.</p>
        <div class="checkin-status" id="checkin-status">${programId ? '' : 'Program ID hilang'}</div>
        <div class="checkin-program" id="checkin-program"></div>
        <form id="checkin-form">
          <label for="checkin-nokp">No KP</label>
          <input id="checkin-nokp" name="no_kp" type="text" placeholder="011111-12-1111" maxlength="14" inputmode="numeric" required />
          <button type="submit">Sahkan Kehadiran</button>
        </form>
      </div>
    </div>
  `;
}

export function setupCheckinPage(programId) {
  const statusEl = document.getElementById('checkin-status');
  const programEl = document.getElementById('checkin-program');
  const form = document.getElementById('checkin-form');
  const input = document.getElementById('checkin-nokp');

  const setStatus = (msg, type = 'info') => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = `checkin-status ${type}`;
  };

  const loadProgram = async () => {
    try {
      const program = await getProgram(programId);
      if (!program) {
        setStatus('Program tidak ditemui.', 'error');
        form.style.display = 'none';
        return;
      }
      programEl.innerHTML = `
        <div class="program-meta">
          <div><strong>${program.nama_program || program.name || 'Program'}</strong></div>
          <div>${program.tarikh_mula ? new Date(program.tarikh_mula).toLocaleDateString('en-MY') : ''}</div>
          <div>${program.lokasi || ''}</div>
        </div>
      `;
      setStatus('Sila masukkan No KP anda untuk sahkan kehadiran.', 'info');
    } catch (error) {
      console.error('Check-in loadProgram error', error);
      setStatus('Ralat memuat program.', 'error');
      form.style.display = 'none';
    }
  };

  if (!programId) {
    form.style.display = 'none';
    return;
  }

  loadProgram();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const no_kp = normalizeNoKP ? normalizeNoKP(input.value) : input.value;
    if (!no_kp) {
      setStatus('Sila masukkan No KP yang sah.', 'error');
      return;
    }
    setStatus('Memproses kehadiran...', 'info');
    try {
      await recordAttendance({ programId, no_kp });
      setStatus('Kehadiran direkodkan. Terima kasih!', 'success');
      form.reset();
    } catch (error) {
      console.error('Check-in submit error', error);
      setStatus(error.message || 'Gagal merekod kehadiran.', 'error');
    }
  });

  const formatNoKP = (value) => {
    const digits = normalizeNoKP(value).slice(0, 12);
    if (digits.length <= 6) return digits;
    if (digits.length <= 8) return `${digits.slice(0, 6)}-${digits.slice(6)}`;
    return `${digits.slice(0, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`;
  };

  input.addEventListener('input', () => {
    const formatted = formatNoKP(input.value);
    input.value = formatted;
  });
}
