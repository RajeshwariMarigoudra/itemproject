// backend/routes/admin.js
const router = require('express').Router();
let Item = require('../models/item.model');

// Set active status of an item
router.post('/set-status/:id', (req, res) => {
  const { active } = req.body;
  Item.findById(req.params.id)
    .then(item => {
      item.active = active;
      item.save()
        .then(() => res.json('Item updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get all items
router.get('/items', (req, res) => {
  Item.find()
    .then(items => res.json(items))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
