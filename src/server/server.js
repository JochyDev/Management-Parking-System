import express from 'express';
import cors from 'cors';
import { db } from "../models/sequelize/index.js";

import { mongodbConection } from '../config/mongodb.config.js';

import { createSpots } from '../helpers/setNumOfSpot.js'

// Routes
import { userRoutes, authRoutes, reservationRoutes, logsRoutes }  from '../routes/index.js';


export class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT || 8080;
        this.paths = {
            auth: '/api/auth',
            logs: '/api/logs',
            reservations: '/api/reservations',
            users: '/api/users',
        }

        // Conection to Mysql
        this.conectionToMysql();

        // Conection to MongoDB
        this.conectionToMongo();

        //Middlewares
        this.middlewares();

        // Routes
        this.routes();

        // Set number of sposts for parking
        this.setNumOfSpots();

    }

    async conectionToMysql(){
        await db.sequelize.sync({ force: false })
        .then(() => {
          console.log("Synced parkingDB.");
        })
        .catch((err) => {
          console.log("Failed to sync db: " + err.message);
        });
    }

    async conectionToMongo(){
        await mongodbConection();
    }

    middlewares(){
        // Cors
        this.app.use(cors());
        // Lectura y parseo del body
        this.app.use(express.json());
    }
    routes(){
        this.app.use(this.paths.auth, authRoutes);
        this.app.use(this.paths.logs, logsRoutes);
        this.app.use(this.paths.reservations, reservationRoutes);
        this.app.use(this.paths.users, userRoutes);
    }

    async setNumOfSpots(){
        await createSpots();
    }
    
    listen(){
        this.app.listen( this.port , () =>{
            console.log(`the app is runnig at port: ${this.port} `)
        })
    }
    
}
