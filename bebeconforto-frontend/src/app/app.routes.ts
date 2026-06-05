import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { ProdutoDetalhe } from './pages/produto-detalhe/produto-detalhe';
import { Carrinho } from './pages/carrinho/carrinho';
import { Busca } from './pages/busca/busca';
import { Auth } from './pages/auth/auth';
import { Perfil } from './pages/perfil/perfil'; // <-- Importamos o Perfil aqui

export const routes: Routes = [
  { path: '', component: Home }, 
  { path: 'produto/:id', component: ProdutoDetalhe },
  { path: 'carrinho', component: Carrinho }, 
  { path: 'busca', component: Busca }, 
  { path: 'login', component: Auth },
  { path: 'perfil', component: Perfil }, // <-- A rota do Perfil DEVE ficar aqui
  { path: '**', redirectTo: '' }         // <-- O curinga (**) DEVE ser sempre a última linha!
];