const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository)

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  if (!isUuid(id))
    return response.status(400).json({ error: 'Repository not found.' })

  const respositoryIndex = repositories.findIndex((repository) => repository.id === id)

  const likes = repositories[respositoryIndex].likes
  const updatedRepository = { id, title, url, techs, likes }

  repositories[respositoryIndex] = updatedRepository

  return response.json(updatedRepository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  if (!isUuid(id))
    return response.status(400).json({ error: 'Repository not found.' })

  const respositoryIndex = repositories.findIndex((repository) => repository.id === id)

  repositories.splice(respositoryIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  if (!isUuid(id))
    return response.status(400).json({ error: 'Repository not found.' })

  const respositoryIndex = repositories.findIndex((repository) => repository.id === id)

  repositories[respositoryIndex].likes += 1

  return response.json(repositories[respositoryIndex])
});

module.exports = app;
