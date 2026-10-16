package edu.atividade.bebeconforto.controller;

import edu.atividade.bebeconforto.model.Cliente;
import edu.atividade.bebeconforto.repository.ClienteRepository;
import edu.atividade.bebeconforto.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody Map<String, String> dados) {
        if (clienteRepository.findByEmail(dados.get("email")).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "E-mail já cadastrado!"));
        }

        Cliente novoCliente = new Cliente();
        novoCliente.setNome(dados.get("nome"));
        novoCliente.setEmail(dados.get("email"));
        novoCliente.setSenha(passwordEncoder.encode(dados.get("senha")));

        clienteRepository.save(novoCliente);
        return ResponseEntity.ok(Map.of("message", "Conta criada com sucesso!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciais) {
        return clienteRepository.findByEmail(credenciais.get("email"))
            .filter(c -> passwordEncoder.matches(credenciais.get("senha"), c.getSenha()))
            .map(c -> ResponseEntity.ok(Map.of(
                    "message", "Login realizado!", 
                    "id", c.getId(),
                    "nome", c.getNome(), 
                    "telefone", c.getTelefone() != null ? c.getTelefone() : ""
            )))
            .orElse(ResponseEntity.status(401).body(Map.of("message", "E-mail ou senha inválidos.")));
    }

    @PostMapping("/recuperar-senha")
    public ResponseEntity<?> recuperarSenha(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (clienteRepository.findByEmail(email).isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "E-mail não encontrado!"));
        }
        try {
            emailService.enviarEmailRecuperacao(email);
            return ResponseEntity.ok().body(Map.of("message", "E-mail de recuperação enviado!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Erro ao enviar o e-mail."));
        }
    }
}