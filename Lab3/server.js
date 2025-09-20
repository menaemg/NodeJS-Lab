import express from "express";
import router from "./routes/todos.js";

const PORT = 3000;
const app = express();

app.use('/todos', router)

app.listen(PORT, () => {
    console.log('Server is running on port 3000');
});