import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth'; // Función que nos va a permitir obtener los datos que vienen de la autenticación de Firebase, se , manejara con un sign para ver con que queremos logearnos
import { User } from '../models/user.model';
import { addDoc, collection, deleteDoc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { doc, getFirestore } from 'firebase/firestore';
import { UtilsService } from './utils.service';
import { deleteObject, getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth); // El "Inject" Sustituirá el constructor e importará nuestros modulos
  firestore = inject(AngularFirestore);
  utils = inject(UtilsService);
  dataRef : AngularFirestoreCollection <User>; // Variable para obtener los datos de firestore a la aplicación y a esto le mandaremos el User , para decirle que estamos trabajando con los modelos

  // --------------- Función de Autenticación --------------- //
  
  getAuth() // getAuth nos ayudará a obtener los datos de firebase , a su vez crearemos una función para traer ese contenido
  { 

    return getAuth(); // Retornará los datos

  }

  // --------------- Función de login --------------- //

  signIn(user: User ) // Mostrara los datos atraves del contenido del getAuth y traeremos el modelo "User" que creamos en la carpeta models, donde traera el contenido que declaramos y necesitamos
  { 

    return signInWithEmailAndPassword(getAuth(), user.email, user.password); // Aqui vamos a utilizar el contenido que necesitamos que declaramos en nuestro model y se aplique para nuestra autenticación

  }

  // --------------- Función de registrar --------------- // 

  signUp(user: User)
  { 

    return createUserWithEmailAndPassword (getAuth(),user.email, user.password);

  }

  // --------------- Función de actualizar nombre --------------- //

  updateUser(displayName: any) // Esta función nos hará una actualización a agregar el nombre , una vez que se encuentre la información del registro
  { 

    return updateProfile (getAuth().currentUser,{displayName}); // Agregar .currentUser porque será el usuario actual el que vamos a actualizar

  }

  /*  Apartir de aqui se inicio varias funciones para enlazar nuestra información a la base de datos (Firestore Database)  */


  // --------------- Función de envio de datos a firebase --------------- //

  setDocument(path: any, data: any ) // Se adjunto "path" para saber donde añadimos esa información y nuestra data
  { 

    return setDoc(doc(getFirestore(), path), data) // Se va a mandar una nueva función para nuestro set y va a recibir nuestra data , gracias a nuestra función "getFirestore"

  }

  // --------------- Función de obtención de la información una vez logeado el usuario, obtener el documento de firebase --------------- //

  async getDocument(path: any) // Para esta función , vamos a estar esperando una respuesta, por lo tanto debe ser asincrono, Se adjunto "path" para saber donde añadimos esa información y nuestra data
  { 

    return (await getDoc(doc(getFirestore(), path))).data() // estará esperando esa respuesta, traemos el documento este recibe la información , traemos el path y el .data para traer todos esos datos
    

  }

   // --------------- Función de recuperación de correo --------------- //

   sendRecoveryEmail(email: string)  // este traerá el email de tipo string
   { 

    return sendPasswordResetEmail(getAuth(), email) // Este va a tener nuestros datos en getauth y traerá nuestro correo

   }

   // --------------- Función de cerrar sesión --------------- //
   
   signOut(){

    getAuth().signOut(); // Para esta función vamos a traer nuestros datos y a indicarle que vamos a salir
    localStorage.removeItem('user'); // Vamos a indicarle que nuestro localstorage va a ser removido y vamos a indicarle nuestra key , esta será user , puesto que esta contendra la información se puede verificar en la consola
    this.utils.routerlink('/auth'); // Una vez removido el localstorage, me navegará ahora si al login-auth

   }

   // --------------- Función crear servicio de añadir información y para crear la carpeta o documento 'empleados' --------------- //

   addDocument(path: any, data: any){ // Esta función contendra nuestra raiz para distinguir de donde vamos a obtener la información que viene de firebase y el data que será el dato que vamos a añadir. Esto va a ir enlazado a firebase 'users/id/empleados' (Crearemos un nuevo documento)

    return addDoc(collection(getFirestore(), path), data) // retornará a nuestro nuevo servicio addDoc , asi mismo vamos a enviar la coeleccion hacia donde queramos redirecionar esta parte, traerá nuestro getfirestore, añadiremos nuesto path y data que es la información que vamos añadir en nuestra colección  (Guarda los datos)

   }
  
   // --------------- Función para actualizar foto una vez subida en nuestra app  --------------- //

   async updateImg (path: any, data_url: any){ // Le estaremos trayendo la ruta o raiz y nuestra data_url para indicarle a donde va a ir

    return uploadString(ref(getStorage(), path), data_url, 'data_url') // Retornaremos un upload de tipo string y este debe de traer una referencia , esa referencia vamos añadirle un getstorage para que se almacene en nuestro storage de firebase que me permite guardar imagenes o diferente multimedia, ademas de traer nuestra ruta o raiz traeremos nuestra data-url o dato que queremos almacenar como data_url
    .then(() =>{ // Necesitaremos suscribirnos al servicio con .then y nos va a retornar ahora si nuestro getdownload con nuestra referencia en el storage
      return getDownloadURL(ref(getStorage(), path)) // guardamos el dato dentro de nuestro getstorage con esa ruta
    })

   }

   // --------------- Función para obtener empleados en nuestra base de firebase   --------------- //

   getCollectionData (path: any):AngularFirestoreCollection<User>{ // Esta función traerá nuestro path , para saber de donde queremos obtener nuestros datos , esto vendra de el servicio de firestorecollection y traeremos user para indicar el manejo del modelo user.model

    this.dataRef = this.firestore.collection(path, ref => ref.orderBy('name', 'asc')) // Vamos a traer la información atraves de un dataref y a nuestro servicio de firestore que queremos , auque tenemos que hacer la referencia a nuestro path y la referencia , ademas de que queremos ordenar nuestra tabla 
    return this.dataRef;
   }

   // --------------- Función de recopilar la ruta de la imagen con su URL (Servirá para editar)--------------- //

   async getFilePath (url:string){ // Va a contener nuestra URL

      return ref(getStorage(), url).fullPath // Va a devolver a retornará la referencia en la cual vamos a obtener nuestro getstorage, traemos la url para rescatarla, tambien vamos a indicarle que traiga el path completo

   }

   // --------------- Función para  actualizar nuestro documento (Nos permita editar)  --------------- //

   updateDocument(path: any, data: any){ // Traemos nuestro path y data

    return updateDoc(doc(getFirestore(), path), data); // Treamos la función de update que viene de firestore, traemos el path para que lo reconozca y nuestra data completa (Autocompletar)

   }

   // --------------- Función para eliminar (empleado) --------------- //

   deleteDocument(path: any){

    return deleteDoc (doc(getFirestore(), path)); // Vamos a regresar esta función de firebase para poder eliminar y traemos nuestro documento que queremos eliminar junto con la raiz o path 

   }

   // --------------- Función para eliminar (imagen) --------------- //

   deleteFile(path: any){

    return deleteObject (ref(getStorage(), path)); // Vamos a manejar un servicio para la imagen como va a ser un objeto , esta va a necesitar una referencia la cual será nuestro storage donde se va a almacenar nuestra imagen

   }

   // Funciones específicas para nuestra aplicación
  saveNewInstitution(newInstitutionName: string) {
    const path = 'institutions'; // Supongamos que 'institutions' es la colección donde se guardan las instituciones
    return this.addDocument(path, { name: newInstitutionName });
  }

   
}
