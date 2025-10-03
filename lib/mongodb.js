import mongoose from 'mongoose';

// Hardcoded MongoDB connection strings as per user request.
// Note: This is not a recommended practice for production environments.
const MONGODB_URI_AUTH = "mongodb+srv://9hva1lu_db_user:RHmBL9hk4e4pIE0R@cluster0.ri4qyoh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const MONGODB_URI_USERS = "mongodb+srv://bp7rzdl_db_user:2nFeXEbH7NtL41uQ@cluster0.h61qonw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const MONGODB_URI_REELS = "mongodb+srv://llw3yxge_db_user:TJZFwIriBKOYh2HS@cluster0.rty34lw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create separate connections
const authConnection = mongoose.createConnection(MONGODB_URI_AUTH);
const usersConnection = mongoose.createConnection(MONGODB_URI_USERS);
const reelsConnection = mongoose.createConnection(MONGODB_URI_REELS);

export { authConnection, usersConnection, reelsConnection };