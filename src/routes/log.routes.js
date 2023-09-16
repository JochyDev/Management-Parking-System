import { Router } from 'express';
import { getActivityLogs } from '../controllers/index.js';

const app = Router();

app.get('/', getActivityLogs)


export default app;
