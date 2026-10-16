import { Component, ChangeDetectorRef } from '@angular/core';
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
dados = { nome: '', email: '', senha: '', telefone: '', novaSenha: '' };
  modo: 'login' | 'cadastro' | 'recuperar' = 'login';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
    private cdr: ChangeDetectorRef // <-- INJETADO AQUI
  ) {}

  alternarModo(novoModo: 'login' | 'cadastro' | 'recuperar') {
    this.modo = novoModo;
    this.cdr.detectChanges(); // <-- ISSO RESOLVE O ERRO NG0100
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
        localStorage.setItem('clienteId', res.id);
        if(res.telefone) {
          localStorage.setItem('telefoneUsuario', res.telefone);
        }
        
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
        setTimeout(() => {
          this.alternarModo('login');
        }, 50); // Tempo levemente ajustado para evitar conflito com a animação
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
        this.toast.sucesso(`Instruções enviadas para ${this.dados.email}!`);
        this.dados.email = '';
        setTimeout(() => {
          this.alternarModo('login');
        }, 50);
      },
      error: (err: any) => {
        this.toast.erro("Erro: " + (err.error?.message || 'Não foi possível enviar o e-mail.'));
      }
    });
  }
}