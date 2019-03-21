import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemListComponent } from './item-list/item-list.component';
import { TeacherListComponent } from './teacher-list/teacher-list.component';
import { SchoolListComponent } from './school-list/school-list.component';

const routes: Routes = [
  { path: 'items', component: ItemListComponent },
  { path: 'teachers', component: TeacherListComponent },
  { path: 'schools', component: SchoolListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }