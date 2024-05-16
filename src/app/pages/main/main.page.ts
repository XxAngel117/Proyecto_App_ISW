import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  router = inject(Router); // Servirá para verificar que navegamos entre los hijos; profile y home
  currentPath: string = ''; // Aqui que me va a indicar hacia donde estoy navegando
  firebaseService = inject(FirebaseService); // Estamos haciendo uso de el servicio de Firebase
  utils = inject(UtilsService); // Se va hacer uso de utils.service para invocar al routerlink

  // Declaración de rutas atraves de un objeto
  pages = [

  { title: 'Inicio', url: '/main/home', icon: 'home-outline' },
  { title: 'Perfil', url: '/main/profile', icon: 'person-outline' }  

  ]

  ngOnInit() {

// Navegación entre los componentes

    this.router.events.subscribe((event: any) => { // Se va a desplazar al componente si detecta algo

      if(event?.url) this.currentPath = event.url // Para ver si existe el evento y si, si desplazame a donde yo quiera desplazarme

     }) 

  }

  signOut(){ // Función de cerrar sesión para nuestro boton (click)

    this.firebaseService.signOut(); // Aqui vamos hacer uso de nuestro servicio que creamos en firebaseService y mandamos a llamar a signout

  }

  user(): User { // Función para enlazar nuestro menu a nuestro "User" y esta será de tipo user 

    return this.utils.getLocalStorage('user'); // y retornaremos a nuestra función que se encuentra en utils para mostrar nuestra key, el cual será user, ahora ya que esta preparada la podemos mandar a llamar en nuestro html de main

  }

  

}
