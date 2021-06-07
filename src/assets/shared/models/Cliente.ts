import { Telefone } from "./Telefone";

export class Cliente
{
    idCliente!: number;
    nome!: string;
    sobrenome!: string;
    cpf!: string;
    cep!: string;
    logradouro!: string;
    complemento!: string;
    numLogradouro!: string; 
    telefone!: Telefone[];
}
