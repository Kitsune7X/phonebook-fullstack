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
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :body'
  )
);

// ---------- Request Logger ----------
const requestLogger = (request, response, next) => {
  console.log('Method', request.method);
  console.log('Path', request.path);
  console.log('Body', request.body);
  console.log('♡⸜(˶˃ ᵕ ˂˶)⸝♡');
  // next() so that the middleware won't hang
  next();
};

// ---------- Serving static files  ----------
app.use(express.static('dist'));

// ==============================
// * Middleware — END
// ==============================

// ==============================
// * Handling requests — START
// ==============================

// ---------- Root entry ----------
app.get('/', (request, response) => {
  response.send('<h1>Hello!</h1>');
});

// ---------- Get Data ----------
app.get('/api/persons', (request, response) => {
  response.json(persons);
});

// ---------- General info ----------
app.get('/info', (request, response) => {
  const timestamp = new Date().toString();
  const count = persons.length;
  //   console.log(count);

  response.send(`
                <p>Phone book has info of ${count} people</p>
                <p>${timestamp}</p>
                `);
});

// ---------- Display the information for a single phone book entry ----------
app.get('/api/persons/:id', (request, response) => {
  //https://expressjs.com/en/5x/api.html#req.params
  const id = request.params.id;
  const person = persons.find((z) => z.id === id);

  if (!person)
    return response.status(404).json({ error: 'not found' });
  else response.json(person);
});

// ---------- Delete a single phone book entry ----------
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  // Find the contact that need to be deleted
  const person = persons.find((z) => z.id === id);
  // Filter out the list
  persons = persons.filter((z) => z.id !== id);
  // Response the person so that the list get updated
  res.json(person);
});

// ---------- Add new entries ----------
const generateId = () =>
  String(Math.floor(Math.random() * Date.now()));

app.post('/api/persons', (req, res) => {
  // console.log(req.body);
  const body = req.body;
  if (!body)
    return res.status(400).json({ error: 'content missing.' });

  if (!body.name)
    return res.status(400).json({ error: 'name missing' });

  if (persons.find((person) => person.name === body.name))
    return res.status(400).json({ error: 'name must be unique' });

  if (!body.number)
    return res.status(400).json({ error: 'number missing' });

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = [...persons, person];

  res.json(person);
});

// ==============================
// * Handling requests — END
// ==============================

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to the DB
