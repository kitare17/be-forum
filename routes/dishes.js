const express = require('express');
const router = express.Router();
const disherController=require('../controller/DisherController');

router.get("/",disherController.getDisher);

module.exports = router;