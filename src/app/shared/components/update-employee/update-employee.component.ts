import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Employees } from 'src/app/models/employees.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.scss'],
})
export class UpdateEmployeeComponent  implements OnInit {

  constructor() { }

  @Input() employee: Employees; // Variable o nuestro Input servirá para llenar nuestros datos o actualizar cambios en nuestro formulario, es nuestra itención al crear esta variable, pero en este caso se mando a employee o nuestro empleado puesto que contiene la información y le importamos al igual el modelo

  utils = inject(UtilsService); // Se va hacer uso de utils.service para invocar al routerlink
  firebaseService = inject(FirebaseService); // Estamos haciendo uso de el servicio de Firebase
  user = {} as User; // Para guardar nuestro empleado , estamos trayendo todo lo que tengamos en nuestro modelo de user y podemows rescatar a uid, por eso el uso de llaves, ademas como no estamos trayendo objetos ni propiedades entonces le estamos añadiendo un alias de tipo User y ahora si , importrá nuestro modelo. necesitamos declarar a "user" para createEmployee para poder accesar a la raiz, es por eso que estamos habilitando user
  curpValue: string;
  newInstitutionName: string = ''; // Variable para almacenar el nombre de la nueva institución

  form = new FormGroup({ // Creamos nuestro formulario y se importa en nuestros imports

    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    lastname_p: new FormControl('', [Validators.required]),
    lastname_m: new FormControl('', [Validators.required]),
    img: new FormControl('', [Validators.required]),
    position_1: new FormControl('', [Validators.required]),
    position_2: new FormControl('', [Validators.required]),
    adscription: new FormControl('', [Validators.required]),
    no_employee: new FormControl('', [Validators.required,Validators.minLength(4),Validators.maxLength(4)]),
    enrollment: new FormControl('', [Validators.required,Validators.minLength(9),Validators.maxLength(9)]),
    institution: new FormControl('', [Validators.required]),
    newInstitution: new FormControl(''),
    curp: new FormControl('', [Validators.required, Validators.pattern(UpdateEmployeeComponent.curpRegex), Validators.maxLength(18)]),
    nss: new FormControl('', [Validators.required,Validators.pattern(/^\d+$/),Validators.minLength(11), Validators.maxLength(11)]),
    blood_type: new FormControl('', [Validators.required]),
    genre: new FormControl('', [Validators.required]),
    id_key: new FormControl(null, [Validators.required,Validators.min(0)]),
    id_key2: new FormControl(null, [Validators.required,Validators.min(0)]),

  })


  ngOnInit() { // Necesita recibir nuestros datos

    this.user = this.utils.getLocalStorage('user'); // Cuando estamos dentro de update-employee vamos a estar cargando desde user un util service el cual será getlocalstorage, para rescatar ese uid , vamos a rescatarlo desde ahi  enviaremos por defecto a user para que podamos obtener ese uid
    if(this.employee) this.form.setValue(this.employee) // Si mi empleado existe entonces va a cargar nuestro formulario y enviará los datosy cargará nuestros empleados "this.employee"
  }

  private static curpRegex = /^[A-Za-z0-9]{18}$/;

  transformToUppercase(event: any) 
  {
    this.curpValue = event.target.value.toUpperCase();
    this.form.controls.curp.setValue(this.curpValue);
  }

  setIdInput(){ // Esta función hará posible que se pueda convertir un número a dato

    let { id_key } = this.form.controls; // Nos trairia nuestro dato del formulario y trairá en este caso a forms que es el que le esta asignando su funcionalidad
    if(id_key.value) id_key.setValue(parseFloat(id_key.value)); // Le vamos a indicar , si encontro algo en nuestro dato osea nss , entonces que nos convierta nuestro valor y enviamos ese valor ya convertido

  }

