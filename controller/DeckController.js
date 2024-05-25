const Deck = require("../model/Deck");

exports.createDeck = async (req, res) => {
  try {
    const { name, regionType, deckOwner } = req.body;

    const newDeck = new Deck({
      name,
      regionType,
      deckOwner,
    });

    const savedDeck = await newDeck.save();
    res.status(201).json(savedDeck);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all decks
exports.getDecks = async (req, res) => {
  try {
    const decks = await Deck.find();
    res.status(200).json(decks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDeckById = async (req, res) => {
  try {
    const { id } = req.params;
    const deck = await Deck.findById(id);

    if (!deck) {
      return res.status(404).json({ message: "Deck not found" });
    }

    res.status(200).json(deck);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit a deck by ID
exports.editDeck = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, regionType } = req.body;

    const updatedDeck = await Deck.findByIdAndUpdate(
      id,
      { name, regionType },
      { new: true, runValidators: true }
    );

    if (!updatedDeck) {
      return res.status(404).json({ message: "Deck not found" });
    }

    res.status(200).json(updatedDeck);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteDeck = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDeck = await Deck.findByIdAndDelete(id);

    if (!deletedDeck) {
      return res.status(404).json({ message: "Deck not found" });
    }
    res.status(200).json({ message: "Deck deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
