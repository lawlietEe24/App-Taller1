
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth} from "firebase/auth";
import { getStorage } from "firebase/storage";

import { initializeAuth, getReactNativePersistence } from 'firebase/auth'; 
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDrzAGBKAbWaH4KOpNZxTdzHKRvGlFD-Uo",
  authDomain: "app-1-e2c18.firebaseapp.com",
  databaseURL: "https://app-1-e2c18-default-rtdb.firebaseio.com",
  projectId: "app-1-e2c18",
  storageBucket: "app-1-e2c18.appspot.com",
  messagingSenderId: "967198652298",
  appId: "1:967198652298:web:998ecd946585b9aa543a73"
};
// Initialize Firebase 
const app = initializeApp(firebaseConfig); 
export const db = getDatabase(app); 
//export const auth = getAuth(app); 

export const auth = initializeAuth(app, { 
  persistence: getReactNativePersistence(ReactNativeAsyncStorage) 
}); 

export const storage = getStorage(app);