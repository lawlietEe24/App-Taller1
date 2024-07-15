
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth} from "firebase/auth";
import { getStorage } from "firebase/storage";

import { initializeAuth, getReactNativePersistence } from 'firebase/auth'; 
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBLFTpqGQHnSZoUIexOlUWHJKgpobkRJYs",
  authDomain: "taller--1.firebaseapp.com",
  projectId: "taller--1",
  storageBucket: "taller--1.appspot.com",
  messagingSenderId: "566426928489",
  appId: "1:566426928489:web:ec8d250fb814c318a669f8"
};

// Initialize Firebase 
const app = initializeApp(firebaseConfig); 
export const db = getDatabase(app); 
//export const auth = getAuth(app); 

export const auth = getAuth();

export const storage = getStorage(app);