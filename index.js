// App.js - Entry Point mit Notification-Trigger (Full-Body)

import React, { useEffect } from 'react';
import MainView from './src/ui/MainView';
import { BackgroundWorkerService } from './src/api/BackgroundWorkerService';

export default function App() {
  useEffect(() => {
    // Initialisierung der Benachrichtigungen beim App-Start
    const initNotifications = async () => {
      await BackgroundWorkerService.setupNotifications();
      await BackgroundWorkerService.registerMarketTask();
    };

    initNotifications();
  }, []);

  return <MainView />;
}