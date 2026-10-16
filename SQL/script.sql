-- ====================================================================
-- PROJETO: BEBÊ CONFORTO (P3)
-- BANCO DE DADOS: PostgreSQL
-- ESQUEMA OFICIAL: bebeconforto
-- ====================================================================

-- 1. Criação do Esquema (caso ainda não exista)
CREATE SCHEMA IF NOT EXISTS bebeconforto;

-- Define o esquema ativo para toda a sessão
SET search_path TO bebeconforto;

-- ====================================================================
-- LIMPEZA DE TABELAS (caso queira recriar limpo)
-- ====================================================================
DROP TABLE IF EXISTS bebeconforto.pedidos CASCADE;
DROP TABLE IF EXISTS bebeconforto.produtos CASCADE;
DROP TABLE IF EXISTS bebeconforto.clientes CASCADE;
DROP TABLE IF EXISTS bebeconforto.usuarios CASCADE;

-- Limpeza preventiva de tabelas antigas no singular
DROP TABLE IF EXISTS bebeconforto.item_pedido CASCADE;
DROP TABLE IF EXISTS bebeconforto.pedido CASCADE;
DROP TABLE IF EXISTS bebeconforto.produto CASCADE;
DROP TABLE IF EXISTS bebeconforto.cliente CASCADE;

-- ====================================================================
-- ESTRUTURA DAS TABELAS OFICIAIS (PLURAL)
-- ====================================================================

-- Tabela de Clientes
CREATE TABLE bebeconforto.clientes (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(30)
);

-- Tabela de Produtos
CREATE TABLE bebeconforto.produtos (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10, 2) NOT NULL,
    categoria VARCHAR(50),
    imagem_url VARCHAR(500)
);

