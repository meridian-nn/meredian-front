// utils
import makeValidation from '@withvoid/make-validation';
// models
import UserModel, { USER_TYPES } from '../models/User.js';

export default {
  onGetAllUsers: async (req, res) => {
    try {
      const users = await UserModel.getUsers();

      return res.status(200).json({ success: true, users });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  },

  onGetUserById: async (req, res) => {
    try {
      const user = await UserModel.getUserById(req.params.id);

      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  }
}