const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

const dbPath = path.join(__dirname, 'moviesData.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

app.get('/movies/', async (request, response) => {
  const getMovieQuery = `
    SELECT
      *
    FROM
      movie
    ORDER BY
      movie_id;`
  const movieArray = await db.all(getMovieQuery)
  response.send(movieArray)
})

app.post('/movies/', async (request, response) => {
  const playerDetails = request.body
  const {directorId, movieName, leadActor} = playerDetails
  const addPlayerQuery = `INSERT INTO movie(directorId, movieName, leadActor)
    VALUES("${directorId}","${movieName}","${leadActor}");`
  const dbResponse = await db.run(addPlayerQuery)
  const playerId = dbResponse.lastID
  response.send('Movie Successfully Added')
})

app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getmoviesId = `
    SELECT 
    *
    FROM
    movie
    WHERE
    movie_id=${movieId};
    `
  const movieArray = await db.all(getmoviesId)
  response.send(movieArray)
})

app.put('/movies/:movieId/', async (request, response) => {
  const {moviesId} = request.params
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails
  const updateMovieArray = `
  UPDATE
  movie
  SET
  director_id="${directorId}",
  movie_name="${movieName}",
  lead_Actor="${leadActor}"
  WHERE 
  movie_id=${moviesId};`
  await db.run(updateMovieArray)
  response.send('Movie Details Updated')
})

app.delete('/movies/:movieId/', async (request, response) => {
  const {moviesId} = request.params
  const deletemoviesId = `
    DELETE
    *
    FROM
    movie
    WHERE
    movies_id=${moviesId};
    `
  await db.run(deletemoviesId)
  response.send('Movie Removed')
})

app.get('/directors/', async (request, response) => {
  const getDirectorQuery = `
    SELECT
      *
    FROM
      director
    ORDER BY
      directorId;`
  const directorArray = await db.all(getDirectorQuery)
  response.send(directorArray)
})

app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  const getmovies = `
    SELECT 
    *
    FROM
    movie
    WHERE
    director_id=${directorId};
    `
  const directorArray = await db.all(getmovies)
  response.send(directorArray)
})

module.exports = app
