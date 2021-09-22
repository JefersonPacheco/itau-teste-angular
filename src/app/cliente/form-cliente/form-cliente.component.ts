import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ClienteService } from '../cliente.service';
import { AlertModalService } from '../../shared/alert-modal.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Cliente } from 'src/assets/shared/models/Cliente';
import { Telefone } from 'src/assets/shared/models/Telefone';

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html',
  styleUrls: ['./form-cliente.component.css']
})
export class FormClienteComponent implements OnInit {

  public form!: FormGroup;
  submitted = false;
  cliente!: Cliente;
  telefone!: Telefone[];
  readonly: Boolean = false;

  public cpfMask = [/[1-9]/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]
  public telMask = [/[1-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  public cepMask = [/[1-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]
  public dddMask = ['(', /[1-9]/, /\d/, ')']

  constructor(
    private fb: FormBuilder,
    private service: ClienteService,
    private modal: AlertModalService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Busca o cliente pelo Id
    this.route.params
      .pipe(
        map((params: any) => params['idCliente']),
        switchMap(id => this.service.loadByID(id)),
      )
      .subscribe(cliente => this.updateForm(cliente));

    this.iniciarForm();
  }

  updateForm(cliente: Cliente) {
    this.form.patchValue({
      nome: cliente.nome,
      sobrenome: cliente.sobrenome,
      cep: cliente.cep,
      complemento: cliente.complemento,
      cpf: cliente.cpf,
      idCliente: cliente.idCliente,
      logradouro: cliente.logradouro,
      numLogradouro: cliente.numLogradouro
    });

    // Limpa os telefones
    const control = <FormArray>this.form.controls['telefone'];
    control.removeAt((control.length - 1));

    // Preenche com a lista de telefones
    cliente.telefone.forEach(tel => {
      this.addNumberPreenchido(tel);
    });

    this.readonly = true;
  }

  iniciarForm() {
    this.form = this.fb.group({
      idCliente: 0,
      nome: [this.cliente?.nome, [Validators.required, Validators.maxLength(50)]],
      cep: [this.cliente?.cep, [Validators.required, Validators.minLength(8)]],
      complemento: [this.cliente?.complemento, [Validators.maxLength(100)]],
      cpf: [this.cliente?.cpf, [Validators.required, Validators.minLength(11)]],
      logradouro: [this.cliente?.logradouro, [Validators.maxLength(200)]],
      sobrenome: [this.cliente?.sobrenome, [Validators.required, Validators.maxLength(50)]],
      numLogradouro: [this.cliente?.numLogradouro, [Validators.maxLength(6)]],
      telefone: this.fb.array([
        new FormGroup({
          ddd: new FormControl(),
          numero: new FormControl(),
          tipotelefone: new FormControl(),
        })
      ])
    });
  }

  addNumber() {
    const control = <FormArray>this.form.controls['telefone'];
    control.push(new FormGroup({
      ddd: new FormControl(),
      numero: new FormControl(),
      tipotelefone: new FormControl(),
    }));
  }

  addNumberPreenchido(telefone: Telefone) {
    const control = <FormArray>this.form.controls['telefone'];
    control.push(new FormGroup({
      idTelefone: new FormControl({ value: telefone.idTelefone, disabled: false }),
      ddd: new FormControl({ value: telefone.ddd, disabled: false }),
      numero: new FormControl({ value: telefone.numero, disabled: false }),
      tipotelefone: new FormControl({ value: telefone.tipoTelefone, disabled: false }),
    }));
  }

  removeNumber() {
    const control = <FormArray>this.form.controls['telefone'];
    if (control.length > 1)
      control.removeAt((control.length - 1));
    else
      this.modal.showAlertDanger("Cliente necessita de ao menos um telefone");
  }

  getControls() {
    return (this.form.get('telefone') as FormArray).controls;
  }

  hasError(field: string) {
    return this.form.get(field)?.errors;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.valid) {
      let msgSuccess = 'Cliente criado com sucesso!';
      let msgError = 'Erro ao criar cliente, tente novamente!';
      if (this.form.value.id) {
        msgSuccess = 'Cliente atualizado com sucesso!';
        msgError = 'Erro ao atualizar cliente, tente novamente!';
      }

      // update
      if (this.form.value.idCliente) {
        this.service.update(this.form.value).subscribe(
          success => {
            this.modal.showAlertSuccess('Cliente atualizado com sucesso!');
            this.location.back();
          },
          error => this.modal.showAlertDanger('Erro ao atualizar cliente, tente novamente!')
        );
      } else {
        // create
        this.service.salvar(this.form.value).subscribe(
          success => {
            this.modal.showAlertSuccess(msgSuccess);
            this.location.back();
          },
          error => this.modal.showAlertDanger(msgError)
        );
      }

    }
    else {
      this.modal.showAlertDanger("Formulário Inválido!")
    }
  }

  onCancel() {
    this.submitted = false;
    this.form.reset();
  }

}
