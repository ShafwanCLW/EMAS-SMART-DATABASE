import { collection, query, where, getDocs, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../database/firebase.js';
import { COLLECTIONS, createEnvFilter, getEnvironment } from '../database/collections.js';

const PARTICIPANT_COLLECTION = 'index_nokp';

const normalizeNoKP = (value = '') => value.toString().replace(/\D/g, '');

export async function getParticipantByNoKP(no_kp) {
  const normalized = normalizeNoKP(no_kp);
  if (!normalized) return null;
  const snap = await getDocs(query(collection(db, PARTICIPANT_COLLECTION), where('no_kp', '==', normalized), createEnvFilter()));
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}

export async function getProgram(programId) {
  if (!programId) return null;
  const programDoc = await (await import('firebase/firestore')).getDoc(doc(db, COLLECTIONS.PROGRAM, programId));
  return programDoc.exists() ? { id: programDoc.id, ...programDoc.data() } : null;
}

export async function recordAttendance({ programId, no_kp }) {
  const participant = await getParticipantByNoKP(no_kp);
  if (!participant) {
    throw new Error('Peserta tidak ditemui dalam index_nokp');
  }
  const program = await getProgram(programId);
  if (!program) {
    throw new Error('Program tidak ditemui');
  }

  const participantId = participant.id || participant.no_kp || normalizeNoKP(no_kp);
  const attendanceId = `${programId}_${participantId}`;
  const ref = doc(db, COLLECTIONS.KEHADIRAN_PROGRAM, attendanceId);

  const payload = {
    program_id: programId,
    participant_id: participantId,
    participant_name: participant.nama || participant.name || '-',
    no_kp_display: participant.no_kp_display || participant.no_kp || normalizeNoKP(no_kp),
    hadir: true,
    source: 'qr-self-checkin',
    scanned_at: serverTimestamp(),
    tarikh_kemas_kini: serverTimestamp(),
    env: getEnvironment()
  };

  await setDoc(ref, payload, { merge: true });
  return { id: attendanceId, ...payload };
}

export async function listAttendanceByProgram(programId, date) {
  const constraints = [where('program_id', '==', programId), createEnvFilter()];
  if (date) {
    const targetDate = new Date(date);
    const nextDate = new Date(targetDate);
    nextDate.setDate(targetDate.getDate() + 1);
    constraints.push(where('scanned_at', '>=', targetDate));
    constraints.push(where('scanned_at', '<', nextDate));
  }
  const snap = await getDocs(query(collection(db, COLLECTIONS.KEHADIRAN_PROGRAM), ...constraints));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateAttendanceStatus(attendanceId, hadir) {
  const ref = doc(db, COLLECTIONS.KEHADIRAN_PROGRAM, attendanceId);
  await updateDoc(ref, { hadir, tarikh_kemas_kini: serverTimestamp() });
  return { id: attendanceId, hadir };
}

export async function updateAttendanceNotes(attendanceId, notes) {
  const ref = doc(db, COLLECTIONS.KEHADIRAN_PROGRAM, attendanceId);
  await updateDoc(ref, { catatan: notes || '', tarikh_kemas_kini: serverTimestamp() });
  return { id: attendanceId, notes };
}

export default {
  getParticipantByNoKP,
  getProgram,
  recordAttendance,
  listAttendanceByProgram,
  updateAttendanceStatus,
  updateAttendanceNotes
};
