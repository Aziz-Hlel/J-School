import { firebaseSession } from '../firebase.init';

async function testFirebaseConnection() {
  try {
    // Attempt to list collections (lightweight read)
    await firebaseSession.listUsers(1);
    console.log('✅ SUCCESS : Firebase credentials are valid and connected!');
  } catch (error) {
    console.error('❌ ERROR : Firebase credentials rejected or network issue.', error);
    throw error;
  }
}

export default testFirebaseConnection;
