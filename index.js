// dependece here
import express from 'express'
import myslq2 from 'mysql2'
import bodyParser from 'body-parser'
import multer from 'multer'
import path from 'path'
import cros from 'cors'
import { domainToASCII } from 'url'


// serve file


// Storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./upload/students-img")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + req.body.name + path.extname(file.originalname))
    }

})





// upload file

const upload = multer({ storage })

const cout = console.log

// confing herre
const app = express()
const port = 3000
app.use(cros())
// app.use(bodyParser.json())

app.use("/imgs", express.static("./upload/students-img"))


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

// app.post("/file-upload", upload.single("file"), (req, res) => {
//     cout('file', req.file)
//     cout("req.body: ", req.body)
//     res.status(201).json({
//         mgs: "file upload seccussfuly",
//         file: req.file,
//         body: req.body
//     })
// })


// file serve


// login

app.post("/login", bodyParser.json(), (req, res) => {
    const { email, password, username } = req.body
    cout("body: ", req.body)
    const sql = `select * from users where (email = ? or name = ?) and password = ?`
    conection.execute(sql, [username, email, password], (err, user) => {
        cout("users: ", user)
        if (err) {
            cout("eorror: ", err)
        }
        if (user.length > 0) {
            const token = {
                username: user[0].name,
                email: user[0].email,
                hidenkey: `${username} + ${email} + devlove by monjurul Islam`
            }
            cout("token: ", token)
            res.status(200).json({ mgs: "Log in successfuly", ok: true, token })
        } else {
            cout("else user: ", user)
            res.status(401).json({ mgs: "Invalited user and password" })
        }
    })
})

// teacher route here
// show teacher
app.get("/api/teachers", (req, res) => {
    conection.execute(SelectTable('teachers'), (err, teacherTable) => {
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

// Students route here
// add students
app.post("/api/students", upload.single("file"), (req, res) => {
    const file = req.file
    const body = req.body
    cout("body: ", body, "file: ", file)
    const sql = `
      INSERT INTO students 
      (firstName, lastName, dob, gender, bloodGroup, nationality, category, religion, email, phone, address, admissionNo, joiningDate, rollNo) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const student = Object.values(req.body)
    conection.execute(sql, student, (err, student) => {
        if (err) {
            cout("student do not add server error: ", err)
            res.status(500).json({ messeage: "internal server error" })
        } else {
            cout("student added suceccessfuly: ", student)
            res.status(201).json({ ok: true, messeage: "Student added successfuly", student })
        }
    })
})

// show studens
app.get("/api/students", (req, res) => {
    const sql = SelectTable('students')
    conection.execute(sql, (err, students) => {
        if (err) {
            cout("students view error: ", students)
        } else {
            cout("show all students: ", students)
            res.status(200).json({ messeage: "all students here", students })
        }
    })
})

// academic section

// class list add

app.post("/api/classes", bodyParser.json(), (req, res) => {
    const sql = `insert into class_list (class_name, section)
    value(?, ?)
    `
    const { classname, section } = req.body
    InsertData(sql, [classname, section], res)

})
// class list show
app.get("/api/classes", (req, res) => {
    GetData(res, "class_list")
})

// section add
app.post("/api/sections", bodyParser.json(), (req, res) => {
    const sql = `insert into section_list (section_name) value (?)`
    const { sectionname } = req.body
    InsertData(sql, [sectionname], res)
})

// show section
app.get("/api/sections", (req, res) => {
    GetData(res, "section_list")
})

// assign teacher add
app.post("/api/assignTeachers", bodyParser.json(), (req, res) => {
    const sql = `insert into assign_teacher (class_name, section_name, teacher_name) value(?, ?, ?)`
    const { classname, sectionname, teachername } = req.body
    InsertData(sql, [classname, sectionname, teachername], res)
})

// show assign teacher
app.get("/api/assignTeachers", (req, res) => {
    GetData(res, "assign_teacher")
})




// attendence 
app.post("/api/attendance", bodyParser.json() ,(req, res) => {
    const sql = `
  INSERT INTO student_attendance 
  (admission_no, roll_no, name, date, attendance, entry_time, exit_time, note) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    const {admissionNo, rollNo, name, data, attendance, entryTime, exitTime, note} = req.body
    InsertData(sql, [admissionNo, rollNo, name, data, attendance, entryTime, exitTime, note], res)
})

// server start here
app.listen(port, (err) => {
    if (err) {
        console.log(err);

    }
    console.log(`server start on :http://localhost:${3000}/ `);

})



// function 

function SelectTable(tableName) {
    return `select * from ${tableName}`
}

// get all data from database
function GetData(res, table) {
    const sql = SelectTable(table)
    conection.execute(sql, (err, result) => {
        if (err) {
            cout("error: ", err)
        } else {
            cout("table: ", table)
            res.status(200).json({
                mgs: "all data recive",
                ok: true,
                data: result
            })
        }
    })
}


// insert data into database

function InsertData(insertSql, insertValue, res) {
    conection.execute(insertSql, insertValue, (err, result) => {
        if (err) {
            cout("error: ", err)
        } else {
            cout("result: ", result)
            res.status(201).json({
                mgs: "Data added successfuly",
                ok: true,
            })
        }

    })
}
