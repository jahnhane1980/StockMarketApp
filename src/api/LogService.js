// src/api/LogService.js - Manueller Versand & Dynamic Attachments (Full-Body)

import * as FileSystem from 'expo-file-system/legacy';
import * as MailComposer from 'expo-mail-composer';
import { Alert } from 'react-native';
import { Config } from '../core/Config';

const LOG_FILE_PATH = `${FileSystem.documentDirectory}session_log.txt`;

export const LogService = {
  appendLine: async (message) => {
    try {
      const timestamp = new Date().toISOString();
      const entry = `[${timestamp}] ${message}\n`;
      await FileSystem.writeAsStringAsync(LOG_FILE_PATH, entry, { append: true });
    } catch (error) {
      console.error("LogService Error:", error);
    }
  },

  /**
   * Manueller Versand des aktuellen Logs inkl. aller JSON-Dumps (ohne Löschen)
   */
  sendCurrentLog: async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(LOG_FILE_PATH);
      if (!fileInfo.exists) {
        Alert.alert("Hinweis", "Es ist noch keine Log-Datei vorhanden.");
        return;
      }

      // NEU: Dynamisches Sammeln der Attachments
      const attachments = [LOG_FILE_PATH];
      try {
        const dirFiles = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
        // Filtere nach Dateien, die wir im Trading212Service erstellt haben
        const jsonFiles = dirFiles.filter(f => f.startsWith('t212_') && f.endsWith('.json'));
        jsonFiles.forEach(f => attachments.push(`${FileSystem.documentDirectory}${f}`));
      } catch (fsError) {
        console.error("LogService: Fehler beim Sammeln der JSON-Dateien", fsError);
      }

      const isAvailable = await MailComposer.isAvailableAsync();
      if (isAvailable) {
        await MailComposer.composeAsync({
          recipients: [Config.ADMIN_EMAIL],
          subject: `StockAnalyser Support-Log`,
          body: `Manuell angeforderter Log-Bericht zur Fehleranalyse.\nAngehängte Dateien: ${attachments.length}`,
          attachments: attachments, // Array mit Log + allen gefundenen JSONs
        });
      } else {
        Alert.alert("Fehler", "Keine E-Mail-App konfiguriert.");
      }
    } catch (error) {
      console.error("LogService Manual Send Error:", error);
    }
  },

  processPreviousSession: async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(LOG_FILE_PATH);
      if (!fileInfo.exists) return;

      const content = await FileSystem.readAsStringAsync(LOG_FILE_PATH);
      
      if (content.includes('ERROR') || content.includes('WARN')) {
        const isAvailable = await MailComposer.isAvailableAsync();
        if (isAvailable) {
          
          // Für Auto-Reports sammeln wir sicherheitshalber auch die JSONs ein
          const attachments = [LOG_FILE_PATH];
          try {
            const dirFiles = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
            const jsonFiles = dirFiles.filter(f => f.startsWith('t212_') && f.endsWith('.json'));
            jsonFiles.forEach(f => attachments.push(`${FileSystem.documentDirectory}${f}`));
          } catch (e) {}

          await MailComposer.composeAsync({
            recipients: [Config.ADMIN_EMAIL],
            subject: `StockAnalyser Auto-Report`,
            body: "Die App hat Fehler in der letzten Sitzung erkannt.",
            attachments: attachments,
          });
        }
      }
      await FileSystem.deleteAsync(LOG_FILE_PATH, { idempotent: true });
    } catch (error) {
      console.error("LogService Session Cleanup Error:", error);
    }
  },

  startNewSession: async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(LOG_FILE_PATH);
      if (fileInfo.exists) await FileSystem.deleteAsync(LOG_FILE_PATH);
      
      await FileSystem.writeAsStringAsync(LOG_FILE_PATH, `--- SESSION START: ${new Date().toISOString()} ---\n`);
    } catch (error) {
      console.error("LogService Init Error:", error);
    }
  }
};