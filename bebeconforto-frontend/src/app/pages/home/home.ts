import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule, Router } from '@angular/router'; // <-- 1. Router adicionado aqui
import { Api } from '../../services/api';
import { BuscaService } from '../../services/busca.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  slides = ['slide1.png', 'slide2.png', 'slide3.png'];
  currentIndex = 0;
  
  produtos: any[] = []; 
  produtosFiltrados: any[] = []; 
  
  categoriaAtiva: string = 'Todas as categorias';
  termoBusca: string = '';
  
  ordenacaoAtual: string = 'Relevância';
  categoriasSidebar: string[] = ['Alimentação', 'Higiene', 'Passeio', 'Roupinhas'];
  categoriasSelecionadas: string[] = []; 

  constructor(
    private api: Api, 
    private buscaService: BuscaService,
    private cdr: ChangeDetectorRef,
    private router: Router // <-- 2. Injetado aqui para podermos mudar de página
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
  }

  carregarProdutos(): void {
    this.api.getVitrine().subscribe({
      next: (dados: any[]) => {
        this.produtos = dados || [];
        this.categoriaAtiva = 'Todas as categorias';
        
        // Manda filtrar e desenhar na tela IMEDIATAMENTE
        this.aplicarFiltros(); 
      },
      error: (erro: any) => console.error('Erro ao carregar produtos:', erro)
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

    // Atualiza a variável que vai para o HTML
    this.produtosFiltrados = filtrados;

    // 3. A MÁGICA: Manda o Angular desenhar a tela agora mesmo, na marra!
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
  
  // --- FUNÇÃO NOVA PARA AS COLEÇÕES ---
  irParaCategoria(categoria: string) {
    // Atualiza o termo de busca no serviço
    this.buscaService.atualizarBusca(categoria);
    // Redireciona para a página de resultados da busca
    this.router.navigate(['/busca']);
  }

  // --- SLIDER ---
  proximoSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  slideAnterior() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }
}