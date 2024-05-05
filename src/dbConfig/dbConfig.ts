import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export async function connect() {
    try {
        console.log(process.env.MONGODB_URI);
        const url="mongodb+srv://deepakbagati2708:deepak179@cluster0.ptuxrqk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });

        connection.on('error', (err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
            process.exit();
        });

    } catch (error) {
        console.log('Something goes wrong!');
        console.log(error);
        process.exit(1); // Exit with non-zero status code to indicate failure
    }
}
