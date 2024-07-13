const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const Item = require('./models/item.model'); // Import the Item model

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// MongoDB Connection
const uri = 'mongodb://localhost:27017/mern_curd';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB database connection established successfully");
})
.catch(err => {
  console.error("Error connecting to MongoDB:", err.message);
});

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `image-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Initialize multer upload
const upload = multer({ storage: storage });

// Example route to handle file upload
app.post('/items/add', upload.single('image'), (req, res) => {
  const newItem = new Item({
    title: req.body.title,
    description: req.body.description,
    imageUrl: `uploads/${req.file.filename}`,
    active: req.body.active
  });

  newItem.save()
    .then(() => res.json('Item added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Routes
const itemsRouter = require('./routes/items');
const adminRouter = require('./routes/admin');
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

app.use('/items', itemsRouter);
app.use('/admin', adminRouter);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
