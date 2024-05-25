const mongoose = require("mongoose");
const Question = require("../model/Question");

const flashcardSchema = new mongoose.Schema(
  {
    questions: [Question.schema],
    deckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deck",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FlashCard", flashcardSchema);
