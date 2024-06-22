const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    testOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deck",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    numberCorrectAnswer: {
      type: Number,
      required: true,
    },
    totalQuestionTest: {
      type: Number,
      required: true,
    },
    durationInMinutes: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", testSchema);
