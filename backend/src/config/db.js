import moose from 'mongoose';
export const connectDB = async () => {
    try{
        await moose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log('Connected to MongoDB');
    } 
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}