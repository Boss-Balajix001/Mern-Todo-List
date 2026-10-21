
import express from 'express';
import dotenv from 'dotenv';
import todoRoutes from './routes/todo.route.js';
import { connectDB } from './config/db.js';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

app.use('/api/todos', todoRoutes);

if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../frontend/Boss_Todo/dist');

    app.use(express.static(frontendPath));

    app.get('/{*splat}', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}

app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`Server running on port ${PORT}`);
    } catch (error) {
        console.error('Database connection failed:', error);
    }
});
