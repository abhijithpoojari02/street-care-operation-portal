// server.js (robust mounting + auto admin creation)
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const User = require('./models/User'); // ⬅️ IMPORTANT

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// helper: try to find a callable router inside the required module
function resolveRouter(mod, modulePath) {
  if (typeof mod === 'function') return mod;
  if (mod && typeof mod.default === 'function') return mod.default;
  if (mod && typeof mod.router === 'function') return mod.router;

  if (mod && typeof mod === 'object') {
    for (const key of Object.keys(mod)) {
      if (typeof mod[key] === 'function') {
        console.log(`[INFO] Using export property "${key}" from ${modulePath} as middleware`);
        return mod[key];
      }
    }
  }
  return null;
}

function safeRequireAndMount(mountPath, modulePath) {
  try {
    const fullPath = require.resolve(modulePath, { paths: [process.cwd()] });
    const mod = require(fullPath);

    const router = resolveRouter(mod, modulePath);

    if (router) {
      app.use(mountPath, router);
      console.log(`✓ Mounted ${modulePath} -> ${mountPath}`);
    } else {
      console.error(`\n[ERROR] Export in ${modulePath} not a router.`);
    }
  } catch (err) {
    console.error(`\n[ERROR] Requiring route ${modulePath} failed:`, err.message);
  }
}

// --- Mount routes ---
safeRequireAndMount('/api/auth', './routes/authRoutes');
safeRequireAndMount('/api/issues', './routes/issueRoutes');
safeRequireAndMount('/api/workers', './routes/workerRoutes');
safeRequireAndMount('/api/analytics', './routes/analyticsRoutes');
safeRequireAndMount('/api/complaints', './routes/complaintRoutes');

// --- AUTO CREATE DEFAULT ADMIN ---
const ensureDefaultAdmin = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@streetcare.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const adminName = process.env.ADMIN_NAME || 'Super Admin';

    let admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        phone: '0000000000',
        role: 'admin',
      });
      console.log('\n🎉 Default admin CREATED automatically');
    } else {
      admin.name = adminName;
      admin.email = adminEmail;
      admin.password = adminPassword;
      await admin.save();
      console.log('\n🔁 Existing admin UPDATED to match environment config');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Admin Email:', adminEmail);
    console.log('🔑 Admin Password:', adminPassword);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (err) {
    console.error('❌ Error ensuring default admin:', err.message);
  }
};

// MongoDB Connection + Admin Setup + Start Server
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/streetcare';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('✅ MongoDB Connected');
    await ensureDefaultAdmin(); // ⬅️ MAGIC HERE
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Health check
app.get('/', (req, res) => res.json({ message: 'Street Care Portal API is running' }));
