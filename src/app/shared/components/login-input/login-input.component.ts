import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-login-input',
  templateUrl: './login-input.component.html',
  styleUrls: ['./login-input.component.scss'],
})
export class LoginInputComponent  implements OnInit {

  // Recibirá parametros que estará enlazado nuestro formulario de auth

  @Input() control!: FormControl; // Rescatará la información
  @Input() type!: string; // Definirá el input será si es tipo texto , password etc 
  @Input() label!: string; // Para saber en que input se esta escribriendo (Será para el placeholder)
  @Input() autocomplete!: string; // Se guardaran los correos que se vayan agregando 
  @Input() icon!: string; // Servirá para el icono de los inputs del form

  isPassword!: boolean; // Esta variable vamos a identificar si es de tipo password 
  hide: boolean = true; // Si la contraseña estará oculta o no

  constructor() { }

  ngOnInit() {

    if(this.type == 'password') this.isPassword = true; // si existe algo en passsword que nuestro "ojo-icono" se active y si no coincide no lo hara


  }

  showandhide(){ // Nos servirá esta función para mostrar y ocultar la contraseña 

    this.hide = !this.hide; // Si this.hide esta en true , cambiará a false y si esta en false estará en true

    if(this.hide) this.type = 'password';
    else this.type = 'text' // El ojo cambiara de password a texto para ver si se ingreso la contraseña
  }

}
