import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  constructor() { }

  utils = inject(UtilsService); // Se va hacer uso de utils.service para invocar al routerlink

  firebaseService = inject(FirebaseService); // Estamos haciendo uso de el servicio de Firebase

  form = new FormGroup({ // Creamos nuestro formulario y se importa en nuestros imports

    email: new FormControl('', [Validators.required, Validators.email]),


  })


  ngOnInit() {
  }

  async submit(){ // Servira para saber que contiene nuestro form y si es valido en cuanto a la información obtenida de mi formulario

    if(this.form.valid){

      const loading = await this.utils.loading(); // Si es valido el formulario se va a lanzar algo , va a estar esperando ese algo
      
      await loading.present(); // Traerá o cargará ese loading

      this.firebaseService.sendRecoveryEmail(this.form.value.email) // Aqui estamos trayendo el valor que se encuentra en nuestro formulario, es cual será email 

      .then(resp =>{ // está linea servirá para que nos podamos subscribir a la función o servicio en firebaseservice
          
        this.utils.presentToast({
          message: 'Revise su bandeja de entrada del correo proporcionado para tener el cambio de contraseña',
          duration: 2500,
          color: 'success',
          position: 'bottom',
          icon: 'mail-outline'
        })

        this.utils.routerlink('/auth')
        this.form.reset()

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
}
