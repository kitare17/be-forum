// controller/TestController.js

const Test = require("../model/Test");
const Question = require("../model/Question");
const FlashCard = require("../model/FlashCard");

// Create a new test
exports.submitTest = async (req, res) => {
  const testParams = req.body;

  if (
    !testParams.questions ||
    !Array.isArray(testParams.questions) ||
    testParams.questions.length === 0
  ) {
    return res.status(400).json({
      message: "Questions are required and should be a non-empty array",
    });
  }

  try {
    const savedQuestions = await Promise.all(
      testParams.questions.map(async (question) => {
        const newQuestion = new Question(question);
        await newQuestion.save();
        return newQuestion;
      })
    );

    const newTest = new Test({
      questions: savedQuestions,
      flashCardId: testParams.flashCardId,
      userId: testParams.userId,
    });

    await newTest.save();
    res.status(201).json(newTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a test by ID
exports.getResultTestById = async (req, res) => {
  const { id } = req.params;

  try {
    const test = await Test.findById(id)
      .populate("questions")
      .populate("flashCardId");
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.status(200).json(test);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteTest = async (req, res) => {
  const { id } = req.params;

  try {
    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Optionally delete the questions
    await Question.deleteMany({ _id: { $in: test.questions } });
    await test.remove();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
