import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarrinhoService, ItemCarrinho } from '../../services/carrinho.service';
import { ToastService } from '../../services/toast.service';
import { PedidoService } from '../../services/pedido.service';

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
    private toast: ToastService,
    private pedidoService: PedidoService
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

    const clienteId = localStorage.getItem('clienteId');

    if (!clienteId) {
      this.toast.erro('Você precisa estar logado para finalizar a compra!');
      this.router.navigate(['/login']);
      return;
    }

    const novoPedido = {
      clienteId: Number(clienteId),
      data: new Date().toISOString().split('T')[0],
      total: this.total,
      metodoPagamento: this.metodoPagamento,
      itens: this.itens.map(i => ({
        produtoId: i.produto.id,
        quantidade: i.quantidade
      }))
    };

    // A chamada 'any' previne os erros de tipagem estrita do TypeScript
    (this.pedidoService as any).gravarPedido(novoPedido).subscribe({
      next: () => {
        this.toast.sucesso(`Compra finalizada com sucesso no ${this.metodoPagamento}!`);
        this.carrinhoService.limpar();
        this.fecharModal();
        this.router.navigate(['/perfil']);
      },
      error: (err: any) => {  // <- Aqui resolve o segundo erro 'err' implicitly has 'any'
        console.error(err);
        this.toast.erro('Erro ao processar o pedido no servidor.');
      }
    });
}
}