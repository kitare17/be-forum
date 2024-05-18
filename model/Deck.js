const mongoose = require("mongoose");

const deckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  regionType: { type: String, required: true },
  deckOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Deck", deckSchema);
