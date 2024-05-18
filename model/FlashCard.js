const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  deckId: { type: mongoose.Schema.Types.ObjectId, ref: "Deck", required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FlashCard", flashcardSchema);
