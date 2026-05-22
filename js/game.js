/* ============================================
   SIMULADOR DE FUTEBOL - Lógica do Jogo
   ============================================ */

// ─── Times Mundialmente Conhecidos ─────────────────────────
const TEAMS = [
    { id: 'real-madrid',     name: 'Real Madrid',      country: 'Espanha',       strength: 92, badge: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg' },
    { id: 'barcelona',       name: 'Barcelona',         country: 'Espanha',       strength: 89, badge: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona.svg' },
    { id: 'man-city',        name: 'Manchester City',   country: 'Inglaterra',    strength: 93, badge: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg' },
    { id: 'bayern',          name: 'Bayern de Munique', country: 'Alemanha',      strength: 90, badge: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg' },
    { id: 'psg',             name: 'PSG',               country: 'França',        strength: 87, badge: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg' },
    { id: 'liverpool',       name: 'Liverpool',         country: 'Inglaterra',    strength: 88, badge: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg' },
    { id: 'arsenal',         name: 'Arsenal',           country: 'Inglaterra',    strength: 85, badge: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg' },
    { id: 'inter',           name: 'Inter de Milão',    country: 'Itália',        strength: 86, badge: 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg' },
    { id: 'juventus',        name: 'Juventus',          country: 'Itália',        strength: 84, badge: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Juventus_FC_2017_icon.svg' },
    { id: 'milan',           name: 'AC Milan',          country: 'Itália',        strength: 83, badge: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg' },
    { id: 'dortmund',        name: 'Borussia Dortmund', country: 'Alemanha',      strength: 82, badge: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg' },
    { id: 'atletico',        name: 'Atlético de Madrid',country: 'Espanha',       strength: 84, badge: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Atletico_Madrid_Logo_2024.svg' },
    { id: 'chelsea',         name: 'Chelsea',           country: 'Inglaterra',    strength: 81, badge: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg' },
    { id: 'man-united',      name: 'Manchester United', country: 'Inglaterra',    strength: 80, badge: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg' },
    { id: 'napoli',          name: 'Napoli',            country: 'Itália',        strength: 82, badge: 'https://upload.wikimedia.org/wikipedia/commons/2/28/S.S.C._Napoli_logo.svg' },
    { id: 'ajax',            name: 'Ajax',              country: 'Holanda',       strength: 78, badge: 'https://upload.wikimedia.org/wikipedia/en/7/79/Ajax_Amsterdam.svg' },
    { id: 'benfica',         name: 'Benfica',           country: 'Portugal',      strength: 79, badge: 'https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg' },
    { id: 'porto',           name: 'Porto',             country: 'Portugal',      strength: 77, badge: 'https://upload.wikimedia.org/wikipedia/en/f/f1/FC_Porto.svg' },
    { id: 'boca',            name: 'Boca Juniors',      country: 'Argentina',     strength: 78, badge: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/CABJ70.png' },
    { id: 'river',           name: 'River Plate',       country: 'Argentina',     strength: 77, badge: 'https://upload.wikimedia.org/wikipedia/en/5/56/River_Plate_logo.svg' },
    { id: 'flamengo',        name: 'Flamengo',          country: 'Brasil',        strength: 79, badge: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_braz_logo.svg' },
    { id: 'palmeiras',       name: 'Palmeiras',         country: 'Brasil',        strength: 78, badge: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg' },
    { id: 'sao-paulo',       name: 'São Paulo',         country: 'Brasil',        strength: 76, badge: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Sao_Paulo_Futebol_Clube.png' },
    { id: 'al-ahly',         name: 'Al Ahly',           country: 'Egito',         strength: 74, badge: 'https://upload.wikimedia.org/wikipedia/en/3/3f/Al_Ahly_SC_logo.svg' },
];

// Ordena times por força para exibição
const TEAMS_SORTED = [...TEAMS].sort((a, b) => b.strength - a.strength);

// ─── Estado Global ────────────────────────────────────────
let currentMatch = null;
let simInterval = null;
let matchEvents = [];
let currentMinute = 0;
let homeScore = 0;
let awayScore = 0;
let homeShots = 0, awayShots = 0;
let homeOnTarget = 0, awayOnTarget = 0;
let homeFouls = 0, awayFouls = 0;
let homeYellows = 0, awayYellows = 0;
let homeReds = 0, awayReds = 0;
let homePossession = 50;
let commentaryCount = 0;
let isMatchRunning = false;
let matchPaused = false;

// Dados persistidos
const HISTORY_KEY = 'football_sim_history';
let matchHistory = [];

// ─── Inicialização ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    populateTeamSelects();
    setupEventListeners();
    renderStandings();
});

// ─── Carregar / Salvar Histórico ──────────────────────────
function loadHistory() {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        matchHistory = raw ? JSON.parse(raw) : [];
    } catch (e) {
        matchHistory = [];
    }
}

function saveHistory() {
    // Mantém apenas as últimas 50 partidas
    if (matchHistory.length > 50) {
        matchHistory = matchHistory.slice(-50);
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(matchHistory));
}

function addToHistory(match) {
    matchHistory.push({
        ...match,
        date: new Date().toISOString(),
    });
    saveHistory();
}

// ─── Popular Selects dos Times ────────────────────────────
function populateTeamSelects() {
    const homeSelect = document.getElementById('homeTeamSelect');
    const awaySelect = document.getElementById('awayTeamSelect');

    const sortedTeams = [...TEAMS].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

    const optionsHTML = sortedTeams.map(t =>
        `<option value="${t.id}">${t.countryFlag()} ${t.name} (${t.strength})</option>`
    ).join('');

    homeSelect.innerHTML = `<option value="">🏠 Time da Casa</option>` + optionsHTML;
    awaySelect.innerHTML = `<option value="">✈️ Time Visitante</option>` + optionsHTML;
}

// Adiciona emoji de bandeira
TEAMS.forEach(t => {
    const flags = {
        'Espanha': '🇪🇸', 'Inglaterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Alemanha': '🇩🇪', 'França': '🇫🇷',
        'Itália': '🇮🇹', 'Holanda': '🇳🇱', 'Portugal': '🇵🇹', 'Argentina': '🇦🇷',
        'Brasil': '🇧🇷', 'Egito': '🇪🇬'
    };
    t.countryFlag = () => flags[t.country] || '🌍';
});

// ─── Event Listeners ──────────────────────────────────────
function setupEventListeners() {
    // Navegação entre abas
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Seleção de times
    const homeSelect = document.getElementById('homeTeamSelect');
    const awaySelect = document.getElementById('awayTeamSelect');

    homeSelect.addEventListener('change', () => {
        updateBadge('home', homeSelect.value);
        checkStartEligibility();
    });

    awaySelect.addEventListener('change', () => {
        updateBadge('away', awaySelect.value);
        checkStartEligibility();
    });

    // Botão iniciar partida
    document.getElementById('btnStartMatch').addEventListener('click', startMatch);

    // Botão nova partida
    document.getElementById('btnNewMatch').addEventListener('click', resetToSetup);

    // Limpar histórico
    document.getElementById('btnClearHistory').addEventListener('click', clearHistory);

    // Previne mesmo time nos dois lados
    homeSelect.addEventListener('change', () => {
        if (homeSelect.value === awaySelect.value && homeSelect.value !== '') {
            awaySelect.value = '';
            updateBadge('away', '');
        }
    });

    awaySelect.addEventListener('change', () => {
        if (awaySelect.value === homeSelect.value && awaySelect.value !== '') {
            homeSelect.value = '';
            updateBadge('home', '');
        }
    });
}

function switchTab(tabId) {
    // Atualiza botões
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

    // Atualiza conteúdo
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');

    // Se for aba de histórico, atualiza
    if (tabId === 'history') renderHistory();
    if (tabId === 'standings') renderStandings();
}

// ─── Badge dos Times ──────────────────────────────────────
function updateBadge(side, teamId) {
    const badge = document.getElementById(`${side}Badge`);
    const img = document.getElementById(`${side}BadgeImg`);
    const nameSpan = document.getElementById(`${side}BadgeName`);

    if (!teamId) {
        badge.classList.remove('selected');
        img.src = '';
        img.style.display = 'none';
        nameSpan.textContent = side === 'home' ? 'Escolha o time' : 'Escolha o time';
        return;
    }

    const team = TEAMS.find(t => t.id === teamId);
    if (!team) return;

    badge.classList.add('selected');
    img.src = team.badge;
    img.style.display = 'block';
    img.alt = team.name;
    img.onerror = () => {
        img.style.display = 'none';
    };
    img.onload = () => {
        img.style.display = 'block';
    };
    nameSpan.textContent = team.name;
}

function checkStartEligibility() {
    const home = document.getElementById('homeTeamSelect').value;
    const away = document.getElementById('awayTeamSelect').value;
    document.getElementById('btnStartMatch').disabled = !(home && away);
}

// ─── Iniciar Partida ──────────────────────────────────────
function startMatch() {
    const homeId = document.getElementById('homeTeamSelect').value;
    const awayId = document.getElementById('awayTeamSelect').value;
    if (!homeId || !awayId) return;

    const homeTeam = TEAMS.find(t => t.id === homeId);
    const awayTeam = TEAMS.find(t => t.id === awayId);

    // Reseta estado
    resetMatchState();
    currentMatch = { home: homeTeam, away: awayTeam };

    // Determina tipo de simulação
    const simType = document.querySelector('input[name="simType"]:checked')?.value || 'quick';

    // Configura velocidades
    let totalTimeMs, intervalMs;
    switch (simType) {
        case 'quick': totalTimeMs = 5000;  intervalMs = 55;  break;
        case 'medium': totalTimeMs = 20000; intervalMs = 220; break;
        case 'full': totalTimeMs = 90000;  intervalMs = 1000; break;
    }

    // Troca para tela de jogo
    document.getElementById('matchSetup').classList.add('hidden');
    document.getElementById('matchLive').classList.remove('hidden');
    document.getElementById('btnNewMatch').classList.add('hidden');

    // Configura placar
    document.getElementById('scoreHomeBadge').src = homeTeam.badge;
    document.getElementById('scoreHomeBadge').alt = homeTeam.name;
    document.getElementById('scoreHomeBadge').onerror = function() { this.style.display = 'none'; };
    document.getElementById('scoreHomeBadge').onload = function() { this.style.display = 'block'; };
    document.getElementById('scoreHomeName').textContent = homeTeam.name;
    document.getElementById('scoreHomeGoals').textContent = '0';

    document.getElementById('scoreAwayBadge').src = awayTeam.badge;
    document.getElementById('scoreAwayBadge').alt = awayTeam.name;
    document.getElementById('scoreAwayBadge').onerror = function() { this.style.display = 'none'; };
    document.getElementById('scoreAwayBadge').onload = function() { this.style.display = 'block'; };
    document.getElementById('scoreAwayName').textContent = awayTeam.name;
    document.getElementById('scoreAwayGoals').textContent = '0';

    document.getElementById('scoreTime').textContent = '00:00';
    document.getElementById('scoreStatus').textContent = '1º Tempo';
    document.getElementById('scoreStatus').classList.remove('hidden');

    document.getElementById('commentaryFeed').innerHTML = '';

    // Limpa marcadores de gol
    document.getElementById('goalMarkers').innerHTML = '';

    updateAllStats();

    // Gera todos os eventos da partida
    matchEvents = generateMatchEvents(homeTeam, awayTeam);
    let eventIndex = 0;

    isMatchRunning = true;
    commentaryCount = 0;

    // Calcula quantos minutos avançar por tick
    const totalTicks = Math.floor(totalTimeMs / intervalMs);
    const minutesPerTick = 90 / totalTicks;

    addCommentary('info', `🎙️ ${homeTeam.name} e ${awayTeam.name} em campo! A partida vai começar!`);

    simInterval = setInterval(() => {
        currentMinute = Math.min(90, currentMinute + minutesPerTick);
        const displayMinute = Math.floor(currentMinute);
        const displaySecond = Math.floor((currentMinute % 1) * 60);

        // Formata tempo
        const minStr = String(displayMinute).padStart(2, '0');
        const secStr = String(displaySecond).padStart(2, '0');
        document.getElementById('scoreTime').textContent = `${minStr}:${secStr}`;

        // Atualiza metade
        if (displayMinute >= 45 && document.getElementById('scoreStatus').textContent === '1º Tempo') {
            document.getElementById('scoreStatus').textContent = '2º Tempo';
            addCommentary('info', '⏸️ Fim do primeiro tempo! Os times voltam para o vestiário.');
        }

        // Processa eventos até o minuto atual
        while (eventIndex < matchEvents.length && matchEvents[eventIndex].minute <= currentMinute) {
            processEvent(matchEvents[eventIndex]);
            eventIndex++;
        }

        // Atualiza posse com base nos eventos
        updatePossession();

        // Fim da partida
        if (currentMinute >= 90 && eventIndex >= matchEvents.length) {
            endMatch();
        }
    }, intervalMs);
}

// ─── Gerar Eventos da Partida ─────────────────────────────
function generateMatchEvents(homeTeam, awayTeam) {
    const events = [];
    const strengthDiff = homeTeam.strength - awayTeam.strength;

    // Calcula probabilidades base
    const homeGoalProb = 0.04 + (strengthDiff / 200); // 4% base + ajuste de força
    const awayGoalProb = 0.04 - (strengthDiff / 200);
    const homeShotProb = 0.12 + (strengthDiff / 150);
    const awayShotProb = 0.12 - (strengthDiff / 150);

    // Distribui eventos ao longo dos 90 minutos (mais intensos no final)
    const phases = [
        { start: 0, end: 15, mult: 0.7, desc: 'início' },
        { start: 15, end: 30, mult: 0.9, desc: 'meio 1T' },
        { start: 30, end: 45, mult: 1.1, desc: 'final 1T' },
        { start: 45, end: 60, mult: 0.8, desc: 'início 2T' },
        { start: 60, end: 75, mult: 1.0, desc: 'meio 2T' },
        { start: 75, end: 90, mult: 1.4, desc: 'final 2T' },
    ];

    for (let phase of phases) {
        const phaseLength = phase.end - phase.start;
        const numEvents = Math.floor(phaseLength * 1.8 * phase.mult);

        for (let i = 0; i < numEvents; i++) {
            const minute = phase.start + (Math.random() * phaseLength);

            // Decide tipo de evento
            const rand = Math.random();
            let event = { minute, type: '', side: '', details: {} };

            // Probabilidade de gol
            const isHomeAttack = Math.random() < (0.5 + strengthDiff / 200);

            if (rand < 0.12) {
                // Gol
                event.side = isHomeAttack ? 'home' : 'away';
                event.type = 'goal';
                const goalTypes = [
                    { desc: '⚽ Chute colocado no canto!', prob: 0.25 },
                    { desc: '⚽ Cabeçada fulminante!', prob: 0.15 },
                    { desc: '⚽ Chute de fora da área! Que golaço!', prob: 0.20 },
                    { desc: '⚽ Cobrança de pênalti convertida!', prob: 0.08 },
                    { desc: '⚽ Gol de falta! Incrível!', prob: 0.07 },
                    { desc: '⚽ Contra-ataque fulminante!', prob: 0.10 },
                    { desc: '⚽ Chute rasteiro no canto!', prob: 0.15 },
                ];
                event.details.goalType = pickWeighted(goalTypes);
                event.details.scorer = pickScorerName(event.side);
                event.details.assist = Math.random() < 0.5 ? pickScorerName(event.side) : null;
            } else if (rand < 0.40) {
                // Finalização
                event.side = isHomeAttack ? 'home' : 'away';
                event.type = 'shot';
                event.details.onTarget = Math.random() < 0.4;
            } else if (rand < 0.52) {
                // Falta
                event.side = Math.random() < 0.5 ? 'home' : 'away';
                event.type = 'foul';
            } else if (rand < 0.56) {
                // Cartão amarelo
                event.side = Math.random() < 0.5 ? 'home' : 'away';
                event.type = 'yellow';
                event.details.player = pickScorerName(event.side);
            } else if (rand < 0.57) {
                // Cartão vermelho (raro)
                event.side = Math.random() < 0.5 ? 'home' : 'away';
                event.type = 'red';
                event.details.player = pickScorerName(event.side);
            } else {
                // Jogada de ataque sem finalização
                event.side = Math.random() < 0.5 ? 'home' : 'away';
                event.type = 'attack';
            }

            events.push(event);
        }
    }

    // Ordena por minuto
    events.sort((a, b) => a.minute - b.minute);

    // Garante pelo menos 7 eventos de gol no total (distribuídos realisticamente)
    const goalEvents = events.filter(e => e.type === 'goal');
    const totalGoals = goalEvents.length;
    const minGoals = 1;
    const maxGoals = 8;

    // Ajusta: se muitos ou poucos gols, substitui eventos
    if (totalGoals < minGoals) {
        for (let g = 0; g < minGoals - totalGoals; g++) {
            const idx = Math.floor(Math.random() * events.length);
            const side = Math.random() < (0.5 + strengthDiff / 200) ? 'home' : 'away';
            const goalType = pickWeighted([
                { desc: '⚽ Chute colocado no canto!', prob: 0.35 },
                { desc: '⚽ Cabeçada fulminante!', prob: 0.25 },
                { desc: '⚽ Chute de fora da área! Que golaço!', prob: 0.20 },
                { desc: '⚽ Contra-ataque fulminante!', prob: 0.20 },
            ]);
            events[idx] = {
                minute: 10 + Math.random() * 80,
                type: 'goal',
                side,
                details: {
                    goalType,
                    scorer: pickScorerName(side),
                    assist: Math.random() < 0.5 ? pickScorerName(side) : null
                }
            };
        }
    } else if (totalGoals > maxGoals) {
        const toRemove = totalGoals - maxGoals;
        const goalIndices = events.map((e, i) => e.type === 'goal' ? i : -1).filter(i => i >= 0);
        for (let r = 0; r < toRemove; r++) {
            const randIdx = goalIndices[Math.floor(Math.random() * goalIndices.length)];
            events[randIdx].type = 'shot';
            events[randIdx].details = { onTarget: Math.random() < 0.4 };
        }
    }

    events.sort((a, b) => a.minute - b.minute);
    return events;
}

function pickWeighted(options) {
    const totalWeight = options.reduce((s, o) => s + o.prob, 0);
    let rand = Math.random() * totalWeight;
    for (const o of options) {
        rand -= o.prob;
        if (rand <= 0) return o;
    }
    return options[0];
}

function pickScorerName(side) {
    const homeNames = ['Silva', 'Santos', 'Oliveira', 'Costa', 'Pereira', 'Rodriguez', 'Martinez', 'Lopez', 'Garcia', 'Fernandez', 'Junior', 'Marcos', 'Lucas', 'Pedro', 'Gabriel'];
    const awayNames = ['Müller', 'Kane', 'Son', 'Salah', 'De Bruyne', 'Mbappé', 'Haaland', 'Vinicius', 'Bellingham', 'Lewandowski', 'Griezmann', 'Osimhen', 'Rashford', 'Saka', 'Foden'];
    const combined = [...homeNames, ...awayNames];
    return combined[Math.floor(Math.random() * combined.length)];
}

// ─── Processar Evento ─────────────────────────────────────
function processEvent(event) {
    const teamName = event.side === 'home' ? currentMatch.home.name : currentMatch.away.name;
    const minuteInt = Math.floor(event.minute);
    const timeStr = `${String(minuteInt).padStart(2, '0')}'`;

    switch (event.type) {
        case 'goal':
            if (event.side === 'home') {
                homeScore++;
                homeShots++;
                homeOnTarget++;
                document.getElementById('scoreHomeGoals').textContent = homeScore;
                document.getElementById('scoreHomeGoals').classList.remove('scored');
                void document.getElementById('scoreHomeGoals').offsetWidth;
                document.getElementById('scoreHomeGoals').classList.add('scored');
            } else {
                awayScore++;
                awayShots++;
                awayOnTarget++;
                document.getElementById('scoreAwayGoals').textContent = awayScore;
                document.getElementById('scoreAwayGoals').classList.remove('scored');
                void document.getElementById('scoreAwayGoals').offsetWidth;
                document.getElementById('scoreAwayGoals').classList.add('scored');
            }

            const assistText = event.details.assist ? ` Assistência de ${event.details.assist}.` : '';
            addCommentary('goal', `${timeStr} ${event.details.goalType.desc} GOOOOOOL do ${teamName}! ${event.details.scorer} balança as redes!${assistText}`);

            // Adiciona marcador no campo
            addGoalMarker(event.side);

            // Efeito visual de gol
            showGoalCelebration(teamName, event.details.scorer);
            break;

        case 'shot':
            if (event.side === 'home') homeShots++;
            else awayShots++;
            if (event.details.onTarget) {
                if (event.side === 'home') homeOnTarget++;
                else awayOnTarget++;
                addCommentary('attack', `${timeStr} 🎯 ${teamName}! Finalização perigosa, mas o goleiro defende!`);
            } else {
                addCommentary('attack', `${timeStr} 🔼 ${teamName} tenta o chute, mas a bola vai para fora.`);
            }
            break;

        case 'foul':
            if (event.side === 'home') homeFouls++;
            else awayFouls++;
            addCommentary('foul', `${timeStr} 🚨 Falta marcada para o ${teamName}. Jogo parado.`);
            break;

        case 'yellow':
            if (event.side === 'home') homeYellows++;
            else awayYellows++;
            addCommentary('card', `${timeStr} 🟨 Cartão amarelo! ${event.details.player} (${teamName}) é advertido.`);
            break;

        case 'red':
            if (event.side === 'home') homeReds++;
            else awayReds++;
            addCommentary('card', `${timeStr} 🟥 Cartão vermelho! ${event.details.player} (${teamName}) é expulso! O time fica com um a menos!`);
            break;

        case 'attack':
            addCommentary('attack', `${timeStr} 🔄 ${teamName} avança com perigo ao ataque. A defesa se prepara!`);
            break;
    }

    updateAllStats();
}

// ─── Marcador de Gol no Campo ─────────────────────────────
function addGoalMarker(side) {
    const markersContainer = document.getElementById('goalMarkers');
    const marker = document.createElement('div');
    marker.className = 'goal-marker';

    // Posição aleatória na metade do campo adversário (gol fica mais no campo de ataque)
    const x = 15 + Math.random() * 70; // % horizontal
    const y = side === 'home' ? 70 + Math.random() * 20 : 10 + Math.random() * 20; // % vertical

    marker.style.left = `${x}%`;
    marker.style.top = `${y}%`;

    const goalNum = side === 'home' ? homeScore : awayScore;
    marker.textContent = goalNum;
    marker.style.background = side === 'home' ? '#e53935' : '#1e88e5';

    markersContainer.appendChild(marker);
}

// ─── Efeito de Gol ────────────────────────────────────────
function showGoalCelebration(teamName, scorer) {
    const overlay = document.getElementById('goalOverlay');
    const goalText = document.getElementById('goalText');
    const goalScorer = document.getElementById('goalScorer');
    const confetti = document.getElementById('confettiContainer');

    goalText.textContent = 'GOOOOL!';
    goalScorer.textContent = `${scorer} - ${teamName}`;
    overlay.classList.remove('hidden');

    // Confetti
    spawnConfetti();

    // Esconde overlay após 3 segundos
    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 3000);
}

function spawnConfetti() {
    const container = document.getElementById('confettiContainer');
    container.classList.remove('hidden');
    container.innerHTML = '';

    const colors = ['#e53935', '#1e88e5', '#f9a825', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4', '#ff4081'];

    for (let i = 0; i < 80; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = `${2 + Math.random() * 3}s`;
        piece.style.animationDelay = `${Math.random() * 0.5}s`;
        piece.style.width = `${6 + Math.random() * 10}px`;
        piece.style.height = `${6 + Math.random() * 10}px`;
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        container.appendChild(piece);
    }

    setTimeout(() => {
        container.classList.add('hidden');
        container.innerHTML = '';
    }, 4000);
}

// ─── Atualizar Posse de Bola ──────────────────────────────
function updatePossession() {
    const totalEvents = matchEvents.filter(e => e.minute <= currentMinute).length;
    const homeEvents = matchEvents.filter(e => e.minute <= currentMinute && e.side === 'home').length;

    if (totalEvents > 0) {
        const rawPossession = (homeEvents / totalEvents) * 100;
        homePossession = Math.round(40 + (rawPossession - 40) * 0.3); // Suaviza
        homePossession = Math.max(30, Math.min(70, homePossession));
    }

    document.getElementById('possessionHomeFill').style.width = `${homePossession}%`;
    document.getElementById('possessionAwayFill').style.width = `${100 - homePossession}%`;
    document.getElementById('possessionHomeLabel').textContent = `${homePossession}%`;
    document.getElementById('possessionAwayLabel').textContent = `${100 - homePossession}%`;
}

// ─── Adicionar Comentário ─────────────────────────────────
function addCommentary(type, text) {
    const feed = document.getElementById('commentaryFeed');

    // Remove placeholder na primeira mensagem
    if (commentaryCount === 0) {
        feed.innerHTML = '';
    }

    const entry = document.createElement('div');
    entry.className = `commentary-entry ${type}`;
    entry.textContent = text;
    feed.prepend(entry);
    commentaryCount++;

    // Limita a 80 comentários visíveis
    while (feed.children.length > 80) {
        feed.removeChild(feed.lastChild);
    }
}

// ─── Atualizar Estatísticas ───────────────────────────────
function updateAllStats() {
    document.getElementById('statHomeShots').textContent = homeShots;
    document.getElementById('statAwayShots').textContent = awayShots;
    document.getElementById('statHomeOnTarget').textContent = homeOnTarget;
    document.getElementById('statAwayOnTarget').textContent = awayOnTarget;
    document.getElementById('statHomeYellows').textContent = homeYellows;
    document.getElementById('statAwayYellows').textContent = awayYellows;
    document.getElementById('statHomeReds').textContent = homeReds;
    document.getElementById('statAwayReds').textContent = awayReds;
    document.getElementById('statHomeFouls').textContent = homeFouls;
    document.getElementById('statAwayFouls').textContent = awayFouls;
}

// ─── Finalizar Partida ────────────────────────────────────
function endMatch() {
    clearInterval(simInterval);
    isMatchRunning = false;

    document.getElementById('scoreTime').textContent = '90:00';
    document.getElementById('scoreStatus').textContent = 'Fim de Jogo';
    document.getElementById('btnNewMatch').classList.remove('hidden');

    // Resultado final
    let resultText;
    if (homeScore > awayScore) {
        resultText = `🏆 ${currentMatch.home.name} vence por ${homeScore} a ${awayScore}!`;
    } else if (awayScore > homeScore) {
        resultText = `🏆 ${currentMatch.away.name} vence por ${awayScore} a ${homeScore}!`;
    } else {
        resultText = `🤝 Empate em ${homeScore} a ${awayScore}!`;
    }

    addCommentary('goal', `⏹️ ${resultText} Fim de partida!`);

    // Salva no histórico
    addToHistory({
        home: { id: currentMatch.home.id, name: currentMatch.home.name, badge: currentMatch.home.badge },
        away: { id: currentMatch.away.id, name: currentMatch.away.name, badge: currentMatch.away.badge },
        homeScore,
        awayScore,
        stats: {
            homeShots, awayShots,
            homeOnTarget, awayOnTarget,
            homeFouls, awayFouls,
            homeYellows, awayYellows,
            homeReds, awayReds,
            homePossession,
        }
    });

    // Celebração se teve vencedor
    if (homeScore !== awayScore) {
        const winner = homeScore > awayScore ? currentMatch.home : currentMatch.away;
        setTimeout(() => {
            spawnConfetti();
        }, 500);
    }
}

// ─── Resetar Estado da Partida ────────────────────────────
function resetMatchState() {
    clearInterval(simInterval);
    currentMinute = 0;
    homeScore = awayScore = 0;
    homeShots = awayShots = 0;
    homeOnTarget = awayOnTarget = 0;
    homeFouls = awayFouls = 0;
    homeYellows = awayYellows = 0;
    homeReds = awayReds = 0;
    homePossession = 50;
    commentaryCount = 0;
    matchEvents = [];
    isMatchRunning = false;

    // Reseta UI
    document.getElementById('possessionHomeFill').style.width = '50%';
    document.getElementById('possessionAwayFill').style.width = '50%';
    document.getElementById('possessionHomeLabel').textContent = '50%';
    document.getElementById('possessionAwayLabel').textContent = '50%';
    document.getElementById('goalMarkers').innerHTML = '';
    document.getElementById('goalOverlay').classList.add('hidden');
    document.getElementById('confettiContainer').classList.add('hidden');
    document.getElementById('confettiContainer').innerHTML = '';
    document.getElementById('commentaryFeed').innerHTML = '<div class="commentary-placeholder">Aguardando o apito inicial...</div>';
    updateAllStats();
}

function resetToSetup() {
    resetMatchState();
    document.getElementById('matchSetup').classList.remove('hidden');
    document.getElementById('matchLive').classList.add('hidden');
    document.getElementById('btnNewMatch').classList.add('hidden');
    document.getElementById('homeTeamSelect').value = '';
    document.getElementById('awayTeamSelect').value = '';
    updateBadge('home', '');
    updateBadge('away', '');
    document.getElementById('btnStartMatch').disabled = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── Histórico ────────────────────────────────────────────
function renderHistory() {
    const container = document.getElementById('historyList');

    if (matchHistory.length === 0) {
        container.innerHTML = `
            <div class="history-empty">
                <i class="fa-solid fa-futbol history-empty-icon"></i>
                <p>Nenhuma partida simulada ainda.</p>
                <p>Vá para a aba <strong>Jogar</strong> para começar!</p>
            </div>`;
        return;
    }

    container.innerHTML = matchHistory.slice().reverse().map((m, i) => {
        const date = new Date(m.date);
        const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
        const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        let resultClass = '';
        if (m.homeScore > m.awayScore) resultClass = 'home-win';
        else if (m.awayScore > m.homeScore) resultClass = 'away-win';
        else resultClass = 'draw';

        return `
            <div class="history-card">
                <div class="history-match-badges">
                    <img src="${m.home.badge}" alt="${m.home.name}" onerror="this.style.display='none'">
                    <span class="history-match-score">
                        <span style="color:${m.homeScore > m.awayScore ? '#e53935' : m.homeScore < m.awayScore ? '#888' : '#f9a825'}">${m.homeScore}</span>
                        -
                        <span style="color:${m.awayScore > m.homeScore ? '#1e88e5' : m.awayScore < m.homeScore ? '#888' : '#f9a825'}">${m.awayScore}</span>
                    </span>
                    <img src="${m.away.badge}" alt="${m.away.name}" onerror="this.style.display='none'">
                </div>
                <div class="history-match-teams">${m.home.name} vs ${m.away.name}</div>
                <div class="history-match-date">${dateStr} ${timeStr}</div>
            </div>`;
    }).join('');
}

function clearHistory() {
    if (confirm('Tem certeza que deseja apagar todo o histórico de partidas?')) {
        matchHistory = [];
        saveHistory();
        renderHistory();
    }
}

// ─── Ranking ──────────────────────────────────────────────
function renderStandings() {
    const tbody = document.getElementById('standingsBody');

    tbody.innerHTML = TEAMS_SORTED.map((team, i) => {
        let tierClass = '';
        if (team.strength >= 90) tierClass = 's-tier';
        else if (team.strength >= 80) tierClass = 'a-tier';
        else if (team.strength >= 75) tierClass = 'b-tier';
        else tierClass = 'c-tier';

        return `
            <tr>
                <td class="standings-rank">${i + 1}</td>
                <td>
                    <div class="standings-team-info">
                        <img src="${team.badge}" alt="${team.name}" onerror="this.style.display='none'">
                        <div>
                            <div class="standings-team-name">${team.name}</div>
                            <div class="standings-team-country">${team.countryFlag()} ${team.country}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="display:flex;align-items:center;gap:0.5rem;">
                        <div class="strength-bar-outer">
                            <div class="strength-bar-inner ${tierClass}" style="width:${team.strength}%"></div>
                        </div>
                        <strong>${team.strength}</strong>
                    </div>
                </td>
                <td>${team.countryFlag()} ${team.country}</td>
            </tr>`;
    }).join('');
}
