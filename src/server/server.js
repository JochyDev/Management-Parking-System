import express from 'express';
import cors from 'cors';
import { db } from "../models/index.js";

import { mongodbConection } from '../config/mongodb.config.js';

// Routes
import { userRoutes, authRoutes, spotsRoutes, reservationRoutes, logsRoutes }  from '../routes/index.js';


export class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT || 8080;
        this.paths = {
            auth: '/api/auth',
            logs: '/api/logs',
            reservations: '/api/reservations',
            users: '/api/users',
            spots: '/api/spots',
        }

        // Conection to Mysql
        this.conectionToMysql();

        // Conection to MongoDB
        this.conectionToMongo();

        //Middlewares
        this.middlewares();

        // Routas de mi aplicación
        this.routes();

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
        this.app.use(this.paths.spots, spotsRoutes);
    }
    
    listen(){
        this.app.listen( this.port , () =>{
            console.log(`the app is runnig at port: ${this.port} `)
        })
    }
    
}
