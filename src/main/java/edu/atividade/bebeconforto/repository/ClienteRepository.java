package edu.atividade.bebeconforto.repository;

import java.util.Optional;

import edu.atividade.bebeconforto.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    
    // Método para procurar um cliente pelo e-mail (usado no Login e na Redefinição de Senha)
    Optional<Cliente> findByEmail(String email);
}