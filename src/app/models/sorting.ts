import { Course } from "./course";

export interface Sorting {
    column: keyof Course;
    direction: 'ascending' | 'descending';
}
