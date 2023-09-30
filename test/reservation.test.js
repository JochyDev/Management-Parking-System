import 'dotenv/config';
import request from 'supertest';
import { Server } from '../src/server/server.js';
const server = new Server();

import { db } from '../src/models/sequelize/index.js';
const { User, Reservation, sequelize, Spot } = db;


import generateJWT from '../src/helpers/generateJWT.js';
let user;
let token;

import { createSpots } from '../src/helpers/setNumOfSpot.js'

beforeEach( async () => {
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

    const spot = await Spot.findOne();

        await Reservation.create({
            startDateTime: new Date(Date.now() - 5 * 60 * 1000),
            endDateTime: new Date('2025'),
            carDetails: {
                brand: 'Toyoya',
                model: 'Corolla',
                plate: 'gr412as'
            },
            UserId: user.id,
            SpotId: spot.id,
        })
})

describe('Reserve a Parking Spot', () => {

    test('POST /api/reservation --> reservation details', async () => {
        const {status, headers, body} = await request(server.app)
        .post('/api/reservations')
        .set('x-token', token)
        .send({
            startDateTime: new Date('2025'), 
            endDateTime: new Date('2025'),
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

    test('POST /api/reservations --> 401 Unauthorized', async () => {
        const {status, body} = await request(server.app)
        .post('/api/reservations')
        .send({
            startDateTime: new Date(), 
            endDateTime: new Date(),
            carDetails: {
                "brand": "toyota",
                "modelo": "corolla-2006",
                "chapa": "pkg5467"
            }
        })

        expect(status).toEqual(401),
        expect(body.data).toEqual(
            expect.stringContaining("There isn't token")
        )
    })

    test('POST /api/reservations --> Reservation in past', async () => {
        const {status, body} = await request(server.app)
        .post('/api/reservations')
        .set('x-token', token)
        .send({
            startDateTime: new Date('2020'), 
            endDateTime: new Date(),
            carDetails: {
                "brand": "toyota",
                "modelo": "corolla-2006",
                "chapa": "pkg5467"
            }
        })

        expect(status).toEqual(400)
        expect(body.data).toEqual(
            expect.stringContaining("Cannot create a reservation in past")
        )
    })

    test('POST /api/reservations --> endDateTime always have to be after startDateTime', async () => {
        const {status, body} = await request(server.app)
        .post('/api/reservations')
        .set('x-token', token)
        .send({
            startDateTime: new Date('2025'), 
            endDateTime: new Date('2024'),
            carDetails: {
                "brand": "toyota",
                "modelo": "corolla-2006",
                "chapa": "pkg5467"
            }
        })

        expect(status).toEqual(400)
        expect(body.data).toEqual(
            expect.stringContaining('endDateTime always have to be after startDateTime')
        )
    })

    test('POST /api/reservations --> overlaping reservation', async() => {

        const totalSpots = await Spot.count();

        await Reservation.destroy({
            where: {},
            truncate: true
        })

        for(let i = 1; i <= totalSpots; i++){
            const spot = await Spot.findOne({
                where: {spotNumber: i}
            })
            await Reservation.create({
                startDateTime: new Date(Date.now() + 1 * 60 * 1000),
                endDateTime: new Date(Date.now() + 5 * 60 * 1000),
                carDetails: {
                    brand: 'Toyoya',
                    model: 'Corolla',
                    plate: 'gr412as'
                },
                UserId: user.id,
                SpotId: spot.id,
            })
        }

        const {status, headers, body} = await request(server.app)
        .post('/api/reservations')
        .set('x-token', token)
        .send({
            startDateTime: new Date(Date.now() + 1 * 60 * 1000), 
            endDateTime: new Date(Date.now() + 2 * 60 * 1000),
            carDetails: {
                "brand": "toyota",
                "modelo": "corolla-2006",
                "chapa": "pkg5467"
            }
        });

        expect(status).toEqual(400)
        expect(body.data).toEqual(
            expect.stringContaining('No hay plazas de aparcamiento disponibles en ese horario.')
        )
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
                totalSpots: 5,
                occupiedSpot: 1,
                availableSpots: 4,
                occupationPercentage: '20%'
            })
        )


    })   
})

afterAll( async () => {
    await sequelize.close();
})


