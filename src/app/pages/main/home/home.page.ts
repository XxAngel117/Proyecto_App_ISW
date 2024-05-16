import { Component, OnInit, inject } from '@angular/core';
import { map } from 'rxjs';
import { Employees } from 'src/app/models/employees.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UpdateEmployeeComponent } from 'src/app/shared/components/update-employee/update-employee.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor() { }

  searchTerm: string = '';
  utils = inject(UtilsService); // Se va hacer uso de utils.service para invocar al routerlink
  firebaseService = inject(FirebaseService);
  loading: boolean = false; // El spinnner se va a traer para ver si existe algo , es decir si nos va a cargar nuestros datos o no
  employees: Employees[] = []; // Creamos una variable para traer el modelo de employees , ademas este nos va a traer un arreglo de objetos y igualamos con corchetes []  porque serán varios arreglos

  

  ngOnInit() {

    // this.getEmployee() // nos esta trayendo lo que contenga el empleado demás de la key y el uid, nuestros arrays por cada empleado

  }

  ionViewWillEnter () { // Esta función va a sustituír la acción de la función de ngOnInit, Esta función será util porque , que pasaría si debemos crear, editar un empleado, esta función hace un "refresh" de la información automaticamente, sin necesitar de activarlo o desactivar esta función desde ngOnInit

    this.getEmployee()

  }


  getEmployeeSearch() {
    const path = `users/${this.user().uid}/empleados`;
  
    this.loading = true;
  
    let sub = this.firebaseService
      .getCollectionData(path)
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          }))
        )
      )
      .subscribe({
        next: (resp: any) => {
          // Filtrar empleados según el término de búsqueda
          this.employees = resp.filter(employee =>
          `${employee.name} ${employee.lastname_p} ${employee.lastname_m}`.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            employee.id_key.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            employee.id_key2.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            employee.enrollment.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            employee.curp.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            employee.no_employee.toLowerCase().includes(this.searchTerm.toLowerCase()) 
          );
  
          this.loading = false;
          sub.unsubscribe();
        },
      });
  }

  onSearch(event: CustomEvent) {
    this.searchTerm = event.detail.value || '';
    this.getEmployeeSearch();
  }
  
  
  

  async addUpdateEmployee(employee?: Employees){ // Está funcion nos ayudará para crear el modal , además de que se agregará a nuestra accion de actualizar 

    // console.log(employee) // Estamos trayendo a consola a employee , para que traiga como identificador
    
    let modal = await this.utils.getModal({  // Nuestro modal va a estar esperando de lo que vaya a ejecutar de nuestro utils

      component: UpdateEmployeeComponent, // Digamos que va a ser el elemento del cual nosotros queremos que afecte
      cssClass: 'add-update-modal', // clase css
      componentProps: {employee} // Se van a traer los datos que vamos a ir trayendo , esto se podra realizar gracias a component props y se lo pasaremos atraves de un objeto o propiedad

    })

    if(modal) this.getEmployee() // Una vez que se cumple la acción de nuestro modal , el if va a condicionar a nuestra ventana  si se activa nuestra ventana modal enviaremos nuestro this.getemployee que trae consigo ionViewWillEnter

  }

  user(): User{ // Aqui estamos rescatando user atraves de nuestro localstorage para nuestro getemployee

    return this.utils.getLocalStorage('user') // Este nos traerá nuestro localstorage de nuestra key llamada "user"
  }

  getEmployee(){ // Función para obtener a los empleados que estamos creando , para ello necesitamos recibit nuestro path o raiz "user/uid/empleados" 

    let path = `users/${this.user().uid}/empleados`;

    this.loading = true; // Si existe algo entonces el spinnner lo detectará

    let sub = this.firebaseService.getCollectionData(path) // La función de let "sub" será para que nos vayamos a desubscribir a lo que vayamos a recoger, traemos nuestro servicio y nuestro path
    .snapshotChanges().pipe( // Este nos va a guiar todo el recorrido
      map(changes => changes.map(c => ({ // map rxjs para poder filtrar hacia los cambios que vamos a realizar donde "changes" hara esa acción, nuestro segundo map lo que hará es filtrarse  a la información que viene hacia nuestro firebase para que podamos indicarle que es lo que queremos que traiga o refleje
        id: c.payload.doc.id, // la c va nos va a indicar lo que vamos a traer se inicializa arriba y trae id , pertenecerá a payload , para que nos carge lo que estamos seleccionado de ese documento y traemos el id del documento
        ...c.payload.doc.data() // operador spread para que yo le indique dentro de mis cambios le mande mi payload y me traiga todo lo que tiene en ese documento y manda llamar mi data
      })))
    ).subscribe({ // Nos vamos a suscribir para que nosotro arrojemos esos resultados
      next: (resp: any) => { // Nos conectaremos con un next que nos genere una respuesta
        this.employees = resp // Traeremos a employees para que se iguale lo que estamos trayendo atraves del arreglo [Employees]y lo igualamos a la respuesta  a la que estamos trayendo

        // console.log(this.employees)
        this.loading = false; // Una vez que sepamos que esta trayendo nuestra información o los objetos que deje de cargar
        sub.unsubscribe(); // Al final nuestra variable sub recibirá la desubscripción del servicio para evitar que se sobrecarge de archivos , como si fuera un ciclo for
      }
    }) 
    
  }

  doRefresh(event: any) { // Función una vez que se haga alguna opción , me refresque automaticamente nuestra aplicación para mostrar cambios o errores

    setTimeout(() => {

      this.getEmployee()
      event.target.complete() // Enviamos el envento 

    }, 1000) // Despues de un segundo que cargue

  }
 
   
  async deleteEmployee(employee: Employees){ // Esta función nos servirá para poder eliminar el empleado , por ello traemos toda la información con la cual identificaremos ese empleado que queremos borrar

    let path = `users/${this.user().uid}/empleados/${employee.id}`; // Recopilamos nuestro path o raiz general, identificamos el path junto con el employee con su id

    const loading = await this.utils.loading(); // Esperamos a que traiga 
    await loading.present(); // Aparecerá nuestro spinner cuando se hara nuestra acción

    let imgPath = await this.firebaseService.getFilePath(employee.img); // Vamos a traer nuestro archivo de nuestra imagen para poder borrarla con mayor antelación
    await this.firebaseService.deleteFile(imgPath);

    // Mandamos la actualización o mandamos el documento con la información del formulario

    this.firebaseService.deleteDocument(path) // Mandamos a llamar primero al servicio de addDocument ese servicio enviará un path o raiz
    .then(async resp =>{ 

      this.employees = this.employees.filter(e => e.id !== employee.id); // Aqui le vamos a mandar una señal que los empleados van a ser filtrados y ser actualizados 

      this.utils.dismissModal({ success: true }); // Aqui haremos que una vez de que nuestro modal se desactive o se descarte se muestre un mensaje de que nuestro empleado a sido creado 
      this.utils.presentToast({
        message: `El empleado eliminado exitosamente`,
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


  async confirmDeleteEmployee(employees: Employees){ //Vamos a crear una función para pasarle nuestra variable que creamos para presentar una alerta

    this.utils.presentAlert({

      header:'Eliminar empleado',
      message: '¿Desea borrar ese empleado?',
      mode: 'ios',
      buttons: [ // Este boton contendra arreglos
      {
        text:'Cancelar'
      },
      {
        text:'Si, eliminar',
        handler: () => {
          this.deleteEmployee(employees)
        } // Se pondrá un handler para que se ejecute la función
      }

      ]
    })

  } 

  // getBills (){ // Función para obtener los gastos de los empleados , esto será para las cards de empleados

  //   return this.employees.reduce((index, employee) => index + employee.salario, 0); // vas a traer un devolver nuestros employees va a ser uso de un reduce donde vamos a indicarle que me haga un recorrido de mis empleados y traemos una función fecha  donde aparte de traer el recorrido va a ir sumando los salarios
    
  // }


}
