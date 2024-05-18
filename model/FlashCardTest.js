const mongoose = require("mongoose");

const flashCardTestSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  flashCardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flashcard",
    required: true,
  },
  userAnswer: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FlashCardTest", flashCardTestSchema);
