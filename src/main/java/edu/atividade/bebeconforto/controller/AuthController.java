package edu.atividade.bebeconforto.controller;

import edu.atividade.bebeconforto.model.Usuario;
import edu.atividade.bebeconforto.repository.UsuarioRepository;
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
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService; // Injetado aqui no topo junto com os outros

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody Map<String, String> dados) {
        if (usuarioRepository.findByEmail(dados.get("email")).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "E-mail já cadastrado!"));
        }

        Usuario novoUsuario = new Usuario(
            dados.get("nome"), 
            dados.get("email"), 
            passwordEncoder.encode(dados.get("senha"))
        );
        
        usuarioRepository.save(novoUsuario);
        return ResponseEntity.ok(Map.of("message", "Conta criada com sucesso!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciais) {
        return usuarioRepository.findByEmail(credenciais.get("email"))
            .filter(u -> passwordEncoder.matches(credenciais.get("senha"), u.getSenha()))
            .map(u -> ResponseEntity.ok(Map.of("message", "Login realizado!", "nome", u.getNome())))
            .orElse(ResponseEntity.status(401).body(Map.of("message", "E-mail ou senha inválidos.")));
    }

    @PostMapping("/recuperar-senha")
    public ResponseEntity<?> recuperarSenha(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        // Verifica se o e-mail existe no banco de dados antes de enviar
        if (usuarioRepository.findByEmail(email).isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "E-mail não encontrado!"));
        }
        
        try {
            // CORREÇÃO: usamos a instância 'emailService' e não a classe 'EmailService'
            emailService.enviarEmailRecuperacao(email);
            return ResponseEntity.ok().body(Map.of("message", "E-mail de recuperação enviado!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Erro ao enviar o e-mail."));
        }
    }
}