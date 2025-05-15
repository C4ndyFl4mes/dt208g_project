import { Component, signal } from '@angular/core';
import { Course } from '../../models/course';
import { CourseService } from '../../services/course.service';
import { List } from '../../utilities/list';
import { ListControlsComponent } from '../../partials/list-controls/list-controls.component';
import { CoursesList } from '../../models/courses-list';
import { TableComponent } from '../../partials/table/table.component';
import { Page } from '../../models/page';

@Component({
  selector: 'app-courses',
  imports: [ListControlsComponent, TableComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent {
  parentPage = signal<string>("courses"); // Används för att enkelt bestämma hur knappen tillagd/ta bort ska se ut beroende på vad det är för sida. Kurslistan har "Tillagd" medans ramschema har "Ta bort."
  courses = signal<Array<Course>>([]); // Deklarerar en tom array av kurser.
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

  constructor(private courseService: CourseService) {
    courseService.getCourses().subscribe(data => {
      this.courses.set(data);
      this.list.set(List.pagination(this.courses()));
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
    this.list.set(List.pagination(this.courses(), this.itemsPerPage()));
    this.onPageChanged(1);
  }
}
