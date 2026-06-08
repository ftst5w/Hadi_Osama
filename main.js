// Localization
const translations = {
    ar: {
        title: "متاهة العقل",
        subtitle: "هل يمكنك النجاة من الـ 10 غرف؟",
        start_game: "ابدأ الكابوس",
        settings: "الإعدادات",
        delete_progress: "حذف التقدم",
        language: "اللغة:",
        back: "رجوع",
        horror_map: "خريطة الرعب",
        stage: "مرحلة",
        time: "الوقت:",
        win_title: "لقد نجوت من متاهة العقل",
        win_secret: "لقد نجوت من متاهة العقل (النهاية السرية!)",
        win_msg: "لقد هربت من متاهة العقل بذهن سليم... أسطورة!",
        win_scars: "لقد نجوت من المتاهة... لكنها تركت ندوباً في عقلك. (الأخطاء: {count})",
        game_over: "انتهت اللعبة",
        continue: "متابعة",
        xo_title: "اربح أو تعادل ضد الظل",
        maze_title: "اخرج من المتاهة المظلمة",
        simon_title: "تذكر الألوان",
        darkroom_title: "ابحث عن المفتاح في الظلام",
        seq_title: "اضغط الأرقام بالترتيب",
        escape_title: "اضغط للهروب بسرعة!",
        memory_title: "طابق البطاقات",
        traps_title: "تجنب الفخاخ الحمراء",
        keypad_title: "أدخل الرمز السري المخبأ في الظلال (666)",
        final_title: "الهروب النهائي! ابقَ على قيد الحياة!",
        run_btn: "ارركض!",
        win_final: "لقد هربت من المتاهة... هل تظن أنك بأمان الآن؟",
        play_again: "إلعب مجدداً",
        main_menu: "القائمة الرئيسية"
    },
    en: {
        title: "Mind Maze",
        subtitle: "Can you survive the 10 rooms?",
        start_game: "Start Nightmare",
        settings: "Settings",
        delete_progress: "Reset Progress",
        language: "Language:",
        back: "Back",
        horror_map: "Horror Map",
        stage: "Level",
        time: "Time:",
        win_title: "You survived Mind Maze",
        win_secret: "You survived Mind Maze (Secret Ending!)",
        win_msg: "You escaped the Mind Maze with your mind intact... Legend!",
        win_scars: "You survived the Maze... but it left scars. (Mistakes: {count})",
        game_over: "Game Over",
        continue: "Continue",
        xo_title: "Win or Draw against the Shadow",
        maze_title: "Escape the dark maze",
        simon_title: "Remember the colors",
        darkroom_title: "Find the key in the dark",
        seq_title: "Press numbers in order",
        escape_title: "Tap to escape quickly!",
        memory_title: "Match the cards",
        traps_title: "Avoid red traps",
        keypad_title: "Enter the secret code hidden in shadows (666)",
        final_title: "Final Escape! Stay Alive!",
        run_btn: "RUN!",
        win_final: "You escaped the Mind Maze... Do you think you're safe now?",
        play_again: "Play Again",
        main_menu: "Main Menu"
    }
};

let currentLang = localStorage.getItem('mindMazeLang') || 'ar';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('mindMazeLang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    updateUI();
}

function updateUI() {
    const t = translations[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.innerText = t[key];
    });
    
    // Update glitch text
    const glitch = document.querySelector('.glitch');
    glitch.innerText = t.title;
    glitch.setAttribute('data-text', t.title);
    
    // Update subtitle
    document.querySelector('.subtitle').innerText = t.subtitle;
    
    // Update map header
    document.querySelector('.map-header h2').innerText = t.horror_map;
    document.getElementById('btn-settings-back').innerText = t.back;
    document.getElementById('btn-question-back').innerText = t.back;
    document.getElementById('btn-victory-reset').innerText = t.play_again;
    document.getElementById('btn-victory-menu').innerText = t.main_menu;
}

// Game State
let gameState = {
    currentLevel: 1,
    maxLevelUnlocked: 1,
    stars: [0,0,0,0,0,0,0,0,0,0],
    errorsCount: 0
};

// Load Progress
const savedState = localStorage.getItem('mindMazeSave');
if (savedState) {
    try {
        gameState = JSON.parse(savedState);
    } catch(e) {}
}

const saveProgress = () => {
    localStorage.setItem('mindMazeSave', JSON.stringify(gameState));
};

