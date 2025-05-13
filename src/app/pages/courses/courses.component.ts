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
  private courses = signal<Array<Course>>([]);
  list = signal<CoursesList>({
    totalCourses: 0,
    maxPages: 0,
    coursesPerPage: 0,
    pages: []
  });
  currentPage = signal<number>(1);
  page = signal<Page>(this.list().pages[0]);

  constructor(private courseService: CourseService) {
    courseService.getCourses().subscribe(data => {
      this.courses.set(data);
      this.list.set(List.pagination(this.courses(), 20));
      this.onPageChanged(1);
    });
  }

  onPageChanged(newPage: number) {
    this.currentPage.set(newPage);
    console.log(`Sida: ${this.currentPage()}`);

    for (const page of this.list().pages) {
      if (this.currentPage() == page.nr) {
        this.page.set(page);
      }
    }
  }
}
