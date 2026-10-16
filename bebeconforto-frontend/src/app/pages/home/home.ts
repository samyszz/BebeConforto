import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule, Router } from '@angular/router';
import { Api } from '../../services/api';
import { BuscaService } from '../../services/busca.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, OnDestroy, AfterViewInit {
  slides = ['slide1.png', 'slide2.png', 'slide3.png'];
  currentIndex = 0;
  escondendo = false; // Controla a transição suave de opacidade do carrossel
  
  produtos: any[] = []; 
  produtosFiltrados: any[] = []; 
  
  categoriaAtiva: string = 'Todas as categorias';
  termoBusca: string = '';
  
  ordenacaoAtual: string = 'Relevância';
  categoriasSidebar: string[] = ['Alimentação', 'Higiene', 'Passeio', 'Roupinhas'];
  categoriasSelecionadas: string[] = []; 

  // --- CONTROLE DO VER MAIS E CARROSSEL ---
  limiteDestaques: number = 12; 
  slideInterval: any; 

  constructor(
    private api: Api, 
    private buscaService: BuscaService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.buscaService.termoBuscaAtual.subscribe((termo: string) => {
      this.termoBusca = termo || '';
      this.categoriasSelecionadas = []; 
      
      if (this.produtos.length > 0) {
        this.aplicarFiltros();
      }
    });

    this.carregarProdutos();
    this.iniciarCarrossel(); // Inicia o giro automático do slider
  }

  // --- LÓGICA DO SCROLL REVEAL (Executada após a tela carregar) ---
  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active'); // Aplica o efeito visual de surgimento
        }
      });
    }, {
      threshold: 0.12 // Ativa quando cerca de 12% do elemento despontar na tela
    });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));
  }

  // --- DESLIGA O CARROSSEL AO SAIR DA PÁGINA ---
  ngOnDestroy() {
    this.limparIntervalo();
  }

  // --- CONTROLADORES DO CARROSSEL COM TRANSIÇÃO FLUIDA ---
  iniciarCarrossel() {
    this.slideInterval = setInterval(() => {
      this.proximoSlideAutomatico();
    }, 4000); // Troca de foto a cada 4 segundos
  }

  limparIntervalo() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  resetarTimer() {
    this.limparIntervalo();
    this.iniciarCarrossel();
  }

  // MÁGICA DA TRANSIÇÃO FLUIDA: Esconde a imagem antiga, altera o index e revela a nova
  executarTransicaoSuave(trocarIndexCallback: () => void) {
    this.escondendo = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      trocarIndexCallback();
      this.escondendo = false;
      this.cdr.detectChanges();
    }, 350); // Delay milimetrado para sincronizar com a opacidade do CSS
  }

  private proximoSlideAutomatico() {
    this.executarTransicaoSuave(() => {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    });
  }

  proximoSlide() {
    this.resetarTimer();
    this.executarTransicaoSuave(() => {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    });
  }

  slideAnterior() {
    this.resetarTimer();
    this.executarTransicaoSuave(() => {
      this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    });
  }

  // --- BOTÃO VER MAIS ---
  verMais() {
    this.limiteDestaques += 12; 
  }

 carregarProdutos(): void {
    this.api.getVitrine().subscribe({
      next: (dados: any) => {
        // Tenta pegar os dados quer venham direto no array ou dentro de um objeto 'content'
        let produtosVindosDoBanco = [];
        
        if (Array.isArray(dados)) {
          produtosVindosDoBanco = dados;
        } else if (dados && dados.content && Array.isArray(dados.content)) {
          produtosVindosDoBanco = dados.content;
        } else if (dados && dados._embedded && dados._embedded.produtos) {
          produtosVindosDoBanco = dados._embedded.produtos; // Caso o backend use Spring Data REST
        }

        console.log('Produtos carregados com sucesso:', produtosVindosDoBanco);
        
        this.produtos = produtosVindosDoBanco;
        this.categoriaAtiva = 'Todas as categorias';
        this.aplicarFiltros(); 
      },
      error: (erro: any) => {
        console.error('Erro ao carregar produtos:', erro);
        this.produtos = []; // Garante que não quebre a tela se falhar
        this.aplicarFiltros();
      }
    });
  }
  aplicarFiltros() {
    if (!this.produtos) return;

    let filtrados = [...this.produtos];

    // 1. TELA DE BUSCA
    if (this.termoBusca && this.termoBusca.trim() !== '') {
      const termo = this.termoBusca.toLowerCase().trim();
      filtrados = filtrados.filter(p => 
        (p.nome && p.nome.toLowerCase().includes(termo)) || 
        (p.descricao && p.descricao.toLowerCase().includes(termo))
      );

      if (this.categoriasSelecionadas.length > 0) {
        filtrados = filtrados.filter(p => this.categoriasSelecionadas.includes(p.categoria));
      }
    } 
    // 2. TELA INICIAL
    else {
      if (this.categoriaAtiva && this.categoriaAtiva !== 'Todas as categorias') {
        filtrados = filtrados.filter(p => p.categoria === this.categoriaAtiva);
      }
    }

    // Ordenação
    if (this.ordenacaoAtual === 'Menor Preço') {
      filtrados.sort((a, b) => a.preco - b.preco);
    } else if (this.ordenacaoAtual === 'Maior Preço') {
      filtrados.sort((a, b) => b.preco - a.preco);
    }

    this.produtosFiltrados = filtrados;
    this.cdr.detectChanges(); 
  }

  contarPorCategoria(categoria: string): number {
    const termo = (this.termoBusca || '').toLowerCase();
    return this.produtos.filter(p => 
      p.categoria === categoria &&
      ((p.nome && p.nome.toLowerCase().includes(termo)) || (p.descricao && p.descricao.toLowerCase().includes(termo)))
    ).length;
  }

  atualizarCheckbox(categoria: string, evento: any) {
    if (evento.target.checked) {
      this.categoriasSelecionadas.push(categoria);
    } else {
      this.categoriasSelecionadas = this.categoriasSelecionadas.filter(c => c !== categoria);
    }
    this.aplicarFiltros();
  }

  filtrarCategoria(categoria: string) {
    this.categoriaAtiva = categoria;
    this.aplicarFiltros(); 
  }
  
  irParaCategoria(categoria: string) {
    this.buscaService.atualizarBusca(categoria);
    this.router.navigate(['/busca']);
  }
}