// scripts/createOwner.js
const mongoose = require('mongoose');
const Owner = require('../models/Owner');
require('dotenv').config();

const ownerData = {
    email: 'owner@mta-service.com',
    password: 'MTA2024Secure!'
};

async function createOwner() {
    try {
        await mongoose.connect(process.env.url_mongodb);
        console.log('✅ Connecté à MongoDB');

        if (await Owner.hasOwner()) {
            console.log('⚠️ Un Owner existe déjà');
            process.exit(0);
        }

        const owner = new Owner(ownerData);
        await owner.save();

        console.log('✅ Owner créé avec succès!');
        console.log('===================================');
        console.log(`📧 Email: ${ownerData.email}`);
        console.log(`🔑 Mot de passe: ${ownerData.password}`);
        console.log(`🆔 ID: ${owner._id}`);
        console.log('===================================');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

createOwner();