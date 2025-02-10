const express = require('express');
const axios = require('axios');
const admin = require('firebase-admin');
const cron = require('node-cron');

const serviceAccount = require('./serves-account.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://whatsapp-sms-site-default-rtdb.europe-west1.firebaseio.com"
});

const db = admin.database();
const app = express();

// تحديث الأرقام يوميًا
cron.schedule('0 0 * * *', async () => {
    const url = "https://sms-receive.net/";
    try {
        const response = await axios.get(url);
        const numbers = extractNumbers(response.data); // استخراج الأرقام من HTML
        
        let ref = db.ref("numbers");
        await ref.set(numbers);
        
        console.log("✅ تم تحديث الأرقام بنجاح!");
    } catch (error) {
        console.error("❌ فشل تحديث الأرقام", error);
    }
});

// تشغيل السيرفر
app.listen(3000, () => console.log("🚀 الخادم يعمل على المنفذ 3000"));
