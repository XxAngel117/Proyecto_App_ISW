import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  firebaseService = inject(FirebaseService); // Asignamos nuestro servicio de firebase
  utils = inject(UtilsService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let user = localStorage.getItem('user'); /* Vamos a guardar lo que nosotros traigamos de nuestro LocalStorage  */
    return new Promise((resolve) => { // Trabajaremos con una promesa, esta promesa funciona cuando se cumple una condicion , sino se sale
      this.firebaseService.getAuth().onAuthStateChanged((auth) => { // Primero le pasamos nuestro servicio para obtener nuestro getauth, esto porque nos va a ser un cambio de estado cuando no estemos autenticandonos
        if (auth) { // Si nos estamos autenticando, entonces traeme mi if

          if (user) resolve(true) // Siempre y cuando nuestro user exista, se cumplirá promesa

        } else { // Sino , entonces no esta autenticado
          this.firebaseService.signOut() // Sino, te va a retornar al auth o al login y ademas te eliminara el usuario que no tiene nada ver
          resolve(false)
        }
      })

    })

  }

}
