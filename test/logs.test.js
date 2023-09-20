import 'dotenv/config';
import request from 'supertest';
import { Server } from '../src/server/server.js';
const server = new Server();

import { db} from '../src/models/sequelize/index.js';
const { User, sequelize } = db;

import generateJWT from '../src/helpers/generateJWT.js';
import { createSpots } from '../src/helpers/setNumOfSpot.js';
let token;
let user;

beforeAll( async () => {
    await sequelize.sync({force: true});
    await createSpots();

    user = await User.create({
        name: 'Juan',
        email: 'juan@gmail.com',
        password : '1234',
        phone: '5678',
        role: 'ADMIN'
    });

    token = await generateJWT(user.id);
})

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

    test('debe manejar errores correctamente', async () => {
        // Simula un error pasando un valor incorrecto para 'offset'
        const {status, body } = await request(server.app)
        .get('/api/logs?offset=a')
        .set('x-token', token);

        expect(status).toBe(500); 
        expect(body.data.message).toEqual(
            expect.stringContaining('Cast to Number failed for value "a"')
        ); 
    });  
})