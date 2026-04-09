// index.js - Update: Task Registration Trigger (Full-Body)

import { registerRootComponent } from 'expo';
import { logger } from 'react-native-logs';
import App from './App'; 
import { BackgroundWorkerService } from './src/api/BackgroundWorkerService';

const log = logger.createLogger();
global.log = log;

log.info("App wird gestartet und Logger ist initialisiert.");

// 1. Task definieren
BackgroundWorkerService.defineMarketTask();

// 2. Notifications vorbereiten
BackgroundWorkerService.setupNotifications();

// 3. Task beim System registrieren
BackgroundWorkerService.registerMarketTask();

registerRootComponent(App);

export default App;