import { Op } from 'sequelize';
import { logActivity } from '../helpers/logActivity.js';
import { reservationRepository, spotRepository } from '../repositories/index.js';

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
    const totalSpots = await spotRepository.countSpots() ;
    let SpotId = null;

    // Loop through available spots to find one without overlapping reservations.
    for(let i = 1; i <= totalSpots; i++){
        const spot = await this.spotRepository.findBySpotNumber(i);

        SpotId = spot.id;
        
        const data = {
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
        }
        // Check if there is an overlapping reservation for this spot.
        const overlappingReservation = reservationRepository.findOneReservation(data)

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

    const reservationData = {
      UserId,
      SpotId,
      startDateTime,
      endDateTime,
      carDetails
    }

    const reservation = await reservationRepository.createReservation(reservationData);

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
    const error = new Error();
    error.message = 'Action isn\'t valid';
    error.status = 400;
    throw error;
  }
  // Obtains the status and log corresponding to the action
  const { status, log } = actionMap[action];

  const num = await reservationRepository.updateReservation(id, status);

  if(num != 1){
    const error = new Error();
    error.message = `Something went wrong maybe Reservation with id=${id} was not found`;
    error.status = 400;
    throw error;
  }

  logActivity(UserId, log);
}

export const cancelReservation = async( UserId, id) => {
  const reservation = await this.reservationRepository.getReservationById(id);

  if(!reservation){
    const error = new Error();
    error.message = `Reservation was not found with id=${id}`;
    error.status = 404;
    throw error;
  }

  if( reservation.status == 'IN_PROGRESS'){
    const error = new Error();
    error.message = `The reservation has already started, it cannot be canceled`;
    error.status = 400;
    throw error;
  }

  const num = await reservationRepository.updateReservation(id, 'CANCELED');

  if(num != 1){
    const error = new Error();
    error.message = `Something went wrong maybe Reservation with id=${id} was not found`;
    error.status = 400;
    throw error;
  }

  logActivity(UserId, 'CANCELED_RESERVATION');
}

export const getCurrentOccupancy = async () => {

  const totalSpots = await this.spotRepository.countSpots();

  const data = {
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
  }

  const parkingSpots = this.reservationRepository.findAllReservations(data);

  const occupancyDetails = { 
    totalSpots,
    occupiedSpot: parkingSpots.length,
    availableSpots: totalSpots - parkingSpots.length,
    occupationPercentage: (parkingSpots.length / totalSpots)  * 100 + "%"
  }

  return occupancyDetails;
}