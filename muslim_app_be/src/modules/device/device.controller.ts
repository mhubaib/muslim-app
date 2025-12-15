import { Request, Response } from 'express';
import { DeviceTokenService } from './device.service.js';

const deviceTokenService = new DeviceTokenService();

export const registerDevice = async (req: Request, res: Response) => {
  try {
    const { token, deviceId, platform, latitude, longitude, timezone } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'FCM token is required',
      });
    }

    const device = await deviceTokenService.registerDevice({
      token,
      deviceId,
      platform,
      latitude,
      longitude,
      timezone,
    });

    res.status(201).json({
      success: true,
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to register device',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateDevicePreferences = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const {
      enablePrayerNotifications,
      enableEventNotifications,
      notifyBeforePrayer,
      latitude,
      longitude,
      timezone,
    } = req.body;

    const device = await deviceTokenService.updatePreferences(token, {
      enablePrayerNotifications,
      enableEventNotifications,
      notifyBeforePrayer,
      latitude,
      longitude,
      timezone,
    });

    res.status(200).json({
      success: true,
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update device preferences',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getDeviceInfo = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const device = await deviceTokenService.getDeviceByToken(token);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found',
      });
    }

    res.status(200).json({
      success: true,
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch device info',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const unregisterDevice = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    await deviceTokenService.unregisterDevice(token);

    res.status(200).json({
      success: true,
      message: 'Device unregistered successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to unregister device',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
