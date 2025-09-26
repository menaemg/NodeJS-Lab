import express from "express";
import query from "../data/db-connection.js";
import jwt from "jsonwebtoken";
import joi from "joi";
import bcrypt from "bcrypt";



const router = express.Router();

const registerSchema = joi.object({
    name: joi.string().min(2).max(100).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    age: joi.number().integer().min(13).max(120).required()
});

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});

router.post("/register", async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        });
    }    
    
    let { name, password, email, age } = req.body;

    let oldEmail = await query("select * from users where email =?", [email]); 

    if (oldEmail.length) {
        return res.status(409).json({
            error: "email already exists"
        });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
        "insert into users (name, password_hash, email, age) values(?, ?, ?, ?)",
        [name, hashedPassword, email, age]
    );

    if (!result || result.affectedRows === 0) {
        return res.status(500).send({ error: "server error" });
    } 

    console.log("🚀 ~ result:", result);

    res.status(201).send({ "message": "created", 
        "user": {
            "name": name,
            "email": email,
            "age": age
        }
    });
});



router.post("/login", async (req, res) => {

    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        });
    }    
    

    let { email, password } = req.body;

    const user = await query("select * from users where email = ?", [email]);

    if (!user || user.length === 0) {
        res.status(400).send({ error: "bad creds" });
        return;
    }

    const compare = await bcrypt.compare(password, user[0].password_hash);

    let id = user[0].id

    if (compare) {
        const token = jwt.sign({ id, email }, "verysecret", { expiresIn: "1h" });
        console.log("🚀 ~ token:", token);
        res.send({ token });
        return;
    }
    
    res.status(401).send({ error: "Unauthorized" });
    return;
});

export default router;
