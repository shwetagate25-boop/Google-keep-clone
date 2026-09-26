const Note = require("../models/Note");

// CREATE NOTE
const createNote = async (req, res) => {
  try {
    const { title, description, color } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const note = await Note.create({
      title,
      description,
      color,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create note",
      error: error.message,
    });
  }
};


// GET ALL NOTES
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({
      createdAt: -1,
    });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notes",
      error: error.message,
    });
  }
};


// GET SINGLE NOTE
const getNote = async (req, res) => {
  try {
    const note = await Note.findById(
      req.params.id
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch note",
      error: error.message,
    });
  }
};


// UPDATE NOTE
const updateNote = async (req, res) => {
  try {
    const {
      title,
      description,
      color,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const note =
      await Note.findByIdAndUpdate(
        req.params.id,

        {
          title,
          description,
          color,
        },

        {
          new: true,
          runValidators: true,
        }
      );

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update note",
      error: error.message,
    });
  }
};


// DELETE SINGLE NOTE
const deleteNote = async (req, res) => {
  try {
    const note =
      await Note.findByIdAndDelete(
        req.params.id
      );

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete note",
      error: error.message,
    });
  }
};


// DELETE ALL NOTES
const deleteAllNotes = async (req, res) => {
  try {
    await Note.deleteMany({});

    res.status(200).json({
      message: "All notes deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete all notes",
      error: error.message,
    });
  }
};


module.exports = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  deleteAllNotes,
};