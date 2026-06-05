package edu.atividade.bebeconforto.controller;

import java.util.Optional;

import edu.atividade.bebeconforto.model.Cliente;
import edu.atividade.bebeconforto.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {

    @Autowired
    private ClienteRepository repository;

    // Gravar Cliente (Cadastro)
    @PostMapping
    public ResponseEntity<Cliente> gravarCliente(@RequestBody Cliente cliente) {
        // Aqui, futuramente, você deve criptografar a senha antes de salvar
        Cliente novoCliente = repository.save(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoCliente);
    }

    // Consultar Cliente
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> consultarCliente(@PathVariable Long id) {
        Optional<Cliente> cliente = repository.findById(id);
        return cliente.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Alterar Cliente
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> alterarCliente(@PathVariable Long id, @RequestBody Cliente clienteAtualizado) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        clienteAtualizado.setId(id);
        Cliente clienteSalvo = repository.save(clienteAtualizado);
        return ResponseEntity.ok(clienteSalvo);
    }

    // Fazer Login
    @PostMapping("/login")
    public ResponseEntity<Cliente> fazerLogin(@RequestBody LoginDTO loginRequest) {
        Optional<Cliente> cliente = repository.findByEmail(loginRequest.getEmail());
        
        if (cliente.isPresent() && cliente.get().getSenha().equals(loginRequest.getSenha())) {
            return ResponseEntity.ok(cliente.get());
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Erro 401
    }

    // Redefinir Senha (Simulação simples)
    @PostMapping("/redefinir-senha")
    public ResponseEntity<String> redefinirSenha(@RequestBody RedefinirSenhaDTO request) {
        Optional<Cliente> cliente = repository.findByEmail(request.getEmail());
        if (cliente.isPresent()) {
            Cliente cli = cliente.get();
            cli.setSenha(request.getNovaSenha());
            repository.save(cli);
            return ResponseEntity.ok("Senha redefinida com sucesso!");
        }
        return ResponseEntity.notFound().build();
    }
 // Classes auxiliares (DTOs) para receber os dados JSON corretamente
 public static class LoginDTO {
     private String email;
     private String senha;
     // Getters e Setters
     public String getEmail() { return email; }
     public void setEmail(String email) { this.email = email; }
     public String getSenha() { return senha; }
     public void setSenha(String senha) { this.senha = senha; }
 }
 
 public static class RedefinirSenhaDTO {
     private String email;
     private String novaSenha;
     // Getters e Setters
     public String getEmail() { return email; }
     public void setEmail(String email) { this.email = email; }
     public String getNovaSenha() { return novaSenha; }
     public void setNovaSenha(String novaSenha) { this.novaSenha = novaSenha; }
 }
}