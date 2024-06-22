const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  answerName: { type: "string", required: true },
  isAnswer: { type: "boolean", required: true },
});

const questionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    answers: [answerSchema],
    deck: { type: mongoose.Schema.Types.ObjectId, ref: "Deck", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
