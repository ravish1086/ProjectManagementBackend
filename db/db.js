import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, clientOptions);
      console.log('MongoDB connected');
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  };

export default connectDB;