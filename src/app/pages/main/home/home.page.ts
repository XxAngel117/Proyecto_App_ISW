import { Component, OnInit, inject } from '@angular/core';
import { map } from 'rxjs';
import { Employees } from 'src/app/models/employees.model';
import { Student } from 'src/app/models/students.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UpdateEmployeeComponent } from 'src/app/shared/components/update-employee/update-employee.component';
import { UpdateStudentComponent } from 'src/app/shared/components/update-student/update-student.component';
 
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
  students: Student[] = [];
  

  ngOnInit() {

  }

  ionViewWillEnter () { // Esta función va a sustituír la acción de la función de ngOnInit, Esta función será util porque , que pasaría si debemos crear, editar un empleado, esta función hace un "refresh" de la información automaticamente, sin necesitar de activarlo o desactivar esta función desde ngOnInit

    this.getEmployee();
    this.getStudent();

  }

  user() {
    return this.utils.getLocalStorage('user');
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.getEmployee();
      this.getStudent();
      event.target.complete();
    }, 1000);
  }

  getSearchResults() {
    const employeePath = `users/${this.user().uid}/empleados`;
    const studentPath = `users/${this.user().uid}/estudiantes`;
  
    this.loading = true;
  
    let employeeSub = this.firebaseService
      .getCollectionData(employeePath)
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
            // employee.id_key2.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            employee.curp.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            employee.no_employee.toLowerCase().includes(this.searchTerm.toLowerCase()) 
          );
  
          this.loading = false;
          employeeSub.unsubscribe();
        },
      });

    let studentSub = this.firebaseService
      .getCollectionData(studentPath)
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
          this.students = resp.filter(student =>
            `${student.name}`.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            student.id_key.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            // student.id_key2.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            student.enrollment.toLowerCase().includes(this.searchTerm.toLowerCase()) 
            // student.curp.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
  
          this.loading = false;
          studentSub.unsubscribe();
        },
      });  


  }

  onSearch(event: CustomEvent) {
    this.searchTerm = event.detail.value || '';
    this.getSearchResults();
  }


  getEmployee() {
    let path = `users/${this.user().uid}/empleados`;
    this.loading = true;
    let sub = this.firebaseService.getCollectionData(path).snapshotChanges().pipe(
      map(changes => changes.map(c => ({
        id: c.payload.doc.id,
        ...c.payload.doc.data(),
      })))
    ).subscribe({
      next: (resp: any) => {
        this.employees = resp;
        this.loading = false;
        sub.unsubscribe();
      }
    });
  }

  async addUpdateEmployee(employee?: Employees) {
    let modal = await this.utils.getModal({
      component: UpdateEmployeeComponent,
      cssClass: 'add-update-modal',
      componentProps: { employee }
    });
    if (modal) this.getEmployee();
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

  async addUpdateStudent(students?: Student){ // Está funcion nos ayudará para crear el modal , además de que se agregará a nuestra accion de actualizar 

    // console.log(employee) // Estamos trayendo a consola a employee , para que traiga como identificador
    
    let modal = await this.utils.getModal({  // Nuestro modal va a estar esperando de lo que vaya a ejecutar de nuestro utils

      component: UpdateStudentComponent, // Digamos que va a ser el elemento del cual nosotros queremos que afecte
      cssClass: 'add-update-modal', // clase css
      componentProps: {students} // Se van a traer los datos que vamos a ir trayendo , esto se podra realizar gracias a component props y se lo pasaremos atraves de un objeto o propiedad

    })

    if(modal) this.getStudent() // Una vez que se cumple la acción de nuestro modal , el if va a condicionar a nuestra ventana  si se activa nuestra ventana modal enviaremos nuestro this.getemployee que trae consigo ionViewWillEnter

  }



}