import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  firebaseService = inject(FirebaseService); 
  utils = inject(UtilsService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      
      return new Promise((resolve) => { // Trabajaremos con una promesa, esta promesa funciona cuando se cumple una condicion , sino se sale
        this.firebaseService.getAuth().onAuthStateChanged((auth)=>{ // Primero le pasamos nuestro servicio para obtener nuestro getauth, esto porque nos va a ser un cambio de estado cuando no estemos autenticandonos

          if(!auth){ // Si nos estamos autenticando
  
           resolve(true) //  se cumplirá promesa
  
          }else{ // Sino , entonces  esta autenticado
            this.utils.routerlink('/main/home') // Te enviará  al home en caso de que este autenticado y quiera regresar al login
          }
        })
  
      })



  }
  
}
