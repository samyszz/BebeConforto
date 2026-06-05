import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarrinhoService, ItemCarrinho } from '../../services/carrinho.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carrinho.html',
  styleUrls: ['./carrinho.css']
})
export class Carrinho implements OnInit {
  itens: ItemCarrinho[] = [];
  total: number = 0;
  mostrarModal: boolean = false;
  metodoPagamento: string = '';

  constructor(
    private carrinhoService: CarrinhoService, 
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.carrinhoService.carrinho$.subscribe(itensAtualizados => {
      this.itens = itensAtualizados;
      this.total = this.carrinhoService.obterTotal();
    });
  }

  aumentarQtd(item: ItemCarrinho) {
    this.carrinhoService.alterarQuantidade(item.produto.id, item.quantidade + 1);
  }

  diminuirQtd(item: ItemCarrinho) {
    this.carrinhoService.alterarQuantidade(item.produto.id, item.quantidade - 1);
  }

  remover(item: ItemCarrinho) {
    this.carrinhoService.remover(item.produto.id);
  }

  abrirModal() {
    if (this.itens.length > 0) {
      this.mostrarModal = true;
    }
  }

  fecharModal() {
    this.mostrarModal = false;
    this.metodoPagamento = '';
  }

  selecionarPagamento(metodo: string) {
    this.metodoPagamento = metodo;
  }

  finalizarCompra() {
    if (!this.metodoPagamento) {
      this.toast.erro('Por favor, escolha como deseja pagar.');
      return;
    }

    const novoPedido = {
      id: Math.floor(1000 + Math.random() * 9000),
      data: new Date().toLocaleDateString('pt-BR'),
      total: this.total,
      metodoPagamento: this.metodoPagamento,
      itens: this.itens
    };

    const pedidosSalvos = JSON.parse(localStorage.getItem('meusPedidos') || '[]');
    pedidosSalvos.push(novoPedido);
    localStorage.setItem('meusPedidos', JSON.stringify(pedidosSalvos));

    this.toast.sucesso(`Compra finalizada com sucesso no ${this.metodoPagamento}! 🎉`);
    
    this.carrinhoService.limpar();
    this.fecharModal();
    this.router.navigate(['/perfil']); 
  }
}