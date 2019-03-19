import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemCreateComponent } from './item-create/item-create.component';
import { TeacherListComponent } from './teacher-list/teacher-list.component';
import { PhonePipe } from './phone.pipe';
import { TeacherCreateComponent } from './teacher-create/teacher-create.component';
import { SchoolListComponent } from './school-list/school-list.component';
import { SchoolCreateComponent } from './school-create/school-create.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemListComponent,
    ItemCreateComponent,
    TeacherListComponent,
    PhonePipe,
    TeacherCreateComponent,
    SchoolListComponent,
    SchoolCreateComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }