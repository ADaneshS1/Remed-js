import { useEffect, useReducer, useState } from "react";
import Table from 'react-bootstrap/Table';

function taskReducer(tasks, action) {
    switch (action.type) {
        case "added": {
            return [...tasks, {id: action.id, text: action.text, done:false}]
        }
        case "deleted": {
            return tasks.filter((t) => t.id !== action.id)
        }
        case "changed": {
            return tasks.map((t) => {
                if (t.id === action.task.id) {
                    return action.task
                } else {
                    return t;
                }
            })
        }
    }
}   

let nextId = 3;
const initialTasks = [
  { id: 0, text: "Mengunjungi Toko", done: true },
  { id: 1, text: "Mengunjungi Masjid", done: false },
  { id: 2, text: "Mengunjungi Warung", done: true },
];

const Pro = () => {
    const [tasks, dispatch] = useReducer(taskReducer, initialTasks)
    function handleAddTask(text) {
        dispatch({type:"added", id: nextId++, text: text})
    }
    function handleChange(text) {
        dispatch({type:"changed", text:text})
    }
    function handleDelete(taskId) {
        dispatch({type:"deleted", id:taskId})
    }

    return (
        <>
            <h1 className="mt-5">Jadwal Kegiatan Harian</h1>
            <AddTask onAddTask={handleAddTask}/>
            <div className="justify-content-center py-5 flex-col">
                <Table striped bordered>
                    <thead>
                        <tr>
                            <th>Check</th>
                            <th>Kegiatan</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TaskList tasks={tasks} onChangeTask={handleChange} onDeleteTask={handleDelete}/>             
                    </tbody>
                </Table>
            </div>
        </>
    )
}

const AddTask = ({onAddTask}) => {
    const [text, setText] = useState("")

    return (
        <div className="d-flex justify-content-center gap-2 mt-4">
            <input className="p-2 my-8" style={{border:"2px solid black", width:"70%"}} value={text} onChange={(e) => setText(e.target.value)} placeholder="Add task"></input>
            <button onClick={() => {setText(""); onAddTask(text);}}>Tambah Kegiatan</button>
        </div>
    )
}

const TaskList = ({tasks, onChangeTask, onDeleteTask}) => {
    return (
        <>
            {tasks.map((task) => (
                <>
                    <tr key={task.id}>
                        <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask}/>
                    </tr>
                </>
            ))}
        </>
    )
}

const Task = ({task, onChange, onDelete}) => {

    const url = "https://api.npoint.io/3c26ff950ba8288fc00d";
    const [user, setUser] = useState([])
    const getDataUser = async () => {
        const response = await fetch(url);
        const dataUser = await response.json()
        setUser(dataUser)
    }

    useEffect(() => {
        getDataUser()
    }, [])

    const [isEditing, setIsEditing] = useState(false)
    let taskContent;

    if (isEditing) {taskContent = (
        <div className="d-flex justify-content-center">
            <td>
                <input style={{padding:"3px 2px", border:"2px solid black"}} value={user} onChange={(e) => setUser(e.target.value)} onKeyDown={(e) => getDataUser(user)}/>
            </td>
            <td>
                <button onClick={() => setIsEditing(false)}>Save</button>
            </td>
        </div>
    )} else {
        taskContent = (
            <div className="d-flex justify-content-evenly gap-5" style={{alignItems:"center"}}>

                <tr>
                   
                   <td>
                        {user.map((use) => (
                            <Tableff id={use.id} done={use.done} text={use.text} userId={use.userId}/>
                        ))}   
                   </td>

                    <td>
                        <button style={{margin:"0px 5%", padding:"2px 5px", backgroundColor:"blue", color:"white"}} onClick={() => setIsEditing(true)}>Edit</button>
                    </td>

                </tr>

            </div>
        )
    }

    return (
        <>
            <td>
                <input type="checkbox" checked={task.done} onChange={(e) => setUser(e.target.value)} onKeyDown={(e) => getDataUser(user)}/>
            </td>
            
            <td style={{textAlign:"center"}}>
                {taskContent}
            </td>

            <td>
                <button style={{padding:"2px 5px", backgroundColor:"red", color:"white"}} onClick={() => onDelete(task.id)}>Delete</button>
            </td>
        </>
    )
}

const Tableff = (props) => {
    return (
        <tbody>
            <td style={{textAlign:"start"}}>{props.text}</td>
        </tbody>
    )
}

export default Pro