  setId2Input(){ // Esta función hará posible que se pueda convertir un número a dato

    let { id_key2 } = this.form.controls; // Nos trairia nuestro dato del formulario y trairá en este caso a forms que es el que le esta asignando su funcionalidad
    if(id_key2.value) id_key2.setValue(parseFloat(id_key2.value)); // Le vamos a indicar , si encontro algo en nuestro dato osea nss , entonces que nos convierta nuestro valor y enviamos ese valor ya convertido

  }

  // setNumberInput(){ // Esta función hará posible que se pueda convertir un número a dato

  //   let { nss } = this.form.controls; // Nos trairia nuestro dato del formulario y trairá en este caso a forms que es el que le esta asignando su funcionalidad
  //   let nssValue = nss.value.toString(); // Convertir el valor a cadena para poder obtener su longitud


  //   if(nss.value.length !== 11 || isNaN(Number(nssValue))) // Verificar longitud y si es numérico 
  //   {
  //     nss.setErrors({ invalidNss: true }); // Establecer error si la longitud es incorrecta o no es numérico
  //   } else {
  //     nss.setErrors(null); // Borrar error si la longitud es correcta y es numérico
  //   }
  // }

  async submit(){ // Servira para saber que contiene nuestro form y si es valido en cuanto a la información obtenida de mi formulario

    if(this.form.valid){ // Si nuestro formulario es valido 

      if(this.employee) this.updateEmployee(); // Si es valido entonces vamos a mandarle "employee" y vamos a mandar nuestra función de update
      else this.createEmployee(); // Si no existe, entonces va a lanzar la función para crearla

      if (this.form.value.institution === 'other') {
        const newInstitutionName = this.form.value.newInstitution;
        console.log('Nueva institución:', newInstitutionName);
        await this.saveNewInstitution();

      } else {
        const selectedInstitution = this.form.value.institution;
        console.log('Institución seleccionada:', selectedInstitution);
        await this.saveOrUpdateEmployee();
      }

    }

    // this.createEmployee(); // Le enviamos nuestra función porque sabemos que ya esta llegando algo

  }

  async saveNewInstitution() {
    if (this.newInstitutionName.trim() !== '') { // Verifica que el nombre de la institución no esté vacío
      try {
        await this.firebaseService.saveNewInstitution(this.newInstitutionName); // Llama a la función saveNewInstitution del servicio FirebaseService
        // Limpiar el campo de nombre de la nueva institución después de agregarla exitosamente
        this.newInstitutionName = '';
        // Puedes agregar aquí lógica adicional, como mostrar un mensaje de éxito o actualizar la lista de instituciones
      } catch (error) {
        console.error('Error al guardar la nueva institución:', error);
        // Puedes agregar aquí lógica adicional para manejar el error, como mostrar un mensaje de error al usuario
      }
    } else {
      console.error('El nombre de la nueva institución no puede estar vacío');
      // Puedes agregar aquí lógica adicional para informar al usuario que el nombre de la institución no puede estar vacío
    }
  }

  async saveOrUpdateEmployee() {
    // Implementa aquí la lógica para guardar o actualizar el empleado en la base de datos
    // Por ejemplo:
    // if (this.employee) {
    //   await this.firebaseService.updateEmployee(this.employee.id, this.form.value);
    // } else {
    //   await this.firebaseService.createEmployee(this.form.value);
    // }
  }

  async takeImage (){

    const dataUrl = (await this.utils.takePicture ('Imagen del empleado')).dataUrl // Traerá un valor constante y va a retornar a nuestra dataURL, esperará a nuetro servicio de utils de takepicture y al final  nuestra dataUrl extraerá la respuesta que estamos seleccionando
    this.form.controls.img.setValue(dataUrl) // Traermos nuestro form y este contendra nuestra img y nos muestra con (setValue) lo que contiene esa ubicación

  }

