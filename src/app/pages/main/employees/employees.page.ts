import { Component, OnInit, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Employees } from 'src/app/models/employees.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UpdateEmployeeComponent } from 'src/app/shared/components/update-employee/update-employee.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss'],
})
export class EmployeesPage implements OnInit {

  constructor() { }

  searchTerm: string = '';
  utils = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  loading: boolean = false;
  employees: Employees[] = [];

  ngOnInit() {}

  ionViewWillEnter() { 
    this.getEmployee();
  }

  getEmployeeSearch() {
    const path = `users/${this.user().uid}/empleados`;
    this.loading = true;
    let sub = this.firebaseService.getCollectionData(path).snapshotChanges().pipe(
      map(changes => changes.map(c => ({
        id: c.payload.doc.id,
        ...c.payload.doc.data(),
      })))
    ).subscribe({
      next: (resp: any) => {
        this.employees = resp.filter(employee =>
          `${employee.name} ${employee.lastname_p} ${employee.lastname_m}`.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          employee.id_key.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          employee.id_key2.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
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

  async addUpdateEmployee(employee?: Employees) {
    let modal = await this.utils.getModal({
      component: UpdateEmployeeComponent,
      cssClass: 'add-update-modal',
      componentProps: { employee }
    });
    if (modal) this.getEmployee();
  }

  user() {
    return this.utils.getLocalStorage('user');
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

  doRefresh(event: any) {
    setTimeout(() => {
      this.getEmployee();
      event.target.complete();
    }, 1000);
  }

  async deleteEmployee(employee: Employees) {
    let path = `users/${this.user().uid}/empleados/${employee.id}`;
    const loading = await this.utils.loading();
    await loading.present();
    let imgPath = await this.firebaseService.getFilePath(employee.img);
    await this.firebaseService.deleteFile(imgPath);
    this.firebaseService.deleteDocument(path).then(async () => {
      this.employees = this.employees.filter(e => e.id !== employee.id);
      this.utils.dismissModal({ success: true });
      this.utils.presentToast({
        message: `El empleado fue eliminado exitosamente`,
        duration: 1500,
        color: 'success',
        position: 'bottom',
        icon: 'checkmark-circle-outline'
      });
    }).catch(error => {
      console.log(error);
      this.utils.presentToast({
        message: error.message,
        duration: 2500,
        color: 'danger',
        position: 'bottom',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  }

  async confirmDeleteEmployee(employee: Employees) {
    this.utils.presentAlert({
      header: 'Eliminar empleado',
      message: '¿Desea borrar a este empleado?',
      mode: 'ios',
      buttons: [
        { text: 'Cancelar' },
        { text: 'Si, eliminar', handler: () => this.deleteEmployee(employee) }
      ]
    });
  }
}