// Questions Definition
const levelQuestions = {
    ar: [
        { text: "ما ناتج ضرب 7 في 8؟", options: ["48", "54", "56", "62"], ans: 2, time: 15 },
        { text: "ما هو الشيء الذي يمشي بلا أرجل ويبكي بلا عيون؟", options: ["السحابة", "النهر", "الشبح", "الريح"], ans: 0, time: 15 },
        { text: "ما هو اللون الذي يرمز للخطر؟", options: ["الأزرق", "الأخضر", "الأحمر", "الأسود"], ans: 2, time: 10 },
        { text: "أنا لا أمتلك صوتاً ولكنني أجعلك تصرخ. لا أملك جسداً ولكنني أجعلك ترتجف. من أنا؟", options: ["الشبح", "الخوف", "الظلام", "البرد"], ans: 1, time: 15 },
        { text: "أوجد الرقم المفقود: 2, 6, 12, 20, ؟", options: ["24", "30", "36", "40"], ans: 1, time: 20 },
        { text: "ما هو أسرع حيوان بري؟", options: ["الأسد", "الفهد", "الغزال", "الذئب"], ans: 1, time: 10 },
        { text: "إذا كان غداً هو الأمس، فاليوم هو الجمعة. ما هو اليوم؟", options: ["الأحد", "الأربعاء", "الخميس", "السبت"], ans: 1, time: 20 },
        { text: "أنا دائماً جائع، يجب أن أُطعم دائماً. إذا لمستني، سأعضك. من أنا؟", options: ["الوحش", "النار", "الظلام", "السر"], ans: 1, time: 15 },
        { text: "في أي عام تم إصدار أول فيلم رعب؟", options: ["1896", "1910", "1922", "1931"], ans: 0, time: 10 },
        { text: "سؤال أخير... هل أنت مستعد للهروب؟", options: ["نعم", "لا", "ربما", "لن أهرب أبداً"], ans: 0, time: 5 },
        { text: "من يصنعه يبيعه، ومن يشتريه لا يستخدمه، ومن يستخدمه لا يراه.. ما هو؟", options: ["المرآة", "الكفن", "السر", "الحلم"], ans: 1, time: 20 }
    ],
    en: [
        { text: "What is 7 times 8?", options: ["48", "54", "56", "62"], ans: 2, time: 15 },
        { text: "What walks with no legs and cries with no eyes?", options: ["Cloud", "River", "Ghost", "Wind"], ans: 0, time: 15 },
        { text: "Which color represents danger?", options: ["Blue", "Green", "Red", "Black"], ans: 2, time: 10 },
        { text: "I have no voice but make you scream. No body but make you shake. Who am I?", options: ["Ghost", "Fear", "Darkness", "Cold"], ans: 1, time: 15 },
        { text: "Find the missing number: 2, 6, 12, 20, ?", options: ["24", "30", "36", "40"], ans: 1, time: 20 },
        { text: "What is the fastest land animal?", options: ["Lion", "Cheetah", "Gazelle", "Wolf"], ans: 1, time: 10 },
        { text: "If tomorrow is yesterday, then today is Friday. What day is it?", options: ["Sunday", "Wednesday", "Thursday", "Saturday"], ans: 1, time: 20 },
        { text: "I am always hungry, I must always be fed. If you touch me, I will bite you. Who am I?", options: ["Monster", "Fire", "Darkness", "Secret"], ans: 1, time: 15 },
        { text: "What year was the first horror movie released?", options: ["1896", "1910", "1922", "1931"], ans: 0, time: 10 },
        { text: "One last question... Are you ready to escape?", options: ["Yes", "No", "Maybe", "Never"], ans: 0, time: 5 },
        { text: "The person who makes it, sells it. The person who buys it, never uses it. The person who uses it, never knows they are using it. What is it?", options: ["Mirror", "Coffin", "Secret", "Dream"], ans: 1, time: 20 }
    ]
};

