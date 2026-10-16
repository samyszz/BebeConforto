package edu.atividade.bebeconforto.controller;

import edu.atividade.bebeconforto.model.Cliente;
import edu.atividade.bebeconforto.model.Pedido;
import edu.atividade.bebeconforto.repository.ClienteRepository;
import edu.atividade.bebeconforto.repository.PedidoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;

    public PedidoController(PedidoRepository pedidoRepository, ClienteRepository clienteRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
    }

    @PostMapping
    public ResponseEntity<?> gravarPedido(@RequestBody Map<String, Object> payload) {
        try {
            Long clienteId = Long.valueOf(payload.get("clienteId").toString());
            Cliente cliente = clienteRepository.findById(clienteId).orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
            
            Pedido pedido = new Pedido();
            pedido.setCliente(cliente);
            pedido.setTotal(new BigDecimal(payload.get("total").toString()));
            pedido.setMetodoPagamento(payload.get("metodoPagamento").toString());
            
            Pedido novoPedido = pedidoRepository.save(pedido);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoPedido);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("erro", e.getMessage()));
        }
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Pedido>> buscarPedidosPorCliente(@PathVariable Long clienteId) {
        List<Pedido> pedidos = pedidoRepository.findByClienteId(clienteId);
        return ResponseEntity.ok(pedidos);
    }
}