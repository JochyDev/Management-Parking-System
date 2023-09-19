import { Router } from 'express';
import { getActivityLogs } from '../controllers/index.js';
import { validateFields } from '../middlewares/validateFields.js';
import { validateJWT } from '../middlewares/validateJWT.js';
import { hasRole } from '../middlewares/validateRoles.js';

const app = Router();

app.get('/', [
    validateJWT,
    hasRole('ADMIN', 'EMPLOYEE'),
    validateFields
], getActivityLogs)


export default app;
