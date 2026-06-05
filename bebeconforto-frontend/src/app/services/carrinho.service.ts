import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ItemCarrinho {
  produto: any; // Substitua 'any' pelo seu modelo de Produto se tiver
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private itens: ItemCarrinho[] = [];
  // BehaviorSubject avisa a tela em tempo real quando o carrinho muda
  private carrinhoSubject = new BehaviorSubject<ItemCarrinho[]>([]);
  carrinho$ = this.carrinhoSubject.asObservable();

  adicionar(produto: any) {
    const itemExistente = this.itens.find(i => i.produto.id === produto.id);
    if (itemExistente) {
      itemExistente.quantidade++;
    } else {
      this.itens.push({ produto, quantidade: 1 });
    }
    this.atualizar();
  }

  alterarQuantidade(produtoId: number, quantidade: number) {
    const item = this.itens.find(i => i.produto.id === produtoId);
    if (item) {
      item.quantidade = quantidade;
      if (item.quantidade <= 0) {
        this.remover(produtoId);
      }
    }
    this.atualizar();
  }

  remover(produtoId: number) {
    this.itens = this.itens.filter(i => i.produto.id !== produtoId);
    this.atualizar();
  }

  limpar() {
    this.itens = [];
    this.atualizar();
  }

  obterTotal(): number {
    return this.itens.reduce((total, item) => total + (item.produto.preco * item.quantidade), 0);
  }

  private atualizar() {
    this.carrinhoSubject.next([...this.itens]);
  }
}