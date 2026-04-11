# Sample Snack app

Open the `App.js` file to start writing some code. You can preview the changes directly on your phone or tablet by scanning the **QR code** or use the iOS or Android emulators. When you're done, click **Save** and share the link!

When you're ready to see everything that Expo provides (or if you want to use your own editor) you can **Download** your project and use it with [expo cli](https://docs.expo.dev/get-started/installation/#expo-cli)).

All projects created in Snack are publicly available, so you can easily share the link to this project via link, or embed it on a web page with the `<>` button.

If you're having problems, you can tweet to us [@expo](https://twitter.com/expo) or ask in our [forums](https://forums.expo.dev/c/expo-dev-tools/61) or [Discord](https://chat.expo.dev/).

Snack is Open Source. You can find the code on the [GitHub repo](https://github.com/expo/snack).

---

## 🛠 Refactoring & Architektur-Roadmap (Geplant)

Die folgenden Punkte wurden zur Verbesserung der Code-Qualität, Performance und Wartbarkeit identifiziert und sollen Schritt für Schritt umgesetzt werden:


### 2. Utils-Schicht etablieren (Separation of Concerns)
* **`JsonUtils`:** Extraktion der fehleranfälligen JSON-Sanitizing-Logik (z. B. das Entfernen von Markdown-Backticks via `indexOf('{')`) aus dem `GoogleApiService`. Der API-Service soll nur noch Daten transportieren, nicht mehr parsen.
* **`PortfolioCalculator` / `MathUtils`:** Auslagerung der Business-Logik (Berechnung von Durchschnittskursen, Gesamtanteilen, Fiat-Werten). Aktuell rechnet das `AssetRepository` in `getPositionStats`. Repositories sollen jedoch ausschließlich für das Speichern/Laden von Daten zuständig sein.
* **`DateUtils` / `Constants`:** Magische Arrays und redundante Definitionen (wie z. B. die Monatsnamen `["Januar", "Februar", ...]`, die aktuell doppelt in `TransactionTransformer` und `GoogleApiService` liegen) werden zentralisiert.

### 3. Caching-Logik zentralisieren (DRY-Prinzip)
* **Ziel:** Die redundante Try-Catch- und Timestamp-Prüflogik (Alter des Caches vs. `CACHE_DURATION`) aus `MacroRepository`, `RadarRepository` und `Trading212Repository` entfernen.
* **Umsetzung:** Eine zentrale Methode wie `getValidCache(key, maxAge)` im `StorageService` oder einem neuen `CacheManager` implementieren.

### 4. UI-Performance & Bugfixes
* **FlatList-Performance (`PortfolioList.js`):** Der Aufruf von `AssetRepository.getPositionStats(asset)` innerhalb der `renderItem`-Funktion führt bei jedem Scrollen zu Neuberechnungen. Die Stats sollen zukünftig im `useCoreData`-Hook beim `refreshAssets` vorberechnet und als fertige Werte an die UI übergeben werden.
* **Log-System aktivieren:** Das `global.log` wird aktuell in der Einstiegsdatei (`App.js` / `index.js`) nicht initialisiert, weshalb die Aufrufe `global.log.info(...)` ins Leere laufen. Dies muss im Setup-Hook gebunden werden.

### 5. Ordnerstruktur aufräumen (Komponenten)
* **Ziel:** Den `src/ui/components`-Ordner strukturieren. 
* **Umsetzung:** Gruppierung der aktuell über 14 flachen Dateien in logische Unterordner wie `dialogs/`, `cards/` (für StockItem, ErrorBox) und `layout/` (für Toolbar).

---

### ❌ Verworfen: React Navigation
Die ursprüngliche Idee, *React Navigation* zu integrieren, wurde offiziell gestrichen. Die App funktioniert konzeptionell als slickes **Single-Screen-Dashboard**. Die Steuerung der Overlays über einfache Boolean-Flags im `useUiState`-Hook ist absolut ausreichend, hochperformant und erspart uns unnötigen Library-Overhead.

### ✅ Business-Logik (Berechnungen)
Memoisierung der Berechnungen in `AssetRepository.getPositionStats` (z. B. durch einen Selector). Damit wird verhindert, dass die Kalkulationen bei jedem UI-Update unnötig neu ausgeführt werden.

### ✅ Gewinnstatistik 
Die App verfügt über ein dediziertes Statistik-Dashboard, das realisierte und unrealisierte Gewinne präzise voneinander trennt. Es schlüsselt die Performance für das Gesamtportfolio sowie pro Einzelaktie auf und zeigt neben dem absoluten Euro-Wert stets die prozentuale Rendite bezogen auf das exakt für diese Anteile eingesetzte Kapital an.

### ✅ Base API Service (Netzwerk-Schicht)
* **Ziel:** Zusammenführung der `fetch`-Logik aus `GoogleApiService` und `Trading212Service` in einen zentralen `BaseApiService` (oder `HttpClient`).
* **Vorteil:** Einheitliches Error-Handling, globale Timeout-Steuerung (`AbortController`), zentrale Retry-Logik (für 429/503 Fehler) und gebündeltes Response-Logging ins FileSystem.