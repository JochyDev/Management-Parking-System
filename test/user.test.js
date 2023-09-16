import request from 'supertest';
import 'dotenv/config';

import { Server } from '../src/server/server.js';
const server = new Server();
const app = server.app;

import generateJWT from '../src/helpers/generateJWT.js';
const token = await generateJWT('1');


describe('Update User information', () => {
    test('PUT /api/user/:id --> user details' , async () => {
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

    test('PUT /api/user/:id --> user not found', async () => {
        const { status, body } = await request(app)
        .put('/api/users/9999999')
        .set('x-token', token)
        .send({
            name: 'Jose Luis',
            email: 'jose@gmail.com',
            phone: '76845672'
        })

        expect(status).toEqual(400)
        expect(body.data).toEqual(
            expect.stringContaining("User was not found")
        )

    })
})

