// dependece here
import express from 'express'
import myslq2 from 'mysql2'
import bodyParser from 'body-parser'


const cout = console.log

// confing herre
const app = express()
const port = 3000
app.use(bodyParser.json())

// db confign herer
const conection = myslq2.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    database: "nodedatabse"
})

conection.execute(`create table if not exists users(
    id varchar(20),
    name varchar(200),
    email varchar(200)
    )`, (err, result) => {
    if (err) {
        console.log(err);

    } else {
        console.log("table create sucseefuly", result);

    }
})

// routeing here
app.get("/", (req, res) => {
    conection.execute(`insert into users(id, name, email) values("01839", "Monjurul Islam", "shekhmonjurul@gmail.com")`, (err, result) => {
        if (err) {
            console.log("error: ", err);

        } else {
            console.log("data insert secusseccfuly: ", result);
            res.json(result)

        }
    })
})


// teacher route here
// show teacher
app.get("/api/teachers", (req, res) => {
    conection.execute(`select * from teachers`, (err, teacherTable) => {
        if (err) {
            cout("error: ", err)
        } else {
            res.status(200).json({ status: 200, messeage: "all teacher recive successecfuly", data: teacherTable })
        }
    })
})

// add teacher
app.post("/api/teachers", (req, res) => {
    const sql = `
INSERT INTO teachers 
(firstName, lastName, Department, Qualification, Type, dob, gender, maritalStatus, bloodGroup, phone, email, address, city, state, pinCode, country, photos, employeeStatus) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
    const teacher = Object.values(req.body)
    cout("teacher: ", teacher)

    // const values =[] 
    conection.execute(sql, teacher, (err, teacher) => {
        if (err) {
            cout("error: ", err)
        } else {
            cout("teacher add seccessfully ❤️ ", teacher)
            res.status(201).json({ status: 201, messeage: "Teacher add seccessfuly", teacher: teacher })
        }
    })
})

app.get("/users", (req, res) => {
    conection.execute("select * from users", (err, recrod) => {
        if (err) {
            console.log("recrod error: ", err);

        } else {
            console.log("recrod here: ", recrod);
            res.json(recrod)
        }
    })
})

// server start here
app.listen(port, (err) => {
    if (err) {
        console.log(err);

    }
    console.log(`server start on :http://localhost:${3000}/ `);

})