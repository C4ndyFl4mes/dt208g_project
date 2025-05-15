import { Component, EventEmitter, Input, Output, Signal, signal } from '@angular/core';
import { Page } from '../../models/page';
import { FrameworkService } from '../../services/framework.service';
import { Course } from '../../models/course';
import { Sorting } from '../../models/sorting';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  @Input() parentPage!: Signal<string>;
  @Input() page!: Signal<Page>;
  @Input() coursesOnDisplay!: Signal<Array<Course>>;

  sortingStates: Array<string> = ["none", "ascending", "descending"];

  codeState = signal(this.sortingStates[0]);
  nameState = signal(this.sortingStates[0]);
  pointsState = signal(this.sortingStates[0]);
  subjectState = signal(this.sortingStates[0]);

  @Output() sortRequested = new EventEmitter<Sorting>();

  constructor(public framework: FrameworkService) { }

  openPlan(link: string): void {
    window.open(link, "_blank");
  }

  /**
   * Denna uppdaterar indikationen på vilken sortering det är.
   * @param column - en kolumn.
   */
  forward(column: string): void {
    let index = 0;

    switch (column) {
      case "courseCode":
        index = this.sortingStates.indexOf(this.codeState()) + 1;
        if (index == this.sortingStates.length) {
          index = 1;
        }
        this.codeState.set(this.sortingStates[index]);
        this.nameState.set(this.sortingStates[0]);
        this.pointsState.set(this.sortingStates[0]);
        this.subjectState.set(this.sortingStates[0]);
        break;
      case "courseName":
        index = this.sortingStates.indexOf(this.nameState()) + 1;
        if (index == this.sortingStates.length) {
          index = 1;
        }
        this.codeState.set(this.sortingStates[0]);
        this.nameState.set(this.sortingStates[index]);
        this.pointsState.set(this.sortingStates[0]);
        this.subjectState.set(this.sortingStates[0]);
        break;
      case "points":
        index = this.sortingStates.indexOf(this.pointsState()) + 1;
        if (index == this.sortingStates.length) {
          index = 1;
        }
        this.codeState.set(this.sortingStates[0]);
        this.nameState.set(this.sortingStates[0]);
        this.pointsState.set(this.sortingStates[index]);
        this.subjectState.set(this.sortingStates[0]);
        break;
      case "subject":
        index = this.sortingStates.indexOf(this.subjectState()) + 1;
        if (index == this.sortingStates.length) {
          index = 1;
        }
        this.codeState.set(this.sortingStates[0]);
        this.nameState.set(this.sortingStates[0]);
        this.pointsState.set(this.sortingStates[0]);
        this.subjectState.set(this.sortingStates[index]);
        break;
      default:
        break;
    }

  }

  /**
   * Avgör vilken kolumn och vilken riktning sorteringen ska utföras.
   * @param column - kolumn som enbart kan vara en av egenskaperna tillhörande Course.
   */
  sortBy(column: keyof Course): void {
    this.forward(column);

    const direction =
      column === 'courseCode' ? this.codeState() :
        column === 'courseName' ? this.nameState() :
          column === 'points' ? this.pointsState() :
            column === 'subject' ? this.subjectState() :
              'none';

    if (direction === 'ascending' || direction === 'descending') {
      this.sortRequested.emit({ column, direction });
    }
  }
}
