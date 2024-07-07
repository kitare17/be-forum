const Test = require("../model/Test");
const Question = require("../model/Question");

exports.submitTest = async (req, res) => {
  const testParams = req.body;

  try {
    const newTest = new Test({
      testOwner: testParams.testOwner,
      deckId: testParams.deckId,
      score: testParams.score,
      numberCorrectAnswer: testParams.numberCorrectAnswer,
      totalQuestionTest: testParams.totalQuestionTest,
      durationInMinutes: testParams.durationInMinutes,
    });

    await newTest.save();
    res.status(201).json(newTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getResultTest = async (req, res) => {
  const { id, deckId } = req.params;
  try {
    const tests = await Test.find({ testOwner: id, deckId: deckId }).populate(
      "deckId"
    );
    if (!tests.length) {
      return res.status(404).json({ message: "No tests found for this owner" });
    }
    res.status(200).json(tests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Delete a test by ID
exports.deleteResultTest = async (req, res) => {
  const { id } = req.params;

  try {
    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    await test.remove();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
