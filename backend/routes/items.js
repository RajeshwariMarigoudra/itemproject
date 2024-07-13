// backend/routes/items.js
const router = require('express').Router();
const multer = require('multer');
const path = require('path');
let Item = require('../models/item.model');

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `image-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// CRUD operations
router.route('/').get((req, res) => {
  Item.find()
    .then(items => res.json(items))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post(upload.single('image'), (req, res) => {
  const newItem = new Item({
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.file.path,
    active: req.body.active
  });

  newItem.save()
    .then(() => res.json('Item added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Item.findById(req.params.id)
    .then(item => res.json(item))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Item.findByIdAndDelete(req.params.id)
    .then(() => res.json('Item deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});




router.route('/update/:id').post(upload.single('image'), (req, res) => {
  Item.findById(req.params.id)
    .then(item => {
      item.title = req.body.title;
      item.description = req.body.description;
      if (req.file) {
        item.imageUrl = `uploads/${req.file.filename}`;
      }
      item.active = req.body.active;

      item.save()
        .then(() => res.json('Item updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
