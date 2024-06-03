import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderComponent } from './components/header/header.component';
import { LoginInputComponent } from './components/login-input/login-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { UpdateEmployeeComponent } from './components/update-employee/update-employee.component';
import { UpdateStudentComponent } from './components/update-student/update-student.component';





@NgModule({
  declarations: [ // Aqui se declaran los modulos que vayamos a utilizar o los componentes que contenga shared
    HeaderComponent,
    LoginInputComponent,
    LogoComponent,
    UpdateEmployeeComponent,
    UpdateStudentComponent
  ],
  exports: [  // Agregamos un arreglo para  utilizar los componentes e nuestros  modulos que vayamos haciendo
    HeaderComponent,
    LoginInputComponent,
    LogoComponent,
    UpdateEmployeeComponent,
    UpdateStudentComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  imports: [ // Se necesitan importar algunos modulos para que funcionen nuestros componentes 
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule
  ]
})
export class SharedModule { }
