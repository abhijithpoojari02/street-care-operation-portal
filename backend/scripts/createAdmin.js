const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const createOrUpdateAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/streetcare';

    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@streetcare.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const adminName = process.env.ADMIN_NAME || 'Super Admin';

    // Find existing admin (any admin)
    let admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      // No admin yet → create one
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        phone: '0000000000',
        role: 'admin',
      });

      console.log('\n🎉 Default admin CREATED successfully!');
    } else {
      // Admin exists → update it to match .env
      admin.name = adminName;
      admin.email = adminEmail;
      admin.password = adminPassword; // will be hashed by pre-save hook
      admin.phone = admin.phone || '0000000000';
      await admin.save();

      console.log('\n🔁 Existing admin UPDATED to match .env!');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Change the password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating/updating admin:', error.message || error);
    process.exit(1);
  }
};

createOrUpdateAdmin();
