import { Component, EventEmitter, Input, Output, Signal, signal } from '@angular/core';
import { Course } from '../../models/course';
import { List } from '../../utilities/list';
import { DatalistComponent } from '../datalist/datalist.component';

@Component({
  selector: 'app-data-controls',
  imports: [DatalistComponent],
  templateUrl: './data-controls.component.html',
  styleUrl: './data-controls.component.scss'
})
export class DataControlsComponent {

  @Input() courses!: Signal<Array<Course>>;
  @Input() items!: Signal<Array<string>>;

  @Output() onFilter = new EventEmitter<Array<Course>>();

  subject = signal<string>("");
  filterValue = signal<string>("");

  filter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filterValue.set(input.value);
    this.onFilter.emit(List.filterCourses(this.courses(), input.value, this.subject()));
  }

  setSubject(value: string): void {
    this.subject.set(value);
    this.onFilter.emit(List.filterCourses(this.courses(), this.filterValue(), this.subject()));
  }
}
