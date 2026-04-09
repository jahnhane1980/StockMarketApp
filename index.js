// index.js - Update: Legacy Bootstrap (Full-Body)

import { registerRootComponent } from 'expo';
import { logger, consoleTransport } from 'react-native-logs';
import App from './App'; 
import { BackgroundWorkerService } from './src/api/BackgroundWorkerService';
import { LogService } from './src/api/LogService';

const fileTransport = (props) => {
  const message = `${props.level.text.toUpperCase()}: ${props.msg}`;
  LogService.appendLine(message);
};

const log = logger.createLogger({
  levels: { debug: 0, info: 1, warn: 2, error: 3 },
  transport: [consoleTransport, fileTransport],
});

global.log = log;

const bootstrap = async () => {
  // 1. Zuerst alte Logs verarbeiten (Trigger für Mail)
  await LogService.processPreviousSession();
  
  // 2. Dann Datei für die aktuelle Sitzung neu anlegen
  await LogService.startNewSession();

  log.info("App-Start im Legacy-Modus.");

  BackgroundWorkerService.defineMarketTask();
  await BackgroundWorkerService.setupNotifications();
  await BackgroundWorkerService.registerMarketTask();

  registerRootComponent(App);
};

bootstrap();

export default App;