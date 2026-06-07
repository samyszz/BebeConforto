import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private apiUrl = 'https://bebeconforto-production.up.railway.app/api';

  constructor(private http: HttpClient) { }

  getVitrine(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produtos`);
  }

  // AGORA SIM, USANDO A URL DO RAILWAY:
  getProduto(id: string) {
    return this.http.get<any>(`${this.apiUrl}/produtos/${id}`);
  }
}