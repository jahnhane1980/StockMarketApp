// src/api/LogService.js - Manueller Versand & Robustheit (Full-Body)

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
      // 'append: true' stellt sicher, dass nichts überschrieben wird
      await FileSystem.writeAsStringAsync(LOG_FILE_PATH, entry, { append: true });
    } catch (error) {
      console.error("LogService Error:", error);
    }
  },

  /**
   * Manueller Versand des aktuellen Logs (ohne Löschen)
   */
  sendCurrentLog: async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(LOG_FILE_PATH);
      if (!fileInfo.exists) {
        Alert.alert("Hinweis", "Es ist noch keine Log-Datei vorhanden.");
        return;
      }

      const isAvailable = await MailComposer.isAvailableAsync();
      if (isAvailable) {
        await MailComposer.composeAsync({
          recipients: [Config.ADMIN_EMAIL],
          subject: `StockAnalyser Support-Log`,
          body: "Manuell angeforderter Log-Bericht zur Fehleranalyse.",
          attachments: [LOG_FILE_PATH],
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
      
      // Nur senden, wenn wirklich ein Fehler vorliegt
      if (content.includes('ERROR') || content.includes('WARN')) {
        const isAvailable = await MailComposer.isAvailableAsync();
        if (isAvailable) {
          await MailComposer.composeAsync({
            recipients: [Config.ADMIN_EMAIL],
            subject: `StockAnalyser Auto-Report`,
            body: "Die App hat Fehler in der letzten Sitzung erkannt.",
            attachments: [LOG_FILE_PATH],
          });
        }
      }
      // Erst nach der Prüfung löschen
      await FileSystem.deleteAsync(LOG_FILE_PATH, { immigrant: true });
    } catch (error) {
      console.error("LogService Session Cleanup Error:", error);
    }
  },

  startNewSession: async () => {
    try {
      // Falls die Datei noch existiert (z.B. kein Fehler beim letzten Mal), jetzt löschen
      const fileInfo = await FileSystem.getInfoAsync(LOG_FILE_PATH);
      if (fileInfo.exists) await FileSystem.deleteAsync(LOG_FILE_PATH);
      
      await FileSystem.writeAsStringAsync(LOG_FILE_PATH, `--- SESSION START: ${new Date().toISOString()} ---\n`);
    } catch (error) {
      console.error("LogService Init Error:", error);
    }
  }
};