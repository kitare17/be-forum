const express = require('express');
const router=express.Router();
const {verifyAdmin}=require("../config/jwt/authentication");
const salePostController = require('../controller/SalePostController');


router.post("/",salePostController.createPost);
router.get("/",salePostController.showSalePost);
router.put("/:idSalePost",salePostController.updateSalePost);
router.get("/:idSalePost",salePostController.getOne);
router.get("/filter/:idcategory",salePostController.getBaseOnCategory);
router.delete("/:idSalePost",salePostController.deleteSalePost);
router.put("/:idSalePost/comments",salePostController.addComment);//getBaseOnCategory


module.exports = router;
