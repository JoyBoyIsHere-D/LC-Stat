import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore} from 'firebase/firestore'
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: 'AIzaSyAud_N6MtqVt5lvdscJGhL0SF7cL3JyhRc',
  authDomain: 'lc-stat.firebaseapp.com',
  projectId: 'lc-stat',
  storageBucket: 'lc-stat.firebasestorage.app',
  messagingSenderId: '64187812261',
  appId: '1:64187812261:web:adc6ebbb588e66c08dc04c',
  measurementId: 'G-57STVRSM8S',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
// const analytics = getAnalytics(app);

export const db = getFirestore(app)
