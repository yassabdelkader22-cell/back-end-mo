// models/Owner.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ownerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    // تخزين عدد النقرات لكل صورة
    clickCounts: {
        type: Map,
        of: Number,
        default: {}
    },
    // تخزين مسار الصور المحدثة
    cardImages: {
        type: Map,
        of: String,
        default: {}
    }
}, {
    timestamps: true
});

// تشفير كلمة المرور
ownerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// مقارنة كلمة المرور
ownerSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// زيادة عدد النقرات
ownerSchema.methods.incrementClick = function(imageId) {
    const current = this.clickCounts.get(imageId) || 0;
    this.clickCounts.set(imageId, current + 1);
    return this.clickCounts.get(imageId);
};

// إعادة تعيين العداد
ownerSchema.methods.resetClick = function(imageId) {
    this.clickCounts.set(imageId, 0);
};

// تحديث صورة
ownerSchema.methods.updateImage = function(imageId, imagePath) {
    this.cardImages.set(imageId, imagePath);
};

// التحقق من وجود Owner
ownerSchema.statics.hasOwner = async function() {
    return await this.countDocuments() > 0;
};

// الحصول على Owner الوحيد
ownerSchema.statics.getOwner = async function() {
    return await this.findOne();
};

module.exports = mongoose.model('Owner', ownerSchema);