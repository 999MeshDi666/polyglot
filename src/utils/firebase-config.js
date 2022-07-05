import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database"
import {getAuth} from "firebase/auth"
const firebaseConfig = {
    apiKey: "AIzaSyAwjrx46MmvA1m4jNhuNf_NSp3FMdc1fzs",
    authDomain: "polyglot-999666.firebaseapp.com",
    databaseURL: "https://polyglot-999666-default-rtdb.firebaseio.com",
    projectId: "polyglot-999666",
    storageBucket: "polyglot-999666.appspot.com",
    messagingSenderId: "1051194073372",
    appId: "1:1051194073372:web:896ed47e1c48b827219ad9",
    measurementId: "G-CC7DM627RK"
};

const fbaseConfig = initializeApp(firebaseConfig);
const fbaseDB = getDatabase(fbaseConfig)
const fbAuth = getAuth(fbaseConfig)
export {fbaseConfig, fbaseDB, fbAuth};