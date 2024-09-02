const { Pool } = require("pg");


const pool = new Pool(
    {
      // Enter PostgreSQL username
      user: "",
      // Enter PostgreSQL password
      password: "",
      host: "127.0.0.1",
      database: "employeetracker_dp",
    },
    console.log("Connected to the employeetracker_db database!")
  );

  module.exports = pool
