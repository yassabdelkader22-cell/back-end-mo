// routes/index.js
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // ✅ أصلح هذا السطر
  res.json('Welcome to the home page!')
  });

module.exports = router;