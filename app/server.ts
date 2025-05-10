import {config} from 'dotenv';
config();

import {Request, Response} from 'express';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './user/user.routes';
import bookRoutes from './book/book.routes';

const connectionString = process.env.DATABASE_URL;
const app = express();

app.use(cors());
app.use(express.json());


import { authenticateToken } from './auth.middleware';

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

// Aplicar middleware de autenticación a rutas protegidas
app.use('/api/protected', authenticateToken);

function routeNotFound(request: Request, response: Response) {
  response.status(404).json({
    message: "Route not found.",
  });
}

mongoose.connect(connectionString as string)
.then((success: any) => app.listen(8080, () => console.log('Server is running on port 8080')))
.catch((error: any) => console.log(error.message));
