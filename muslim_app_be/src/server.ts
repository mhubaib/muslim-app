import dotenv from 'dotenv';
import cron from 'node-cron';
import app from './app.js';
import prisma from './config/database.js';
import { QuranService } from './modules/quran/quran.service.js';
import { PrayerService } from './modules/prayer/prayer.service.js';
import { NotificationService } from './modules/notification/notification.service.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

const quranService = new QuranService();
const prayerService = new PrayerService();
const notificationService = new NotificationService();

async function initializeServer() {
  try {
    console.log('🚀 Starting Muslim App Backend...');

    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected');

    // Initialize Quran cache
    console.log('📖 Initializing Quran cache...');
    await quranService.initializeQuranCache();
    console.log('✅ Quran cache ready');

    // Setup cron jobs
    setupCronJobs();

    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
      console.log('📡 Ready to accept requests');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

function setupCronJobs() {
  // Clean old prayer cache every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('🧹 Running daily cache cleanup...');
    try {
      await prayerService.cleanOldCache();
      console.log('✅ Cache cleanup completed');
    } catch (error) {
      console.error('❌ Cache cleanup failed:', error);
    }
  });

  // Process pending notifications every minute
  cron.schedule('* * * * *', async () => {
    try {
      const processed = await notificationService.processPendingNotifications();
      if (processed > 0) {
        console.log(`📬 Processed ${processed} pending notifications`);
      }
    } catch (error) {
      console.error('❌ Failed to process notifications:', error);
    }
  });

  console.log('⏰ Cron jobs scheduled');
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  console.log('✅ Database disconnected');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  console.log('✅ Database disconnected');
  process.exit(0);
});

// Start the server
initializeServer();
