import Sequelize from "sequelize";
import config from "../config/db.config.json" assert {type: 'json'};

const env = process.env.NODE_ENV || 'development';
const { database, username, password, host, dialect } = config[env];

const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: dialect
});

export const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

import {UserModel} from "./user.model.js"; 
db.users = UserModel(sequelize, Sequelize);