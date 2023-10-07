import { db } from '../models/sequelize/index.js';
const { Spot } = db;

export const countSpots = async () => {
    return await Spot.count()
} 


export const findBySpotNumber = async( spotNumber ) => {
    return await Spot.findOne({
        where: { spotNumber: spotNumber }
      })
}