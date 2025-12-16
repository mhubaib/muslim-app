import prisma from '../../config/database.js';
import { PrayerService } from '../prayer/prayer.service.js';
import { NotificationService } from '../notification/notification.service.js';
import { DeviceTokenService } from '../device/device.service.js';
import { NotificationType } from '../../generated/prisma/client.js';

export class PrayerNotificationService {
  private prayerService: PrayerService;
  private notificationService: NotificationService;
  private deviceTokenService: DeviceTokenService;

  constructor() {
    this.prayerService = new PrayerService();
    this.notificationService = new NotificationService();
    this.deviceTokenService = new DeviceTokenService();
  }

  /**
   * Schedule prayer notifications for all registered devices
   * This should be run daily (e.g., at midnight)
   */
  async scheduleDailyPrayerNotifications() {
    try {
      console.log('📅 Scheduling daily prayer notifications...');

      const devices = await this.deviceTokenService.getDevicesWithPrayerNotifications();

      console.log(`Found ${devices.length} devices with prayer notifications enabled`);

      let totalScheduled = 0;

      for (const device of devices) {
        try {
          const scheduled = await this.schedulePrayerNotificationsForDevice(
            device.id,
            device.token,
            device.latitude!,
            device.longitude!,
            device.notifyBeforePrayer,
            device.enabledPrayers as any // Pass enabledPrayers
          );
          totalScheduled += scheduled;
        } catch (error) {
          console.error(`Failed to schedule notifications for device ${device.id}:`, error);
        }
      }

      console.log(
        `✅ Scheduled ${totalScheduled} prayer notifications for ${devices.length} devices`
      );
      return totalScheduled;
    } catch (error) {
      console.error('Error scheduling daily prayer notifications', error);
      throw error;
    }
  }

  /**
   * Schedule prayer notifications for a specific device
   */
  async schedulePrayerNotificationsForDevice(
    deviceId: number,
    deviceToken: string,
    latitude: number,
    longitude: number,
    notifyBeforeMinutes: number = 5,
    enabledPrayers?: any
  ) {
    try {
      // Get today's prayer times
      const prayerTimes = await this.prayerService.getTodayPrayerTimes(latitude, longitude);

      const prayers = [
        { name: 'Fajr', time: prayerTimes.fajr, emoji: '🌅', key: 'fajr' },
        { name: 'Dhuhr', time: prayerTimes.dhuhr, emoji: '☀️', key: 'dhuhr' },
        { name: 'Asr', time: prayerTimes.asr, emoji: '🌤️', key: 'asr' },
        { name: 'Maghrib', time: prayerTimes.maghrib, emoji: '🌆', key: 'maghrib' },
        { name: 'Isha', time: prayerTimes.isha, emoji: '🌙', key: 'isha' },
      ];

      let scheduled = 0;
      const now = new Date();

      for (const prayer of prayers) {
        // Check if this prayer is enabled
        if (enabledPrayers && enabledPrayers[prayer.key] === false) {
          console.log(`⏭️  Skipping ${prayer.name} - disabled by user`);
          continue;
        }

        // Parse prayer time (format: "HH:MM")
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerDateTime = new Date();
        prayerDateTime.setHours(hours, minutes, 0, 0);

        // Subtract notification time
        const notificationTime = new Date(
          prayerDateTime.getTime() - notifyBeforeMinutes * 60 * 1000
        );

        // Only schedule if the time hasn't passed
        if (notificationTime > now) {
          await prisma.notificationSchedule.create({
            data: {
              type: NotificationType.AZAN,
              title: `${prayer.emoji} Waktu ${prayer.name}`,
              body: `${notifyBeforeMinutes} menit lagi masuk waktu ${prayer.name} (${prayer.time})`,
              scheduleAt: notificationTime,
              deviceTokenId: deviceId,
              meta: {
                prayerName: prayer.name,
                prayerTime: prayer.time,
                notifyBeforeMinutes,
              },
            },
          });
          scheduled++;
        }
      }

      console.log(`Scheduled ${scheduled} prayer notifications for device ${deviceId}`);
      return scheduled;
    } catch (error) {
      console.error(`Error scheduling prayer notifications for device ${deviceId}:`, error);
      throw error;
    }
  }

  /**
   * Process pending prayer notifications
   * This should be run frequently (e.g., every minute)
   */
  async processPendingPrayerNotifications() {
    try {
      const now = new Date();

      // Get all pending prayer notifications
      const pendingNotifications = await prisma.notificationSchedule.findMany({
        where: {
          type: NotificationType.AZAN,
          scheduleAt: {
            lte: now,
          },
          sent: false,
        },
        include: {
          deviceToken: true,
        },
      });

      if (pendingNotifications.length === 0) {
        return 0;
      }

      console.log(`📬 Processing ${pendingNotifications.length} pending prayer notifications`);

      let sent = 0;

      for (const notification of pendingNotifications) {
        try {
          if (notification.deviceToken) {
            // Send to specific device
            await this.notificationService.sendToDevice(notification.deviceToken.token, {
              type: notification.type,
              title: notification.title,
              body: notification.body,
              meta: notification.meta as Record<string, any>,
            });

            // Mark as sent
            await prisma.notificationSchedule.update({
              where: { id: notification.id },
              data: {
                sent: true,
                sentAt: new Date(),
              },
            });

            sent++;
          }
        } catch (error) {
          console.error(`Failed to send notification ${notification.id}:`, error);
        }
      }

      console.log(`✅ Sent ${sent} prayer notifications`);
      return sent;
    } catch (error) {
      console.error('Error processing pending prayer notifications', error);
      throw error;
    }
  }

  /**
   * Clean old sent notifications (older than 7 days)
   */
  async cleanOldNotifications() {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const result = await prisma.notificationSchedule.deleteMany({
        where: {
          sent: true,
          sentAt: {
            lt: sevenDaysAgo,
          },
        },
      });

      console.log(`🧹 Cleaned ${result.count} old notifications`);
      return result.count;
    } catch (error) {
      console.error('Error cleaning old notifications', error);
      throw error;
    }
  }
}
