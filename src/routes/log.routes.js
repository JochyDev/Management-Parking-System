import { Router } from 'express';
import { checkLogsActivity } from '../controllers/index.js';

const app = Router();

app.get('/', checkLogsActivity)


export default app;
