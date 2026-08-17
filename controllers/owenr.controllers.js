// controllers/ownerController.js
const Owner = require('../model/owner.model');
const fs = require('fs');
const path = require('path');

// ========== تسجيل الدخول ==========
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const owner = await Owner.findOne({ email }).select('+password');
        if (!owner) {
            return res.status(401).json({ 
                success: false, 
                message: 'Email ou mot de passe incorrect' 
            });
        }

        const isValid = await owner.comparePassword(password);
        if (!isValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Email ou mot de passe incorrect' 
            });
        }

        const ownerData = owner.toObject();
        delete ownerData.password;

        res.json({
            success: true,
            message: '✅ Connexion réussie',
            data: ownerData
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ========== النقر على الصورة ==========
exports.handleClick = async (req, res) => {
    try {
        const { imageId } = req.params;
        const { ownerId } = req.body;

        const owner = await Owner.findById(ownerId);
        if (!owner) {
            return res.status(404).json({ 
                success: false, 
                message: 'Owner non trouvé' 
            });
        }

        const count = owner.incrementClick(imageId);
        await owner.save();

        res.json({
            success: true,
            canUpdate: count >= 3,
            clickCount: count
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ========== تغيير الصورة ==========
exports.updateImage = async (req, res) => {
    try {
        const { imageId } = req.params;
        const { ownerId } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez sélectionner une image'
            });
        }

        const owner = await Owner.findById(ownerId);
        if (!owner) {
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            return res.status(404).json({ 
                success: false, 
                message: 'Owner non trouvé' 
            });
        }

        // التحقق من 3 نقرات
        const count = owner.clickCounts.get(imageId) || 0;
        if (count < 3) {
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            return res.status(403).json({
                success: false,
                message: 'Vous devez cliquer 3 fois sur l\'image'
            });
        }

        // حذف الصورة القديمة
        const oldImage = owner.cardImages.get(imageId);
        if (oldImage && fs.existsSync(oldImage)) {
            fs.unlinkSync(oldImage);
        }

        // حفظ الصورة الجديدة
        const imagePath = req.file.path;
        owner.updateImage(imageId, imagePath);
        owner.resetClick(imageId);
        await owner.save();

        const imageUrl = `/uploads/${path.basename(imagePath)}`;

        res.json({
            success: true,
            message: '✅ Image mise à jour',
            imageUrl: imageUrl
        });

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// ========== إنشاء Owner (مرة واحدة) ==========
exports.createOwner = async (req, res) => {
    try {
        const { email, password } = req.body;

        const hasOwner = await Owner.hasOwner();
        if (hasOwner) {
            return res.status(400).json({
                success: false,
                message: 'Un Owner existe déjà'
            });
        }

        const owner = new Owner({ email, password });
        await owner.save();

        res.status(201).json({
            success: true,
            message: '✅ Owner créé',
            data: { email: owner.email, id: owner._id }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ========== الحصول على معلومات Owner ==========
exports.getOwner = async (req, res) => {
    try {
        const owner = await Owner.findOne();
        if (!owner) {
            return res.status(404).json({
                success: false,
                message: 'Aucun Owner trouvé'
            });
        }

        // تحويل مسارات الصور إلى URLs
        const data = owner.toObject();
        if (data.cardImages) {
            const images = {};
            for (let [key, value] of data.cardImages) {
                images[key] = value ? `/uploads/${path.basename(value)}` : null;
            }
            data.cardImages = images;
        }

        res.json({ success: true, data });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ========== الحصول على Owner بواسطة ID ==========
exports.getOwnerById = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const owner = await Owner.findById(ownerId);
        
        if (!owner) {
            return res.status(404).json({
                success: false,
                message: 'Owner non trouvé'
            });
        }

        const data = owner.toObject();
        if (data.cardImages) {
            const images = {};
            for (let [key, value] of data.cardImages) {
                images[key] = value ? `/uploads/${path.basename(value)}` : null;
            }
            data.cardImages = images;
        }

        res.json({ success: true, data });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};