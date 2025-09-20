import fs from "fs/promises";
import express from "express";

// __direname not working with type module (ES)
import path, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
import { fileURLToPath } from 'url';
const __dirname = dirname(__filename);

const todosPath = path.join(__dirname, "/../public/todos.json");

const router = express.Router();

function getTodos() {
    return fs.readFile(todosPath, "utf-8");
}

function updateTodos(todos) {
    return fs.writeFile(todosPath, JSON.stringify(todos, null, 4));
}


router.get("/", async (req, res) => {
    let todos = await getTodos();
    todos = JSON.parse(todos)

    res.send({
        "items": todos,
        "total": todos.length
    });

});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    let todos = await getTodos();
    todos = JSON.parse(todos);
    const todo = todos.find((t) => t.id === parseInt(id));
    if (!todo) {
        res.status(404).send({ error: "todo not found" });
    }
    res.send(todo);
});


router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    let todos = await getTodos();
    todos = JSON.parse(todos);
    const todo = todos.find((t) => t.id === parseInt(id));
    if (!todo) {
        res.status(404).end();
    }

    todos = todos.filter(t => t.id != parseInt(id))

    updateTodos(todos)

    res.status(204).end();
});

export default router;
