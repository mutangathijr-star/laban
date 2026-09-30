// Laban's Hidden Message App Logic

// Confession messages database
const messages = [
    { text: "Every single time my phone lights up, I secretly hope it's your name on the screen. 🤭", type: "confession" },
    { text: "I know I haven't always handled things right, but losing you or hurting you is the last thing I ever wanted. ❤️", type: "apology" },
    { text: "You have this annoying habit of staying in my head 24/7. Literally can't get work done. 👀", type: "teasing" },
    { text: "Even when things got a little messy between us, talking to you was still the absolute favorite part of my day. ✨", type: "honesty" },
    { text: "Plot twist: I'm completely falling for you, and honestly? There's no turning back. 🤭❤️", type: "confession" },
    // -- QUIZ INTERRUPT HAPPENS AT INDEX 5 --
    { text: "You remember every little detail I tell you. Nobody has ever paid attention to me the way you do. 👀", type: "memory" },
    { text: "I don't just like you... I'm head over heels for you. Mistakes, quirks, overthinking, and all. ❤️", type: "confession" },
    { text: "If I get the chance to be there for you, I'm doing things 100% right this time. Promise. 🤝", type: "promise" },
    { text: "Our endless banter and stupid inside jokes mean more to me than you probably realize. 😂❤️", type: "memory" },
    { text: "You're the 'Blinding Lights' in my chaotic life. Literally. 🎶✨", type: "theme" }
];

let currentMessageIndex = 0;
const messagesTotal = messages.length;
const quizTriggerIndex = 5; // Trigger quiz after 5th message (index 5)
let isPlayingAudio = false;

// Audio player logic
const bgAudio = document.getElementById('bg-audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const cassetteDisc = document.getElementById('cassette-disc');

function toggleMusic() {
    if (!bgAudio) return;
    if (bgAudio.paused) {
        bgAudio.play().then(() => {
            isPlayingAudio = true;
            playIcon.textContent = '⏸';
            cassetteDisc.classList.add('playing');
        }).catch(err => {
            console.log("Audio autoplay prevented by browser:", err);
        });
    } else {
        bgAudio.pause();
        isPlayingAudio = false;
        playIcon.textContent = '▶';
        cassetteDisc.classList.remove('playing');
    }
}

if (playPauseBtn) {
    playPauseBtn.addEventListener('click', toggleMusic);
}

function startAppWithAudio() {
    toggleMusic();
    goToScreen('setup');
}

// Photo handling
function handlePhotoError() {
    const photoImg = document.getElementById('girl-photo');
    const fallback = document.getElementById('photo-fallback');
    if (photoImg) photoImg.style.display = 'none';
    if (fallback) fallback.style.display = 'flex';
}

function loadUploadedPhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const photoImg = document.getElementById('girl-photo');
            const fallback = document.getElementById('photo-fallback');
            if (photoImg) {
                photoImg.src = e.target.result;
                photoImg.style.display = 'block';
            }
            if (fallback) fallback.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

// Screen navigation
function goToScreen(screenId) {
    const activeScreen = document.querySelector('.screen.active');
    const targetScreen = document.getElementById(`screen-${screenId}`);

    if (activeScreen) {
        activeScreen.classList.remove('visible');
        setTimeout(() => {
            activeScreen.classList.remove('active');
            targetScreen.classList.add('active');
            // Force reflow
            targetScreen.offsetHeight;
            targetScreen.classList.add('visible');
        }, 400);
    } else if (targetScreen) {
        targetScreen.classList.add('active');
        targetScreen.classList.add('visible');
    }
}

// Floating Particles
function initParticles() {
    const container = document.getElementById('bg-particles');
    if (!container) return;
    const particleCount = 22;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 5 + 2;
        const left = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = Math.random() * 10 + 7;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        const isCyan = Math.random() > 0.5;
        particle.style.backgroundColor = isCyan ? 'rgba(5, 217, 232, 0.5)' : 'rgba(255, 42, 109, 0.5)';
        particle.style.boxShadow = `0 0 ${size * 3}px ` + (isCyan ? 'rgba(5, 217, 232, 0.8)' : 'rgba(255, 42, 109, 0.8)');
        
        container.appendChild(particle);
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    const landing = document.getElementById('screen-landing');
    if (landing) {
        landing.classList.add('active');
        setTimeout(() => landing.classList.add('visible'), 100);
    }
});

// Message loop functions
function startMessageLoop() {
    currentMessageIndex = 0;
    updateLoopMessage();
    goToScreen('loop');
}

function updateLoopMessage() {
    const counter = document.getElementById('message-counter');
    const textEl = document.getElementById('loop-message-text');
    const buttonEl = document.getElementById('loop-btn');

    if (counter) counter.textContent = `Secret ${currentMessageIndex + 1}/${messagesTotal}`;
    if (textEl) {
        textEl.style.opacity = '0';
        setTimeout(() => {
            textEl.textContent = messages[currentMessageIndex].text;
            textEl.style.opacity = '1';
        }, 300);
    }

    if (buttonEl) {
        if (currentMessageIndex === messagesTotal - 1) {
            buttonEl.textContent = "Final Secret 👀";
        } else {
            buttonEl.textContent = "One more?";
        }
    }
}

function nextMessage() {
    currentMessageIndex++;
    
    if (currentMessageIndex === quizTriggerIndex) {
        goToScreen('quiz');
    } else if (currentMessageIndex >= messagesTotal) {
        goToScreen('final');
        setTimeout(() => {
            const finalTexts = document.querySelectorAll('.final-text');
            finalTexts.forEach(el => el.classList.add('show'));
            const restartBtn = document.querySelector('.restart-btn');
            if (restartBtn) restartBtn.classList.add('show');
        }, 600);
    } else {
        updateLoopMessage();
    }
}

// Quiz handlers
function submitQuiz(answer) {
    const reactionText = document.getElementById('quiz-reaction-text');
    
    if (answer === 'A') {
        reactionText.textContent = "See, even you know it. Laban has no defense against you. 😂❤️";
    } else if (answer === 'B') {
        reactionText.textContent = "100% correct answer. Absolutely zero doubts. 🤭❤️";
    } else if (answer === 'C') {
        reactionText.textContent = "Yup, Laban admits it proudly. You win. 😂🔥";
    }
    
    goToScreen('quiz-reaction');
}

function resumeMessageLoop() {
    updateLoopMessage();
    goToScreen('loop');
}

// Restart logic
function restartApp() {
    currentMessageIndex = 0;
    const finalTexts = document.querySelectorAll('.final-text');
    finalTexts.forEach(el => el.classList.remove('show'));
    const restartBtn = document.querySelector('.restart-btn');
    if (restartBtn) restartBtn.classList.remove('show');
    
    goToScreen('landing');
}
