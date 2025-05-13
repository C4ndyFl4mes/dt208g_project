import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from '../models/course';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {


  constructor(private http: HttpClient) {}

  public getCourses(): Observable<Array<Course>> {
    return this.http.get<Array<Course>>("https://matdah.github.io/DT208G---Programmering-i-TypeScript/Moment%205%20-%20Projekt/miun_courses.json");
  }
}