// Audio Engine
class AudioEngine {
    constructor() { this.ctx = null; this.started = false; }
    init() { if(this.started) return; try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); this.started = true; } catch(e){} }
    playScream() {
        if(!this.ctx) return;
        const now = this.ctx.currentTime;

        // --- HIGH-PITCHED GIRL SCREAM ---
        const screamOsc = this.ctx.createOscillator();
        const screamGain = this.ctx.createGain();
        
        screamOsc.type = 'sawtooth';
        // Start high and ramp even higher then drop
        screamOsc.frequency.setValueAtTime(1000, now);
        screamOsc.frequency.exponentialRampToValueAtTime(3500, now + 0.1);
        screamOsc.frequency.exponentialRampToValueAtTime(800, now + 1.2);
        
        // Vibrato for more "terror"
        const vibrato = this.ctx.createOscillator();
        const vibratoGain = this.ctx.createGain();
        vibrato.frequency.setValueAtTime(15, now);
        vibratoGain.gain.setValueAtTime(50, now);
        vibrato.connect(vibratoGain);
        vibratoGain.connect(screamOsc.frequency);
        vibrato.start();
        vibrato.stop(now + 1.2);

        screamGain.gain.setValueAtTime(0, now);
        screamGain.gain.linearRampToValueAtTime(0.7, now + 0.05);
        screamGain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

        screamOsc.connect(screamGain);
        screamGain.connect(this.ctx.destination);
        
        screamOsc.start();
        screamOsc.stop(now + 1.2);
    }
    playLoseSound() {
        if(!this.ctx) return;
        const now = this.ctx.currentTime;
        [0, 0.4, 0.8, 1.2].forEach((delay, i) => {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'sawtooth';
            // Classic wah-wah-wah (descending notes)
            const freqs = [330, 294, 262, 220]; 
            osc.frequency.setValueAtTime(freqs[i], now + delay);
            osc.frequency.exponentialRampToValueAtTime(freqs[i] * 0.8, now + delay + 0.3);
            
            g.gain.setValueAtTime(0, now + delay);
            g.gain.linearRampToValueAtTime(0.2, now + delay + 0.05);
            g.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.3);
            
            osc.connect(g);
            g.connect(this.ctx.destination);
            osc.start(now + delay);
            osc.stop(now + delay + 0.3);
        });
    }
}
const audio = new AudioEngine();

// UI Elements
const els = {
    menu: document.getElementById('screen-menu'),
    map: document.getElementById('screen-map'),
    question: document.getElementById('screen-question'),
    minigame: document.getElementById('screen-minigame'),
    result: document.getElementById('screen-result'),
    settings: document.getElementById('screen-settings'),
    path: document.getElementById('map-path'),
    totalStars: document.getElementById('total-stars'),
    qLevel: document.getElementById('q-level'),
    qTimer: document.getElementById('q-timer'),
    qText: document.getElementById('q-text'),
    qOptions: document.getElementById('q-options'),
    mgTitle: document.getElementById('mg-title'),
    mgTimer: document.getElementById('mg-timer'),
    mgDom: document.getElementById('mg-dom'),
    mgCanvas: document.getElementById('mg-canvas'),
    jumpscare: document.getElementById('jumpscare'),
    jumpscareImg: document.getElementById('jumpscare-img'),
    errCounter: document.getElementById('error-counter'),
    victory: document.getElementById('screen-victory'),
    victoryMsg: document.getElementById('victory-msg')
};

function showScreen(screenEl) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screenEl.classList.add('active');
}

// Map Rendering
function renderMap() {
    els.path.innerHTML = '';
    let totalStars = 0;
    // Generate nodes in normal order: 1, 2, ..., 10
    // With flex-direction: column-reverse, Level 1 will be at the bottom.
    for(let i = 1; i <= 11; i++) {
        const node = document.createElement('div');
        node.className = `level-node ${i <= gameState.maxLevelUnlocked ? 'unlocked' : 'locked'}`;
        node.innerText = i === 11 ? '💀' : i;
        if(i <= gameState.maxLevelUnlocked) {
            node.onclick = () => startLevel(i);
            const stars = gameState.stars[i-1] || 0;
            totalStars += stars;
            const starDiv = document.createElement('div');
            starDiv.className = 'node-stars';
            starDiv.innerText = '★'.repeat(stars);
            node.appendChild(starDiv);
        }
        els.path.appendChild(node);
    }
    els.totalStars.innerText = totalStars;
}

document.getElementById('btn-play').onclick = () => { 
    audio.init(); 
    renderMap(); 
    showScreen(els.map); 
    // Scroll to bottom so Level 1 is visible immediately
    const mapContainer = document.getElementById('map-container');
    setTimeout(() => {
        if(mapContainer) mapContainer.scrollTop = mapContainer.scrollHeight;
    }, 50);
};

document.getElementById('btn-settings').onclick = () => showScreen(els.settings);
document.getElementById('btn-settings-back').onclick = () => showScreen(els.menu);
document.getElementById('btn-map-back').onclick = () => showScreen(els.menu);
document.getElementById('btn-question-back').onclick = () => {
    clearInterval(qTimerInt);
    showScreen(els.map);
    renderMap();
};

document.getElementById('btn-victory-reset').onclick = () => {
    localStorage.removeItem('mindMazeSave');
    location.reload();
};

document.getElementById('btn-victory-menu').onclick = () => {
    location.reload();
};



document.getElementById('btn-reset').onclick = () => {
    localStorage.removeItem('mindMazeSave');
    location.reload();
};

// Main Game Loop Variables
let currentPlayLevel = 1;
let qTimerInt;
let mgTimerInt;
let mgCurrentGame = null;
let currentStars = 3;

