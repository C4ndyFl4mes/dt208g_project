# Projekt - Kurslista
En webbplats skapad med TypeScript, Angular, vars uppgift är att lista kurser och möjlighet att skapa ett ramschema. Webbplatsen har två sidor: ett för att lista kurser och en annan för att visa ramschema.

## Komponent: Kurssidan
Kurssidan hanterar hämtning av kursdata genom en service och därefter skickar informationen till en tabellkomponent som listar dessa kurser. Kurssidan utöver att hämta information också sköter filtrering, sortering och pagination.

## Komponent: Ramschemasidan
Ramschemasidan hanterar hämtning av kursdata från localStorage genom en service och därefter skickar informationen till en tabellkomponent som listar dessa kurser. Ramschemasidan har ingen filtering eller pagination, den har sortering. Det var ett medvetet val.

## Komponent: Tabell
Tabellen återanvänds två gånger med hjälp av olika Input() och hanterar olika data beroende på om den ligger på kurssidan eller ramschemasidan. Tabellen hanterar både vad för sortering är tillgänglig och sorteringsutseendet, den uppdaterar utseendet automatiskt för att visa vilken typ av sortering som pågår.
Det ska påpekas att själva sorteringen sköts på kurssidan respektive ramschemasidan. Efter en sortering skickas kurserna tillbaka till tabellen och visar den sorterade listan, samma gäller filtering och pagination. Tabellen är endast reaktiv gällande visning av
kursinformation. Vid klick av en kursrad skickas användaren till kursplanen i en ny flik.

## Service: Kurs och ramschema
Det enda kursservice gör är att hämta information från den externa källan, men ramschemats service är något mer komplicerad och tillhandahåller ett flertal metoder. Metoderna är följande:
* add: lägger till en kurs till ramschema.
* remove: tar bort en kurs från ramschema.
* isSelected: kollar om en kurs är i ramschemat.
* loadStorage: hämtar kursinformation från localStorage.
* saveToStorage: sparar en kurs till localStorage.
* reloadStorage: sparar om hela localStorage (efter en borttagning).

Tillsammans gör dessa metoder att ramschemat hanteras på ett sätt som gör att det förhoppningsvis inte kan gå fel.

## Partials
Utöver tabellen användes flera andra komponenter.

### Komponent: Meny
En enkel meny som jag återanvänder från en tidigare uppgift, men med en del förändringar. Menyn har två lägen, en dropdown meny i mobilläget och en vanlig meny på större skärmar.

### Komponent: Listkontroller
Komponenten sköter sidförflyttningar och angivelse av hur många kurser ska visas per sida. Den visar också hur många kurser det finns i en filtrering, samt sidantalet beroende på antalet kurser per sida. Användaren kan förflytta sig bakåt och framåt med enkla if-satser för att gå runt, alltså från sista sidan till sida ett. Det finns två ytterligare knappar som gör att användaren kan direkt hoppa till sida ett eller sista sidan.

### Komponent: Datakontroller
Komponenten sköter angivelsen av filteringar. Det nämndes tidigare att kurssidan hanterar filteringar, en filtering (sökfras samt vilket ämne/alla) skickas från datakontroller komponenten till moderkomponenten (kurssidan). Samma sak gäller pagination, paginering sker i moderkomponeten och inte i listkontroller.

### Komponent: Datalist
En komponent som endast var till för det grafiska utseendet. Eftersom en vanlig datalist inte kan stylas, måste en custom datalist göras. Flera aspekter behövdes tas om hand såsom att kunna hanteras av ett tangentbord. Min datalist fungerar med mus, sökning och tangentbord för att bli så lik en vanlig datalist som möjligt. 

## Extra funktionalitet
Här är alla extra grejer:
* Mörkt och ljust tema. Dock är det bara två olika gråa teman, ville testa hur tråkigt det skulle se ut.
* Pagination med olika antal kurser per sida möjligheter: 5, 10, 20, 30, 50 och 100 kurser/sida.
* Grafisk design, dock är jag inte så bra. Personligen tycker jag om knapparna för att blädra bland sidor och lägga till/ta bort.
* Bättre datalist som gör att sidan blir en mer enhetlig design.
* Sorteringen är gömd och ligger istället på tangentbordsvänliga th för att bli mer användarvänligt.