  async createEmployee(){  // Función para crear nuestro empleador, que podemos crearlo de varias formas ya sea mandar a llamar el servicio de imagenes o AddDocument para ya una vez guardada en la app , se vea reflejada esa información en base de datos 

    let path = `users/${this.user.uid}/empleados`; // Pondremos un let para recopilar o incluso hacer uso de esa información a esa raiz o ubicación en users/uid/empleados

    const loading = await this.utils.loading(); // Estamos trayendo nuestro  preloader o spinnner , para ver de manera visual la correcta función de guardar 
    await loading.present(); // Le vamos a pasar un await para que se presente nuestro preloader o spinnner

    let dataUrl  = this.form.value.img; // Estamos creando otro path, esto se hará al momento de declarar nuestro nuevo path, traerá lo que este encontrando en img
    let imgPath = ` ${this.user.uid}/${Date.now()} `;//  Estamos creando un path unico, esto atraves de una fecha o número, esto con el objetivo de ubicar de una manera sencilla la img y no se pierda de la raiz dentro del documento 
    let imgUrl = await this.firebaseService.updateImg(imgPath, dataUrl); // Ahora que ya se vio que estamos trayendo y obteniendo un identificador, se hará un let de nuestra url de la imagen esta se va a conectar a firebase y vamos a actualizar nuestra imagen y cargarle el path o raiz unico y necesitamos recibir nuestra imagen en base64 
    
    this.form.controls.img.setValue(imgUrl); // Aqui lo que haremos es el guardado de nuestra imagen 

    delete this.form.value.id; // Aqui estamos borrando el id que se crea aparte al momento de generar un nuevo empleado, para poder trabajar y guardar toda la información y se refleje tambien la imagen para eso eliminamos el id , para trabajar con el uid del usuario mismo no del empleado

    this.firebaseService.addDocument(path, this.form.value) // Mandamos a llamar primero al servicio de addDocument ese servicio enviará un path o raiz
    .then(async resp =>{ // Aqui nos vamos  a subscribir

      this.utils.dismissModal({ success: true }); // Aqui haremos que una vez de que nuestro modal se desactive o se descarte se muestre un mensaje de que nuestro empleado a sido creado 
      this.utils.presentToast({
        message: `El empleado fue agregado exitosamente`,
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

  async updateEmployee(){ // Esta función nos servirá para actualizar ahora si el empleado , ahora que identificamos el path y la raiz de cada empleado

    let path = `users/${this.user.uid}/empleados/${this.employee.id}`; // Recopilamos nuestro path de empleados

    const loading = await this.utils.loading(); // Esperamos a que traiga 
    await loading.present(); // Aparecerá nuestro spinner cuando se hara nuestra acción

    if(this.form.value.img!== this.employee.img ) // Esta condición servirá para cambiarme mi img , para ello voy a traerá mi imagen desde el forms y si sí cambio podemos subir la nueva y obtener el URL , para ello será diferente de this.employee.img

    {
      let dataURL = this.form.value.img; // Si uno es diferente de otro , entonces traeremos lo que contenga nuestro forms url
      let imgPath = await this.firebaseService.getFilePath (this.employee.img); // Traeremos nuestra imagen de nuestro path , que por cierto estará esperando al momento de editar o mandar esa ruta de la imagen y mandamos esa nueva imagen
      let imgUrl =  await this.firebaseService.updateImg(imgPath, dataURL); // Vamos a traer la imagen o la nueva imagen para que sea actualizada

      this.form.controls.img.setValue(imgUrl); // Ahora si le pasamos nuestra imagen a nuestro formulario para que se guarde 
    }

    delete this.form.value.id; // Eliminamos el valor del id que genera el documento de la imagen y tome el uid del usuario y no aparezca undefined 

    // Mandamos la actualización o mandamos el documento con la información del formulario

    this.firebaseService.updateDocument(path, this.form.value) // Mandamos a llamar primero al servicio de addDocument ese servicio enviará un path o raiz
    .then(async resp =>{ // Aqui nos vamos  a subscribir

      this.utils.dismissModal({ success: true }); // Aqui haremos que una vez de que nuestro modal se desactive o se descarte se muestre un mensaje de que nuestro empleado a sido creado 
      this.utils.presentToast({
        message: `El empleado fue editado exitosamente`,
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