function triggerJumpscare(onComplete) {
    const scareImages = ['assets/scare.png', 'assets/scare1.png', 'assets/scare2.png', 'assets/scare3.png'];
    const randomScare = scareImages[Math.floor(Math.random() * scareImages.length)];
    if(els.jumpscareImg) els.jumpscareImg.src = randomScare;

    els.jumpscare.style.display = 'flex';
    audio.playScream();
    audio.playLoseSound();
    gameState.errorsCount++;
    setTimeout(() => {
        els.jumpscare.style.display = 'none';
        if(onComplete) onComplete();
    }, 1000);
}

function startLevel(lvl) {
    currentPlayLevel = lvl;
    currentStars = 3;
    showQuestionPhase();
}

function showQuestionPhase() {
    clearInterval(qTimerInt);
    clearInterval(mgTimerInt);
    showScreen(els.question);
    
    const q = levelQuestions[currentLang][currentPlayLevel - 1];
    els.qLevel.innerText = `${translations[currentLang].stage} ${currentPlayLevel}`;
    els.qText.innerText = q.text;
    els.qOptions.innerHTML = '';
    
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => {
            clearInterval(qTimerInt);
            if(i === q.ans) {
                startMinigamePhase();
            } else {
                currentStars = Math.max(0, currentStars - 1);
                triggerJumpscare(() => {
                    // Penalty: restart level or go back
                    startLevel(Math.max(1, currentPlayLevel - 1));
                });
            }
        };
        els.qOptions.appendChild(btn);
    });

    let t = q.time;
    els.qTimer.innerText = `${translations[currentLang].time} ${t}`;
    els.qTimer.className = 'timer';
    
    qTimerInt = setInterval(() => {
        t--;
        els.qTimer.innerText = `${translations[currentLang].time} ${t}`;
        if(t <= 5) els.qTimer.className = 'timer danger';
        if(t <= 0) {
            clearInterval(qTimerInt);
            currentStars = Math.max(0, currentStars - 1);
            triggerJumpscare(() => startLevel(Math.max(1, currentPlayLevel - 1)));
        }
    }, 1000);
}

// ---------------------------------------------------------
// MINIGAMES
// ---------------------------------------------------------

function startMinigamePhase() {
    showScreen(els.minigame);
    els.mgDom.innerHTML = '';
    els.mgDom.style.display = 'flex';
    els.mgCanvas.style.display = 'none';
    clearInterval(mgTimerInt);
    
    // Default success/fail handlers
    const onSuccess = () => {
        clearInterval(mgTimerInt);
        completeLevel();
    };
    const onFail = () => {
        clearInterval(mgTimerInt);
        currentStars = Math.max(0, currentStars - 1);
        triggerJumpscare(() => startLevel(currentPlayLevel));
    };

    els.mgTitle.innerText = `لعبة المرحلة ${currentPlayLevel}`;

    switch(currentPlayLevel) {
        case 1: playXO(onSuccess, onFail); break;
        case 2: playMaze(onSuccess, onFail); break;
        case 3: playSimon(onSuccess, onFail); break;
        case 4: playDarkRoom(onSuccess, onFail); break;
        case 5: playSequence(onSuccess, onFail); break;
        case 6: playEscape(onSuccess, onFail); break;
        case 7: playMemory(onSuccess, onFail); break;
        case 8: playTraps(onSuccess, onFail); break;
        case 9: playKeypad(onSuccess, onFail); break;
        case 10: playFinalChase(onSuccess, onFail); break;
        case 11: playMasterRiddle(onSuccess, onFail); break;
    }
}

function playMasterRiddle(success, fail) {
    els.mgTitle.innerText = currentLang === 'ar' ? "اللغز النهائي" : "The Ultimate Riddle";
    const container = document.createElement('div');
    container.style.textAlign = 'center';
    container.style.padding = '20px';
    
    const msg = document.createElement('p');
    msg.innerText = currentLang === 'ar' ? "لقد وصلت إلى نهاية المتاهة... ولكن الباب مغلق بكلمة سر." : "You have reached the end... but the door is locked with a password.";
    msg.style.fontSize = '1.5rem';
    msg.style.marginBottom = '20px';
    
    const hint = document.createElement('p');
    hint.innerText = currentLang === 'ar' ? "تذكر إجابة اللغز السابق جيداً..." : "Remember the answer to the previous riddle...";
    hint.style.color = 'red';
    hint.style.fontStyle = 'italic';
    
    const btn = document.createElement('button');
    btn.className = 'btn primary';
    btn.innerText = currentLang === 'ar' ? "الخروج من المتاهة" : "Exit Maze";
    btn.onclick = success;
    
    container.appendChild(msg);
    container.appendChild(hint);
    container.appendChild(btn);
    els.mgDom.appendChild(container);
    startMgTimer(10, fail);
}

