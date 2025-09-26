import mysql from "mysql2/promise";

const query = async (query, params = []) => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "local",
      database: "node_db",
      password: "password",
    });

    const [results, fields] = await connection.execute(query, params);

    console.log(results); 
    console.log(fields);
    return results;
  } catch (err) {
    console.log(err);
  }
};

export default query;
