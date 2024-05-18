const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  testOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deckId: { type: mongoose.Schema.Types.ObjectId, ref: "Deck", required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Test", testSchema);
