const express = require('express');
const router = express.Router();
const promotionController = require("../controller/PromotionController");

//  [GET /promotions/:promoId]
router.get("/:promoId", promotionController.show);

//   [PUT /promotions/:promoId]
router.put("/:promoId", promotionController.update);

//  [POST /promotions/]
router.post("/", promotionController.create);

// [DELETE /promotions/:promoId]
router.delete("/:promoId", promotionController.remove);

module.exports = router;
