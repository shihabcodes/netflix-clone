import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCaXEVIkRJje1eZoQ_YgfqkiWhwoblrugc",
  authDomain: "netflix-clone-9072c.firebaseapp.com",
  projectId: "netflix-clone-9072c",
  storageBucket: "netflix-clone-9072c.appspot.com",
  messagingSenderId: "379787290820",
  appId: "1:379787290820:web:3ec250cc50f8e246018191",
  measurementId: "G-VMDXFWPY3M",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
