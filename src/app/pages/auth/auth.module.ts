import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './auth.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthPageRoutingModule,
    SharedModule // Se importará nuestra carpeta "SharedModule" para que algunos componentes se utilicen, esto dependerá de lo que se vaya a realizar 
  ],
  declarations: [AuthPage]
})
export class AuthPageModule {}
