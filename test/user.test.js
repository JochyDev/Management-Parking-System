import request from 'supertest';
import 'dotenv/config';

import { Server } from '../src/server/server.js';
const server = new Server();
const app = server.app;

import generateJWT from '../src/helpers/generateJWT.js';
const token = await generateJWT('1');


describe('Update User information', () => {
    test('PUT /api/user/:id', async () => {
        const { status, headers, body } = await request(app)
        .put('/api/users/1')
        .set('x-token', token)
        .send({
            name: 'Jose Luis',
            email: 'jose@gmail.com',
            phone: '76845672'
        })

        expect(status).toEqual(200);
        expect(headers['content-type']).toEqual(
            expect.stringContaining('json')
        )
        expect(body.data).toEqual(
            expect.objectContaining({
                id: 1,
                name: 'Jose Luis', 
                email: 'jose@gmail.com',
                phone: '76845672',
                password: expect.any(String),
                role: expect.any(String)
            })
        )
    }) 
})

