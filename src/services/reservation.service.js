import { db } from '../models/sequelize/index.js';
const { Reservation, Spot } = db;

export const createReservation = async ( UserId, body ) => {

    const { startDateTime, endDateTime, carDetails } = body;

    // Check if the startDateTime is in the past.
    if(new Date(startDateTime) < new Date()){
      throw new Error(`Cannot create a reservation in past`, 400);
    }

    // Check if endDateTime is before startDateTime.
    if(new Date(endDateTime) < new Date(startDateTime)){
      throw new Error(`endDateTime always have to be after startDateTime`, 400);
    }

    // Get the total number of spots available.
    const totalSpots = await Spot.count();
    let SpotId = null;

    // Loop through available spots to find one without overlapping reservations.
    for(let i = 1; i <= totalSpots; i++){
        const spot = await Spot.findOne({
          where: {spotNumber: i}
        })

        SpotId = spot.id;

        // Check if there is an overlapping reservation for this spot.
        const overlappingReservation = await Reservation.findOne({
          where: {
            SpotId,
            [Op.or]: [
              {
                startDateTime: {
                  [Op.lt]: endDateTime,
                },
                endDateTime: {
                  [Op.gt]: startDateTime,
                },
              },
            ],
          },
        });

        // If there's an overlap, reset SpotId and continue to the next spot.
        if (overlappingReservation) {
          SpotId = null;
          continue;
        }

        // Break the loop if a spot without overlapping reservations is found.
        break;
    };

    if(!SpotId){
        throw new Error('No hay plazas de aparcamiento disponibles en ese horario.', 400);
    };

    return await Reservation.create({
        UserId,
        SpotId,
        startDateTime,
        endDateTime,
        carDetails
    });

    
}   