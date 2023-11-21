import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD-dnDrH9FSG5AJo2unicuWdroEidctzdE",
  authDomain: "tccfinancas-fd7a9.firebaseapp.com",
  databaseURL: "https://tccfinancas-fd7a9-default-rtdb.firebaseio.com",
  projectId: "tccfinancas-fd7a9",
  storageBucket: "tccfinancas-fd7a9.appspot.com",
  messagingSenderId: "613723245646",
  appId: "1:613723245646:web:bf6e26fda11fe3ab1c071f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Configura o Firebase Auth com AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth }; 