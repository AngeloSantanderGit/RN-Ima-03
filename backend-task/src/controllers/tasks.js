import {connect} from '../database.js'


export const getTasks = async (req, res) => {
    const connection = await connect();
    const[rows] = await connection.query('SELECT * FROM tasks')
    //console.log(rows)
    // res.send("hi world")
    res.json(rows)
}

export const getTask = async (req, res) => {
    const connection = await connect();
    const [rows] = await connection.query('SELECT * FROM tasks WHERE id = ?', [
        req.params.id,
    ]);
    res.json(rows[0])
    // console.log(rows[0]);
    // res.send("hi world 2")
}

export const getTaskCount = async (req, res) => {
    const connection = await connect()
    const [rows] = await connection.query("SELECT COUNT(*) FROM tasks")
    res.json(rows[0]["COUNT(*)"])
}

export const saveTask = async (req, res) => {
    const connection = await connect();
    const [results] = await connection.query(
        "INSERT INTO tasks(title, description) VALUES (?,?)", [
        req.body.title, 
        req.body.description        
    ])
    res.json({
        id: results.insertId,
        ...req.body,
    })
}

export const deleteTask = async (req, res) => {
    const connection = await connect()
    await connection.query("DELETE FROM tasks WHERE id = ?", [
        req.params.id,
    ])
    res.sendStatus(204)
}

export const updateTask = async (req, res) => {
    const connection = await connect()
    await connection.query("UPDATE tasks SET ? WHERE id = ?", [
        req.body,
        req.params.id,
    ])
    res.sendStatus(204)
}






























































































































































