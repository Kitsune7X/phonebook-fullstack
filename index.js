require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
// Import Contact model
const Contact = require('./models/contact');

// ==============================
// * Middleware — START
// ==============================
// ---------- JSON Parser ----------
app.use(express.json());

// ---------- Logging info ----------
// ---------- Morgan token ----------
// Create a new token to be used in `morgan`
// https://github.com/expressjs/morgan#creating-new-tokens
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

// ---------- Request Logger ----------
const requestLogger = (req, res, next) => {
  console.log('Method', req.method);
  console.log('Path', req.path);
  console.log('Body', req.body);
  console.log('♡⸜(˶˃ ᵕ ˂˶)⸝♡');
  // next() so that the middleware won't hang
  next();
};
app.use(requestLogger);

// ---------- Serving static files  ----------
app.use(express.static('dist'));

// ==============================
// * Middleware — END
// ==============================

// ==============================
// * Handling requests — START
// ==============================

// ---------- Get Data ----------
app.get('/api/persons', (req, res) => {
  Contact.find({}).then((contacts) => res.json(contacts));
});

// ---------- General info ----------
app.get('/info', (req, res) => {
  const timestamp = new Date().toString();
  Contact.find({}).then((contacts) => {
    res.send(`
                <p>Phone book has info of ${contacts.length} people</p>
                <p>${timestamp}</p>
                `);
  });
});

// ---------- Display the information for a single phone book entry ----------
app.get('/api/persons/:id', (req, res) => {
  //https://expressjs.com/en/5x/api.html#req.params
  Contact.findById(req.params.id).then((contact) => res.json(contact));
});

// ---------- Delete a single phone book entry ----------
app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id).then((result) => {
    console.log(result);
    res.json(result);
  });
});

// ---------- Add new entries ----------
app.post('/api/persons', (req, res) => {
  // console.log(req.body);
  const body = req.body;
  if (!body) return res.status(400).json({ error: 'content missing.' });

  if (!body.name) return res.status(400).json({ error: 'name missing' });

  if (!body.number) return res.status(400).json({ error: 'number missing' });

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact.save().then((savedContact) => res.json(savedContact));
});

// ==============================
// * Handling requests — END
// ==============================

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Delete phone book entries is reflected in the database
// Move the error handling of the application to a new error handler middleware
