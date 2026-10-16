import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  // Variável necessária para o seu [(ngModel)] no HTML
  termoDigitado: string = '';

  constructor(public authService: AuthService) {}

  // Método chamado pelo (ngModelChange) no seu HTML
  aoDigitar() {
    console.log("Termo de busca:", this.termoDigitado);
    // Aqui você pode adicionar a lógica de busca do seu projeto
  }

  // Método que o seu HTML (ngIf) vai chamar
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Método chamado pelo botão de sair
  logout() {
    this.authService.logout();
  }
}