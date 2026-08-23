import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string)
        console.log("Connected To Mongo Successfully");
        
    } catch (error) {
        console.log(`Error: ${error}`);
        process.exit(1);
    }
};

export default connectDB;
