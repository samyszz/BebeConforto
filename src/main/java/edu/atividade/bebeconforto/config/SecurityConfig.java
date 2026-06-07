package edu.atividade.bebeconforto.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Ativa o CORS configurado abaixo
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // 2. Desativa CSRF (necessário para APIs REST)
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // 3. A MÁGICA ESTÁ AQUI: Permite todos os pedidos OPTIONS (Preflight)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // 4. Permite acesso livre aos endpoints de autenticação e produtos
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/produtos/**").permitAll()
                // 5. Qualquer outro pedido precisa estar autenticado
                .anyRequest().permitAll() // (Mude para authenticated() depois se quiser bloquear outras rotas)
            );
            
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permite qualquer URL da Vercel (resolve o problema dos links dinâmicos)
        configuration.setAllowedOriginPatterns(List.of("https://*.vercel.app", "http://localhost:*")); 
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}