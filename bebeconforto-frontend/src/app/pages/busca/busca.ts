import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Api } from '../../services/api';
import { BuscaService } from '../../services/busca.service';

@Component({
  selector: 'app-busca',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './busca.html',
  styleUrls: ['./busca.css']
})
export class Busca implements OnInit {
  produtos: any[] = [];
  produtosFiltrados: any[] = [];
  termoBusca: string = '';
  ordenacaoAtual: string = 'Relevância';
  categoriasSidebar: string[] = ['Alimentação', 'Higiene', 'Passeio', 'Roupinhas'];
  categoriasSelecionadas: string[] = [];

  constructor(
    private api: Api,
    private buscaService: BuscaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // 1. Ouve o que foi clicado nas coleções ou digitado no cabeçalho
    this.buscaService.termoBuscaAtual.subscribe(termo => {
      this.termoBusca = termo || '';
      this.aplicarFiltros();
    });

    // 2. A MÁGICA: Puxa os dados REAIS do seu Banco de Dados Java
    this.api.getVitrine().subscribe({
      next: (dados) => {
        this.produtos = dados || [];
        this.aplicarFiltros(); // Aplica o filtro assim que os produtos chegam
      },
      error: (err) => console.error('Erro ao buscar produtos do banco:', err)
    });
  }

  aplicarFiltros() {
    if (!this.produtos) return;

    let filtrados = [...this.produtos];

    // Busca por Nome, Descrição e também Categoria (para as coleções funcionarem!)
    if (this.termoBusca && this.termoBusca.trim() !== '') {
      const termo = this.termoBusca.toLowerCase().trim();
      filtrados = filtrados.filter(p =>
        (p.nome && p.nome.toLowerCase().includes(termo)) ||
        (p.descricao && p.descricao.toLowerCase().includes(termo)) ||
        (p.categoria && p.categoria.toLowerCase().includes(termo)) 
      );
    }

    if (this.categoriasSelecionadas.length > 0) {
      filtrados = filtrados.filter(p => this.categoriasSelecionadas.includes(p.categoria));
    }

    // Ordenação
    if (this.ordenacaoAtual === 'Menor Preço') {
      filtrados.sort((a, b) => a.preco - b.preco);
    } else if (this.ordenacaoAtual === 'Maior Preço') {
      filtrados.sort((a, b) => b.preco - a.preco);
    }

    this.produtosFiltrados = filtrados;
    this.cdr.detectChanges(); // Força a tela a desenhar os resultados
  }

  contarPorCategoria(categoria: string): number {
    const termo = (this.termoBusca || '').toLowerCase().trim();
    return this.produtos.filter(p => {
      const matchTermo = termo === '' ||
        (p.nome && p.nome.toLowerCase().includes(termo)) ||
        (p.descricao && p.descricao.toLowerCase().includes(termo)) ||
        (p.categoria && p.categoria.toLowerCase().includes(termo));
      return p.categoria === categoria && matchTermo;
    }).length;
  }

  atualizarCheckbox(categoria: string, evento: any) {
    if (evento.target.checked) {
      this.categoriasSelecionadas.push(categoria);
    } else {
      this.categoriasSelecionadas = this.categoriasSelecionadas.filter(c => c !== categoria);
    }
    this.aplicarFiltros();
  }
}