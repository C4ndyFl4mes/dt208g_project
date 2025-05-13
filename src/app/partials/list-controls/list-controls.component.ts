import { Component, EventEmitter, Input, Output, Signal} from '@angular/core';
import { CoursesList } from '../../models/courses-list';

@Component({
  selector: 'app-list-controls',
  imports: [],
  templateUrl: './list-controls.component.html',
  styleUrl: './list-controls.component.scss'
})
export class ListControlsComponent {
  @Input() list!: Signal<CoursesList>;
  @Input() currentPage!: Signal<number>;

  @Output() pageChanged = new EventEmitter<number>();

  public firstPage(): void {
    this.pageChanged.emit(1);
  }

  public prevPage(): void {
    const newPage = this.currentPage() - 1;
    const maxPages = this.list().maxPages;

    if (newPage < 1) {
      this.pageChanged.emit(maxPages);
    } else {
      this.pageChanged.emit(newPage);
    }
  }

  public inputPage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    const maxPages = this.list().maxPages;

    if (value <= maxPages && value > 0) {
      this.pageChanged.emit(value);
    } else if (value < 0) {
      this.pageChanged.emit(1);
      input.value = "1";
    } else if (value > maxPages) {
      this.pageChanged.emit(maxPages);
      input.value = String(maxPages);
    }
  }

  public nextPage(): void {
    const newPage = this.currentPage() + 1;
    const maxPages = this.list().maxPages;

    if (newPage <= maxPages) {
      this.pageChanged.emit(newPage);
    } else {
      this.pageChanged.emit(1);
    }
  }

  public lastPage(): void {
    this.pageChanged.emit(this.list().maxPages);
  }
}
