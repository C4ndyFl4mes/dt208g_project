# Projekt - Kurslista
En webbplats skapad med TypeScript, Angular, vars uppgift är att lista kurser och möjlighet att skapa ett ramschema. Webbplatsen har två sidor: ett för att lista kurser och en annan för att visa ramschema.

## Komponenten: Kurssidan
Kurssidan hanterar hämtning av kursdata genom en service och därefter skickar informationen till en tabellkomponent som listar dessa kurser. Kurssidan utöver att hämta information också sköter filtrering, sortering och pagination.

## Komponenten: Ramschemasidan
Ramschemasidan hanterar hämtning av kursdata från localStorage genom en service och därefter skickar informationen till en tabellkomponent som listar dessa kurser. Ramschemasidan har ingen filtering eller pagination, den har sortering. Det var ett medvetet val.

## Komponenten: Tabell
Tabellen återanvänds två gånger med hjälp av olika Input() och hanterar olika data beroende på om den ligger på kurssidan eller ramschemasidan. Tabellen hanterar både vad för sortering är tillgänglig och sorteringsutseendet, den uppdaterar utseendet automatiskt för att visa vilken typ av sortering som pågår.
Det ska påpekas att själva sorteringen sköts på kurssidan respektive ramschemasidan. Efter en sortering skickas kurserna tillbaka till tabellen och visar den sorterade listan, samma gäller filtering och pagination. Tabellen är endast reaktiv gällande visning av
kursinformation. Vid klick av en kursrad skickas användaren till kursplanen i en ny flik.

## Service: Kurs och ramschema
Det enda kursservice gör är att hämta information från den externa källan, men ramschemats service är något mer komplicerad och tillhandahåller ett flertal metoder.
