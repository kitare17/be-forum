const Deck = require("../model/Deck");
const FlashCard = require("../model/FlashCard");
const Question = require("../model/Question");

exports.createQuiz = async (req, res) => {
  const quizParams = req.body;
  console.log(quizParams);

  if (!quizParams.questions) {
    return res.status(400).json({
      message: "Questions are required and should be a non-empty array",
    });
  }
  if (quizParams.deckName === undefined) {
    return res.status(400).json({
      message: "Deck name cannot be empty",
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
    try {
      for (let i = 0; i < quizParams.questions.length; i++) {
        const newQuestion = new Question(quizParams.questions[i]);
        newQuestion.save();
      }

      const newDeck = new Deck({
        name: quizParams.deckName,
        regionType: quizParams.regionType,
        deckOwner: quizParams.deckOwner,
      });
      const newFlashCard = new FlashCard({
        questions: quizParams.questions,
        deckId: newDeck._id,
      });

      await newDeck.save();
      await newFlashCard.save();
      res.status(201).json(newDeck);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    try {
      const existedFlashCard = await FlashCard.findOne({
        deckId: quizParams.deckId,
      });

      for (let i = 0; i < quizParams.questions.length; i++) {
        const newQuestion = new Question(quizParams.questions[i]);
        newQuestion.save();
      }
      existedFlashCard.questions = quizParams.questions;
      await existedFlashCard.save();
      res.status(201).json(existedFlashCard);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
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
