import mysql from 'mysql'

const con = mysql.createConnection({
    host: "localhost",
    port: "8889",
    user: "root",
    password: "root",
    database: "employeems"
})

con.connect(function (err) {
    if (err) {
        console.log("Connection error")
    } else {
        console.log("Connect")
    }
})

export default con;