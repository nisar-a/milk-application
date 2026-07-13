require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const { ensureAdminFromEnv, ensureDefaultMilkPrice } = require('./services/bootstrapService');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    const bootstrap = await ensureAdminFromEnv();

    if (bootstrap.created) {
      // eslint-disable-next-line no-console
      console.log(`Default admin created for phone ${bootstrap.phone}`);
    }

    const priceBootstrap = await ensureDefaultMilkPrice(bootstrap.adminId);

    if (priceBootstrap.created) {
      // eslint-disable-next-line no-console
      console.log(`Default milk price initialized at Rs. ${priceBootstrap.pricePerLitre}/L`);
    }

    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
