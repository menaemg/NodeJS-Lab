import { Command } from "commander";
const program = new Command();
import fs from "fs/promises";
const data = await fs.readFile("./users.json", "utf-8");
let parsedData = JSON.parse(data);

if (!Array.isArray(parsedData)) {
    parsedData = [parsedData]
}

program
    .option("-a, --action [string]", "specify action")
    .option("-i, --id [number]", "specify id")
    .option("-n, --name [string]", "specify name")
    .action(({ action, id, name  }) => {
        switch (action) {
            case 'getone':
                getOne(id)
                break;

            case 'add':
                add(name);
                break;

            case "getall":
                getAll();
                break;

            case "remove":
                remove(id);
                break;

            case "edit":
                edit(id, name);
                break;
            
            default:
                console.log("invalid action");
                break;
        }
    });


program.parse();

function getOne(id) {
    let user = parsedData.find((user)=> user.id === parseInt(id))

    console.log(user ?? "not user exists");
}

async function add(user) {
    try {
        const latestId = parsedData.sort((user) => user.id - user.id).at(-1).id 
        const newId = latestId ? latestId + 1 : 1;
        let newUser = {
            "id" : newId,
            "Name" : user
        }

        parsedData.push(newUser);

        await fs.writeFile("./users.json", JSON.stringify(parsedData, null, 2));

        console.log('success');

    } catch (error) {
        console.log("Error")
    }
}

function getAll() {
    console.log(parsedData);
}

async function remove(id) {
    try {
        parsedData = parsedData.filter(user => user.id != id);
    
        await fs.writeFile("./users.json", JSON.stringify(parsedData, null, 2));

        console.log("success");
    } catch (error) {
        console.log("Error")
    }
}

async function edit(id, username) {
    try {
        parsedData = parsedData.map(function (user) {
            if (user.id === +id) {
                user.Name = username;
            }
            return user;
        });
    
        await fs.writeFile("./users.json", JSON.stringify(parsedData, null, 2));

        console.log("success");
    } catch (error) {
        console.log("Error")
    }
}

