const express = require('express');
const router = express.Router();
const disherController = require('../controller/DisherController');

//[GET /dishes/:dishId]
router.get("/:dishId", disherController.show);

//[PUT /dishes/:dishId]
router.put("/:dishId", disherController.update);

//[POST /dishes/:dishId]
router.post("/", disherController.create);

//[DELETE /dishes/:dishId]
router.delete("/:dishId", disherController.remove);

module.exports = router;