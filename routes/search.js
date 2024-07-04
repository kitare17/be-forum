const express = require('express');
const router=express.Router();
const {verifyAdmin}=require("../config/jwt/authentication");
const searchController = require('../controller/SearchController');

router.get("/:keyword",searchController.search);

module.exports = router;
