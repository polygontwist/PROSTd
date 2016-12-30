# PROSTd - Projektstundenverwaltung

Ein kleines Webprojekt um Projektstunden zu erfassen und auszuwerten.

Die Daten werden in einem seperaten Verzeichnis gespeichet, die Einstellung der Verzeichnisse sind in "php\basis.php" zu finden:<br>
$pfaddata = Pfad zu einem Ordner von die Daten gespeichert werden sollen<br>
$pfadtemplates = Pfad für das projekt-Template, das die Grundstruktur eines Projektdatensatzes enthält<br>
$pfadJS = Pfad zum Javascript<br>
$pfadphp = Pfad zum php-Scripten<br>

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

# TODO
Der Plan ist noch eine lokale Variante mit http://electron.atom.io/ zu erstellen.
