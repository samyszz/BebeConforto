import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil implements OnInit {
  nomeUsuario: string = '';
  telefone: string = '';

  editandoNome: boolean = false;
  editandoTelefone: boolean = false;

  pedidos: any[] = [];
  mostrarPedidos: boolean = false;

  // Novas variáveis para os Favoritos
  favoritos: any[] = [];
  mostrarFavoritos: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.nomeUsuario = localStorage.getItem('nomeUsuario') || 'Usuário';
    this.telefone = localStorage.getItem('telefoneUsuario') || '(00) 00000-0000';
    
    const pedidosStorage = localStorage.getItem('meusPedidos');
    if (pedidosStorage) {
      this.pedidos = JSON.parse(pedidosStorage).reverse(); 
    }

    // Carrega os favoritos
    const favoritosStorage = localStorage.getItem('meusFavoritos');
    if (favoritosStorage) {
      this.favoritos = JSON.parse(favoritosStorage);
    }
  }

  salvarNome() {
    this.editandoNome = false;
    localStorage.setItem('nomeUsuario', this.nomeUsuario);
  }

  salvarTelefone() {
    this.editandoTelefone = false;
    localStorage.setItem('telefoneUsuario', this.telefone);
  }

  // Lógica para alternar as abas
  alternarPedidos() {
    this.mostrarPedidos = !this.mostrarPedidos;
    this.mostrarFavoritos = false; // Fecha os favoritos se abrir os pedidos
  }

  alternarFavoritos() {
    this.mostrarFavoritos = !this.mostrarFavoritos;
    this.mostrarPedidos = false; // Fecha os pedidos se abrir os favoritos
  }

  // Remove um item da lista de favoritos
  removerFavorito(id: number) {
    this.favoritos = this.favoritos.filter(f => f.id !== id);
    localStorage.setItem('meusFavoritos', JSON.stringify(this.favoritos));
  }

  sair() {
    this.authService.logout();
    localStorage.removeItem('nomeUsuario'); 
    this.router.navigate(['/login']);
  }
}