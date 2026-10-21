import { useEffect, useState } from "react";
import axios from 'axios';
import { MdModeEditOutline } from "react-icons/md";
import { MdOutlineDone } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

function App() {

  const [newTodo , setNewtodo] = useState("");
  const [todos , setTodos] = useState([]);
  const [editingTodo , setEditingTodo] = useState(null);
  const [editedText , setEditedText] = useState("");

const addTodo = async (e)=>{
       e.preventDefault();
       if(!newTodo.trim()) return;

       try{
        const response = await axios.post('/api/todos',{
          text:newTodo});
         
          setTodos([...todos , response.data])
          setNewtodo('');
          
       }catch(err){
           console.log("something went wrong")
       }
}

 const fetchTodos = async()=> {
     
  try{
         const response = await axios.get("/api/todos");
         setTodos(response.data);
  }
  catch(err){
      console.log(err);
  }
 }

 useEffect(()=>{
  fetchTodos();
 }, [])

 const startEditing = (todo) =>{
     
  setEditingTodo(todo._id)
  setEditedText(todo.text)
 }

 const saveEdit = async(id)=>{
        try{
         const response = await axios.patch(`/api/todos/${id}`,{
          text:editedText
         })
         setTodos(todos.map((todo)=>(todo._id === id ? response.data:todo)))
         setEditingTodo(null);
        }catch(err){
              console.log("error",err)
        }
 }
 const deleteTodo = async (id) => {
  try{
    await axios.delete(`/api/todos/${id}`);
    setTodos(todos.filter((todo) => todo._id !== id))
  }catch(err){
           console.log(err)
  }
 }

const toggleTodo = async (id)=>{
  try{
        const todo = todos.find((t)=> t._id === id)
        const response = await axios.patch(`/api/todos/${id}`,
          {completed: !todo.completed}
        )
        setTodos(todos.map((t) => t._id === id ?
      response.data : t))
  }catch(err){
    console.log(err);
  }
}

  return (
    <div className='min-h-screen bg-linear-to-br from-yellow-50 to-yellow-300 flex items-center justify-center   p-4'>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
     <div> <h1 className="text-4xl font-bold text-gray-800 mb-8 flex justify-center text-center"> Task Manager</h1></div>

<form onSubmit={addTodo} className="flex shadow-sm shadow-mist-800 border-2 border-gray-500 rounded-2xl p-2">
  <input className="flex-1 outline-none px-3 py-2 text-gray-700"
  type="text" value={newTodo} onChange={(e)=> setNewtodo(e.target.value)} placeholder="SET A GOAL!" required
  />
  <button type="submit" className="bg-yellow-300 text-black hover:bg-amber-500 hover:text-white px-3 py-2 rounded-xl cursor-pointer">Add Task</button>
</form>

<div className="mt-3">
      {
      todos.length === 0 ? (<div></div>) 
      :
      (
        <div className="flex-col gap-4"> {todos.map((todo)=>(
        <div key={todo._id}>{
          editingTodo === todo._id ? 
          (
            <div className="flex items-center gap-x-3">
              <input className="flex-1 rounded-lg border p-2 mt-2 border-gray-600 outline-none focus:ring-2 focus:ring-amber-300 text-gray-700 shadow-inner" type="text" value={editedText} onChange={(e)=> setEditedText(e.target.value)}></input>
             <div className="flex gap-x-2">
              <button onClick={()=> saveEdit(todo._id)} className="px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-600 cursor-pointer"><MdOutlineDone/></button>
              <button className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-600 cursor-pointer" onClick={()=> setEditingTodo(null)}><IoClose/></button>
             </div>
            </div>) : 
          ( 
          <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-4 overflow-hidden">   
           <button onClick={()=>toggleTodo(todo._id)}
  type="button"
  className={` shrink-0 h-6 w-6 border rounded-full flex items-center justify-center ${
    todo.completed
      ? "bg-green-500 border-green-500 text-white"
      : "bg-white border-gray-300 hover:border-gray-500"
  }`}
>
  {todo.completed && <MdOutlineDone />}
</button>
            <span className="text-grey-800 font-medium truncate">{todo.text}</span></div>
            <div>
              <button className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 duration-200" onClick={()=>{startEditing(todo)}}><MdModeEditOutline/></button>
              <button className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 duration-200" onClick={()=>deleteTodo(todo._id)}><FaTrash/></button>
            </div>
          </div>
        )
        }</div>))
          }</div>
        )
          }
        </div>

</div>
    </div>
  )
}

export default App
