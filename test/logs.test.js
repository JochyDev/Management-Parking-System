import request from 'supertest';
import { Server } from '../src/server/server.js';
const server = new Server();

import generateJWT from '../src/helpers/generateJWT.js';
const token = await generateJWT('1');


describe('Access the parking logs', () => {
    test('GET /api/logs --> Parking Logs History', async () => {
        const {status, headers, body} = await request(server.app)
        .get('/api/logs')
        .set('x-token', token)

        expect(status).toEqual(200);
        expect(headers['content-type']).toEqual(
            expect.stringContaining('json')
        )
        

    })
})