
import { error, success } from '../helpers/handleResponse.js';
import { reservationService } from '../services/index.js';

export const createReservation = async (req, res) => {
  
  const { id: UserId } = req.user;
  const { body } = req;

  
  try {
      const reservation = await reservationService.createReservation(UserId, body);
      success( res, reservation, 200);
    } catch(err) {
        error(res, err, 500);
    };
};

export const checkInOut = async (req, res) => {
  
  const {id: UserId} = req.user;
  const { id, action } = req.params;

  try {
    await reservationService.checkInOut(UserId, id, action);
    success(res, `The action ${action} was executed successfully`, 200);
  } catch (err) {
    error(res, err, 500);
  }
}

export const cancelReservation = async ( req, res ) => {

  const { id: UserId } = req.user;
  const { id } = req.params;

  
  try {
    await reservationService.cancelReservation(UserId, id);
    success(res, "Reservation was canceled successfully.", 200);

  } catch (err) {
    error(res, err, 500);
  }
};

export const getCurrentOccupancy = async ( req, res ) => {

  try {
    const occupancyDetails = await reservationService.getCurrentOccupancy();
    success(res, occupancyDetails, 200);
  } catch (err) {
    error(res, err, 500);
  }

}