function startMgTimer(time, onFail) {
    let t = time;
    els.mgTimer.innerText = `${translations[currentLang].time} ${t}`;
    els.mgTimer.className = 'timer';
    mgTimerInt = setInterval(() => {
        t--;
        els.mgTimer.innerText = `${translations[currentLang].time} ${t}`;
        if(t <= 5) els.mgTimer.className = 'timer danger';
        if(t <= 0) { clearInterval(mgTimerInt); onFail(); }
    }, 1000);
}

// MG1: XO vs CPU (Win or Draw to pass)
function playXO(success, fail, difficulty = 'medium') {
    els.mgTitle.innerText = translations[currentLang].xo_title + ` (${difficulty})`;
    const grid = document.createElement('div');
    grid.className = 'mg-xo-grid';
    let board = Array(9).fill(null);
    let active = true;

    const checkWin = (b, p) => [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]].some(l => l.every(i => b[i] === p));
    
    const cpuMove = () => {
        let avail = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
        if(avail.length === 0) return success();
        
        let move;
        if(difficulty === 'legend') {
             // Basic AI for legend
             move = avail.find(m => {
                 let b = [...board]; b[m] = 'O'; return checkWin(b, 'O');
             }) || avail.find(m => {
                 let b = [...board]; b[m] = 'X'; return checkWin(b, 'X');
             }) || avail[Math.floor(Math.random() * avail.length)];
        } else if(difficulty === 'medium') {
             move = avail.find(m => {
                 let b = [...board]; b[m] = 'O'; return checkWin(b, 'O');
             }) || avail[Math.floor(Math.random() * avail.length)];
        } else {
             move = avail[Math.floor(Math.random() * avail.length)];
        }

        board[move] = 'O';
        grid.children[move].innerText = 'O';
        grid.children[move].style.color = '#ff0';
        if(checkWin(board, 'O')) { active = false; setTimeout(fail, 500); }
    };

    for(let i=0; i<9; i++) {
        const cell = document.createElement('div');
        cell.className = 'mg-xo-cell';
        cell.onclick = () => {
            if(!active || board[i]) return;
            board[i] = 'X'; cell.innerText = 'X'; cell.style.color = '#f00';
            if(checkWin(board, 'X')) { active = false; setTimeout(success, 500); }
            else if(!board.includes(null)) { active = false; setTimeout(success, 500); }
            else cpuMove();
        };
        grid.appendChild(cell);
    }
    els.mgDom.appendChild(grid);
    startMgTimer(30, fail);
}

// MG2: Canvas Maze
function playMaze(success, fail) {
    els.mgTitle.innerText = translations[currentLang].maze_title;
    els.mgDom.style.display = 'none';
    els.mgCanvas.style.display = 'block';
    const ctx = els.mgCanvas.getContext('2d');
    let px = 50, py = 50;
    const draw = () => {
        ctx.fillStyle = 'black'; ctx.fillRect(0,0,800,600);
        ctx.fillStyle = '#222'; ctx.fillRect(400, 500, 100, 100); // Exit
        
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 150);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.globalCompositeOperation = 'destination-in';
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(px, py, 150, 0, Math.PI*2); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        
        ctx.fillStyle = 'red'; ctx.fillRect(px-10, py-10, 20, 20); // Player
        
        if(px > 400 && px < 500 && py > 500) success();
    };
    
    const move = (e) => {
        const speed = 15;
        const key = e.key.toLowerCase();
        if(key==='arrowup' || key==='w') py-=speed; 
        if(key==='arrowdown' || key==='s') py+=speed;
        if(key==='arrowleft' || key==='a') px-=speed; 
        if(key==='arrowright' || key==='d') px+=speed;
        draw();
    };
    window.addEventListener('keydown', move);
    draw();
    startMgTimer(20, () => { 
        window.removeEventListener('keydown', move); 
        fail(); 
    });
}

// MG3: Simon Says
function playSimon(success, fail) {
    els.mgTitle.innerText = translations[currentLang].simon_title;
    const grid = document.createElement('div'); grid.className = 'mg-simon-grid';
    const colors = ['#f00', '#0f0', '#00f', '#ff0'];
    const btns = [];
    let seq = [], playerSeq = [];
    
    for(let i=0; i<4; i++) {
        const b = document.createElement('div');
        b.className = 'mg-simon-btn'; b.style.backgroundColor = colors[i];
        b.onclick = () => {
            b.classList.add('active'); setTimeout(() => b.classList.remove('active'), 200);
            playerSeq.push(i);
            if(playerSeq[playerSeq.length-1] !== seq[playerSeq.length-1]) fail();
            else if(playerSeq.length === seq.length) {
                if(seq.length === 4) setTimeout(success, 500);
                else setTimeout(nextRound, 1000);
            }
        };
        btns.push(b); grid.appendChild(b);
    }
    els.mgDom.appendChild(grid);
    
    const nextRound = () => {
        playerSeq = []; seq.push(Math.floor(Math.random()*4));
        let i = 0;
        const int = setInterval(() => {
            const b = btns[seq[i]];
            b.classList.add('active');
            setTimeout(() => b.classList.remove('active'), 400);
            i++; if(i >= seq.length) clearInterval(int);
        }, 800);
    };
    setTimeout(nextRound, 1000);
    startMgTimer(30, fail);
}

