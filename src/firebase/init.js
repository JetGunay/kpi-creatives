import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

var firebaseConfig = {
  apiKey: //apiKey,
  authDomain: "kpi-creatives.firebaseapp.com",
  projectId: "kpi-creatives",
  storageBucket: "kpi-creatives.appspot.com",
  messagingSenderId: "422185275250",
  appId: "1:422185275250:web:a54b415d4bbba5272c57eb",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const timestamp = firebase.firestore.FieldValue.serverTimestamp;
const auth = firebase.auth();

export { auth, timestamp };
export default firebaseApp.firestore();
