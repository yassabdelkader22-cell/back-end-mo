var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http');
const connectToMongo = require('./config/mongo.connection');
const fs = require('fs'); // ✅ أضف هذا


var ownerRoutes = require('./routes/ownerRoutes'); // ✅ أضف هذا
var contactRoutes = require('./routes/contactRoutes');
require('dotenv').config();

var app = express();

// ========== إنشاء مجلد uploads ==========
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('📁 Dossier uploads créé');
}

// ========== MIDDLEWARE ==========
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ========== Servir les images uploadées ==========
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); // ✅ أضف هذا

// ========== ROUTES ==========

app.use('/api/owner', ownerRoutes); // ✅ أضف هذا
app.use('/api', contactRoutes);
// ========== CATCH 404 ==========
app.use(function(req, res, next) {
    next(createError(404));
});

// ========== ERROR HANDLER ==========
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.json({
        success: false,
        message: err.message || 'Erreur interne du serveur'
    });
});

// ========== SERVER ==========
const server = http.createServer(app);
const PORT = process.env.PORT || 5006;

server.listen(PORT, () => {
    connectToMongo();
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`✅ API Owner disponible sur /api/owner`);
});