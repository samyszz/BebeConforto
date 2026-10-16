import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Produto {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagemUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class Api {
  // Apontando para o backend local no Endpoint de Produtos
  private apiUrl = 'http://localhost:9090/api/produtos'; // No api.ts
  
  constructor(private http: HttpClient) { }

  // Métodos de Leitura (Read)
  getVitrine(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  getProduto(id: string | number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  criarProdutos(produtos: Produto[]): Observable<Produto[]> {
    return this.http.post<Produto[]>(this.apiUrl, produtos);
  }

  criarProduto(produto: Produto): Observable<Produto[]> {
    return this.criarProdutos([produto]);
  }

  popularBanco(): Observable<string> {
    return this.http.post(`${this.apiUrl}/popular-banco`, null, { responseType: 'text' });
  }

  deletarTodos(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }

  deletarProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}