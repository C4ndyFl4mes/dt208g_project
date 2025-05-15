import { Component, signal } from '@angular/core';
import { Course } from '../../models/course';
import { CourseService } from '../../services/course.service';
import { List } from '../../utilities/list';
import { ListControlsComponent } from '../../partials/list-controls/list-controls.component';
import { CoursesList } from '../../models/courses-list';
import { TableComponent } from '../../partials/table/table.component';
import { Page } from '../../models/page';
import { DataControlsComponent } from '../../partials/data-controls/data-controls.component';
import { Sorting } from '../../models/sorting';

@Component({
  selector: 'app-courses',
  imports: [ListControlsComponent, TableComponent, DataControlsComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent {
  parentPage = signal<string>("courses"); // Används för att enkelt bestämma hur knappen tillagd/ta bort ska se ut beroende på vad det är för sida. Kurslistan har "Tillagd" medans ramschema har "Ta bort."
  courses = signal<Array<Course>>([]); // Deklarerar en tom array av kurser.
  coursesOnDisplay = signal<Array<Course>>([]);
  subjects = signal<Array<string>>([]);
  // Deklarerar listan:
  list = signal<CoursesList>({
    totalCourses: 0,
    maxPages: 0,
    coursesPerPage: 0,
    pages: []
  });
  currentPage = signal<number>(1); // Nuvarande sida, börjar på sida 1.
  page = signal<Page>(this.list().pages[0]); // Innehållet på sida 1.

  itemsPerPage = signal<number>(30); // Antalet kurser per sida, 30 är standard värdet.

  lastSort = signal<{ column: keyof Course; direction: 'ascending' | 'descending' } | null>(null); // Används för att hålla reda på senaste sorteringen.

  constructor(private courseService: CourseService) {
    courseService.getCourses().subscribe(data => {
      this.courses.set(data);
      this.coursesOnDisplay.set(data);
      const uniqueSubjects = Array.from(new Set(this.courses().map(course => course.subject)));
      this.subjects.set(["Alla", ...uniqueSubjects]);
      this.list.set(List.pagination(this.coursesOnDisplay()));
      this.onPageChanged(1);
    });
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

  filter(courses: Array<Course>): void {
    
    this.coursesOnDisplay.set(courses);
    this.list.set(List.pagination(this.coursesOnDisplay()));

    // Gör att sortering läggs på.
    const sort = this.lastSort();
    if (sort) {
      this.sort(sort);
    } else {
      this.onPageChanged(1); 
    }
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
