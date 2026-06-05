package edu.atividade.bebeconforto.repository;
import edu.atividade.bebeconforto.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    // Métodos herdados padrão já são suficientes para gravar o pedido
}