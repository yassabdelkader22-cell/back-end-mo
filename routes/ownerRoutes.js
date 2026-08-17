// routes/ownerRoutes.js
const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/owenr.controllers');
const upload = require('../middleware/upload');

router.post('/auth/login', ownerController.login);
router.post('/init', ownerController.createOwner);
router.get('/profile', ownerController.getOwner);
router.get('/profile/:ownerId', ownerController.getOwnerById);
router.post('/click/:imageId', ownerController.handleClick);
router.put('/update/:imageId', upload.single('image'), ownerController.updateImage);

module.exports = router;