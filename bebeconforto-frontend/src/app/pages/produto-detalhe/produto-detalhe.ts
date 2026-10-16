import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; 
import { CommonModule, Location } from '@angular/common'; 
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth.service'; 
import { CarrinhoService } from '../../services/carrinho.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-produto-detalhe',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './produto-detalhe.html', 
  styleUrls: ['./produto-detalhe.css']   
})
export class ProdutoDetalhe implements OnInit {
  produto: any;
  quantidade: number = 1;
  isFavorito: boolean = false; 

  constructor(
    private route: ActivatedRoute, 
    private router: Router,       
    private api: Api,
    private location: Location,
    private cdr: ChangeDetectorRef,
    private authService: AuthService, 
    private carrinhoService: CarrinhoService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.produto = null; 
        this.cdr.detectChanges();
        this.api.getProduto(id).subscribe({
          next: (dados) => {
            this.produto = dados;
            this.cdr.detectChanges(); 
          },
          error: (err) => console.error('Erro ao buscar produto:', err)
        });
      }
    });
  }

  alterarQuantidade(valor: number) {
    if (this.quantidade + valor >= 1) {
      this.quantidade += valor;
    }
  }

  adicionarAoCarrinho() {
    if (this.authService.isLoggedIn()) {
      for (let i = 0; i < this.quantidade; i++) {
        this.carrinhoService.adicionar(this.produto);
      }
      this.toast.sucesso(`${this.quantidade}x ${this.produto.nome} adicionado ao carrinho!`);
    } else {
      this.toast.erro('Você precisa entrar na sua conta para adicionar itens!');
      this.router.navigate(['/login']); 
    }
  }

  voltarRotaAnterior() {
    this.location.back();
  }

  favoritar() {
    if (!this.produto) return;
    if (!this.authService.isLoggedIn()) {
      this.toast.info('Faça login para salvar seus favoritos!');
      return;
    }

    const favoritosSalvos = JSON.parse(localStorage.getItem('meusFavoritos') || '[]');
    const jaExiste = favoritosSalvos.find((f: any) => f.id === this.produto.id);

    if (!jaExiste) {
      favoritosSalvos.push(this.produto);
      localStorage.setItem('meusFavoritos', JSON.stringify(favoritosSalvos));
      this.isFavorito = true; 
      this.toast.sucesso('Produto adicionado aos favoritos! ❤️');
    } else {
      this.toast.info('Você já favoritou este produto!');
    }
  }
}