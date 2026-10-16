import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Mantém o serviço compilável mesmo quando o modelo não está disponível neste módulo.
export interface Cliente {
  id?: number;
  nome?: string;
  email?: string;
  senha?: string;
  telefone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  // Apontando para o backend do BebeConforto na porta 9090
  private apiUrl = 'http://localhost:9090/api/clientes';

  constructor(private http: HttpClient) {}

  // POST - Gravar um novo cliente (Cadastro)
  gravarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  // GET - Buscar os dados de um cliente específico pelo ID
  consultarCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  // PUT - Atualizar os dados de um cliente existente
  alterarCliente(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  // DELETE - Remover um cliente do banco de dados (Exigência do CRUD completo)
  deletarCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // POST - Validação de e-mail e senha no Login
  fazerLogin(credenciais: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credenciais);
  }

  // POST - Redefinição de senha do cliente
  redefinirSenha(dados: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/redefinir-senha`, dados, { responseType: 'text' });
  }
}