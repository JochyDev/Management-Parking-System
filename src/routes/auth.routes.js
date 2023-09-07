import { Router } from 'express';
import { login } from '../controllers/index.js';

export const authRouter = Router();

authRouter.post('/login', login);


