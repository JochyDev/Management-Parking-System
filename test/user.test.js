import 'dotenv/config';
import request from 'supertest';
import { Server } from '../src/server/server.js';
const server = new Server();

import { db} from '../src/models/sequelize/index.js';
const { User, sequelize } = db;

import generateJWT from '../src/helpers/generateJWT.js';
let user;
let token; 

describe('Update User information', () => {

    beforeAll( async () => {
        await sequelize.sync({force: true})
        
        user = await User.create({
            name: 'Juan',
            email: 'juan@gmail.com',
            password : '1234',
            phone: '5678',
            role: 'ADMIN'
        });

        token = await generateJWT(user.id);
    })

    test('PUT /api/user/:id --> user details' , async () => {
        const { status, headers, body } = await request(server.app)
        .put(`/api/users/${user.id}`)
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
                id: user.id,
                name: 'Jose Luis', 
                email: 'jose@gmail.com',
                phone: '76845672',
                password: expect.any(String),
                role: expect.any(String)
            })
        )
    }) 

    test('PUT /api/user/:id --> user not found', async () => {
        const { status, body } = await request(server.app)
        .put('/api/users/9999999')
        .set('x-token', token)
        .send({
            name: 'Jose Luis',
            email: 'jose@gmail.com',
            phone: '76845672'
        })

        expect(status).toEqual(400)
        expect(body.data.errors).toBeTruthy()
        expect(body.data.errors[0].msg).toEqual(
            expect.stringContaining("User with id=9999999 dosen't exist!")
        )

    })

    afterAll( async () => {
        await sequelize.close();
    })
})

