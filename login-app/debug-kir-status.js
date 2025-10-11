// Debug script to check KIR records and related documents
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';

// Firebase config (using the same config as the app)
const firebaseConfig = {
  apiKey: "AIzaSyBvOxvtCI7Qs8Qs8Qs8Qs8Qs8Qs8Qs8Qs", // placeholder
  authDomain: "smart-emasa.firebaseapp.com",
  projectId: "smart-emasa",
  storageBucket: "smart-emasa.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function debugKIRStatus() {
  try {
    console.log('=== Debugging KIR Status and Related Documents ===');
    
    // Check KIR records
    console.log('\n1. Checking KIR records...');
    const kirQuery = query(
      collection(db, 'kir'),
      where('env', '==', 'dev'),
      orderBy('tarikh_cipta', 'desc')
    );
    const kirSnapshot = await getDocs(kirQuery);
    
    console.log(`Found ${kirSnapshot.size} KIR records:`);
    kirSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`- ID: ${doc.id}`);
      console.log(`  Name: ${data.nama_penuh || 'N/A'}`);
      console.log(`  No KP: ${data.no_kp || 'N/A'}`);
      console.log(`  Status: ${data.status_rekod || 'N/A'}`);
      console.log(`  Created: ${data.tarikh_cipta?.toDate?.() || data.tarikh_cipta || 'N/A'}`);
      console.log('');
    });
    
    // Check related collections
    const relatedCollections = [
      { name: 'kir_kafa', label: 'KAFA' },
      { name: 'kir_pendidikan', label: 'Pendidikan' },
      { name: 'kir_pekerjaan', label: 'Pekerjaan' },
      { name: 'kir_kesihatan', label: 'Kesihatan' }
    ];
    
    console.log('\n2. Checking related collections...');
    for (const col of relatedCollections) {
      try {
        const relatedQuery = query(
          collection(db, col.name),
          where('env', '==', 'dev')
        );
        const relatedSnapshot = await getDocs(relatedQuery);
        console.log(`${col.label} (${col.name}): ${relatedSnapshot.size} documents`);
        
        if (relatedSnapshot.size > 0) {
          relatedSnapshot.forEach(doc => {
            const data = doc.data();
            console.log(`  - Doc ID: ${doc.id}, KIR ID: ${data.kir_id}`);
          });
        }
      } catch (error) {
        console.log(`${col.label} (${col.name}): Error - ${error.message}`);
      }
    }
    
    console.log('\n=== Debug Complete ===');
    
  } catch (error) {
    console.error('Error during debug:', error);
  }
}

// Run the debug function
debugKIRStatus();