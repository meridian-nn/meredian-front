import express from 'express'
// controllers
import user from '../controllers/user.js'

const router = express.Router()

router
  .get('/', user.onGetAllUsers)
  .get('/:id', user.onGetUserById)

export default router
