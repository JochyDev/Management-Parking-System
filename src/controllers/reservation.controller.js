import { Op } from 'sequelize';
import { error, success } from '../helpers/handleResponse.js';
import { activityLog } from '../helpers/activityLog.js';
import { db } from '../models/index.js';
const { Reservation, Spot } = db;

export const createReservation = async (req, res) => {
  
  const { id: UserId } = req.user;
  const {startDateTime, endDateTime, carDetails} = req.body;


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

      activityLog(UserId, 'PARKING_RESERVATION');
      success( res, reservation, 200);
    } catch(err) {
        error(res, err, 500);
    };
};

export const findReservationByPk = async( req, res) => {

  const { id } = req.params;

  try {
    const reservation = await Reservation.findByPk(id);
    success(res, reservation, 200);
  } catch (err) {
    error(res, err, 500);
  }
}

export const cancelReservation = async ( req, res ) => {

  const { id: UserId } = req.user;
  const { id } = req.params;

  try {
    const num = await Reservation.update({status: 'CANCELED'}, {
      where: {id}
    });
 
    if (num == 1) {
        activityLog(UserId, 'CANCELED_RESERVATION');
        success(res, "Reservation was canceled successfully.", 200);
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