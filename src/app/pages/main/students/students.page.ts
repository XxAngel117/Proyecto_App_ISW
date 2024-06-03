import { Component, OnInit, inject } from '@angular/core';
import { map } from 'rxjs';
import { Student } from 'src/app/models/students.model';
import { User } from 'src/app/models/user.model'; 
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UpdateStudentComponent } from 'src/app/shared/components/update-student/update-student.component';

@Component({
  selector: 'app-students',
  templateUrl: './students.page.html',
  styleUrls: ['./students.page.scss'],
})
export class StudentsPage implements OnInit {

  constructor() { }

  searchTerm: string = '';
  utils = inject(UtilsService); // Se va hacer uso de utils.service para invocar al routerlink
  firebaseService = inject(FirebaseService);
  loading: boolean = false; // El spinnner se va a traer para ver si existe algo , es decir si nos va a cargar nuestros datos o no
  students: Student[] = []; // Creamos una variable para traer el modelo de employees , ademas este nos va a traer un arreglo de objetos y igualamos con corchetes []  porque serán varios arreglos

  ngOnInit() { 
  }

  ionViewWillEnter () { // Esta función va a sustituír la acción de la función de ngOnInit, Esta función será util porque , que pasaría si debemos crear, editar un empleado, esta función hace un "refresh" de la información automaticamente, sin necesitar de activarlo o desactivar esta función desde ngOnInit

    this.getStudent()

  }

  getStudentSearch() { 
    const path = `users/${this.user().uid}/estudiantes`;
  
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
          this.students = resp.filter(student =>
          `${student.name} ${student.lastname_p} ${student.lastname_m}`.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            student.id_key.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            student.id_key2.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            student.enrollment.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            student.curp.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            student.nss.toLowerCase().includes(this.searchTerm.toLowerCase()) 
          );
  
          this.loading = false;
          sub.unsubscribe();
        },
      });
  }

  onSearch(event: CustomEvent) {
    this.searchTerm = event.detail.value || '';
    this.getStudentSearch();
  }

  async addUpdateStudent(students?: Student){ // Está funcion nos ayudará para crear el modal , además de que se agregará a nuestra accion de actualizar 

    // console.log(employee) // Estamos trayendo a consola a employee , para que traiga como identificador
    
    let modal = await this.utils.getModal({  // Nuestro modal va a estar esperando de lo que vaya a ejecutar de nuestro utils

      component: UpdateStudentComponent, // Digamos que va a ser el elemento del cual nosotros queremos que afecte
      cssClass: 'add-update-modal', // clase css
      componentProps: {students} // Se van a traer los datos que vamos a ir trayendo , esto se podra realizar gracias a component props y se lo pasaremos atraves de un objeto o propiedad

    })

    if(modal) this.getStudent() // Una vez que se cumple la acción de nuestro modal , el if va a condicionar a nuestra ventana  si se activa nuestra ventana modal enviaremos nuestro this.getemployee que trae consigo ionViewWillEnter

  }

  user(): User{ // Aqui estamos rescatando user atraves de nuestro localstorage para nuestro getemployee

    return this.utils.getLocalStorage('user') // Este nos traerá nuestro localstorage de nuestra key llamada "user"
  }

  getStudent(){ // Función para obtener a los empleados que estamos creando , para ello necesitamos recibit nuestro path o raiz "user/uid/empleados" 

    let path = `users/${this.user().uid}/estudiantes`;

    this.loading = true; // Si existe algo entonces el spinnner lo detectará

    let sub = this.firebaseService.getCollectionData(path) // La función de let "sub" será para que nos vayamos a desubscribir a lo que vayamos a recoger, traemos nuestro servicio y nuestro path
    .snapshotChanges().pipe( // Este nos va a guiar todo el recorrido
      map(changes => changes.map(c => ({ // map rxjs para poder filtrar hacia los cambios que vamos a realizar donde "changes" hara esa acción, nuestro segundo map lo que hará es filtrarse  a la información que viene hacia nuestro firebase para que podamos indicarle que es lo que queremos que traiga o refleje
        id: c.payload.doc.id, // la c va nos va a indicar lo que vamos a traer se inicializa arriba y trae id , pertenecerá a payload , para que nos carge lo que estamos seleccionado de ese documento y traemos el id del documento
        ...c.payload.doc.data() // operador spread para que yo le indique dentro de mis cambios le mande mi payload y me traiga todo lo que tiene en ese documento y manda llamar mi data
      })))
    ).subscribe({ // Nos vamos a suscribir para que nosotro arrojemos esos resultados
      next: (resp: any) => { // Nos conectaremos con un next que nos genere una respuesta
        this.students = resp // Traeremos a employees para que se iguale lo que estamos trayendo atraves del arreglo [Employees]y lo igualamos a la respuesta  a la que estamos trayendo

        // console.log(this.employees)
        this.loading = false; // Una vez que sepamos que esta trayendo nuestra información o los objetos que deje de cargar
        sub.unsubscribe(); // Al final nuestra variable sub recibirá la desubscripción del servicio para evitar que se sobrecarge de archivos , como si fuera un ciclo for
      }
    }) 
    
  }
  
  doRefresh(event: any) { // Función una vez que se haga alguna opción , me refresque automaticamente nuestra aplicación para mostrar cambios o errores

    setTimeout(() => {

      this.getStudent()
      event.target.complete() // Enviamos el envento 

    }, 1000) // Despues de un segundo que cargue

  }

  async deleteStudent(student: Student){ // Esta función nos servirá para poder eliminar el empleado , por ello traemos toda la información con la cual identificaremos ese empleado que queremos borrar

    let path = `users/${this.user().uid}/estudiantes/${student.id}`; // Recopilamos nuestro path o raiz general, identificamos el path junto con el employee con su id

    const loading = await this.utils.loading(); // Esperamos a que traiga 
    await loading.present(); // Aparecerá nuestro spinner cuando se hara nuestra acción

    let imgPath = await this.firebaseService.getFilePath(student.img); // Vamos a traer nuestro archivo de nuestra imagen para poder borrarla con mayor antelación
    await this.firebaseService.deleteFile(imgPath);

    // Mandamos la actualización o mandamos el documento con la información del formulario

    this.firebaseService.deleteDocument(path) // Mandamos a llamar primero al servicio de addDocument ese servicio enviará un path o raiz
    .then(async resp =>{ 

      this.students = this.students.filter(e => e.id !== student.id); // Aqui le vamos a mandar una señal que los empleados van a ser filtrados y ser actualizados 

      this.utils.dismissModal({ success: true }); // Aqui haremos que una vez de que nuestro modal se desactive o se descarte se muestre un mensaje de que nuestro empleado a sido creado 
      this.utils.presentToast({
        message: `El estudiante ha sido eliminado exitosamente`,
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

  async confirmDeleteStudent(students: Student){ //Vamos a crear una función para pasarle nuestra variable que creamos para presentar una alerta

    this.utils.presentAlert({

      header:'Eliminar estudiante',
      message: '¿Desea borrar ese estudiante?',
      mode: 'ios',
      buttons: [ // Este boton contendra arreglos
      {
        text:'Cancelar'
      },
      {
        text:'Si, eliminar',
        handler: () => {
          this.deleteStudent(students)
        } // Se pondrá un handler para que se ejecute la función
      }

      ]
    })

  } 



}
