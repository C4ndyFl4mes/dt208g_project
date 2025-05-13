import { Page } from "./page";

export interface CoursesList {
    totalCourses: number;
    maxPages: number;
    coursesPerPage: number;
    pages: Array<Page>
}
