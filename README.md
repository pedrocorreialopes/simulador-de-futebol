# ⚽ Simulador de Futebol

Um jogo interativo que simula partidas de futebol entre times mundialmente conhecidos, com narração ao vivo, estatísticas detalhadas e efeitos visuais.

## 🎯 Funcionalidades Implementadas

### 🔥 Simulação de Partidas
- **24 times internacionais** de ligas como Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Brasileirão e mais
- **3 modos de simulação**:
  - **Rápida** (~5 segundos) — Resultado instantâneo
  - **Normal** (~20 segundos) — Experiência balanceada
  - **Completa** (~90 segundos) — Simulação minuto a minuto
- Sistema de força dos times (rating de 74 a 93) que influencia o resultado
- Eventos realistas: gols, finalizações, faltas, cartões amarelos e vermelhos
- Distribuição de eventos por fases do jogo (mais intenso no final)

### 📊 Placar ao Vivo
- Placar dinâmico com animações de gol
- Cronômetro da partida (00:00 a 90:00)
- Indicador de 1º e 2º tempo
- Barra de posse de bola em tempo real

### 🎙️ Narração ao Vivo
- Feed de comentários em tempo real com categorias:
  - ⚽ **Gols** — Com nome do artilheiro e assistência
  - 🎯 **Defesas** — Finalizações no gol
  - 🔼 **Ataques** — Jogadas ofensivas
  - 🚨 **Faltas** — Infrações
  - 🟨 **Cartões amarelos** — Advertências
  - 🟥 **Cartões vermelhos** — Expulsões

### 📈 Estatísticas da Partida
- Chutes totais
- Chutes no gol
- Cartões amarelos
- Cartões vermelhos
- Faltas cometidas

### 🎨 Efeitos Visuais
- Campo de futebol estilizado com marcadores de gol
- Overlay de "GOOOL!" com animação de pop-up
- Chuva de confetes nas comemorações de gol
- Ícone de bola animado no cabeçalho
- Animações de pulso no placar quando sai gol

### 📋 Histórico de Partidas
- Armazenamento local (localStorage) das últimas 50 partidas
- Exibição de data, hora, times e placar
- Botão para limpar histórico

### 🏆 Ranking dos Times
- Tabela com todos os 24 times ordenados por força
- Barras de progresso visuais com tiers (S, A, B, C)
- Bandeiras dos países

### 📱 Responsividade
- Design adaptado para desktop, tablet e mobile
- Layout flexível com grid system
- Navegação por abas otimizada

## 🗂️ Estrutura de Arquivos

```
/
├── index.html          # Página principal do jogo
├── css/
│   └── style.css       # Estilos completos (tema escuro com verde)
├── js/
│   └── game.js         # Lógica completa de simulação
└── README.md           # Documentação
```

## 🚀 URLs de Acesso

- **Página principal**: `index.html`
- **Abas disponíveis**:
  - `#tab-play` — Simulação de partidas
  - `#tab-history` — Histórico de partidas
  - `#tab-standings` — Ranking dos times

## 🎮 Como Jogar

1. Na aba **Jogar**, selecione o **Time da Casa** e o **Time Visitante**
2. Escolha o modo de simulação: Rápida, Normal ou Completa
3. Clique em **Iniciar Partida**
4. Acompanhe o placar, narração e estatísticas em tempo real
5. Ao final, clique em **Nova Partida** para jogar novamente
6. Veja o histórico na aba **Histórico**

## 🏅 Times Disponíveis

| # | Time | País | Força |
|---|------|------|-------|
| 1 | Manchester City | Inglaterra | 93 |
| 2 | Real Madrid | Espanha | 92 |
| 3 | Bayern de Munique | Alemanha | 90 |
| 4 | Barcelona | Espanha | 89 |
| 5 | Liverpool | Inglaterra | 88 |
| 6 | PSG | França | 87 |
| 7 | Inter de Milão | Itália | 86 |
| 8 | Arsenal | Inglaterra | 85 |
| 9 | Juventus | Itália | 84 |
| 10 | Atlético de Madrid | Espanha | 84 |
| 11 | AC Milan | Itália | 83 |
| 12 | Borussia Dortmund | Alemanha | 82 |
| 13 | Napoli | Itália | 82 |
| 14 | Chelsea | Inglaterra | 81 |
| 15 | Manchester United | Inglaterra | 80 |
| 16 | Benfica | Portugal | 79 |
| 17 | Flamengo | Brasil | 79 |
| 18 | Ajax | Holanda | 78 |
| 19 | Boca Juniors | Argentina | 78 |
| 20 | Palmeiras | Brasil | 78 |
| 21 | Porto | Portugal | 77 |
| 22 | River Plate | Argentina | 77 |
| 23 | São Paulo | Brasil | 76 |
| 24 | Al Ahly | Egito | 74 |

## 🔧 Tecnologias Utilizadas

- **HTML5** — Estrutura semântica
- **CSS3** — Design responsivo, animações, variáveis CSS
- **JavaScript (ES6+)** — Lógica de simulação, manipulação do DOM
- **Font Awesome 6** — Ícones
- **Google Fonts** — Inter e Outfit
- **localStorage** — Persistência de histórico

## 📦 Funcionalidades Futuras (Sugestões)

- [ ] Torneios / Mata-mata com chaveamento
- [ ] Escalações personalizadas com nomes de jogadores reais
- [ ] Sons de torcida e narração em áudio
- [ ] Mais ligas e times (Brasileirão completo, Liga dos Campeões)
- [ ] Modo multiplayer local (2 jogadores)
- [ ] Estatísticas avançadas por time (aproveitamento, média de gols)
- [ ] Gráficos de desempenho com Chart.js
- [ ] Exportar histórico como PDF/CSV

---

Desenvolvido como um projeto de simulação esportiva interativa. ⚽
