import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private baseUrl = 'http://localhost:9090/api';

  constructor(private http: HttpClient) { }

  // Verifique se o nome é exatamente este
  getVitrine(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/produtos`);

  }
// Busca apenas um produto específico pelo ID dele
  getProduto(id: string) {
    return this.http.get<any>(`http://localhost:9090/api/produtos/${id}`);
  }

}