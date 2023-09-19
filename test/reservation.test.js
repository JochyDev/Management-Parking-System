import 'dotenv/config';
import request from 'supertest';
import { Server } from '../src/server/server.js';
const server = new Server();

import generateJWT from '../src/helpers/generateJWT.js';
const token = await generateJWT('3c20f41b-ba91-42a9-afcb-c32df561636d');

describe('Reserve a Parking Spot', () => {
    test('POST /api/reservation --> reservation details', async () => {
        const {status, headers, body} = await request(server.app)
        .post('/api/reservations')
        .set('x-token', token)
        .send({
            startDateTime: new Date(), 
            endDateTime: new Date(),
            carDetails: {
                "brand": "toyota",
                "modelo": "corolla-2006",
                "chapa": "pkg5467"
            }
        });
        
        expect(status).toEqual(200);
        expect(headers['content-type']).toEqual(
            expect.stringContaining('json')
        )
        expect(body.data).toEqual(expect.objectContaining({
            id: expect.any(String),
            startDateTime: expect.any(String), 
            endDateTime: expect.any(String),
            carDetails: expect.any(Object),
            status: expect.any(String),
            SpotId: expect.any(String),
            UserId: expect.any(String)
          }));
    })

    test('POST /api/reservations --> startDatetime and endDateTime are requireds!!!', async () => {
        const {status, body} = await request(server.app)
        .post('/api/reservations')
        .set('x-token', token)
        .send({})

        expect(status).toEqual(400),
        expect(body.data.errors).toBeTruthy();
    })
})

describe('Get currect occupancy of Parking', () => {
    test('GET /api/reservations --> occupancy details', async () => {
        const {status, body } = await request(server.app)
        .get('/api/reservations')
        .set('x-token', token);

        expect(status).toEqual(200);
        expect(body.data).toEqual(
            expect.objectContaining({
                totalSpots: expect.any(Number),
                occupiedSpot: expect.any(Number),
                availableSpots: expect.any(Number),
                occupationPercentage: expect.any(String)
            })
        )

    })
})



