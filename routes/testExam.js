const express = require("express");
const router = express.Router();
const testController = require("../controller/TestController");

router.post("/", testController.submitTest);
router.get("/:id", testController.getResultTestById);
router.delete("/:id", testController.deleteTest);

module.exports = router;
