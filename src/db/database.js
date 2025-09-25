import mongoose from "mongoose";
import { DB_Name} from "../constants.js";   // ✅ match naming

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_Name}`
    );

    console.log(
      `✅ MongoDB connected at DB HOST :: ${connectionInstance.connection.host}`

    );
    console.log(  "the port is running at the ",process.env.PORT);
    
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
