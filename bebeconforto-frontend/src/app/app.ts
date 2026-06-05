import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Importado apenas uma vez
import { Header } from './components/header/header'; // Usando o nome original "Header"

// Se o Footer ainda não existir ou não estiver configurado, comente a linha abaixo por enquanto
// import { Footer } from './components/footer/footer'; 

@Component({
  selector: 'app-root',
  standalone: true,
  // Certifique-se de listar apenas os nomes que importou acima
  imports: [RouterOutlet, Header], 
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
  `
})
export class App { }