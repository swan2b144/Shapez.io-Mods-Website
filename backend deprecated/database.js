const mysql = require("mysql");

module.exports = {
    getConnection: () => {
        let connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "modloader_web",
        });
        connection.connect();
        return connection;
    },
};