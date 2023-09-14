import request from 'supertest';
import { Server } from '../src/server/server.js';
const server = new Server();
const app = server.app;

describe('Reserve a Parking Spot', () => {
    test('POST /api/reservation --> reservation details', async () => {
        const response = await request(app).post('/api/reservations').send({
            UserId: '1',
            startDateTime: new Date(), 
            startEndTime: new Date() 
        })
        
        expect(response.status).toEqual(200);
        expect(response.headers['content-type']).toEqual(
            expect.stringContaining('json')
        )
        expect(response.body.data).toEqual(expect.objectContaining({
            id: expect.any(Number),
            startDateTime: expect.any(String), 
            endDateTime: expect.any(String),
            status: expect.any(String),
            SpotId: expect.any(Number),
            UserId: expect.any(String)
          }));
    })
})