const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI not found in .env file');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:');
    console.error('Error details:', error.message);
    
    if (error.message.includes('querySrv')) {
      console.log('\n📝 Fix SRV Record Issue:');
      console.log('1. Check internet connection');
      console.log('2. Try using direct connection string');
      console.log('3. Format: mongodb://username:password@host1:port1,host2:port2/database');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;