-- Tabela de Pedidos
CREATE TABLE bebeconforto.pedidos (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT REFERENCES bebeconforto.clientes(id) ON DELETE SET NULL,
    total NUMERIC(10, 2) NOT NULL,
    metodo_pagamento VARCHAR(50),
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Usuários (para o Spring Security / Auth)
CREATE TABLE bebeconforto.usuarios (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(150),
    role VARCHAR(50) DEFAULT 'USER'
);

-- ====================================================================
-- CARGA DE DADOS INICIAIS (50 PRODUTOS E CLIENTE DE TESTE)
-- ====================================================================

-- Cliente inicial para testes na apresentação
INSERT INTO bebeconforto.clientes (nome, email, senha, telefone) VALUES 
('Professor FATEC', 'professor@fatec.sp.gov.br', 'senha123', '(11) 98888-7777');

-- 50 Produtos com categorias e imagens reais da web
INSERT INTO bebeconforto.produtos (nome, descricao, preco, categoria, imagem_url) VALUES
('Kit Recém Nascido', 'Conjunto completo com 5 peças de algodão macio.', 120.50, 'Roupinhas', 'assets/colecao_rn.png'),
('Carrinho de Passeio Confort', 'Carrinho dobrável, leve e com cinto de 5 pontos.', 550.00, 'Passeio', 'assets/colecao_bbs.png'),
('Vestido Floral Infantil', 'Vestido 100% algodão ideal para dias amenos.', 89.90, 'Roupinhas', 'assets/colecao_meninas.png'),
('Conjunto Inverno Menino', 'Moletom peluciado super quentinho e confortável.', 110.00, 'Roupinhas', 'assets/colecao_meninos.png'),
('Mamadeira Anti-cólica', 'Mamadeira ergonómica com sistema anti-vácuo de ventilação.', 45.00, 'Alimentação', 'assets/colecao_rn.png'),
('Body Floral Rosa', 'Body confortável em algodão suedine para uso diário.', 39.90, 'Roupinhas', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Body%20Floral%20Rosa'),
('Macacão Ursinha Rosa', 'Macacão macio para recém-nascidos e bebés.', 79.90, 'Roupinhas', 'https://placehold.co/400x400/fce7f3/db2777?text=Macac%C3%A3o%20Ursinha%20Rosa'),
('Vestido Jardim Encantado', 'Vestido delicado com forro interno para eventos e passeios.', 89.90, 'Roupinhas', 'https://placehold.co/400x400/fce7f3/db2777?text=Vestido%20Jardim%20Encantado'),
('Conjunto Princesa Rosa', 'Conjunto infantil composto por blusa e calção.', 69.90, 'Roupinhas', 'https://placehold.co/400x400/fce7f3/db2777?text=Conjunto%20Princesa%20Rosa'),
('Sapatinho Infantil Rosa', 'Calçado com sola macia e antiderrapante para primeiros passos.', 54.90, 'Roupinhas', 'https://placehold.co/400x400/fce7f3/db2777?text=Sapato%20Infantil%20Rosa'),
('Body Dino Azul', 'Body manga curta estampado em malha respirável.', 39.90, 'Roupinhas', 'https://placehold.co/400x400/e0f2fe/0284c7?text=Body%20Dino%20Azul'),
('Macacão Astronauta', 'Macacão em algodão quentinho com zíper frontal.', 84.90, 'Roupinhas', 'https://placehold.co/400x400/e0f2fe/0284c7?text=Macac%C3%A3o%20Astronauta'),
('Conjunto Esportivo Azul', 'Conjunto infantil com tecido leve e respirável.', 74.90, 'Roupinhas', 'https://placehold.co/400x400/e0f2fe/0284c7?text=Conjunto%20Esportivo%20Azul'),
('Tênis Infantil Azul', 'Tênis leve e anatómico para passeios.', 59.90, 'Roupinhas', 'https://placehold.co/400x400/e0f2fe/0284c7?text=T%C3%AAnis%20Infantil%20Azul'),
('Touca Azul Estrelinhas', 'Touca delicada para aquecer recém-nascidos.', 19.90, 'Roupinhas', 'https://placehold.co/400x400/e0f2fe/0284c7?text=Touca%20Azul%20Estrelinhas'),
('Body Branco Básico', 'Body básico 100% algodão unissexo.', 29.90, 'Roupinhas', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Body%20Branco%20Basico'),
('Saída de Maternidade Rosa', 'Conjunto luxo com manta e macacão para meninas.', 149.90, 'Roupinhas', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Sa%C3%ADda%20de%20Maternidade%20Rosa'),
('Saída de Maternidade Azul', 'Conjunto elegante com manta e macacão para meninos.', 149.90, 'Roupinhas', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Sa%C3%ADda%20de%20Maternidade%20Azul'),
('Ninho Redutor de Berço', 'Acessório acolchoado para garantir o sono seguro do bebé.', 199.90, 'Passeio', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Ninho%20Redutor%20de%20Ber%C3%A7o'),
('Cueiro Estampado Algodão', 'Cueiro multifunções em flanela suave.', 34.90, 'Roupinhas', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Cueiro%20Estampado'),
('Carrinho Compacto Premium', 'Carrinho dobrável tipo mala de mão com fecho rápido.', 899.90, 'Passeio', 'https://placehold.co/400x400/fef3c7/d97706?text=Carrinho%20Compacto%20Premium'),
('Travel System Completo', 'Sistema com carrinho, bebé conforto e base para automóvel.', 1599.90, 'Passeio', 'https://placehold.co/400x400/fef3c7/d97706?text=Travel%20System%20Completo'),
('Bebê Conforto Cinza', 'Cadeirinha de transporte para automóvel de 0 a 13kg.', 549.90, 'Passeio', 'https://placehold.co/400x400/fef3c7/d97706?text=Beb%C3%AA%20Conforto%20Cinza'),
('Mochila Canguru Ergonômica', 'Carregador ergonómico de bebé ajustável e seguro.', 249.90, 'Passeio', 'https://placehold.co/400x400/fef3c7/d97706?text=Mochila%20Canguru%20Ergon%C3%B4mica'),
('Berço Portátil Viagem', 'Berço desmontável com bolsa de transporte e mosquiteiro.', 499.90, 'Passeio', 'https://placehold.co/400x400/fef3c7/d97706?text=Ber%C3%A7o%20Port%C3%A1til'),
('Mamadeira Anticólica 260ml', 'Bico de silicone macio com fluxo adaptável.', 49.90, 'Alimentação', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Mamadeira%20Antic%C3%B3lica%20260ml'),
('Mamadeira Premium 330ml', 'Capacidade maior para a fase de crescimento.', 59.90, 'Alimentação', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Mamadeira%20Premium%20330ml'),
('Prato Térmico Infantil', 'Prato com ventosa que mantém o alimento na temperatura certa.', 34.90, 'Alimentação', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Prato%20T%C3%A9rmico%20Infantil'),
('Colher Silicone Flexível', 'Ponta macia que protege as gengivas do bebé.', 14.90, 'Alimentação', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Colher%20Silicone%20Flex%C3%ADvel'),
('Cadeira de Alimentação Dobrável', 'Cadeira com bandeja removível e altura ajustável.', 429.90, 'Alimentação', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Cadeira%20de%20Alimenta%C3%A7%C3%A3o%20Dobr%C3%A1vel'),
('Kit Alimentação Rosa', 'Kit com prato, tigela, copo e talheres em silicone.', 69.90, 'Alimentação', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Kit%20Alimenta%C3%A7%C3%A3o%20Rosa'),
('Kit Alimentação Azul', 'Kit completo livre de BPA para introdução alimentar.', 69.90, 'Alimentação', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Kit%20Alimenta%C3%A7%C3%A3o%20Azul'),
('Copo de Transição 360', 'Copo antiderramamento para treino de autonomia.', 29.90, 'Alimentação', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Copo%20de%20Transi%C3%A7%C3%A3o'),
('Babador Impermeável com Cata-Migalhas', 'Babador de silicone fácil de limpar.', 19.90, 'Alimentação', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Babador%20Imperme%C3%A1vel'),
('Aquecedor Elétrico de Mamadeira', 'Aquece leite materno e fórmulas de forma homogénea.', 149.90, 'Alimentação', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Aquecedor%20de%20Mamadeira'),
('Fralda Descartável Tamanho P', 'Pacote com barreiras antifuga e rápida absorção.', 59.90, 'Higiene', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Fralda%20Tamanho%20P'),
('Fralda Descartável Tamanho M', 'Conforto e até 12h de proteção seca.', 69.90, 'Higiene', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Fralda%20Tamanho%20M'),
('Lenços Umedecidos Sensitive 96un', 'Fórmula à base de água pura, sem álcool ou perfume.', 12.90, 'Higiene', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Len%C3%A7o%20Umedecido%20Sensitive'),
('Shampoo Infantil Suave 200ml', 'Limpeza suave que não arde nos olhos.', 22.90, 'Higiene', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Shampoo%20Infantil%20Suave'),
('Sabonete Líquido da Cabeça aos Pés', 'Fórmula hipoalergénica com glicerina vegetal.', 18.90, 'Higiene', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Sabonete%20L%C3%ADquido%20Beb%C3%AA'),
('Banheira Dobrável com Termômetro', 'Banheira com suporte e indicação de temperatura.', 179.90, 'Higiene', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Banheira%20Dobr%C3%A1vel'),
('Toalha com Capuz Rosa', 'Toalha de banho com forro duplo de fralda macia.', 49.90, 'Higiene', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Toalha%20com%20Capuz%20Rosa'),
('Toalha com Capuz Azul', 'Toalha atoalhada com alta absorção para bebés.', 49.90, 'Higiene', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Toalha%20com%20Capuz%20Azul'),
('Escova e Pente Cerdas Naturais', 'Kit ideal para couro cabeludo delicado.', 15.90, 'Higiene', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Escova%20de%20Cabelo%20Infantil'),
('Kit Higiene Cuidados Pessoais', 'Tesourinha de ponta arredondada, cortador e lixa.', 89.90, 'Higiene', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Kit%20Higiene%20Completo'),
('Chupeta Ortodôntica 0-6m Rosa', 'Bico em silicone simétrico que apoia o palato.', 19.90, 'Higiene', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Chupeta%20Ortod%C3%B4ntica%20Rosa'),
('Chupeta Ortodôntica 0-6m Azul', 'Proteção com aberturas de ventilação para a pele.', 19.90, 'Higiene', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Chupeta%20Ortod%C3%B4ntica%20Azul'),
('Mordedor Girafinha Texturizado', 'Alívio seguro para o período de dentição.', 29.90, 'Passeio', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Mordedor%20Girafinha'),
('Tapete de Atividades com Arco', 'Tapete acolchoado com brinquedos suspensos e sons.', 149.90, 'Passeio', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Tapete%20de%20Atividades'),
('Móbile Musical para Berço', 'Gira suavemente com canções de ninar e luz suave.', 99.90, 'Passeio', 'https://placehold.co/400x400/f1f5ff/6b1fad?text=Mobile%20para%20Ber%C3%A7o');

-- Confirmação das transações
COMMIT;

-- 1. Consultar os produtos que o Angular puxa na Vitrine
SELECT * FROM bebeconforto.produtos;

-- 2. Consultar o cliente cadastrado em tempo real pelo Angular
SELECT * FROM bebeconforto.clientes ORDER BY id DESC LIMIT 5;

-- 3. Consultar as compras efetuadas no carrinho
SELECT * FROM bebeconforto.pedidos ORDER BY id DESC LIMIT 5;