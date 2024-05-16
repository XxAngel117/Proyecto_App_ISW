import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(private router: Router) { }

  goToForgotPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }

  goToSignUp() {
    this.router.navigate(['/auth/sign-up']);
  }

  utils = inject(UtilsService); // Se va hacer uso de utils.service para invocar al routerlink

  firebaseService = inject(FirebaseService); // Estamos haciendo uso de el servicio de Firebase
  

  form = new FormGroup({ // Creamos nuestro formulario y se importa en nuestros imports

    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
    

  })


  ngOnInit() {
  }

  async submit(){ // Servira para saber que contiene nuestro form y si es valido en cuanto a la información obtenida de mi formulario, declará asincrona porque estará esperando una respuesta y además dependerá de nuestra herramienta "spinner" para verificará cuando se esta mandando información desde mi formulario

    if(this.form.valid){

      const loading = await this.utils.loading(); // Si es valido el formulario se va a lanzar algo , va a estar esperando y lanzará nuestro spinner
      
      await loading.present(); // Traerá o cargará ese loading

      this.firebaseService.signIn(this.form.value as User) // nos estamos conectando con firebase y a su vez haciendo uso de signin va a ser el servicio por el yo puedo loguearme en la app, además esta haciendo uso de la información que estamos recibiendo de nuestro formulario de user, esta información esta ligada en nuestro archivo user.model

      .then(resp =>{ // Se va a incluir .then , porque como estamos recibiendo información en nuestra anterior intrucción de nuestro formulario , de igual manera servirá para que nos podamos subscribir a la función o servicio en firebaseservice
          
         this.getUserInfo(resp.user.uid) // Estará al pendiente de lo que traigamos de nuestro getuser, en base a la respuesto traerá el user y el uid como mensaje , esto para verificar que esta correctamente ligado. el mensaje se creo en la función getuserinfo

      }).catch(error => { // En caso de que tengamos un error , podemos mandar a llamar ese error que desconocemos en nuestra consola, para ello tambien nos ayudará nuestro spinner 
        console.log(error);
        this.utils.presentToast({
          message: error.message,
          duration: 2500,
          color: 'danger',
          position: 'bottom',
          icon: 'alert-circle-outline'
        })
            
      }).finally(() => { // En caso de que no se encuentre algun error en consola, terminará nuestro loading o preloader y traerá o podremos acceder a la información que querramos , dependerá de en que momento ocuparemos nuestro catch
        loading.dismiss();
      })
     
    }

  }

  async getUserInfo (uid: string){ // Función para mandar esa información ya validada a la base de datos

    if(this.form.valid){ // este submit fue traido de auth, puesto que estamos enviando información y registrando muy similar a lo que hicimos en auth.page.ts

      const loading = await this.utils.loading(); // Si es valido el formulario se va a lanzar algo , va a estar esperando ese algo
      await loading.present(); // Traerá o cargará ese loading

      let path = `users/${uid}`; // Le estaremos asignando valores a firebase y estaremos creando una ruta o estamos definiendo nuestra ruta o "path" en lo que nosotros tenemos en nuestro users y le mandaremos nuestro uid
     

      this.firebaseService.getDocument(path) // nos estamos conectando con firebase y a su vez haciendo uso de signin la cual esta haciendo uso de la información que estamos recibiendo de nuestro formulario de user, esta información esta ligada en nuestro archivo user.model
      
      .then((user: User) =>{ // Despues una vez obtenida traemos ese usuario

          this.utils.saveLocalStorage('user', user); // Aqui nosotros estamos obteniendo la información atraves de nuestro user 
          this.utils.routerlink('main/home');
          this.form.reset();

          this.utils.presentToast({
            message: `Bienvenido(a) ${user.name}`,
            duration: 1500,
            color: 'primary',
            position: 'bottom',
            icon: 'person-circle-outline'
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


}
