# PROSTd - Projektstundenverwaltung

Ein kleines Webprojekt um Projektstunden zu erfassen und auszuwerten.

siehe auch: https://github.com/polygontwist/PROSTd-App (Für Versionsinfos, siehe dort)

Die Daten werden in einem seperaten Verzeichnis gespeichet, die Einstellung der Verzeichnisse sind in "php\basis.php" zu finden:<br>
$pfaddata = Pfad zu einem Ordner von die Daten gespeichert werden sollen<br>
$pfadtemplates = Pfad für das projekt-Template, das die Grundstruktur eines Projektdatensatzes enthält<br>
$pfadJS = Pfad zum Javascript<br>
$pfadphp = Pfad zum php-Scripten<br>

# Systemvorraussetzungen
Ich habe es auf einem Raspi mit lighttpd und php laufen. Serverseitig benötigt man also php. Clientseitig benötigt man eien aktuellen Browser mit Javascript.

# neue User
Wenn zu einem Namen beim Login kein Konto exitstiert, erscheint der Button "registrieren". Gibt man dann einen Namen und ein Passwort ein wird ein neuer Ordner (mit Namen von "Name") im Ordner von "$pfaddata" angelegt.

# Datenaufbau
Zu dem eingeloggten User existiert ein gleichnamiger Ordner in "$pfaddata".<br> 
Darin sind folgende Dateien enthalten:<br>
* "pass.txt" mit verschlüsseltem Passwort
* "optionen.txt" darin wird der aktuelle Status von PROSTd gespeichert (z.B. welcher Tab aktiv war) als JSON
* "*.js" beinhalten die Daten der jeweiligen Projekte als JSON

# Sprachen/languages
Die verwendeten Worte sind in /js/sprache.js definiert, es kann darin für jede Sprache eine Wortliste geben. 
Momentan nur deutsch bis das Grundset gesammelt ist. Englisch als Grundobjekt angelegt.

Die aktive Sprache ist in der Variabel "spracheaktiv" gesetzt.

# Screenshots
![screenshot_1mein_tag](https://cloud.githubusercontent.com/assets/3751286/21572196/da46abbe-ced6-11e6-938a-0446452d6b5f.png)
![screenshot_2meine_projekte](https://cloud.githubusercontent.com/assets/3751286/21572216/ff415afe-ced6-11e6-9ab6-fdfe349b1371.png)
![screenshot3_ueberblick](https://cloud.githubusercontent.com/assets/3751286/21572528/29fd8418-ceda-11e6-93fd-e5c6842db5e7.png)

# Disclaimer 
Die Daten werden nicht verschlüsselt, nur das Passwort - wer möchte darf hier gerne weiterentwickeln.

# lokale Variante 
mit http://electron.atom.io/ siehe https://github.com/polygontwist/PROSTd-App


# Projekt exportieren

Im Tab "Meine Projekte" gibt es seit Version 0.1.42 die Option, die Daten als csv zu exportieren. Z.B. für die Weiterverarbeitung in Excel, Calc oder andere.
Die Trennung der Datenfelder ist mit einem ";" umgesetzt.

<img src="https://github.com/polygontwist/PROSTd-App/blob/master/screenshots/prost0-1-42.png" width="593" alt="Screenshot Übersicht">
