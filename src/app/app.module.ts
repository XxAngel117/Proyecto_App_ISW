import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

export const firebaseConfig = { // Se creará un objeto que contendrá la configuración y llave unica de nuestra base creada en firebase utilizara el export para inicialiar la configuracion de firebase y para enlazar nuestros datos al servicio de Firebase
  apiKey: "AIzaSyDud7U1UZX08JBTy_08Fsgp8ke0Hb_41Dw",
  authDomain: "empleados-66799.firebaseapp.com",
  projectId: "empleados-66799",
  storageBucket: "empleados-66799.appspot.com",
  messagingSenderId: "37043416895",
  appId: "1:37043416895:web:d7aa479e29e754e902ed8a",
  measurementId: "G-S05S5PZQWM"
};

initializeApp(firebaseConfig);


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot({mode: 'md'}), // Se añadio el modo "material design" para que se mantenga mi estilo en diferentes dispositivos
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig), // Le estamos pasando la llave que declaramos arriba en el objetivo cuando se inicie la aplicación
    AngularFirestoreModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})

export class AppModule {}
