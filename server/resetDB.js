const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env in the same directory
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ Error: MONGO_URI is not defined in your server/.env file.');
  process.exit(1);
}

const User = require('./models/User');
const JobApplication = require('./models/JobApplication');

async function resetDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    const dbName = mongoose.connection.name;
    console.log(`✅ Connected to database: "${dbName}"`);

    // Fetch counts before clearing
    const userCount = await User.countDocuments().catch(() => 0);
    const jobCount = await JobApplication.countDocuments().catch(() => 0);
    console.log(`📊 Current records: ${userCount} user(s), ${jobCount} job application(s).`);

    console.log('🗑️  Dropping all data from the database...');
    await mongoose.connection.db.dropDatabase();

    // Re-initialize model indexes (such as unique email index)
    await User.init().catch(() => {});
    await JobApplication.init().catch(() => {});

    console.log(`✨ Database "${dbName}" has been successfully reset!`);
    console.log('   All users, applications, and collections have been cleared.');
  } catch (error) {
    console.error('❌ Failed to reset database:');
    console.error(error.message || error);

    if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Tip: Your MONGO_URI could not be resolved by DNS.');
      console.error('   If using local MongoDB, set MONGO_URI=mongodb://127.0.0.1:27017/Smart-Job-Application-Tracker in server/.env');
    }
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('🔒 Database connection closed.');
    }
    process.exit(0);
  }
}

resetDatabase();
