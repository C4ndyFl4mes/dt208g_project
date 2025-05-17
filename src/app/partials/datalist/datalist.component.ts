import { Component, ElementRef, EventEmitter, Input, Output, QueryList, signal, Signal, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-datalist',
  imports: [],
  templateUrl: './datalist.component.html',
  styleUrl: './datalist.component.scss'
})
export class DatalistComponent {

  @Input() items!: Array<string>; // "föremål" i listan.
  @Input() startingValue!: string; // Startvärde.
  @Input() labelText!: string; // Label.
  @Input() readOnly!: boolean;
  @Input() id!: string;

  @Output() value = new EventEmitter<string>(); // Output som används för att skicka till moderelementet.

  isOpen = signal<boolean>(false); // Håller koll på listan visas eller inte.
  displayItems = signal<Array<string>>([]); // De föremål som ska visas, de kan vara filtrerade efter sökning.

  currentValue = signal<string>(""); // Vad det är för värde just nu.
  typedValue = signal<string>(''); // Vad användaren skriver i för värde.

  focusedIndex: number = -1; // Håller reda på vilket föremål är fokuserad just nu.

  isClickingItem = false; // Används vid att kontrollera om användaren klickar på ett föremål i listan.

  @ViewChildren('itemEl') itemElements!: QueryList<ElementRef>; // Används vid att alltid visa föremålet i listan, även om det behövs skrollas.

  ngOnInit(): void {
    this.typedValue.set(this.startingValue); // Sätter startvärde.
    this.value.emit(this.typedValue()); // Ser till att det alltid är ett värde som skickas vid initiering.
  }

  /**
   * Visar dropdown meny.
   */
  open(): void {
    this.displayItems.set(this.items);
    this.isOpen.set(true);
  }

  /**
   * Gömmer dropdown meny.
   */
  close(): void {
    // this.focusedIndex = -1;
    this.isOpen.set(false);
  }

  /**
   * Väljer ett värde och skickar värdet till moderkomponenten.
   * @param item - det valda värdet.
   * @param keyEvent - händelse.
   */
  select(item: string, keyEvent: KeyboardEvent): void {
    const li = keyEvent.target as HTMLElement;
    if (keyEvent.key == " " || keyEvent.key == "Enter") {
      this.currentValue.set(item);
      this.typedValue.set(item);
      this.value.emit(item);

      li.blur();
      this.close();
    }

  }

  /**
   * Väljet ett värde vid musklick och skickar värdet till moderkomponenten.
   * @param item - det valda värdet.
   * @param event - händelse.
   */
  selectClick(item: string, event: Event): void {
    const li = event.target as HTMLElement;
    this.currentValue.set(item);
    this.typedValue.set(item);
    this.value.emit(item);

    li.blur();
    this.close();
  }

  /**
   * Vid input söker efter det närmsta värdet.
   * @param event - händelse.
   */
  search(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.typedValue.set(input.value);
    this.displayItems.set(this.items.filter(item => item.toLocaleLowerCase().includes(input.value.toLocaleLowerCase())));
  }

  /**
   * Navigerar mellan olika alternativ med ner- och up-pilarna.
   * @param event - händelse.
   */
  navigation(event: KeyboardEvent): void {
    const items = this.displayItems();
    if (event.key === "ArrowDown") {
      event.preventDefault();
      this.focusedIndex = (this.focusedIndex + 1) % items.length; // Stegande, modulus gör att det går om, items.length blir index 0.
      this.scrollToFocusedItem();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      this.focusedIndex = (this.focusedIndex - 1 + items.length) % items.length; // Fallande, modulus gör att går om, -1 blir items.length - 1.
      this.scrollToFocusedItem();
    } else if (event.key === "Enter" || event.key === "Space") {
      this.typedValue.set(items[this.focusedIndex]);
    }

    // Ser till att indexet finns och därefter anropar select.
    if (this.focusedIndex >= 0 && this.focusedIndex < items.length) {
      this.select(items[this.focusedIndex], event);
    }
  }

  /**
   * En liten delay på blur så att klick händelser hinner registreras innan fokuset försvinner.
   */
  handleBlur(): void {
    setTimeout(() => {
      if (this.isClickingItem) {
        this.isClickingItem = false;
        return;
      }
      this.close();
    }, 10);
  }

  /**
   * Ser till att det fokuserade värdet är alltid synlig.
   */
  scrollToFocusedItem(): void {
    const element = this.itemElements.get(this.focusedIndex);
    if (element) {
      element.nativeElement.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }
}