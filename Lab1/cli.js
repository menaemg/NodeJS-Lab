import fs from "fs/promises";
const [, , action] = process.argv;
const data = await fs.readFile("./users.json", "utf-8");
let parsedData = JSON.parse(data);

if (!Array.isArray(parsedData)) {
    parsedData = [parsedData]
}


function getOne() {
    const [,,, id] = process.argv;
    let user = parsedData.find((user)=> user.id === parseInt(id))

    console.log(user ?? "not user exists");
}

async function add() {
    try {
        const [,,, user] = process.argv;
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

async function remove() {
    try {
        const [,,, id] = process.argv;
        parsedData = parsedData.filter(user => user.id != id);
    
        await fs.writeFile("./users.json", JSON.stringify(parsedData, null, 2));

        console.log("success");
    } catch (error) {
        console.log("Error")
    }
}

async function edit() {
    try {
        const [,,, id, username] = process.argv;
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

switch (action) {
    case 'getone':
        getOne()
        break;

    case 'add':
        add();
        break;

    case "getall":
        getAll();
        break;

    case "remove":
        remove();
        break;

    case "edit":
        edit();
        break;
    
    default:
        break;
}







