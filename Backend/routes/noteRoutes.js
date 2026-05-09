const express = require("express");
const Note = require("../models/Note");

const router = express.Router();

router.post("/notes", async (req, res) => {
  try {
    const { title, description } = req.body;

    const note = new Note({
      title,
      description
    });

    await note.save();

    res.status(201).json({
      message: "Note created successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating note",
      error: error.message
    });
  }
});

router.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching notes",
      error: error.message
    });
  }
});

router.put("/notes/:id", async (req, res) => {
  try {
    const { title, description } = req.body;

    await Note.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );

    res.status(200).json({
      message: "Note updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating note",
      error: error.message
    });
  }
});

router.delete("/notes/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Note deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting note",
      error: error.message
    });
  }
});

module.exports = router;