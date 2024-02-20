// Backend Express API - a CRUD REST API
// Creates (POST), Reads (GET), Updates (PUT), Deletes (DELETE)
const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea'); // Capital I is convention for Model use.

// Route - get ALL ideas
router.get('/', async (req, res) => {
  try {
    const ideas = await Idea.find();
    res.json({ success: 'true', data: ideas });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

// Route - get single idea
router.get('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    res.json({ success: true, data: idea });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

// Add an idea
router.post('/', async (req, res) => {
  const idea = new Idea({
    // id automatic with MongoDB; date is Date.now per Idea model
    text: req.body.text,
    tag: req.body.tag,
    username: req.body.username,
  });

  try {
    const savedIdea = await idea.save();
    res.json({ success: true, data: savedIdea });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

// Update idea
router.put('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    // Match the usernames
    if (idea.username === req.body.username) {
      const updatedIdea = await Idea.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            text: req.body.text,
            tag: req.body.tag,
          },
        },
        { new: true }
      ); // if id doesn't exist, create it
      return res.json({ success: true, data: updatedIdea }); //return so only one response sent
    }

    // Usernames does not match
    res.status(403).json({
      success: false,
      error: 'You are not authorized to update this resources',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Something went wrong!' });
  }
});

// Delete idea
router.delete('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    // Match the usernames
    if (idea.username === req.body.username) {
      await Idea.findByIdAndDelete(req.params.id);
      return res.json({ success: true, data: {} }); //return so only one response sent
    }

    // Usernames do not match - 403 Unauthorized
    res.status(403).json({
      success: false,
      error: 'You are not authorized to delete this resources',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: 'Something went wrong!!',
    });
  }
});

module.exports = router;
