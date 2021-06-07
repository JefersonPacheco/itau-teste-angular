import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, empty, of, Subject, EMPTY } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteService } from './cliente.service';
import { Cliente } from '../../assets/shared/models/Cliente';
import { AlertModalService } from '../shared/alert-modal.service';
import { FormClienteComponent } from '../cliente/form-cliente/form-cliente.component'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Telefone } from 'src/assets/shared/models/Telefone';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  clientes!: Cliente[];
  public formBusca!: FormGroup;
  public cpfMask = [/[1-9]/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]
  public telMask = [/[1-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  public cepMask = [/[1-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]
  public dddMask = ['(', /[1-9]/, /\d/, ')']

  bsModalRef!: BsModalRef;

  deleteModalRef!: BsModalRef;
  @ViewChild('deleteModal', { static: true }) deleteModal: any;

  clientes$!: Observable<Cliente[]>;
  error$ = new Subject<boolean>();

  clienteSelecionado: Cliente = new Cliente;
  clienteBusca: Cliente = new Cliente;
  fb: any;

  constructor(
    private service: ClienteService,
    private fbBusca: FormBuilder,
    private modalService: BsModalService,
    private alertService: AlertModalService,
    private router: Router,
    private route: ActivatedRoute,
    private clienteComponent: FormClienteComponent
  ) { }

  ngOnInit() {
    this.service.list()
      .subscribe(dados => this.clientes = dados);

    this.onRefresh();
    this.iniciarFormBusca();
  }

  onRefresh() {
    this.clientes$ = this.service.list().pipe(
      catchError(error => {
        console.error(error);
        this.handleError();
        return empty();
      })
    );
  }

  handleError() {
    this.alertService.showAlertDanger('Erro ao carregar clientes. Tente novamente mais tarde.');
  }

  onEdit(cliente: Cliente) {
    this.router.navigate(['editar', cliente.idCliente], { relativeTo: this.route });
  }

  onDelete(cliente: Cliente) {
    this.clienteSelecionado = cliente;
    this.deleteModalRef = this.modalService.show(this.deleteModal, { class: 'modal-sm' });
  }

  iniciarFormBusca() {

    this.formBusca = this.fbBusca.group({
      nome: [''],
      cpf: [''],
      sobrenome: [''],
    });
  }

  pesquisar() {

    this.clienteBusca = this.formBusca.value;

    if (!this.validarBusca()) {
      this.alertService.showAlertDanger('Favor preencher a busca!');
    }
    else {
      this.clientes$ = this.service.pesquisar(this.clienteBusca).pipe(
        catchError(error => {
          console.error(error);
          this.handleError();
          return empty();
        })
      );
    }
  }

  onConfirmDelete() {
    this.service.remove(this.clienteSelecionado)
      .subscribe(
        (success: any) => {
          this.onRefresh();
          this.deleteModalRef.hide();
        },
        (error: any) => {
          this.alertService.showAlertDanger('Erro ao remover cliente. Tente novamente mais tarde.');
          this.deleteModalRef.hide();
        }
      );
  }

  onDeclineDelete() {
    this.deleteModalRef.hide();
  }


  validarBusca() {
    let validacao = false;

    if (Boolean(this.clienteBusca.nome))
      validacao = true;

    if (Boolean(this.clienteBusca.sobrenome))
      validacao = true;

    if (Boolean(this.clienteBusca.cpf))
      validacao = true;

    return validacao;
  }

  cpf_mask(v: any) {
    v = v.replace(/\D/g, ''); //Remove tudo o que não é dígito
    v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
    v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
    //de novo (para o segundo bloco de números)
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); //Coloca um hífen entre o terceiro e o quarto dígitos
    return v;
  }

  cep_mask(v: any) {
    v = v.replace(/\D/g, ''); //Remove tudo o que não é dígito
    v = v.replace(/(\d{3})(\d{2,3})$/, '$1-$2'); //Coloca um hífen entre o terceiro e o quarto dígitos
    return v;
  }

  tel_mask(v: any) {
    v = v.replace(/\D/g, ''); 
    v = v.replace(/(\d{3})(\d{3,4})$/, '$1-$2');
    return v;
  }

}
