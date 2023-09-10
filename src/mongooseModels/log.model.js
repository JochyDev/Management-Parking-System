import { Schema, model } from 'mongoose';

const LogSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['PARKING_RESERVATION', 'VEHICLE_ENTRY', 'VEHICLE_EXIT', 'CANCELED_RESERVATION']
  },
  dateTime: {
    type: Date,
    default: Date.now,
  },
});

export const Log = model('Log', LogSchema);

 