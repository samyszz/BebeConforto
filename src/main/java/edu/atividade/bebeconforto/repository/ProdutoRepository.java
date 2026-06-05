package edu.atividade.bebeconforto.repository;

import java.util.List;

import edu.atividade.bebeconforto.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    
    // Método para fazer a busca de produtos por parte do nome (ignorando maiúsculas/minúsculas)
    List<Produto> findByNomeContainingIgnoreCase(String nome);
}