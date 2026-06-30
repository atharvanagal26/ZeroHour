import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAU0mgKolquFr_w2dxOlXhV2TbT8ea3eIQ",
  authDomain: "zerohour-001.firebaseapp.com",
  projectId: "zerohour-001",
  storageBucket: "zerohour-001.firebasestorage.app",
  messagingSenderId: "824594030087",
  appId: "1:824594030087:web:326f9f4631ff2e4b1dd4a2",
  measurementId: "G-WRG4ZKCXS6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
export const db = getFirestore(app);