import dotenv from 'dotenv'
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Friendship from '../models/Friendship.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js'
import { connectDB } from './db.js';


async function resetDatabase() {
    try {
        await connectDB();
        console.log("🗑️ Resetting database...");
        await Message.deleteMany({});
        await Conversation.deleteMany({});
        await Friendship.deleteMany({});
        await User.deleteMany({});
        console.log("✅ Database reset done");
    } catch (error) {
        console.error("Error resetting database", error);
        await mongoose.disconnect();
    }
}


async function seed() {
    try {
        await resetDatabase();

        // ✅ Hash the password correctly
        const hashPassword = await bcrypt.hash("password123", 10);
        console.log("🔐 Password hashed:", hashPassword);

        const usersData = [
            {
                fullName: 'john',
                username: 'john',
                email: 'test@gmail.com',
                connectCode: '111111',
                password: hashPassword,
            },
            {
                fullName: 'Bob',
                username: 'bob',
                email: 'test2@gmail.com',
                connectCode: '222222',
                password: hashPassword,
            }
        ];

        const users = [];

        for (const data of usersData) {
            const user = await User.create(data);
            console.log(`✅ User created: ${user.fullName} (${user._id})`);
            users.push(user);
        }

        const [user1, user2] = users;

        // Create friendship
        const friendship = await Friendship.create({
            requester: user1._id,
            recipient: user2._id,
        });
        console.log(`✅ Friendship created: ${friendship._id}`);

        // Create conversation
        const conversation = await Conversation.create({
            participants: [user1._id, user2._id],
            lastMessagePreview: null,
            unreadCounts: {
                [user1._id]: 0,
                [user2._id]: 0,
            }
        });
        console.log(`✅ Conversation created: ${conversation._id}`);

        // Create message

        const messages = [];
        for (let i = 0; i < 30; i++) {
            const sender = i % 2 === 0 ? user1 : user2;
            const content = `Message ${i + 1} from ${sender.username}`;
            const message = await Message.create({
                sender,
                content: content,
                conversation: conversation._id,
            });

            messages.push(message)
        }

        const lastMessage = messages[messages.length - 1];



        conversation.unreadCounts.set(user2._id.toString(), lastMessage.sender.equals(user2._id) ? 0 : 1);
        conversation.unreadCounts.set(user1._id.toString(), lastMessage.sender.equals(user1._id) ? 0 : 1);
        await conversation.save();
       

        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");

    } catch (error) {
        console.error("❌ Error seeding database:", error);
        await mongoose.disconnect();
    }
}

seed();