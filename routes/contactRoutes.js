// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// ========== ENVOYER UN MESSAGE ==========
router.post('/contact/send', contactController.sendContactMessage);

module.exports = router;