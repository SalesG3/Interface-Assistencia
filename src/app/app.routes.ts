import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { IndexComponent } from './componentes/index/index.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: '', component: IndexComponent}
];
