# Sample Snack app

Open the `App.js` file to start writing some code. You can preview the changes directly on your phone or tablet by scanning the **QR code** or use the iOS or Android emulators. When you're done, click **Save** and share the link!

When you're ready to see everything that Expo provides (or if you want to use your own editor) you can **Download** your project and use it with [expo cli](https://docs.expo.dev/get-started/installation/#expo-cli)).

All projects created in Snack are publicly available, so you can easily share the link to this project via link, or embed it on a web page with the `<>` button.

If you're having problems, you can tweet to us [@expo](https://twitter.com/expo) or ask in our [forums](https://forums.expo.dev/c/expo-dev-tools/61) or [Discord](https://chat.expo.dev/).

Snack is Open Source. You can find the code on the [GitHub repo](https://github.com/expo/snack).

---

## TODO / Roadmap

* **Google API Integration**: Implementierung der echten Prompts und der Logik in `src/api/GoogleApiService.js`, um Live-Marktdaten und Analysen zu erhalten.
* **Listen-Performance**: Umstellung der Asset-Liste in `MainView.js` von `ScrollView` mit `.map()` auf die `FlatList`-Komponente. Dies reduziert die Speicherlast bei großen Portfolios durch Fenster-Rendering (Windowing).
* **Business-Logik (Berechnungen)**: Memoisierung der Berechnungen in `AssetRepository.getPositionStats` (z. B. durch einen Selector). Damit wird verhindert, dass die Kalkulationen bei jedem UI-Update unnötig neu ausgeführt werden.
* **Navigation & Erweiterung**: Einführung einer Navigations-Bibliothek wie **React Navigation**, um von der manuellen Dialog-Steuerung wegzukommen. Dies ist die Voraussetzung für geplante Erweiterungen wie eine dedizierte Analyse-Seite und den **StockRadar**.