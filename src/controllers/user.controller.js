import { success } from "../helpers/handleResponse.js";



export const getUsers = (req, res) => {
    success(res, 'List of all users of my aplication', 200);
};


