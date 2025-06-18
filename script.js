document.addEventListener('DOMContentLoaded', () => {
    const characters = document.querySelectorAll('.character');
    const songs = document.querySelectorAll('.song');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const characterAnimation = document.querySelector('.character-animation');
    
    let selectedCount = null;
    let selectedSong = null;
    let audio = null;
    let animationInterval = null;
    
    // 7개의 동물 이모지 배열
    const animals = ['🐻', '🐰', '🦊', '🐯', '🐸', '🐨', '🐼'];

    // Character selection (동물 수 선택)
    characters.forEach(character => {
        character.addEventListener('click', () => {
            characters.forEach(c => c.classList.remove('selected'));
            character.classList.add('selected');
            selectedCount = parseInt(character.dataset.count);
        });
    });

    // Song selection
    songs.forEach(song => {
        song.addEventListener('click', () => {
            songs.forEach(s => s.classList.remove('selected'));
            song.classList.add('selected');
            selectedSong = song.dataset.song;
        });
    });

    // Start button click handler
    startBtn.addEventListener('click', () => {
        if (!selectedCount || !selectedSong) {
            alert('동물 수와 동요를 모두 선택해주세요!');
            return;
        }

        // Stop any existing animation and audio
        stopAnimation();

        // Start new animation and audio
        startAnimation();
        startAudio();

        // Update button states
        startBtn.disabled = true;
        stopBtn.disabled = false;
    });

    // Stop button click handler
    stopBtn.addEventListener('click', () => {
        stopAnimation();
        stopAudio();

        // Update button states
        startBtn.disabled = false;
        stopBtn.disabled = true;
    });

    function startAnimation() {
        // 기존 동물 몸통 제거
        characterAnimation.innerHTML = '';
        
        // 선택된 수만큼 랜덤 동물 생성
        const selectedAnimals = getRandomAnimals(selectedCount);
        
        // 동물 몸통 생성
        selectedAnimals.forEach((animal, index) => {
            const animalBody = document.createElement('div');
            animalBody.className = 'animal-body';
            animalBody.textContent = animal;
            animalBody.style.animationDelay = `${index * 0.1}s`;
            characterAnimation.appendChild(animalBody);
        });

        // 춤추는 애니메이션 시작
        const danceFrames = [
            'translateY(0) rotate(0deg)',
            'translateY(-10px) rotate(-5deg)',
            'translateY(0) rotate(0deg)',
            'translateY(10px) rotate(5deg)'
        ];

        let frameIndex = 0;
        const animalBodies = characterAnimation.querySelectorAll('.animal-body');

        animationInterval = setInterval(() => {
            animalBodies.forEach((body, index) => {
                const delay = (index * 0.1) % 0.4;
                const currentFrame = (frameIndex + Math.floor(delay * 10)) % danceFrames.length;
                body.style.transform = danceFrames[currentFrame];
            });
            frameIndex = (frameIndex + 1) % danceFrames.length;
        }, 200);
    }

    function getRandomAnimals(count) {
        const shuffled = [...animals].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function stopAnimation() {
        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }
        characterAnimation.innerHTML = '';
    }

    function startAudio() {
        // Create audio element
        audio = new Audio();
        
        // Set up event listeners before setting the source
        audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            alert('음악 파일을 재생할 수 없습니다. 파일이 올바른 위치에 있는지 확인해주세요.');
            stopAnimation();
            stopAudio();
            startBtn.disabled = false;
            stopBtn.disabled = true;
        });

        audio.addEventListener('canplaythrough', () => {
            audio.play().catch(error => {
                console.error('Playback error:', error);
                alert('음악 재생을 시작할 수 없습니다. 브라우저 설정을 확인해주세요.');
                stopAnimation();
                stopAudio();
                startBtn.disabled = false;
                stopBtn.disabled = true;
            });
        });

        // Set the source and load
        audio.src = `assets/${selectedSong}.mp3`;
        audio.load();
    }

    function stopAudio() {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            audio = null;
        }
    }
}); 