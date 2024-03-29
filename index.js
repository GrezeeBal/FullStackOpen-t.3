// COURSE
const express = require('express')
const cors = require('cors')
const app = express()

let notes = [
  {
    id: 1,
    content: "FIRST NOTE",
    important: true
  },
  {
    id: 2,
    content: "SECOND NOTE",
    important: false
  },
  {
    id: 3,
    content: "THIRD NOTE",
    important: true
  },
  {
    id: 4,
    content: "SOME NOTE",
    important: true
  }
]

const requestLogger = (request, response, next) => {
  console.log('---NEW LOGGER---')
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(requestLogger)

// GET
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
  
})

// DELETE
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => {
    return note.id !== id
  })
  
  response.status(204).end()
})

// POST
const generatedId = () => {
  console.log(...notes)
  const maxId = notes.length > 0
  ? Math.max(...notes.map(n => n.id))
  : 0
  
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body
  
  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  
  const note = {
    id: generatedId(),
    content: body.content,
    important: body.important || false,
  }
  
  notes = notes.concat(note)
  console.log(notes)
  response.json(note)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})