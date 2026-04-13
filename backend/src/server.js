import express from 'express';
import tasksRouter from './routes/tasksRouter.js';
import { connectDB } from './config/db.js';
import dns from 'dns';
import dotenv from 'dotenv'; 
import cors from 'cors';
dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors({origin:["http://localhost:5173"]}));
app.use('/api/tasks', tasksRouter);
connectDB().then (()=> {
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
})


