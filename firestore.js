const firebaseConfig = {
  apiKey: "AIzaSyBRV41aBWKHCZd7S_0bgIRnv80KlIuJiE0",
  authDomain: "todo-list-24af6.firebaseapp.com",
  projectId: "todo-list-24af6",
  storageBucket: "todo-list-24af6.appspot.com",
  messagingSenderId: "864205930629",
  appId: "1:864205930629:web:0b0cfec56d6b8802d629ec",
};
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
