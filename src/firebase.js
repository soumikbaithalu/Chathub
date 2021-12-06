import firebase from "firebase";

const firebaseConfig = {
  apiKey : "AIzaSyBaIYyoUD9Xl_fCaf2Hrvvg04Wm7CEfsN8",
  authDomain : "whatsapp-clone-react-f7071.firebaseapp.com",
  projectId : "whatsapp-clone-react-f7071",
  storageBucket : "whatsapp-clone-react-f7071.appspot.com",
  messagingSenderId : "495403742208",
  appId : "1:495403742208:web:e70a9f1dd7a087a063d4e5",
  measurementId : "G-JWKW7KGYMY",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export {auth, provider, storage};
export default db;
