import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import path from 'path'
// models
import UserModel from '../models/User.js';

const pemFile = readFileSync(path.resolve('./server/key/public.pem'), 'utf8');

const SECRET_KEY = pemFile.toString();

export const encode = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.getUserById(userId);
    const payload = {
      userId: user._id,
      userType: user.type,
    };
    const authToken = jwt.sign(payload, SECRET_KEY);
    req.authToken = authToken;
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: error.error });
  }
}

export const decode = (req, res, next) => {
  if (!req.headers['authorization']) {
    return res.status(400).json({ success: false, message: 'No access token provided' });
  }
  const accessToken = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(accessToken, SECRET_KEY);
    const nowDate = Math.floor(Date.now() / 1000);

    if(decoded.exp < nowDate) {
      throw 'token rotten'
    }

    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
}
