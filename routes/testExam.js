const express = require("express");
const router = express.Router();
const testController = require("../controller/TestController");

router.post("/", testController.submitTest);
router.get("/", testController.getResultTest);
router.delete("/:id", testController.deleteResultTest);

module.exports = router;
