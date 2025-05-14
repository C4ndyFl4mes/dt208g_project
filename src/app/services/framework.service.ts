import { Injectable } from '@angular/core';
import { Course } from '../models/course';

@Injectable({
  providedIn: 'root'
})
export class FrameworkService {
  
  constructor() { }

  add(item: Course) {
    item.selected = true;

    this.saveToStorage(item);
  }

  isSelected(item: Course): boolean {
    const courses = this.loadStorage();
    for (const course of courses) {
      if (item.courseCode == course.courseCode) {
        return true;
      }
    }
    return false;
  }

  loadStorage(): Array<Course> {
    const storage = localStorage.getItem("framework");
    if (storage) {
      const courses: Array<Course> | null = JSON.parse(storage);
      if (courses) {
        return courses;
      } else {
        return [];
      }
    }
    return [];
  }

  saveToStorage(item: Course): void {
    const courses = this.loadStorage();
    courses.push(item);
    localStorage.setItem("framework", JSON.stringify(courses));
  }
}
