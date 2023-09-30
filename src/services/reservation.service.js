import { Op } from 'sequelize';
import { logActivity } from '../helpers/logActivity.js';
import { db } from '../models/sequelize/index.js';
import { reservationRepository } from '../repositories/index.js';
const { Reservation, Spot } = db;

export const createReservation = async ( UserId, body ) => {

    const { startDateTime, endDateTime, carDetails } = body;

    // Check if the startDateTime is in the past.
    if(new Date(startDateTime) < new Date()){
      const error = new Error();
      error.message = 'Cannot create a reservation in past';
      error.status = 400;
      throw error;
    }

    // Check if endDateTime is before startDateTime.
    if(new Date(endDateTime) < new Date(startDateTime)){
      const error = new Error();
      error.message = 'endDateTime always have to be after startDateTime';
      error.status = 400;
      throw error
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
        const error = new Error();
        error.message = 'No hay plazas de aparcamiento disponibles en ese horario.';
        error.status = 400;
        throw error
    };

    const reservation = await Reservation.create({
        UserId,
        SpotId,
        startDateTime,
        endDateTime,
        carDetails
    });

    logActivity(UserId, 'PARKING_RESERVATION');
    return reservation;

    
}

export const checkInOut = async ( UserId, id, action) => {
  // This is an object that maps the actions to the corresponding status and log
  const actionMap = {
    entry: {
      status: 'IN_PROGRESS',
      log: 'VEHICLE_ENTRY',
    },
    exit: {
      status: 'COMPLETED',
      log: 'VEHICLE_EXIT',
    }
  };
  
  // Check if the specified action is in the map
  if (!actionMap[action]) {
    return error(res, 'Action isn\'t valid', 400);
  }
  const reservation = await reservationRepository.getReservationById(id);

  if(!reservation){
    return error(res, `Reservation was not found with id=${id}`, 404);
  }

  // Obtains the status and log corresponding to the action
  const { status, log } = actionMap[action];

  reservation.status = status;

  await reservation.save();
  logActivity(UserId, log);
}

export const cancelReservation = async( UserId, id) => {
  const reservation = await Reservation.findByPk(id);

  if(!reservation){
    error(res, `Reservation was not found with id=${id}`, 404);
  }

  if( reservation.status == 'IN_PROGRESS'){
    return error(res, `The reservation has already started, it cannot be canceled`, 400);
  }

  reservation.status = 'CANCELED'

  await reservation.save()
  logActivity(UserId, 'CANCELED_RESERVATION');
}

export const getCurrentOccupancy = async () => {

  const totalSpots = await Spot.count();

  const parkingSpots = await Reservation.findAll({
    where: {
      status: 'ACTIVE',
      [Op.and]: [
        {
          startDateTime: {
            [Op.lt]: new Date(),
          },
          endDateTime: {
            [Op.gt]: new Date(),
          },
        },
      ],
    },
  })

  const occupancyDetails = { 
    totalSpots,
    occupiedSpot: parkingSpots.length,
    availableSpots: totalSpots - parkingSpots.length,
    occupationPercentage: (parkingSpots.length / totalSpots)  * 100 + "%"
  }

  return occupancyDetails;
}