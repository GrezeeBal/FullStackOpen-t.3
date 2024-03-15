const express = require('express')
const app = express()

app.use(express.json())

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423112-"
  },
]

// GET
app.get('/', (req, res) => {
  res.send(`
    <div>
      <a href="http://localhost:3001/api/persons">Persons</a>
      <a href="http://localhost:3001/info">Info</a>
    </div>
  `)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }

})

app.get('/info', (req, res) => {
  res.send(`
    <div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${Date()}</p>
    </div>
  `)
})

// POST
const generatedId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(p => p.id))
    : 0

  return maxId + 1
}

// const generatedNumber = () => {
//   return Math.floor(100000000 + Math.random() * 900000000)
// }

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }

  const isSame = (person) => person.name === body.name

  if (persons.some(isSame)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generatedId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  res.json(person)
})

// DELETE
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})