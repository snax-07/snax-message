import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
};

const Connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (Connection.isConnected) {
        console.log("Already connected to the database");
        return;
    }

    try {

        const db = await mongoose.connect("mongodb+srv://snax:snax@snax1.svjz8.mongodb.net/bounty");
        Connection.isConnected = db.connections[0].readyState;

        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}

export default dbConnect;
