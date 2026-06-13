import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import MessageController from '../controllers/messageController.js'


const messRoute = express.Router()


messRoute.get('/:conversationId/messages',authMiddleware,MessageController.getMessage)

export default messRoute;