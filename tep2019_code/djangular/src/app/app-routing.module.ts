import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemListComponent } from './item-list/item-list.component';
import { TeacherListComponent } from './teacher-list/teacher-list.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderItemListComponent } from './order-item-list/order-item-list.component';
import { SchoolListComponent } from './school-list/school-list.component';
import { TeacherDetailComponent } from './teacher-detail/teacher-detail.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { TeacherFormComponent } from './teacher-form/teacher-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: 'form', component: TeacherFormComponent },
  { path: 'items', component: ItemListComponent },
  { path: 'items/:id', component: ItemDetailComponent },
  { path: 'teachers', component: TeacherListComponent },
  { path: 'teachers/:id', component: TeacherDetailComponent },
  { path: 'order-items', component: OrderItemListComponent },
  { path: 'orders', component: OrderListComponent },
  { path: 'orders/:id', component: OrderDetailComponent },
  { path: 'schools', component: SchoolListComponent },
  { path: '', component: DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }