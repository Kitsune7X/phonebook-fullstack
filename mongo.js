// Program is used by passing 3 command line arguments
// node mongo.js password Kitsune 900022-000
const mongoose = require('mongoose');

// Check for valid input
if (process.argv.length < 3) {
  console.log('format: node mongo.js <password> <name> <number>');
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

// Database URL
const url = `mongodb+srv://kitsune:${password}@cluster0.n7dev8g.mongodb.net/phonebook?appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(url, { family: 4 });

// Define the Schema for a contact
const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// Compile the Contact model
const Contact = mongoose.model('Contact', contactSchema);

// Instantiate a new contact document using the CLI-provided name/number
const contact = new Contact({
  name,
  number,
});

//  Save the contact Database
if (process.argv.length > 3) {
  contact.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}

// Fetch the contact list when only password is provided
if (process.argv.length === 3) {
  Contact.find({}).then((result) => {
    console.log(`phonebook:`);
    result.forEach((contact) =>
      console.log(`${contact.name} ${contact.number}`)
    );
    mongoose.connection.close();
  });
}
