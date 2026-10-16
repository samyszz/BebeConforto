import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscaService {
  private termoBuscaSource = new BehaviorSubject<string>('');
  termoBuscaAtual = this.termoBuscaSource.asObservable();

  atualizarBusca(termo: string) {
    this.termoBuscaSource.next(termo);
  }
}