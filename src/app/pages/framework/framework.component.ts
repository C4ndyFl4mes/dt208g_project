import { Component, signal } from '@angular/core';
import { TableComponent } from '../../partials/table/table.component';
import { Course } from '../../models/course';
import { FrameworkService } from '../../services/framework.service';
import { CoursesList } from '../../models/courses-list';
import { Page } from '../../models/page';
import { List } from '../../utilities/list';
import { Sorting } from '../../models/sorting';
import { ListControlsComponent } from '../../partials/list-controls/list-controls.component';

@Component({
  selector: 'app-framework',
  imports: [TableComponent],
  templateUrl: './framework.component.html',
  styleUrl: '../courses/courses.component.scss'
})
export class FrameworkComponent {
  parentPage = signal<string>("framework"); // Används för att enkelt bestämma hur knappen tillagd/ta bort ska se ut beroende på vad det är för sida. Kurslistan har "Tillagd" medans ramschema har "Ta bort."
  courses = signal<Array<Course>>([]); // Deklarerar en tom array av kurser.
  coursesOnDisplay = signal<Array<Course>>([]);

  list = signal<CoursesList>({
    totalCourses: 0,
    maxPages: 0,
    coursesPerPage: 0,
    pages: []
  });
  currentPage = signal<number>(1); // Nuvarande sida, börjar på sida 1.
  page = signal<Page>(this.list().pages[0]); // Innehållet på sida 1.

  // Tyvärr lyckades jag inte få till antalet som ska visas på en sida utan att skapa fler sidor. 
  // Jag satte fem biljoner (5.000.000.000.000) bara för att visa att det fungerar, kunde lika gärna vara 4328. Det var tänkt att beräknas utifrån
  // max antal kurser som man kan hämnta från filen, men det var för krångligt då this.list().totalCourses innehåller enbart max antal kurser sparade i ramchemat.
  // Det kanske var dumt att använda så många signals som orsakar evighetsloopar. 
  itemsPerPage = signal<number>(5000000000000); 

  lastSort = signal<Sorting | null>(null); // Används för att hålla reda på senaste sorteringen.

  totalAmountOfPoints = signal<number>(0);

  constructor(private framework: FrameworkService) {
    const courses: Array<Course> = framework.loadStorage();
    this.courses.set(courses);
    this.coursesOnDisplay.set(courses);
    this.totalAmountOfPoints.set(this.pointSum(this.coursesOnDisplay()));
    this.list.set(List.pagination(this.coursesOnDisplay(), this.itemsPerPage()));
    this.onPageChanged(1);
  }

  /**
   * Räknar summan av poängen i ramschemat.
   * @param courses - de kurser i ramschemat som ska räknas.
   * @returns totala mängden poäng.
   */
  pointSum(courses: Array<Course>): number {
    let sum = 0;
    courses.forEach(course => {
      sum += course.points;
    });
    return sum;
  }

  /**
   * Uppdaterar listan.
   * @param filtered - den nya arrayen.
   */
  removing(filtered: Array<Course>): void {
    this.coursesOnDisplay.set(filtered);
    this.totalAmountOfPoints.set(this.pointSum(this.coursesOnDisplay()));
    this.list.set(List.pagination(this.coursesOnDisplay(), this.itemsPerPage()));
    this.onPageChanged(1);

    // Lägger till sortering.
    const sort = this.lastSort();
    if (sort) {
      this.sort(sort);
    }
  }

  /**
  * Visar den nya sidan.
  * @param newPage - nya sidan.
  */
  onPageChanged(newPage: number): void {
    this.currentPage.set(newPage);
    for (const page of this.list().pages) {
      if (this.currentPage() == page.nr) {
        this.page.set(page);
      }
    }
  }

  /**
  * Uppdaterar antalet kurser per sida.
  * @param itemsPerPage - kurser per sida.
  */
  onItemsPerPageChanged(itemsPerPage: number): void {
    this.itemsPerPage.set(itemsPerPage);
    this.list.set(List.pagination(this.coursesOnDisplay(), this.itemsPerPage()));
    this.onPageChanged(1);
  }

  /**
   * Denna sorterar en kolumn i en riktning åt gången. 
   * Den tar in ett objekt där column måste vara en egenskap av Course och direction måste vara ascending eller descending.
   * @param param0 - ett objekt med egenskaperna column och direction.
   */
  sort({ column, direction }: Sorting): void {
    this.lastSort.set({ column, direction });
    const sorted = [...this.coursesOnDisplay()].sort((a, b) => {
      const aVal = a[column]; // Första värde.
      const bVal = b[column]; // Andra värde.

      // Här kollar den om värdena är strängar, om så är fallet används localeCompare.
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return direction === 'ascending' // Ändrar ordningen på första och andra värdet bereonde på om det är ascending eller inte.
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      // Gör exakt samma sak som ovan if-sats och trinäroperator men för tal.
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'ascending' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    this.coursesOnDisplay.set(sorted);
    this.list.set(List.pagination(sorted, this.itemsPerPage()));
    this.onPageChanged(1);
  }
}
