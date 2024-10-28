import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { IndexComponent } from './componentes/index/index.component';
import { ClientesComponent } from './componentes/clientes/clientes.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: '', component: IndexComponent, children: [
        {path: 'clientes', component: ClientesComponent}
    ]}
];
