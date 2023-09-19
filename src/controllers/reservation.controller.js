import { Op } from 'sequelize';
import { error, success } from '../helpers/handleResponse.js';
import { logActivity } from '../helpers/logActivity.js';
import { db } from '../models/sequelize/index.js';
const { Reservation, Spot } = db;

export const findReservationByPk = async( req, res) => {

  const { id } = req.params;

  try {
    const reservation = await Reservation.findByPk(id);
    success(res, reservation, 200);
  } catch (err) {
    error(res, err, 500);
  }
}

export const createReservation = async (req, res) => {
  
  const { id: UserId } = req.user;
  const {startDateTime, endDateTime, carDetails} = req.body;

  if(new Date(startDateTime) < new Date()){
    return error(res, `Cannot create a reservation in past`, 400);
  }

  if(new Date(endDateTime) < new Date(startDateTime)){
    return error(res, `endDateTime always have to be after startDateTime`, 400);
  }


  const totalSpots = await Spot.count();
  let SpotId = null;

  for(let i = 1; i <= totalSpots; i++){
      const spot = await Spot.findOne({
        where: {spotNumber: i}
      })

      SpotId = spot.id;

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

      if (overlappingReservation) {
        SpotId = null;
        continue;
      }

      break;
  };

  if(!SpotId){
      return success(res, 'No hay plazas de aparcamiento disponibles en ese horario.', 401);
  };

  try {
      const reservation = await Reservation.create({
          UserId,
          SpotId,
          startDateTime,
          endDateTime,
          carDetails
      });

      logActivity(UserId, 'PARKING_RESERVATION');
      success( res, reservation, 200);
    } catch(err) {
        error(res, err, 500);
    };
};

export const checkInOut = async (req, res) => {
  
  const {id: UserId} = req.user;
  const { id, action } = req.params;

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
  const reservation = await Reservation.findByPk(id);

  if(!reservation){
    error(res, `Reservation was not found with id=${id}`, 404);
  }

  // Obtains the status and log corresponding to the action
  const { status, log } = actionMap[action];

  reservation.status = status;

  try {
    await reservation.save();
    logActivity(UserId, log);
    success(res, `The action ${action} was executed successfully`, 200);
  } catch (err) {
    error(res, err, 500);
  }
}

export const cancelReservation = async ( req, res ) => {

  const { id: UserId } = req.user;
  const { id } = req.params;

  const reservation = await Reservation.findByPk(id);

  if(!reservation){
    error(res, `Reservation was not found with id=${id}`, 404);
  }

  if( reservation.status == 'IN_PROGRESS'){
    return error(res, `The reservation has already started, it cannot be canceled`, 400);
  }

  reservation.status = 'CANCELED'

  try {

    await reservation.save()
    logActivity(UserId, 'CANCELED_RESERVATION');
    success(res, "Reservation was canceled successfully.", 200);

  } catch (err) {
    error(res, err, 500);
  }
};

export const getCurrentOccupancy = async ( req, res ) => {

  const totalSpots = await Spot.count();

  try {
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

    const ocuupancyDetails = { 
      totalSpots,
      occupiedSpot: parkingSpots.length,
      availableSpots: totalSpots - parkingSpots.length,
      occupationPercentage: (parkingSpots.length / totalSpots)  * 100 + "%"
    }

    success(res, ocuupancyDetails, 200);
  } catch (err) {
    error(res, err, 500);
  }

}