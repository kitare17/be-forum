const mongoose = require("mongoose");

const deckSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    regionType: { type: String, required: true },
    deckOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deck", deckSchema);
