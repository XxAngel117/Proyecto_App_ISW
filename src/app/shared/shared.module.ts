import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LoginInputComponent } from './components/login-input/login-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { UpdateEmployeeComponent } from './components/update-employee/update-employee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [ // Aqui se declaran los modulos que vayamos a utilizar o los componentes que contenga shared
    HeaderComponent,
    LoginInputComponent,
    LogoComponent,
    UpdateEmployeeComponent
  ],
  exports: [  // Agregamos un arreglo para  utilizar los componentes e nuestros  modulos que vayamos haciendo
    HeaderComponent,
    LoginInputComponent,
    LogoComponent,
    UpdateEmployeeComponent,
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
