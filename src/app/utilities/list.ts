import { Course } from "../models/course";
import { CoursesList } from "../models/courses-list";
import { Page } from "../models/page";

export class List {
    public static pagination(courses: Array<Course>, coursesPerPage: number = 30): CoursesList {
        const pages: Array<Page> = [];
        const totalCourses: number = courses.length;
        const maxPages: number = Math.ceil(totalCourses / coursesPerPage);

        for (let i = 0; i < maxPages; i++) {
            const start = i * coursesPerPage;
            const end = start + coursesPerPage;
            const items = courses.slice(start, end);

            pages.push({
                nr: i + 1,
                items: items
            });
        }

        return {
            totalCourses: totalCourses,
            maxPages: maxPages,
            coursesPerPage: coursesPerPage,
            pages: pages
        };
    }
}
