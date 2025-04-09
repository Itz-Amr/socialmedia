import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDLHNiOHmROQ0OgvNi7Sa1q2OZ8wBScrIc",
  authDomain: "bootcamp-631f9.firebaseapp.com",
  projectId: "bootcamp-631f9",
  storageBucket: "bootcamp-631f9.firebasestorage.app",
  messagingSenderId: "553649856705",
  appId: "1:553649856705:web:91adf7604711d6c3e57440",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
