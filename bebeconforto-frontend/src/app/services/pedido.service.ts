import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:9090/api/pedidos';

  constructor(private http: HttpClient) {}

  // POST - Salvar a compra finalizada no banco de dados
  gravarPedido(pedido: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, pedido);
  }

  // GET - Retornar o histórico de compras de um cliente específico
  getPedidosDoCliente(clienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }
}