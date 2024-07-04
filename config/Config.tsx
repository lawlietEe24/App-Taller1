import { initializeApp } from "firebase/app";
import { getDatabase} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD9FCPqfXwS1BkwhTopetJP-9tj4ptuMjM",
  authDomain: "taller1-f940c.firebaseapp.com",
  projectId: "taller1-f940c",
  storageBucket: "taller1-f940c.appspot.com",
  messagingSenderId: "483171511496",
  appId: "1:483171511496:web:e1eadaa19abb6f00ea89fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);