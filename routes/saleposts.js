const express = require('express');
const router=express.Router();
const {verifyAdmin}=require("../config/jwt/authentication");
const salePostController = require('../controller/SalePostController');


router.post("/",salePostController.createPost);
router.get("/",salePostController.showSalePost);
router.get("/:idUser",salePostController.showSalePostByUserId);
router.put("/:idSalePost",salePostController.updateSalePost);
router.get("/:idSalePost",salePostController.getOne);
router.get("/filter/:idslug",salePostController.getBaseOnCategory);
router.delete("/:idSalePost",salePostController.deleteSalePost);
router.put("/:idSalePost/comments",salePostController.addComment);
router.get("/related/:idCategory",salePostController.getRelated); //lấy ngẫu nhiên 5 cái có chung category của bài post đang xem


module.exports = router;
