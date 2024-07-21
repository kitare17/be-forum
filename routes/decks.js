const express = require("express");
const router = express.Router();
const deckController = require("../controller/DeckController");

router.post("/", deckController.createDeck);
router.get("/", deckController.getDecks);
router.get("/:id", deckController.getDeckById);
router.put("/:id", deckController.editDeck);
router.delete("/:id", deckController.deleteDeck);

module.exports = router;
