const firebaseConfig = {
    apiKey: "AIzaSyAgFg83-rL7BdQYyQ-EanWw-Pwg-IcZtI0",
    authDomain: "whatsapp-sms-site.firebaseapp.com",
    databaseURL: "https://whatsapp-sms-site-default-rtdb.europe-west1.firebaseio.com",
    projectId: "whatsapp-sms-site",
    storageBucket: "whatsapp-sms-site.appspot.com",
    messagingSenderId: "101653907977",
    appId: "1:101653907977:web:7f8b91b65042385f22c6d8"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();