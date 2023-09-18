import { db } from '../models/index.js';
const { Spot } = db;

export const createSpots = async() => {
    
    const numSpots = process.env.NUM_OF_SPOTS || 5;

    const existsSpots = await Spot.findOne();

    if(!existsSpots){
        try {
            const spotPromises = [];
            for (let i = 1; i <= numSpots; i++) {
                spotPromises.push(Spot.create({
                    spotNumber: i
                }));
            }
            const spots = await Promise.all(spotPromises);
            console.log(`${spots.length} spots are ready!!`);
        } catch (err) {
            console.log(err);
        }
    }

} 