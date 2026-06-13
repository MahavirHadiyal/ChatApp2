import express from 'express'
import ConversationController from '../controllers/conversationController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const conRouter = express.Router();

// ✅ Added authMiddleware here
conRouter.get('/check-connect-code', authMiddleware, ConversationController.checkConnectcode)
conRouter.get('/', authMiddleware, ConversationController.getConversation)

export default conRouter;