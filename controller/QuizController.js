const Deck = require("../model/Deck");
const Question = require("../model/Question");

exports.createQuiz = async (req, res) => {
  const { questions, deckName, regionType, deckOwner, deckId } = req.body;
  console.log("Incoming request body:", req.body); // Log the incoming request body
  if (!questions || questions.length === 0) {
    return res.status(400).json({
      message: "Questions are required and should be a non-empty array",
    });
  }

  try {
    let deck;
    if (!deckId) {
      if (!regionType || !deckOwner) {
        return res.status(400).json({
          message:
            "regionType and deckOwner are required if deckId is not provided",
        });
      }

      deck = new Deck({
        name: deckName,
        regionType: regionType,
        deckOwner: deckOwner,
      });
      await deck.save();
      console.log("thanh cong mat roi ");
    } else {
      deck = await Deck.findById(deckId);
      if (!deck) {
        return res.status(404).json({ message: "Deck not found" });
      }
    }
    console.log("question ne ");
    // Use a different name for the saved questions array
    const savedQuestions = await Promise.all(
      questions.map(async (questionData) => {
        const question = new Question({ ...questionData, deck: deck._id });
        await question.save();
        return question;
      })
    );

    res.status(201).json({ deck, questions: savedQuestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getQuiz = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getQuizById = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "question not found" });
    }

    res.status(200).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.editQuiz = async (req, res) => {
  const { id } = req.params;
  const { name, answers } = req.body;

  try {
    // Find the question by id
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Update the fields
    question.name = name;
    question.answers = answers;

    // Save the updated question
    await question.save();

    res
      .status(200)
      .json({ message: "Question updated successfully", question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.deleteQuiz = async (req, res) => {
  const { id } = req.params;

  try {
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "question not found" });
    }
    await question.deleteOne();
    res.status(204).send(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
