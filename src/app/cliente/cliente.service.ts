import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Cliente } from 'src/assets/shared/models/Cliente';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
    
  private readonly API = 'https://localhost:44314/api/cliente';

  constructor(private http: HttpClient) { }

  list(){
    return this.http.get<Cliente[]>(this.API);
  }

  salvar(cliente: Cliente) {
    return this.http.post<Cliente>(this.API, cliente);
  }

  remove(cliente: Cliente){
    return this.http.delete<Cliente>(this.API + '/' + cliente.idCliente);
  }

  update(cliente: Cliente) {
    return this.http.put<Cliente>(this.API + '/' + cliente.idCliente, cliente);
  }

  pesquisar(cliente: Cliente){
    return this.http.post<Cliente[]>(this.API + '/pesquisar', cliente);
  }

  loadByID(id: any) {
    return this.http.get<Cliente>(this.API + '/' + id).pipe(take(1));
  }
}
