const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  answerName: { type: "string", required: true },
  isAnswer: { type: "boolean", required: true },
});

const questionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    answers: [answerSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
