// src/api/BackgroundWorkerService.js - Robust Permissions & Worker Logic

import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import { Config } from '../core/Config';
import { RadarRepository } from '../store/RadarRepository';

export const BackgroundWorkerService = {
  /**
   * Robuste Berechtigungsabfrage (Check -> Request)
   */
  setupNotifications: async () => {
    // 1. Prüfen, ob wir bereits Berechtigungen haben
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // 2. Falls nicht granted, fordern wir sie explizit an
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      if (global.log) global.log.warn("Notifications: Berechtigung wurde verweigert!");
      return false;
    }

    // Handler konfigurieren
    await Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
    
    if (global.log) global.log.info("Notifications: Berechtigungen erfolgreich konfiguriert.");
    return true;
  },

  /**
   * Definiert die Logik des Tasks
   */
  defineMarketTask: () => {
    TaskManager.defineTask(Config.WORKER.TASK_NAME, async () => {
      try {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        let isTimeForScan = false;
        if (Config.TEST) {
          isTimeForScan = true;
          if (global.log) global.log.info(`TEST-RUN: Worker aktiv um ${currentTime}`);
        } else {
          isTimeForScan = Config.WORKER.SCAN_TIMES.some(t => {
            const [h, m] = t.split(':');
            const targetMin = parseInt(h) * 60 + parseInt(m);
            const currentMin = now.getHours() * 60 + now.getMinutes();
            return Math.abs(currentMin - targetMin) <= 10;
          });
        }

        if (isTimeForScan) {
          const data = await RadarRepository.getData();
          const highScoring = data?.watchlist_results?.filter(r => r.score >= 9) || [];

          if (highScoring.length > 0) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Stock Radar Alert! 🚀",
                body: `Check ${highScoring.map(s => s.ticker).join(', ')} - High Score detected!`,
                data: { type: 'radar_update' },
              },
              trigger: null,
            });
          }
        }
        return BackgroundFetch.BackgroundFetchResult.NewData;
      } catch (error) {
        if (global.log) global.log.error("BackgroundWorker Error:", error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
      }
    });
  },

  /**
   * Registriert den Task beim Betriebssystem
   */
  registerMarketTask: async () => {
    try {
      await BackgroundFetch.registerTaskAsync(Config.WORKER.TASK_NAME, {
        minimumInterval: Config.WORKER.FETCH_INTERVAL, 
        stopOnTerminate: false,
        startOnIdle: false,
      });
      if (global.log) global.log.info(`Worker '${Config.WORKER.TASK_NAME}' erfolgreich registriert.`);
    } catch (err) {
      if (global.log) global.log.error("Worker-Registrierung fehlgeschlagen:", err);
    }
  }
};