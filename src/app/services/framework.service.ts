import { Injectable } from '@angular/core';
import { Course } from '../models/course';

@Injectable({
  providedIn: 'root'
})
export class FrameworkService {
  
  constructor() { }

  /**
   * Lägger till en kurs till ramschemat.
   * @param item - den kurs som ska läggas till.
   */
  add(item: Course): void {
    item.selected = true;

    this.saveToStorage(item);
  }

  /**
   * Tar bort en kurs från ramschemat.
   * @param item - den kurs som ska tas bort.
   * @returns den nya filtrerade arrayen av kurser.
   */
  remove(item: Course): Array<Course> {
    const courses: Array<Course> = this.loadStorage();
    const filtered: Array<Course> = courses.filter(course => course.courseCode !== item.courseCode && item.selected);
    
    this.reloadStorage(filtered);
    return filtered;
  }

  /**
   * Kollar om en kurs tillhör ramschemat eller inte.
   * @param item - en kurs som ska kollas.
   * @returns en boolean.
   */
  isSelected(item: Course): boolean {
    const courses = this.loadStorage();
    for (const course of courses) {
      if (item.courseCode == course.courseCode) {
        return true;
      }
    }
    return false;
  }

  /**
   * Hämtar alla kurser som finns i ramschemat från localStorage.
   * @returns en array av kurser.
   */
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

  /**
   * Lägger till en kurs till ramschemats localStorage.
   * @param item - den kurs som ska läggas till i localStorage.
   */
  saveToStorage(item: Course): void {
    const courses = this.loadStorage();
    courses.push(item);
    localStorage.setItem("framework", JSON.stringify(courses));
  }

  /**
   * Efter en borttagning måste ramchemats localStorage uppdateras.
   * @param courses - ramschemats kurser.
   */
  reloadStorage(courses: Array<Course>): void {
    localStorage.setItem("framework", JSON.stringify(courses));
  }
}
