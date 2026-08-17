// config/email.config.js
require('dotenv').config();  // ⬅️ أضف هذا السطر في البداية

const nodemailer = require('nodemailer');

console.log('📧 ===== إعدادات البريد الإلكتروني =====');
console.log('EMAIL_USER:', process.env.EMAIL_USER || '❌ غير موجود');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ موجود' : '❌ غير موجود');
console.log('OWNER_EMAIL:', process.env.OWNER_EMAIL || '❌ غير موجود');
console.log('========================================\n');

// ========== تكوين الإرسال ==========
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ========== اختبار الاتصال عند بدء التشغيل ==========
transporter.verify((error, success) => {
    if (error) {
        console.log('❌ فشل الاتصال بخادم Gmail:');
        console.log('🔍 الخطأ:', error.message);
        console.log('\n💡 تأكد من:');
        console.log('   1️⃣ EMAIL_USER صحيح');
        console.log('   2️⃣ EMAIL_PASS هو App Password (وليس كلمة المرور العادية)');
        console.log('   3️⃣ تم تفعيل IMAP في إعدادات Gmail');
        console.log('   4️⃣ تم تفعيل "السماح للتطبيقات الأقل أماناً"');
    } else {
        console.log('✅ البريد الإلكتروني جاهز للإرسال');
    }
});

module.exports = transporter;