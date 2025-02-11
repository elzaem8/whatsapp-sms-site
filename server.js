const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const admin = require('firebase-admin');
const cron = require('node-cron');

// تحميل بيانات Firebase
const serviceAccount = require('./serves-account.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://whatsapp-sms-site-default-rtdb.europe-west1.firebaseio.com"
});

const db = admin.database();
const app = express();

// 🔹 قائمة المواقع التي سيتم جلب الأرقام منها
const sites = [
    "https://sms-receive.net/",
    "https://www.freephonenum.com/",
    "https://www.receive-sms-free.cc/"
];

// 🔹 وظيفة لجلب الأرقام من المواقع
async function fetchNumbers() {
    let numbers = [];

    for (let site of sites) {
        try {
            const response = await axios.get(site);
            const $ = cheerio.load(response.data);

            // 🟢 تعديل حسب بنية الموقع لجلب الأرقام الصحيحة
            $('div.number-box').each((i, el) => {
                let number = $(el).text().trim();
                if (number.startsWith('+')) {
                    numbers.push({ number: number, messages: [] });
                }
            });
        } catch (error) {
            console.error('❌ خطأ في جلب الأرقام من ${site}:', error);
        }
    }

    return numbers;
}

// 🔹 وظيفة لجلب الرسائل الخاصة بكل رقم
async function fetchMessages(numbers) {
    for (let num of numbers) {
        try {
            const response = await axios.get('https://sms-receive.net/${num.number}');
            const $ = cheerio.load(response.data);

            let messages = [];
            $('div.sms-text').each((i, el) => {
                messages.push($(el).text().trim());
            });

            num.messages = messages.slice(0, 5); // 🟢 جلب آخر 5 رسائل فقط
        } catch (error) {
            console.error('❌ خطأ في جلب الرسائل للرقم ${num.number}:', error);
        }
    }

    return numbers;
}

// 🔹 تحديث الأرقام والرسائل تلقائيًا كل 24 ساعة
cron.schedule('0 0 * * *', async () => {
    console.log("🔄 تحديث الأرقام والرسائل...");
    let numbers = await fetchNumbers();
    numbers = await fetchMessages(numbers);

    // 🟢 تخزين البيانات في Firebase
    await db.ref('numbers').set(numbers);
    console.log("✅ تم تحديث قاعدة البيانات!");
});

// تشغيل السيرفر
app.listen(3000, () => console.log("🚀 الخادم يعمل على المنفذ 3000"));