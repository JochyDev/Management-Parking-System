import { Router } from 'express';
import { getUsers, createUser } from '../controllers/index.js';

export const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.post('/', createUser);

// userRouter.put('/:id', updateUser);

// userRouter.delete('/:id', deleteUser);

