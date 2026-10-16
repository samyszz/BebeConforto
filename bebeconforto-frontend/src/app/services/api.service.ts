import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscaService {
  // O BehaviorSubject guarda o último valor digitado e avisa quem estiver a ouvir
  private termoBuscaSource = new BehaviorSubject<string>('');
  
  // A variável que a Home vai ficar a observar
  termoBuscaAtual = this.termoBuscaSource.asObservable();

  constructor() { }

  // Função que o Header vai chamar para atualizar a palavra
  atualizarBusca(termo: string) {
    this.termoBuscaSource.next(termo);
  }
}