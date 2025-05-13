import { Routes } from '@angular/router';
import { CoursesComponent } from './pages/courses/courses.component';
import { FrameworkComponent } from './pages/framework/framework.component';

export const routes: Routes = [
    { path: "courses", component: CoursesComponent },
    { path: "framework", component: FrameworkComponent },
    { path: "", pathMatch: "full", redirectTo: "/courses"}
];
