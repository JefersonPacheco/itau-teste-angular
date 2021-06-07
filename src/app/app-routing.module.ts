import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from './cliente/cliente.component';
import { FormClienteComponent } from './cliente/form-cliente/form-cliente.component';

const routes: Routes = [
  { path: '', component: ClienteComponent },
  { path: 'novo', component: FormClienteComponent },
  { path: 'editar/:idCliente', component: FormClienteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
