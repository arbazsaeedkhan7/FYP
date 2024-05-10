import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCsecOQjxAg36DBTowXBUPr_uyaPsKC5co",
    authDomain: "driverconnect-drivercv-storage.firebaseapp.com",
    projectId: "driverconnect-drivercv-storage",
    storageBucket: "driverconnect-drivercv-storage.appspot.com",
    messagingSenderId: "638821153172",
    appId: "1:638821153172:web:5186b21c3085da07fff781",
    measurementId: "G-9BGT91308M"
  };
// Initialize Firebase app
console.log("Initializing Firebase app...");
const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized successfully.");

// Initialize Firebase Storage
console.log("Initializing Firebase Storage...");
const storage = getStorage(app);
console.log("Firebase Storage initialized successfully.");

export default storage;
