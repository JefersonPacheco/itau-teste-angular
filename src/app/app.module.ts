import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClienteComponent } from './cliente/cliente.component';
import { SharedModule } from './shared/shared.module';
import { FormClienteComponent } from './cliente/form-cliente/form-cliente.component';
import { ClienteModule } from './cliente/cliente.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    AppComponent,
    ClienteComponent,
    FormClienteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ModalModule.forRoot(),
    ClienteModule,
    SharedModule,
    ReactiveFormsModule,
    TextMaskModule
  ],
  providers: [
    FormClienteComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
