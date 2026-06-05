import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://bebeconforto-production.up.railway.app/api/auth';

  
  constructor(private http: HttpClient) {}

  login(credenciais: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credenciais);
  }

  registrar(dados: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/registrar`, dados);
  }

  // ESTE MÉTODO PRECISA EXISTIR AQUI
  recuperarSenha(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/recuperar-senha`, { email });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('nomeUsuario');
  }

  logout() {
    localStorage.removeItem('nomeUsuario');
  }
}