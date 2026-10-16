package edu.atividade.bebeconforto.repository;

import edu.atividade.bebeconforto.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Este método mágico permite buscar um usuário pelo e-mail
    // O Spring Data JPA cria o SQL automaticamente para nós!
    Optional<Usuario> findByEmail(String email);
}