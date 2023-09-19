import 'dotenv/config';
import request from 'supertest';
import { Server } from '../src/server/server.js';
const server = new Server();

import generateJWT from '../src/helpers/generateJWT.js';
const token = await generateJWT('3c20f41b-ba91-42a9-afcb-c32df561636d');


describe('Access the parking logs', () => {
    test('GET /api/logs --> Parking Logs History', async () => {
        const {status, headers, body} = await request(server.app)
        .get('/api/logs')
        .set('x-token', token)

        expect(status).toEqual(200);
        expect(headers['content-type']).toEqual(
            expect.stringContaining('json')
        )
        expect(body.data.total).toEqual(
            expect.any(Number)
        )
        expect(body.data.logs).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    _id: expect.any(String),
                    user: expect.any(String),
                    action: expect.any(String),
                    dateTime: expect.any(String)
                })
            ])
        ) 
    })
})