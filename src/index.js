import 'dotenv/config';

import { Server } from './server/server.js';

export const server = new Server();

server.listen();