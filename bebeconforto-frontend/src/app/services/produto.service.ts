import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Keep the service self-contained when the product model is not available.
export interface Produto {
  id?: number;
  nome?: string;
  descricao?: string;
  preco?: number;
  categoria?: string;
  imagemUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = 'http://localhost:8081/api/produto';

  constructor(private http: HttpClient) {}

  // 1. GET - Retorna a vitrine (/api/produto/vitrine)
  public carregarVitrine(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/vitrine`);
  }

  // 2. GET - Retorna a busca por termo (/api/produto/busca/{termo})
  public carregarPesquisa(termo: string): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/busca/${termo}`);
  }

  // 3. POST - Grava um novo produto (/api/produto)
  public gravar(obj: Produto): Observable<any> {
    return this.http.post(this.apiUrl, obj);
  }

  // 4. PUT - Altera um produto existente (/api/produto)
  public alterar(obj: Produto): Observable<any> {
    return this.http.put(this.apiUrl, obj);
  }

  // 5. GET - Carrega um único produto pelo ID (/api/produto/{codigo})
  public carregar(codigo: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${codigo}`);
  }

  // 6. DELETE - Remove um produto pelo ID (/api/produto/{codigo})
  public remover(codigo: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${codigo}`);
  }
}