const Deck = require("../model/Deck");
const FlashCard = require("../model/FlashCard");
const Question = require("../model/Question");

exports.createQuiz = async (req, res) => {
  const quizParams = req.body;
  console.log(quizParams);

  // //   "deckId": "665217cb50eea828b6113562",
  // "deskName": "",
  // "regionType": "",
  // "deckOwner": ""

  if (
    !quizParams.questions ||
    !Array.isArray(quizParams.questions) ||
    quizParams.questions.length === 0
  ) {
    return res.status(400).json({
      message: "Questions are required and should be a non-empty array",
    });
  }

  if (!quizParams.deckId) {
    if (
      !quizParams.deckName ||
      !quizParams.regionType ||
      !quizParams.deckOwner
    ) {
      return res.status(400).json({
        message:
          "deckName, regionType, and deckOwner are required if deckId is not provided",
      });
    }
  }
  const existingDeck = await Deck.findOne({ name: quizParams.deckName });
  if (existingDeck) {
    return res.status(400).json({
      message: "Deck with the same name already exists",
    });
  }
  try {
    const savedQuestions = await Promise.all(
      quizParams.questions.map(async (question) => {
        const newQuestion = new Question(question);
        await newQuestion.save();
        return newQuestion;
      })
    );
    ``;

    console.log("savedQUestion", savedQuestions);
    if (quizParams.deckId === undefined || quizParams.deckId === null) {
      console.log("Created desk ne ....");
      const newDeck = new Deck({
        name: quizParams.deskName,
        regionType: quizParams.regionType,
        deckOwner: quizParams.deckOwner,
      });

      const newFlashCard = new FlashCard({
        questions: savedQuestions,
        deckId: newDeck._id,
      });

      await newDeck.save();
      await newFlashCard.save();
      console.log("Created success");
      res.status(201).json(newFlashCard);
    } else {
      const newFlashCard = new FlashCard({
        questions: savedQuestions,
        deckId: quizParams.deckId,
      });
      await newFlashCard.save();
      res.status(201).json(newFlashCard);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getQuiz = async (req, res) => {
  try {
    const flashcards = await FlashCard.find()
      .populate("questions")
      .populate("deckId");
    res.status(200).json(flashcards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a quiz by ID
exports.getQuizById = async (req, res) => {
  const { id } = req.params;
  try {
    const flashcard = await FlashCard.findById(id)
      .populate("questions")
      .populate("deckId");
    if (!flashcard) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json(flashcard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.editQuiz = async (req, res) => {
  const { id } = req.params;
  const { questions } = req.body;

  try {
    const flashcard = await FlashCard.findById(id);
    if (!flashcard) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (questions) {
      const updatedQuestions = await Promise.all(
        questions.map(async (question) => {
          if (question._id) {
            return Question.findByIdAndUpdate(question._id, question, {
              new: true,
            });
          } else {
            const newQuestion = new Question(question);
            await newQuestion.save();
            return newQuestion;
          }
        })
      );
      flashcard.questions = updatedQuestions.map((q) => q._id);
    }

    await flashcard.save();
    res.status(200).json(flashcard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.deleteQuiz = async (req, res) => {
  const { id } = req.params;

  try {
    const flashcard = await FlashCard.findById(id);
    if (!flashcard) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Optionally delete the questions
    await Question.deleteMany({ _id: { $in: flashcard.questions } });
    await flashcard.remove();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
