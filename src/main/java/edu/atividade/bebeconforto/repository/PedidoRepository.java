package edu.atividade.bebeconforto.repository;

import edu.atividade.bebeconforto.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    
    // Método que permite buscar todos os pedidos feitos por um cliente específico
    List<Pedido> findByClienteId(Long clienteId);
}