import { error, success } from '../helpers/handleResponse.js';
import { db } from '../models/index.js';
const { Spot } = db;

export const createMultipleSpots = async(req, res) => {
    try {
        const { numSpots } = req.params; 
    
        const spotPromises = [];
        for (let i = 0; i < numSpots; i++) {
            spotPromises.push(Spot.create());
        }
        const spots = await Promise.all(spotPromises);

        success(res, spots, 200);
    } catch (err) {
        error(res, err, 500)
    }

} 