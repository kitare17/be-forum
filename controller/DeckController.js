const Deck = require("../model/Deck");

exports.createDeck = async (req, res) => {
  try {
    const { name, regionType, deckOwner } = req.body;

    console.log("name", name, regionType, deckOwner);
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
  const { regionType, deckOwner } = req.query; // Lấy regionType và deckOwner từ query

  try {
    const query = { regionType }; // Tạo đối tượng query với regionType

    if (regionType === "private" && deckOwner) {
      query.deckOwner = deckOwner; // Thêm deckOwner vào query nếu regionType là 'private'
    }

    const decks = await Deck.find(query); // Tìm các deck dựa trên query
    res.status(200).json(decks); // Trả về các deck tìm được
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message }); // Trả về lỗi nếu có
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
