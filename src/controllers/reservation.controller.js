import { Op } from 'sequelize';
import { error, success } from '../helpers/handleResponse.js';
import { db } from '../models/index.js';
const { Reservation, Spot } = db;



export const createReservation = async (req, res) => {
  const { UserId } = req.body;

  const startDateTime = new Date('2023','09', '08', '08', '25')
  const endDateTime = new Date('2023','09', '08', '08', '45');

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
    }

    if(!SpotId){
        return success(res, 'No hay plazas de aparcamiento disponibles en ese horario.', 401)
    }


    try {

        const reservation = await Reservation.create({
            UserId,
            SpotId,
            startDateTime,
            endDateTime
        });

        success( res, reservation, 200);
    } catch(err) {
        error(res, err, 500);
    }
  }

