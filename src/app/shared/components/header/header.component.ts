import { Component, Input, OnInit, inject } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  /* Le estamos pasando parametros a nuestro header */

  @Input() title!: string; // Enviamos un titulo 
  @Input() showMenu!: boolean; // Hara que el menu se esconda o no , esto dependera del modulo, lo va a recibir mi main (padre)
  @Input() backbutton!: string; // Sera inicializado un boton de regresar, con ello puedo condicionar mi header 
  @Input() isModal!: boolean; 
  
  utils = inject(UtilsService); // Se va hacer uso de utils.service para invocar al routerlink

  
  constructor() { }  

  ngOnInit() {}

  dismissModal(){ // Estamos trayendo una función de utils, "dismissModal" para la desactivación de nuestra ventana

    this.utils.dismissModal()

  }

}
