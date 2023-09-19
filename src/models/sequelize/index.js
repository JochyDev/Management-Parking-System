import Sequelize from "sequelize";
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, basename, join} from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __basename = basename(__filename);
import config from "../../config/db.config.json" assert {type: 'json'};


const env = process.env.NODE_ENV || 'development';
const { database, username, password, host, dialect } = config[env];

const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: dialect
});

export const db = {};

const files = fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== __basename) && (file.slice(-3) === '.js');
  });

for (const file of files) {
  const filePath = join(__dirname, file);
  const { createModel } = await import(filePath);
  const model = createModel(sequelize, Sequelize);
  db[model.name] = model;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;