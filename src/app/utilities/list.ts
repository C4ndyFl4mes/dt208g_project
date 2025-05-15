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

    public static filterCourses(courses: Array<Course>, query: string, subject: string = "Alla"): Array<Course> {
        const term = query.toLocaleLowerCase();
        return courses.filter(course => {
            const matchesQuery =
                course.courseCode.toLocaleLowerCase().includes(term) ||
                course.courseName.toLocaleLowerCase().includes(term);

            const matchesSubject = subject === "Alla" || course.subject.toLocaleLowerCase() === subject.toLocaleLowerCase();

            return matchesQuery && matchesSubject;
        });
    }

}
