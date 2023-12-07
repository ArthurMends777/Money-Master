import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
 /*
   Coloque a conexão com seu banco aqui
 */
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Configura o Firebase Auth com AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth }; 
