import request from 'supertest';
import 'dotenv/config';

import { Server } from '../src/server/server.js';
const server = new Server();
const app = server.app;

import generateJWT from '../src/helpers/generateJWT.js';

const token = await generateJWT('1');

describe('Reserve a Parking Spot', () => {
    test('POST /api/reservation --> reservation details', async () => {
        const {status, headers, body} = await request(app)
        .post('/api/reservations')
        .set('x-token', token)
        .send({
            startDateTime: new Date(), 
            endDateTime: new Date() 
        });
        
        expect(status).toEqual(200);
        expect(headers['content-type']).toEqual(
            expect.stringContaining('json')
        )
        expect(body.data).toEqual(expect.objectContaining({
            id: expect.any(Number),
            startDateTime: expect.any(String), 
            endDateTime: expect.any(String),
            status: expect.any(String),
            SpotId: expect.any(Number),
            UserId: expect.any(Number)
          }));
    })

    test('POST /api/reservations --> startDatetime and endDateTime are requireds!!!', async () => {
        const {status, body} = await request(app)
        .post('/api/reservations')
        .set('x-token', token)
        .send({})

        expect(status).toEqual(400),
        expect(body.data.errors).toBeTruthy();
    })
})