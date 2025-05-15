import { Component, EventEmitter, Input, Output, signal, Signal} from '@angular/core';
import { CoursesList } from '../../models/courses-list';
import { DatalistComponent } from '../datalist/datalist.component';

@Component({
  selector: 'app-list-controls',
  imports: [DatalistComponent],
  templateUrl: './list-controls.component.html',
  styleUrl: './list-controls.component.scss'
})
export class ListControlsComponent {
  @Input() list!: Signal<CoursesList>;
  @Input() currentPage!: Signal<number>;

  @Output() pageChanged = new EventEmitter<number>();
  @Output() itemsPerPageChanged = new EventEmitter<number>();

  itemsPerPageSelections: Array<string> = ["5", "10", "20", "30", "50", "100"];

  /**
   * Skickar kurser per sida vidare till moderelementet courses.component.ts
   * @param itemsPerPage - kurser per sida.
   */
  onItemsPerPageSelection(itemsPerPage: string): void {
    this.itemsPerPageChanged.emit(Number(itemsPerPage));
  }
  
  /**
   * Går direkt till första sidan.
   */
  public firstPage(): void {
    this.pageChanged.emit(1);
  }

  /**
   * Föregående sida. Enkel if-sats för att gå över till sista sidan efter första sidan.
   */
  public prevPage(): void {
    const newPage = this.currentPage() - 1;
    const maxPages = this.list().maxPages;

    if (newPage < 1) {
      this.pageChanged.emit(maxPages);
    } else {
      this.pageChanged.emit(newPage);
    }
  }

  /**
   * Nästa sida. Enkel if-sats för att gå över till första sidan efter sista sidan.
   */
  public nextPage(): void {
    const newPage = this.currentPage() + 1;
    const maxPages = this.list().maxPages;

    if (newPage <= maxPages) {
      this.pageChanged.emit(newPage);
    } else {
      this.pageChanged.emit(1);
    }
  }

  /**
   * Går direkt till sista sidan.
   */
  public lastPage(): void {
    this.pageChanged.emit(this.list().maxPages);
  }
}
