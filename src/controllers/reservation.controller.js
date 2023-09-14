import { Op } from 'sequelize';
import { error, success } from '../helpers/handleResponse.js';
import { activityLog } from '../helpers/activityLog.js';
import { db } from '../models/index.js';
const { Reservation, Spot } = db;



export const createReservation = async (req, res) => {
  const { UserId, startDateTime, endDateTime} = req.body;

  const totalSpots = await Spot.count();
  let SpotId = null;

  for(let i = 1; i < totalSpots; i++){
      const spot = await Spot.findOne({
        where: {id: i}
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
          endDateTime
      });

      activityLog('1', 'PARKING_RESERVATION');
      success( res, reservation, 200);
    } catch(err) {
        error(res, err, 500);
    };
};

export const cancelReservation = async ( req, res ) => {

  const { id } = req.params;

  try {
    const num = await Reservation.update({status: 'CANCELED'}, {
      where: {id}
    });
 
    if (num == 1) {
        success(res, "Reservation was canceled successfully.", 200)
    } else {
      error(
          req, res,
          `Cannot cancel reservation with id=${id}. Maybe Reservation was not found`
      );
    } 
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

    if(parkingSpots.length == 0){
      return success(res, `The ${totalSpots} parking spots are available right now.`);
    }

    success(res, `Out of the ${totalSpots} parking spots in the parking lot, ${parkingSpots.length} are occupied.`, 200);
  } catch (err) {
    error(res, err, 500);
  }

}