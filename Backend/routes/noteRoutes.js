const express = require("express");

const {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  deleteAllNotes,
} = require("../controllers/noteController");
const router = express.Router();
router.post("/", createNote);
router.get("/", getNotes);
router.delete("/", deleteAllNotes);
router.get("/:id", getNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
module.exports = router;
