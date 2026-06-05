import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})
export class Auth {
  dados = { nome: '', email: '', senha: '' };
  modo: 'login' | 'cadastro' | 'recuperar' = 'login'; 

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private toast: ToastService
  ) {}

  alternarModo(novoModo: 'login' | 'cadastro' | 'recuperar') {
    this.modo = novoModo;
  }

  processar() {
    if (this.modo === 'login') {
      this.processarLogin();
    } else if (this.modo === 'cadastro') {
      this.processarRegistro();
    } else if (this.modo === 'recuperar') {
      this.processarRecuperacao();
    }
  }

  processarLogin() {
    this.authService.login({ email: this.dados.email, senha: this.dados.senha }).subscribe({
      next: (res: any) => {
        this.toast.sucesso("Login realizado com sucesso!");
        localStorage.setItem('nomeUsuario', res.nome);
        this.router.navigate(['/']); 
      },
      error: (err: any) => {
        this.toast.erro("Erro no login: " + (err.error?.message || 'Verifique suas credenciais'));
      }
    });
  }

  processarRegistro() {
    this.authService.registrar(this.dados).subscribe({
      next: (res: any) => {
        this.toast.sucesso("Conta criada com sucesso!");
        
        // O setTimeout "engana" o Angular para ele fazer a mudança no próximo frame
        setTimeout(() => {
          this.alternarModo('login'); 
        }, 10);
      },
      error: (err: any) => {
        this.toast.erro("Erro no cadastro: " + (err.error?.message || 'Tente novamente'));
      }
    });
  }

  processarRecuperacao() {
    if (!this.dados.email) {
      this.toast.erro("Por favor, digite o seu e-mail.");
      return;
    }

    this.authService.recuperarSenha(this.dados.email).subscribe({
      next: () => {
        this.toast.sucesso(`Instruções enviadas para ${this.dados.email}! 💜`);
        this.dados.email = '';
        
        // Aplicando a mesma correção aqui
        setTimeout(() => {
          this.alternarModo('login');
        }, 10);
      },
      error: (err: any) => {
        this.toast.erro("Erro: " + (err.error?.message || 'Não foi possível enviar o e-mail.'));
      }
    });
  }
}