import mongoose from 'mongoose';

// NOTE: This setup is designed for scalability. For high availability, you can
// provide a replica set connection string with multiple hosts in the .env file.
// e.g., MONGODB_URI_AUTH="mongodb://host1:27017,host2:27017/auth?replicaSet=myReplicaSet"
const MONGODB_URI_AUTH = process.env.MONGODB_URI_AUTH;
const MONGODB_URI_USERS = process.env.MONGODB_URI_USERS;
const MONGODB_URI_REELS = process.env.MONGODB_URI_REELS;

if (!MONGODB_URI_AUTH) {
  throw new Error(
    'Please define the MONGODB_URI_AUTH environment variable inside .env.local'
  );
}

if (!MONGODB_URI_USERS) {
  throw new Error(
    'Please define the MONGODB_URI_USERS environment variable inside .env.local'
  );
}

if (!MONGODB_URI_REELS) {
  throw new Error(
    'Please define the MONGODB_URI_REELS environment variable inside .env.local'
  );
}

// Create separate connections
const authConnection = mongoose.createConnection(MONGODB_URI_AUTH);
const usersConnection = mongoose.createConnection(MONGODB_URI_USERS);
const reelsConnection = mongoose.createConnection(MONGODB_URI_REELS);

export { authConnection, usersConnection, reelsConnection };