// MG4: Dark Room Key (Hover to reveal)
function playDarkRoom(success, fail) {
    els.mgTitle.innerText = translations[currentLang].darkroom_title;
    els.mgDom.style.width = '100%'; els.mgDom.style.height = '100%';
    els.mgDom.style.background = 'black';
    els.mgDom.style.cursor = 'none';
    
    const key = document.createElement('div');
    key.style.position = 'absolute';
    key.style.width = '40px'; key.style.height = '40px';
    key.style.background = 'gold'; key.style.borderRadius = '50%';
    key.style.left = Math.random() * 80 + 10 + '%';
    key.style.top = Math.random() * 80 + 10 + '%';
    key.onclick = success;
    
    const mask = document.createElement('div');
    mask.style.position = 'absolute';
    mask.style.top = '0'; mask.style.left = '0';
    mask.style.width = '100%'; mask.style.height = '100%';
    mask.style.pointerEvents = 'none';
    mask.style.background = 'radial-gradient(circle 100px at 50% 50%, transparent 0%, black 100%)';
    
    els.mgDom.appendChild(key); els.mgDom.appendChild(mask);
    
    els.mgDom.onmousemove = (e) => {
        const r = els.mgDom.getBoundingClientRect();
        const x = e.clientX - r.left; const y = e.clientY - r.top;
        mask.style.background = `radial-gradient(circle 100px at ${x}px ${y}px, transparent 0%, black 100%)`;
    };
    startMgTimer(15, fail);
}

// MG5: Sequence 1 to 10
function playSequence(success, fail) {
    els.mgTitle.innerText = translations[currentLang].seq_title;
    const grid = document.createElement('div'); grid.className = 'mg-seq-grid';
    let nums = [1,2,3,4,5,6,7,8,9,10].sort(() => Math.random() - 0.5);
    let expected = 1;
    
    nums.forEach(n => {
        const b = document.createElement('div'); b.className = 'mg-seq-btn'; b.innerText = n;
        b.onclick = () => {
            if(n === expected) { b.style.background = 'green'; expected++; if(expected > 10) success(); }
            else fail();
        };
        grid.appendChild(b);
    });
    els.mgDom.appendChild(grid);
    startMgTimer(15, fail);
}

// MG6: Tap to escape
function playEscape(success, fail) {
    els.mgTitle.innerText = translations[currentLang].escape_title;
    const btn = document.createElement('button');
    btn.className = 'btn primary'; btn.innerText = translations[currentLang].run_btn;
    btn.style.fontSize = '3rem'; btn.style.padding = '40px 80px';
    let clicks = 0;
    btn.onclick = () => { clicks++; if(clicks >= 30) success(); };
    els.mgDom.appendChild(btn);
    startMgTimer(10, fail);
}

// MG7: Card Memory
function playMemory(success, fail) {
    els.mgTitle.innerText = translations[currentLang].memory_title;
    const grid = document.createElement('div'); grid.className = 'mg-cards-grid';
    const icons = ['☠️','👽','👁️','🩸','🕸️','🦇','☠️','👽','👁️','🩸','🕸️','🦇'].sort(() => Math.random() - 0.5);
    let flipped = [], matched = 0;
    
    icons.forEach(icon => {
        const c = document.createElement('div'); c.className = 'mg-card'; c.innerText = '?';
        c.onclick = () => {
            if(c.classList.contains('flipped') || flipped.length >= 2) return;
            c.classList.add('flipped'); c.innerText = icon;
            flipped.push({c, icon});
            if(flipped.length === 2) {
                if(flipped[0].icon === flipped[1].icon) {
                    matched += 2; flipped = [];
                    if(matched === 12) setTimeout(success, 500);
                } else {
                    setTimeout(() => {
                        flipped[0].c.classList.remove('flipped'); flipped[0].c.innerText = '?';
                        flipped[1].c.classList.remove('flipped'); flipped[1].c.innerText = '?';
                        flipped = [];
                    }, 500);
                }
            }
        };
        grid.appendChild(c);
    });
    els.mgDom.appendChild(grid);
    startMgTimer(40, fail);
}

