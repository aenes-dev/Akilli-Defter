import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase projenizin ayarlarını .env dosyasından okur.
// Proje kökünde bir .env dosyası oluşturup .env.example dosyasındaki
// değerleri kendi Firebase projenizin bilgileriyle doldurun.
const firebaseConfig = {
  apiKey: "AIzaSyDO6htd6nmV2VllCKvfp0dTEpUVEXqiKtE",
  authDomain: "gelir-gider-f2853.firebaseapp.com",
  projectId: "gelir-gider-f2853",
  storageBucket: "gelir-gider-f2853.firebasestorage.app",
  messagingSenderId: "258262905490",
  appId: "1:258262905490:web:653e68b686284cefa6ec4b",
  measurementId: "G-HZ21VGWBYY"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
