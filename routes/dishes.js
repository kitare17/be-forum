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


//[GET /dishes/:dishId/comments]
router.get("/:dishId/comments", disherController.showComment);

//[GET /dishes/:dishId/comments]
router.post("/:dishId/comments", disherController.createComment);
module.exports = router;