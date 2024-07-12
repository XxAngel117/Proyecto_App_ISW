import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  constructor(private router: Router) { }

  goToSignUp() {
    this.router.navigate(['/auth/sign-up']);
  }

  utils = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  

  form = new FormGroup({ // Creamos nuestro formulario y se importa en nuestros imports

    uid: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])


  })


  ngOnInit() {
  }

  async submit(){ // Servira para saber que contiene nuestro form y si es valido en cuanto a la información obtenida de mi formulario

    if(this.form.valid){ // este submit fue traido de auth, puesto que estamos enviando información y registrando muy similar a lo que hicimos en auth.page.ts

      const loading = await this.utils.loading(); // Si es valido el formulario se va a lanzar algo , va a estar esperando ese algo
      
      await loading.present(); // Traerá o cargará ese loading

      this.firebaseService.signUp(this.form.value as User) // nos estamos conectando con firebase y a su vez haciendo uso de signin la cual esta haciendo uso de la información que estamos recibiendo de nuestro formulario de user, esta información esta ligada en nuestro archivo user.model

      .then(async resp =>{ // está linea servirá para que nos podamos subscribir a la función o servicio en firebaseservice

          await this.firebaseService.updateUser(this.form.value.name) // utilizaremos un await porque al momento de esperar la información del formulario en ese mismo momento se va estar actualizando tambien el nombre 
          
          let uid = resp.user.uid // Vamos a guardar nuestro uid en nuestro formulario, ese id lo obtenemos al crear un nuevo usuario
          this.form.controls.uid.setValue(uid) // se enviara el valor , guardará nuestro ID de usuario 

          

          this.setUserInfo(uid); // Ahora guardaremos esa información a la base de datos, Una vez que se actualizo ahora con un "set" mandaremos esa informacion actualizada a firebase para que sea dinamica 

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

  async setUserInfo (uid: string){ // Función para mandar esa información ya validada a la base de datos va a estar recibiendo nuestro uid 

    if(this.form.valid){ // este submit fue traido de auth, puesto que estamos enviando información y registrando muy similar a lo que hicimos en auth.page.ts

      const loading = await this.utils.loading(); // Si es valido el formulario se va a lanzar algo , va a estar esperando ese algo
      await loading.present(); // Traerá o cargará ese loading

      let path = `users/${uid}`; // Le estaremos asignando valores a firebase y estaremos creando una ruta o estamos definiendo nuestra ruta o "path" en lo que nosotros tenemos en nuestro users y le mandaremos nuestro uid
      delete this.form.value.password;

      this.firebaseService.setDocument(path, this.form.value) // nos estamos conectando con firebase y a su vez haciendo uso de signin la cual esta haciendo uso de la información que estamos recibiendo de nuestro formulario de user, esta información esta ligada en nuestro archivo user.model

      .then(async resp =>{ // está linea servirá para que nos podamos subscribir a la función o servicio en firebaseservice

          this.utils.saveLocalStorage('user', this.form.value); // Aqui una vez que estemos devolviendo o valores vamos a utilizar nuestra función que creamos en utils de localstorage para guardarla y le pasaremos "user" y quien es suer, es lo que vamos a enviar como key y nuestros demas valores 
          this.utils.routerlink('main/home');
          this.form.reset();
          

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