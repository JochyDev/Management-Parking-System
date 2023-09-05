import { Router } from 'express';
import { getUsers } from '../controllers/index.js';

const router = Router();

router.get('/', getUsers);

export default router;