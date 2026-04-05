import { registerRootComponent } from 'expo';
import { logger } from 'react-native-logs';
import App from './App'; 

// Globalen Logger initialisieren (nur Konsole für Expo Snack Kompatibilität)
const log = logger.createLogger();

// Den Logger global verfügbar machen, damit er überall ohne Import genutzt werden kann
global.log = log;

log.info("App wird gestartet und Logger ist initialisiert.");

// Wichtig: Die Komponente registrieren...
registerRootComponent(App);

// ...UND als default exportieren
export default App;