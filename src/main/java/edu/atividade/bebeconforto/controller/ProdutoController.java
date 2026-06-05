package edu.atividade.bebeconforto.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.atividade.bebeconforto.model.Produto;
import edu.atividade.bebeconforto.repository.ProdutoRepository;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "http://localhost:4200")
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    // 1. Listar todos os produtos (GET)
    @GetMapping
    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    // 2. Criar novo produto (POST) - Agora visível no Swagger
    @PostMapping
    public List<Produto> criarProduto(@RequestBody List<Produto> produtos) {
        return produtoRepository.saveAll(produtos);
    }

    // 3. Rota para popular o banco sem SQL (POST)
    @PostMapping("/popular-banco")
    public String popularBanco() {
        Produto p1 = new Produto();
        p1.setNome("Sapatinho Azul");
        p1.setDescricao("Confortável e macio");
        p1.setPreco(45.9);
        p1.setCategoria("Roupinhas");
        p1.setImagemUrl("colecao_bbs.png");
        
        Produto p2 = new Produto();
        p2.setNome("Vestido Floral");
        p2.setDescricao("Tecido leve para verão");
        p2.setPreco(89.90);
        p2.setCategoria("Roupinhas");
        p2.setImagemUrl("colecao_meninas.png");
        
        produtoRepository.saveAll(List.of(p1, p2));
        return "Banco populado com sucesso!";
    }

    // 4. Buscar por ID (GET)
    @GetMapping("/{id}")
    public Produto buscarPorId(@PathVariable Long id) {
        return produtoRepository.findById(id).orElse(null);
    }
    @DeleteMapping
    public void deltarProduto(){
        produtoRepository.deleteAll();
    }

    @DeleteMapping("/{id}")
    public void deltarProdutoById(@PathVariable Long id){
        produtoRepository.deleteById(id);
    }
}