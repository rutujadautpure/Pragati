const mongoose = require('mongoose');

// Define the schema
const videoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      'Finance',
      'Tax',
      'Fashion, Handicraft and Luggage',
      'Home Decor, Furniture and Hardware',
      'Electrical, Electronics and Software',
      'Books, Office Supplies and Madla',
      'Personal Care Health and Beauty',
      'Sports, Hobbies, Toys and Events',
      'Others and Services',
    ],
    required: true,
  },
});

// Create the model from the schema
const Video = mongoose.model('Video', videoSchema);

// Export the model
module.exports = { Video };
