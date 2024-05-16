import { Component, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor() { }

  utils = inject(UtilsService); // Se va hacer uso de utils.service para invocar al routerlink
  firebaseService = inject(FirebaseService);

  ngOnInit() {

  }

  user(): User{ // Aqui estamos rescatando user atraves de nuestro localstorage para nuestro getemployee

    return this.utils.getLocalStorage('user') // Este nos traerá nuestro localstorage de nuestra key llamada "user"
  }

  async takeImage (){ // Vamos a traer nuevamente esta función para poder tomar la foto ahora para nuestro perfil

    let user = this.user(); // Traemos la información de user 
    let path = `users/${user.uid}`; // Vamos a traer la ruta de nuestra imagen

    const dataUrl = (await this.utils.takePicture ('Imagen del usuario')).dataUrl // Traerá un valor constante y va a retornar a nuestra dataURL, esperará a nuetro servicio de utils de takepicture y al final  nuestra dataUrl extraerá la respuesta que estamos seleccionando
    const loading = await this.utils.loading(); // Estamos trayendo nuestro  preloader o spinnner , para ver de manera visual la correcta función de guardar 
    await loading.present(); // Le vamos a pasar un await para que se presente nuestro preloader o spinnner

    let imgPath = ` ${user.uid}/profile `;// Trairá una imagen del path directamente a la raiz o ruta del nuevo archivo lo lo agregará a perfil, este va a ser un perfil unico
    user.img = await this.firebaseService.updateImg(imgPath, dataUrl); // Ahora una vez en user dentro del array va a estar esperando a que nuestro firebase guarde la imagen en perfil
    this.firebaseService.updateDocument(path, { img: user.img}) //Ahora una vez que se haga el cambio o haya una modificación le vamos a indicar que actualice el documento en firebase, siempre y cuando tenga nuestro path , pero unicamente sea el de img
    .then(async resp => { // vamos a suscribirnos al servicio para nuestro storage en este caso 

      this.utils.saveLocalStorage('user',user); // Pasamos la key y que guarde en user
      
      this.utils.presentToast({
        message: `La foto del usuario fue actualizada exitosamente`,
        duration: 1500,
        color: 'success',
        position: 'bottom',
        icon: 'checkmark-circle-outline'
      })
      

  }).catch(error => { // En caso de que tengamos un error , podemos mandar a llamar ese error que desconocemos en nuestra consola
    console.log(error);
    this.utils.presentToast({
      message: error.message,
      duration: 2500,
      color: 'danger',
      position: 'bottom',
      icon: 'alert-circle-outline'
    })
        
  }).finally(() => { // En caso de que no se encuentre el error arrogará el termino de nuestro loading o preloader
    loading.dismiss();
  })

    
  }

}
