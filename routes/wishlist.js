const express = require('express');
const router=express.Router();
const {verifyAdmin}=require("../config/jwt/authentication");
const WishlistController = require('../controller/WishlistController');

router.get("/:userid",WishlistController.getOne); //lay wishlist raaa
router.put("/",WishlistController.togglePostInWishlist);

module.exports = router;