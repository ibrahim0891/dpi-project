/* eslint-disable no-unused-vars */ 
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyC6nhM9v6ornYPI6jWunIczgD9FCmXb7fI",
  authDomain: "dpi-project-24fac.firebaseapp.com",
  projectId: "dpi-project-24fac",
  storageBucket: "dpi-project-24fac.appspot.com",
  messagingSenderId: "616505084482",
  appId: "1:616505084482:web:1d99b69e050a2667d87bdb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
export default auth