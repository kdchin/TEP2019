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
import { FileUploadComponent } from './file-upload/file-upload.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { AuthGuard } from './_guards';
import { CsvImportComponent } from './csv-import/csv-import.component';
import { DeleteDbComponent } from './delete-db/delete-db.component';

const routes: Routes = [
  { path: '', component: TeacherFormComponent },
  { path: 'items', component: ItemListComponent, canActivate: [AuthGuard] },
  { path: 'items/:id', component: ItemDetailComponent, canActivate: [AuthGuard] },
  { path: 'teachers', component: TeacherListComponent, canActivate: [AuthGuard] },
  { path: 'teachers/:id', component: TeacherDetailComponent, canActivate: [AuthGuard] },
  // { path: 'order-items', component: OrderItemListComponent, canActivate: [AuthGuard] },
  { path: 'checkouts', component: OrderListComponent, canActivate: [AuthGuard] },
  { path: 'checkouts/:id', component: OrderDetailComponent, canActivate: [AuthGuard] },
  { path: 'schools', component: SchoolListComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'import', component: CsvImportComponent },
  { path: 'delete-db', component: DeleteDbComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }