import express from 'express';
import dotenv from 'dotenv';
import todoRoutes from "./routes/todo.route.js"
import { connectDB } from './config/db.js';
import path from "path";
const PORT = proscess.env.PORT || 5000;


const app = express();
dotenv.config();

app.use(express.json());

// app.get('/',(req,res)=>{
//     res.send("server is ready")
// })

app.use('/api/todos', todoRoutes)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist","index.html"))
    })
}


app.listen(5000,()=>{
    connectDB();
    console.log("Server running at 5000")
})