import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PedidoService } from '../../services/pedido.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil implements OnInit {
  clienteId: number = 0;
  nomeUsuario: string = '';
  telefone: string = '';
  editandoNome: boolean = false;
  editandoTelefone: boolean = false;
  pedidos: any[] = [];
  mostrarPedidos: boolean = false;
  favoritos: any[] = [];
  mostrarFavoritos: boolean = false;

  constructor(
    private authService: AuthService,
    private pedidoService: PedidoService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.clienteId = Number(localStorage.getItem('clienteId'));
    this.nomeUsuario = localStorage.getItem('nomeUsuario') || 'Usuário';
    this.telefone = localStorage.getItem('telefoneUsuario') || '(11) 99999-9999';

    // Busca os pedidos REAIS vinculados a este cliente no Banco de Dados
    if (this.clienteId) {
      this.pedidoService.getPedidosDoCliente(this.clienteId).subscribe({
        next: (dados) => {
          this.pedidos = dados ? dados.reverse() : [];
        },
        error: (err) => console.error('Erro ao buscar pedidos no banco:', err)
      });
    }

    const favoritosStorage = localStorage.getItem('meusFavoritos');
    if (favoritosStorage) {
      this.favoritos = JSON.parse(favoritosStorage);
    }
  }

  salvarNome() {
    this.editandoNome = false;
    // Faz o UPDATE real no banco de dados via PUT
    this.authService.atualizarCliente(this.clienteId, { nome: this.nomeUsuario, telefone: this.telefone }).subscribe({
      next: () => {
        localStorage.setItem('nomeUsuario', this.nomeUsuario);
        this.toast.sucesso('Nome atualizado com sucesso!');
      },
      error: () => this.toast.erro('Erro ao atualizar nome no banco de dados.')
    });
  }

  salvarTelefone() {
    this.editandoTelefone = false;
    // Faz o UPDATE real no banco de dados via PUT
    this.authService.atualizarCliente(this.clienteId, { nome: this.nomeUsuario, telefone: this.telefone }).subscribe({
      next: () => {
        localStorage.setItem('telefoneUsuario', this.telefone);
        this.toast.sucesso('Telefone atualizado com sucesso!');
      },
      error: () => this.toast.erro('Erro ao atualizar telefone no banco de dados.')
    });
  }

  alternarPedidos() {
    this.mostrarPedidos = !this.mostrarPedidos;
    this.mostrarFavoritos = false;
  }

  alternarFavoritos() {
    this.mostrarFavoritos = !this.mostrarFavoritos;
    this.mostrarPedidos = false;
  }

  removerFavorito(id: number) {
    this.favoritos = this.favoritos.filter(f => f.id !== id);
    localStorage.setItem('meusFavoritos', JSON.stringify(this.favoritos));
  }

  sair() {
    this.authService.logout();
    localStorage.removeItem('clienteId');
    localStorage.removeItem('telefoneUsuario');
    this.router.navigate(['/login']);
  }
}