// MG8: Dodging (Canvas)
function playTraps(success, fail) {
    els.mgTitle.innerText = translations[currentLang].traps_title;
    els.mgDom.style.display = 'none'; els.mgCanvas.style.display = 'block';
    const ctx = els.mgCanvas.getContext('2d');
    let px = 400, py = 500;
    let traps = [];
    for(let i=0; i<15; i++) traps.push({x: Math.random()*800, y: Math.random()*-800, s: Math.random()*5+3});
    
    let active = true;
    const move = (e) => {
        const speed = 20;
        const key = e.key.toLowerCase();
        if(key==='arrowleft' || key==='a') px = Math.max(0, px-speed);
        if(key==='arrowright' || key==='d') px = Math.min(800, px+speed);
    };
    window.addEventListener('keydown', move);
    
    const loop = () => {
        if(!active) return;
        ctx.fillStyle = '#111'; ctx.fillRect(0,0,800,600);
        ctx.fillStyle = 'green'; ctx.fillRect(px-15, py-15, 30, 30);
        
        ctx.fillStyle = 'red';
        traps.forEach(t => {
            ctx.fillRect(t.x, t.y, 20, 20);
            t.y += t.s;
            if(t.y > 600) { t.y = -50; t.x = Math.random()*800; }
            if(Math.abs(t.x - px) < 25 && Math.abs(t.y - py) < 25) { active = false; window.removeEventListener('keydown', move); fail(); }
        });
        requestAnimationFrame(loop);
    };
    loop();
    startMgTimer(15, () => { 
        active = false; 
        window.removeEventListener('keydown', move); 
        success(); 
    });
}

// MG9: Keypad Code
function playKeypad(success, fail) {
    els.mgTitle.innerText = translations[currentLang].keypad_title;
    const display = document.createElement('div'); display.className = 'mg-keypad-display';
    const grid = document.createElement('div'); grid.className = 'mg-keypad';
    let code = '';
    
    for(let i=1; i<=9; i++) {
        const k = document.createElement('div'); k.className = 'mg-key'; k.innerText = i;
        k.onclick = () => {
            code += i; display.innerText = code;
            if(code.length === 3) {
                if(code === '666') setTimeout(success, 500);
                else fail();
            }
        };
        grid.appendChild(k);
    }
    els.mgDom.appendChild(display); els.mgDom.appendChild(grid);
    startMgTimer(15, fail);
}

// MG10: Final Chase (Canvas Runner)
function playFinalChase(success, fail) {
    els.mgTitle.innerText = translations[currentLang].final_title;
    els.mgDom.style.display = 'none'; els.mgCanvas.style.display = 'block';
    const ctx = els.mgCanvas.getContext('2d');
    let px = 100, py = 300, vy = 0, grav = 0.8, isJumping = false;
    let obs = [];
    let frame = 0, active = true;
    
    const jump = (e) => { 
        const key = e.code ? e.code.toLowerCase() : '';
        if((e.type === 'mousedown' || key === 'space' || key === 'keyw' || key === 'arrowup') && !isJumping) { 
            vy = -15; isJumping = true; 
        } 
    };
    window.addEventListener('keydown', jump);
    window.addEventListener('mousedown', jump);
    
    const loop = () => {
        if(!active) return;
        ctx.fillStyle = '#1a0000'; ctx.fillRect(0,0,800,600);
        
        // Player
        vy += grav; py += vy;
        if(py >= 500) { py = 500; isJumping = false; vy = 0; }
        ctx.fillStyle = 'blue'; ctx.fillRect(px, py-40, 30, 40);
        
        // Monster
        ctx.fillStyle = 'red'; ctx.font = '50px Arial'; ctx.fillText('👹', 10, py-10);
        
        // Obstacles
        if(frame % 90 === 0) obs.push({x: 800, y: 460, w: 30, h: 40});
        ctx.fillStyle = '#fff';
        for(let i=obs.length-1; i>=0; i--) {
            let o = obs[i]; o.x -= 8;
            ctx.fillRect(o.x, o.y, o.w, o.h);
            if(px < o.x + o.w && px + 30 > o.x && py > o.y) { active = false; window.removeEventListener('keydown', jump); fail(); }
            if(o.x < -50) obs.splice(i, 1);
        }
        
        frame++;
        requestAnimationFrame(loop);
    };
    loop();
    startMgTimer(20, () => { 
        active = false; 
        window.removeEventListener('keydown', jump); 
        window.removeEventListener('mousedown', jump);
        success(); 
    });
}

// MG 11: SNAKE
function playSnake(success, fail) {
    els.mgTitle.innerText = "Snake Game";
    els.mgDom.style.display = 'none'; els.mgCanvas.style.display = 'block';
    const ctx = els.mgCanvas.getContext('2d');
    let snake = [{x: 10, y: 10}];
    let food = {x: 15, y: 15};
    let dx = 1, dy = 0;
    let score = 0;
    let active = true;

    const move = (e) => {
        const key = e.key.toLowerCase();
        if(key === 'w' || key === 'arrowup') { if(dy === 0) { dx = 0; dy = -1; } }
        if(key === 's' || key === 'arrowdown') { if(dy === 0) { dx = 0; dy = 1; } }
        if(key === 'a' || key === 'arrowleft') { if(dx === 0) { dx = -1; dy = 0; } }
        if(key === 'd' || key === 'arrowright') { if(dx === 0) { dx = 1; dy = 0; } }
    };
    window.addEventListener('keydown', move);

    const loop = setInterval(() => {
        if(!active) return;
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        
        if(head.x < 0 || head.x >= 40 || head.y < 0 || head.y >= 30 || snake.some(s => s.x === head.x && s.y === head.y)) {
            clearInterval(loop); active = false; window.removeEventListener('keydown', move); fail(); return;
        }
        
        snake.unshift(head);
        if(head.x === food.x && head.y === food.y) {
            score++;
            food = {x: Math.floor(Math.random()*40), y: Math.floor(Math.random()*30)};
            if(score >= 10) { clearInterval(loop); active = false; window.removeEventListener('keydown', move); success(); }
        } else {
            snake.pop();
        }

        ctx.fillStyle = 'black'; ctx.fillRect(0,0,800,600);
        ctx.fillStyle = 'lime'; snake.forEach(s => ctx.fillRect(s.x*20, s.y*20, 18, 18));
        ctx.fillStyle = 'red'; ctx.fillRect(food.x*20, food.y*20, 18, 18);
    }, 100);
}

// ---------------------------------------------------------
// End of Level / Game Logic
// ---------------------------------------------------------

function completeLevel() {
    gameState.stars[currentPlayLevel - 1] = Math.max(gameState.stars[currentPlayLevel - 1], currentStars);
    if(currentPlayLevel === gameState.maxLevelUnlocked && gameState.maxLevelUnlocked < 11) {
        gameState.maxLevelUnlocked++;
    }
    saveProgress();
    
    if(currentPlayLevel === 11) {
        showVictoryScreen();
    } else {
        showScreen(els.map);
        renderMap();
    }
}

function showVictoryScreen() {
    showScreen(els.victory);
    els.victoryMsg.innerText = translations[currentLang].win_final;
    // Add a final creepy giggle
    setTimeout(() => {
        const girlOsc = audio.ctx.createOscillator();
        const girlGain = audio.ctx.createGain();
        girlOsc.type = 'sawtooth';
        girlOsc.frequency.setValueAtTime(800, audio.ctx.currentTime);
        girlOsc.frequency.exponentialRampToValueAtTime(1600, audio.ctx.currentTime + 0.3);
        girlOsc.frequency.exponentialRampToValueAtTime(800, audio.ctx.currentTime + 0.6);
        girlGain.gain.setValueAtTime(0.3, audio.ctx.currentTime);
        girlGain.gain.exponentialRampToValueAtTime(0.01, audio.ctx.currentTime + 0.6);
        girlOsc.connect(girlGain);
        girlGain.connect(audio.ctx.destination);
        girlOsc.start();
        girlOsc.stop(audio.ctx.currentTime + 0.6);
    }, 1000);
}

function showResultScreen(won) {
    showScreen(els.result);
    const t = document.getElementById('result-title');
    const m = document.getElementById('result-msg');
    const s = document.getElementById('result-stars');
    const nextBtn = document.getElementById('btn-result-next');
    const winImg = document.getElementById('win-scary-img');
    
    nextBtn.innerText = translations[currentLang].continue;

    if(won) {
        winImg.style.display = 'block';
        if(gameState.errorsCount === 0) {
            t.innerText = translations[currentLang].win_secret;
            m.innerText = translations[currentLang].win_msg;
            t.style.color = "gold";
        } else {
            t.innerText = translations[currentLang].win_title;
            m.innerText = translations[currentLang].win_scars.replace('{count}', gameState.errorsCount);
        }
    } else {
        winImg.style.display = 'none';
        t.innerText = translations[currentLang].game_over;
        m.innerText = "";
    }
    
    s.innerHTML = '';
    const stars = gameState.stars[currentPlayLevel-1] || 0;
    for(let i=0; i<3; i++) {
        const sp = document.createElement('span'); sp.className = 'star'; sp.innerText = '★';
        if(i < stars) sp.classList.add('active');
        s.appendChild(sp);
    }
    
    document.getElementById('btn-result-next').onclick = () => {
        showScreen(els.map);
        renderMap();
    };
}
