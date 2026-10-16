import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  telefone?: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Apontando para o backend local no Endpoint de Clientes/Auth
  private baseUrl = 'http://localhost:9090/api/clientes';

  constructor(private http: HttpClient) {}

  // Autenticação
  login(credenciais: LoginRequest): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.baseUrl}/login`, credenciais);
  }

  redefinirSenha(email: string, novaSenha: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/redefinir-senha`, { email, novaSenha }, { responseType: 'text' });
  }

  registrar(dados: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.baseUrl, dados);
  }

recuperarSenha(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/recuperar-senha`, { email });
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/${id}`);
  }

  atualizarCliente(id: number, dados: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.baseUrl}/${id}`, dados);
  }

  deletarCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Gerenciamento de Sessão Local
  isLoggedIn(): boolean {
    return !!localStorage.getItem('nomeUsuario');
  }

  logout(): void {
    localStorage.removeItem('nomeUsuario');
  }
}