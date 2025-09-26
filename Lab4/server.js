import express from "express";
import AuthRouter from "./routes/auth.js";
import query from "./data/db-connection.js";


// import UserRouter from "./routes/users";
import jwt from "jsonwebtoken";
const app = express();
const port = 3000;

// auth middleware
const checkAuth = async (req, res, next) => {
    console.log("request started");
    const auth = req.headers['authorization']
    const token = auth?.split(" ")?.[1];
    jwt.verify(token, 'verysecret', (err, data) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized" });
        }
    })

    const {id} = jwt.decode(token);

    const result = await query("select * from users where id = ?", [id]);

    if (!result || result.length === 0) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = result[0];

    delete req.user.password_hash

    next();
};

app.use(express.json());


app.use(express.json());
app.get(["/", "/home"], async (req, res) => {

    res.send({ "message": "Welcome to the API" });
    return;
});

app.use('/auth', AuthRouter);

app.use(checkAuth);

app.use("/profile", (req, res) => {

    return res.send({"user": req.user});
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});