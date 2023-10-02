require('dotenv').config()

const fs = require('fs')
const express = require('express')

const PORT = process.env.PORT ?? 3000
const app = express()

app.use(express.json())

let repertorio = require('../db/repertorio.json')

app.get('/', (req, res) => {
  const file = fs.readFileSync('public/index.html', 'UTF-8')
  res.status(200).end(file)
})

app.get('/canciones', (req, res) => {
  res.json(repertorio)
})

app.post('/canciones', (req, res) => {
  const { id, titulo, artista, tono } = req.body
  const nuevaCancion = { id, titulo, artista, tono }
  repertorio.push(nuevaCancion)
  fs.writeFileSync('./repertorio.json', JSON.stringify(repertorio, null, 2))
  res.json(nuevaCancion)
  res.status(201).end()
})

app.put('/canciones/:id', (req, res) => {
  const id = req.params.id
  const { titulo, artista, tono } = req.body
  const cancionExistente = repertorio.find(cancion => cancion.id === id)
  if (!cancionExistente) {
    return res.status(404).json({ message: 'Canción no encontrada' })
  }
  cancionExistente.titulo = titulo
  cancionExistente.artista = artista
  cancionExistente.tono = tono
  fs.writeFileSync('./repertorio.json', JSON.stringify(repertorio, null, 2))
  res.json(cancionExistente)
})

app.delete('/canciones/:id', (req, res) => {
  const id = req.params.id
  repertorio = repertorio.filter(cancion => cancion.id !== id)
  fs.writeFileSync('./repertorio.json', JSON.stringify(repertorio, null, 2))
  res.json({ message: 'Canción eliminada con éxito' })
})

app.all('*', (req, res) => res.status(404).json({ code: 404, message: 'Page not found...' }))

app.listen(PORT, () => console.log(`Server UP: http://localhost:${PORT}`))