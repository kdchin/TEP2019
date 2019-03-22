import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemListComponent } from './item-list/item-list.component';
import { TeacherListComponent } from './teacher-list/teacher-list.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderItemListComponent } from './order-item-list/order-item-list.component';
import { SchoolListComponent } from './school-list/school-list.component';

const routes: Routes = [
  { path: 'items', component: ItemListComponent },
  { path: 'teachers', component: TeacherListComponent },
  { path: 'order-items', component: OrderItemListComponent },
  { path: 'orders', component: OrderListComponent },
  { path: 'schools', component: SchoolListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }