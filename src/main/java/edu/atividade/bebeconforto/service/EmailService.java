package edu.atividade.bebeconforto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarEmailRecuperacao(String email) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("samyraalves20007@gmail.com"); // Seu e-mail
            message.setTo(email);
            message.setSubject("Recuperação de Senha - Bebê Conforto");
            message.setText("Olá! Recebemos um pedido para recuperar a sua senha. " +
                            "Por favor, acesse o link abaixo para redefinir o seu acesso.\n\n" +
                            "Se não foi você quem pediu, ignore este e-mail.");

            mailSender.send(message);
            System.out.println("LOG: E-mail de recuperação enviado com sucesso para: " + email);
            
        } catch (Exception e) {
            System.err.println("LOG ERRO: Falha ao enviar e-mail para: " + email);
            System.err.println("Detalhe do erro: " + e.getMessage());
            // Lançamos uma exceção para o controller saber que falhou
            throw new RuntimeException("Erro ao enviar e-mail de recuperação", e);
        }
    }
}