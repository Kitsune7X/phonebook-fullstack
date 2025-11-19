const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

// Fetch the Mongo DB url from .env
const url = process.env.MONGODB_URI;

console.log('Connecting to', url);

// Connect to the Matrix (MongoDB)
mongoose
  .connect(url, { family: 4 })
  .then((result) => console.log('Connected to the Matrix'))
  .catch((error) =>
    console.log('Error connecting to the Matrix', error.message)
  );

// Define the Schema for the contact
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: (v) => /\d{2,3}-\d{5,}/.test(v), // '/' are escape, between that is regex
    },
    message: (props) => `${props.value} is not a valid phone number!`,
  },
});

// Format the returned data to be prettier
contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// Export the compiled model
module.exports = mongoose.model('Contact', contactSchema);
