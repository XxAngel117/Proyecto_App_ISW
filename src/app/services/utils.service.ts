import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({ 
  providedIn: 'root'
})
export class UtilsService { 

  router = inject(Router); // Insertamos una variable para nuestro routerlink
  toast = inject(ToastController); // Insertamos una variable para nuestro Toast, esta herramienta proviene de ionic/angular
  loadingCtrl = inject(LoadingController); //Insertamos una variable para nuestro loading, proviene de una herramienta de ionic/angular 
  modalCtrl = inject(ModalController);
  alertCtrl = inject(AlertController);


  // ------- ROUTERLINK, para navegar entre vistas -------

  routerlink(url: any){ //Declaramos dentro de routerlink "url" y lo asignamos de tipo any o string para utilizarlo en la funcion this.router.navigateByUrl

    this.router.navigateByUrl(url) // Le asignamos esa variable para hacer dinamica cualquier dirección al invocar al navigateByUrl
  }

  // ------- Preloader -------

  loading(){

    return this.loadingCtrl.create({ spinner:'crescent' })  // Se  especifica de tipo de spinner quiero tener

  }
      
  // ------- TOAST, mensajes o alertas para la aplicación-------
  async presentToast (opts?: ToastOptions) { // Nuestro Toast o el mensaje trabajara con algo asycrono , puesto que estará esperando algo para funcionar 

    const toast = await this.toast.create(opts);

    toast.present()

  } 

  // ------- localstorage al iniciar sesión, guarda uno o varios elementos en el localstorage-------

  saveLocalStorage(key: string, value: any){ // Nuestra función esta recibiendo key y value que son los valores que se necesitan por default, esto se puede apreciar en la consola del navegador

    return localStorage.setItem(key, JSON.stringify(value)) // Vamos a devolver un valor lo que nosotros vayamos a enviar o setear que van hacer nuestro key y valor que vamos a convertirlo con un JSON para nuestros datos(name, correo ... etc)

  } 

  // ------- localstorage al manejar la información dentro de la aplicación, este ya obtiene o agarra uno o varios elementos que se  encuentren guardados en el localstorage -------

  getLocalStorage(key: string){ // Vamos a recibir una llave

    return JSON.parse(localStorage.getItem(key)) // Va a estar esperando el key, hacemos una conversión o parsear los datos que recolectamos, ese decir lo pasamos a su valor original, mandamos a traer todos esos datos y mandamos a obtener el item o en este caso nuestra llave

  }

  // ------- Modal o ventana emergente donde podemos realizar acciones -------  

  async getModal (opts: ModalOptions){ // Está función va a ser de forma asincrona va a estar esperando una respuesta o ejecución , este va a traer una serie de opciones y va a ser de tipo Modal

    const modal = await this.modalCtrl.create(opts) // esta contendrá una constante llamada modal que estará en espera de una ejecución esta ejecución trae consigo un "modal" con opciones que les asignamos, esta como va a ser dinamico se le asigno "opts"
    await modal.present(); // Vamos a mandar a llamar un await para que se ejecute nuestro modal , esta se ejecutará con una palabra resevada llamada "present"

    const {data} = await modal.onWillDismiss();// Espera de la data o la información para nuestro modal, espera que la función devuelva alguna información sobre el estado o los datos relevantes al modal atraves de nuestro data, y para que podamos cerrar la ventana atraves del onWillDismiss

    if(data) return data; // Si existe nuestra data , entonces se mostraran nuestros datos

    
  }

  dismissModal(data?: any){

    return this.modalCtrl.dismiss(data); // Le estamos indicando a ModalCtrl que nos pueda desactivar nuestra ventana modal junto con la data

  }

  async takePicture (promptLabelHeader: string) { // Vamos a trabajar con esta función para la camará, trabajaremos con un async porque estará en espera o retornaeá la imagen 
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl, // Estrá en busqueda de nuestra URL
      source: CameraSource.Prompt, // Opcion a elegir rescatarlo de galeria o tomar foto
      promptLabelHeader, // Nos servirá para nosotros traer los datos a las opciones que queremos elegir
      promptLabelPhoto: 'Selecciona una imagen', // Traerá una alerta de imagen
      promptLabelPicture: 'Toma una foto' // Traerá una alerta de fotos
    });
  
    
  };

  async presentAlert(opts?: AlertOptions){

    const alert = await this.alertCtrl.create(opts); // Vamos a crear una variable , va a estar esperando nuestra alerta 
    await alert.present() // vamos a  mandar ese mensaje 
  }

}
