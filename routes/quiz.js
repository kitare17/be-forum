const express = require("express");
const router = express.Router();
const quizController = require("../controller/QuizController");

router.post("/", quizController.createQuiz);
router.get("/", quizController.getQuiz);
router.get("/:id", quizController.getQuizById);
router.put("/:id", quizController.editQuiz);
router.delete("/:id", quizController.deleteQuiz);

module.exports = router;
