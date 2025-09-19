import http from "http";
import fs from "fs/promises";
import { content } from "./main.js";
const PORT = 3000;
const cssContent = await fs.readFile("styles.css", "utf-8");
let users = await fs.readFile("users.json", "utf-8");
let parsedUsers = JSON.parse(users);

const server = http.createServer(async (req, res) => {
    console.log(req.url);
    const reg = new RegExp(/^\/users\/\d*$/);

    switch (req.method) {
        case "GET":
            switch (req.url) {
                case "/":
                    res.writeHead(200, { "Content-Type": "text/html" });
                    // Send the response body as 'Hello, World!'
                    res.end(content("menna"));
                    break;

                case "/styles.css":
                    res.writeHead(200, { "Content-Type": "text/css" });
                    res.end(cssContent);
                    break;

                case "/users":
                case "/users/":
                    res.writeHead(200, { "content-type": "application/json" });
                    res.end(users);
                    break;

                default:
                    if (reg.test(req.url)) {
                        const id = req.url.split('/')[2];
                        console.log("🚀 ~ id:", id)
                        const user = parsedUsers.find(u => u.id === parseInt(id))
                        if (!user) {
                            res.writeHead(404, { "content-type": "text/plain" })
                            res.end("NOT FOUND");
                            break;
                        }
                        res.writeHead(200, { "content-type": "application/json" })
                        res.end(JSON.stringify(user));
                        break;

                    }
                    res.writeHead(404);
                    res.end(`<h1 style="color='red'"> Error!</h1>`);
                    break;
            }
            break;

        case "POST":
            switch (req.url) {
                case "/users/":
                case "/users":
                    
                    let body = [];
                    req
                        .on("data", (chunk) => {
                            body.push(chunk);
                        })
                        .on("end", async () => {
                            try {
                                body = Buffer.concat(body).toString();
                                console.log("🚀 ~ body:", body);
                                const user = JSON.parse(body);

                                const latestId = parsedUsers.sort((user) => user.id - user.id).at(-1).id 
                                user.id = latestId ? latestId + 1 : 1;

                                parsedUsers.push(user);

                                await fs.writeFile(
                                    "./users.json",
                                    JSON.stringify(parsedUsers, null, 2)
                                );

                                res.writeHead(201, { "content-type": "application/json" });
                                res.end(JSON.stringify({
                                    'status': true,
                                    'message': "user added successfully"
                                }));
                            } catch (error) {
                                res.writeHead(400, { "content-type": "application/json" });
                                res.end(JSON.stringify({
                                    'status': false,
                                    'message': "Error"
                                }));
                            }
                        });

                    break;

                default:
                    break;
            }
            break;

        case "PUT": 
            if (reg.test(req.url)) {
                const id = req.url.split('/')[2];
                
                const user = parsedUsers.find(u => u.id === parseInt(id))
                if (!user) {
                    res.writeHead(404, { "content-type": "application/json" })
                    res.end(JSON.stringify({
                        'status': false,
                        'message': "user not found"
                    }));
                    break;
                }

                let body = [];
                req
                    .on("data", (chunk) => {
                        body.push(chunk);
                    })
                    .on("end", async () => {
                        try {
                            body = Buffer.concat(body).toString();

                            let user = JSON.parse(body);
                            
                            parsedUsers = parsedUsers.map(function (u) {
                                if (u.id === +id) {
                                    console.log(u, user)
                                    u.Name = user.Name;
                                }
                                return u;
                            });                            

                            await fs.writeFile(
                                "./users.json",
                                JSON.stringify(parsedUsers, null, 2)
                            );

                            res.writeHead(201, { "content-type": "application/json" });
                            res.end(JSON.stringify({
                                'status': true,
                                'message': "user updated successfully"
                            }));
                        } catch (error) {
                            res.writeHead(400, { "content-type": "application/json" });
                            res.end(JSON.stringify({
                                'status': false,
                                'message': "Error " + error.message
                            }));
                        }
                    });
                break;

            }
            res.writeHead(401, { "content-type": "application/json" });
            res.end(JSON.stringify({
                'status': false,
                'message': "invalid input"
            }));
            break;
        

        case "DELETE":
            if (reg.test(req.url)) {
                const id = req.url.split('/')[2];

                console.log("parsedUsers", parsedUsers)
                
                const user = parsedUsers.find(u => u.id === parseInt(id))
                if (!user) {
                    res.writeHead(404, { "content-type": "application/json" })
                    res.end(JSON.stringify({
                        'status': false,
                        'message': "user not found"
                    }));
                    break;
                }

                parsedUsers =  parsedUsers.filter(u => u.id !== parseInt(id));

                await fs.writeFile("./users.json", JSON.stringify(parsedUsers, null, 2));


                res.writeHead(200, { "content-type": "application/json" })
                res.end(JSON.stringify({
                    'status': true,
                    'message': "user deleted successfully"
                }));
                break;

            }
            res.writeHead(401, { "content-type": "application/json" });
            res.end(JSON.stringify({
                'status': false,
                'message': "invalid input"
            }));
            break;


        default:
            res.writeHead(404);
            res.end("invalid method");
            break;
    }
});


server.listen(PORT, "localhost", () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
