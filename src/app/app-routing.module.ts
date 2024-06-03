import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

const routes: Routes = [
  
  
  /*{
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },

  */
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule),
     canActivate: [NoAuthGuard] // Activamos el guard del login
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule),
    // canActivate: [AuthGuard] // Activamos el guard para el home 
  },
  {
    path: 'employees',
    loadChildren: () => import('./pages/main/employees/employees.module').then( m => m.EmployeesPageModule)
  },
  {
    path: 'students',
    loadChildren: () => import('./pages/main/students/students.module').then( m => m.StudentsPageModule)
  },
   {
     path: 'splash',
     loadChildren: () => import('./pages/splash/splash.module').then( m => m.SplashPageModule)
   }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
