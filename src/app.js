const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");
const { query } = require("express");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const {title} = request.query;

  if (title){
    const repository = repositories.filter(repository => repository.title.includes(title));
    console.log(repository);
    return response.json(repository);
  }

  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const id = uuid();
  const {title, url, techs} = request.body;

  repository = {
    id,
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({error: "repository not found"});
  }

  const likes = repositories[repositoryIndex].likes;

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }
    
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({error: "repository ID not found"});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({error: "repository not found"});
  }

  const repository = repositories[repositoryIndex];

  repository.likes = repository.likes + 1;

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

module.exports = app;
