
const ensureDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Admin';

    if (!adminEmail || !adminPassword) {
      console.error('Admin credentials are missing from .env');
      return;
    }

    const admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        phone: '0000000000',
        role: 'admin',
      });

      console.log('Default admin created successfully');
    } else {
      console.log('Existing admin found. No password changes made.');
    }
  } catch (err) {
    console.error('Error ensuring default admin:', err.message);
  }
};