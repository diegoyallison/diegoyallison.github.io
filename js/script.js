document.addEventListener('DOMContentLoaded', () => {

    // ======================================================
    // 1. SCROLL FADE-IN ANIMATIONS (Intersection Observer)
    // ======================================================
    const fadeEls = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    fadeEls.forEach(el => observer.observe(el));

    // ======================================================
    // 2. COUNTDOWN TIMER — June 13, 2026 at 4:00 PM
    // ======================================================
    const target = new Date('June 13, 2026 11:00:00').getTime();
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minsEl = document.getElementById('minutes');
    const secsEl = document.getElementById('seconds');

    function pad(n) { return n < 10 ? '0' + n : n; }

    function tick() {
        const diff = target - Date.now();
        if (diff <= 0) {
            daysEl.textContent = hoursEl.textContent = minsEl.textContent = secsEl.textContent = '00';
            return;
        }
        daysEl.textContent = pad(Math.floor(diff / 864e5));
        hoursEl.textContent = pad(Math.floor((diff % 864e5) / 36e5));
        minsEl.textContent = pad(Math.floor((diff % 36e5) / 6e4));
        secsEl.textContent = pad(Math.floor((diff % 6e4) / 1e3));
    }

    tick();
    setInterval(tick, 1000);

    // ======================================================
    // 3. AUDIO — Keep Hero, FAB, and Song Card in sync
    // ======================================================
    const heroAudio = document.getElementById('hero-audio');
    const ourSongAudio = document.getElementById('our-song-audio');
    
    const fab = document.getElementById('audio-player');
    const fabIcon = document.getElementById('audio-icon');
    const heroBtn = document.getElementById('hero-play-btn');
    const heroIcon = document.getElementById('hero-play-icon');
    const songBtn = document.getElementById('song-play-btn');
    const songIcon = document.getElementById('song-play-icon');

    let isHeroPlaying = false;
    let isOurSongPlaying = false;

    function syncHeroUI(playing) {
        isHeroPlaying = playing;
        const icon = playing ? 'pause' : 'play_arrow';
        
        if (fabIcon) fabIcon.textContent = icon;
        if (fab) fab.classList.toggle('playing', playing);
        
        if (heroIcon) heroIcon.textContent = icon;
        if (heroBtn) heroBtn.classList.toggle('playing', playing);
    }

    function syncOurSongUI(playing) {
        isOurSongPlaying = playing;
        const icon = playing ? 'pause' : 'play_arrow';
        if (songIcon) songIcon.textContent = icon;
        if (songBtn) songBtn.classList.toggle('playing', playing);
    }

    function toggleHeroAudio() {
        if (isHeroPlaying) {
            heroAudio.pause();
            syncHeroUI(false);
        } else {
            if (isOurSongPlaying) {
                ourSongAudio.pause();
                syncOurSongUI(false);
            }
            heroAudio.play().catch(() => { /* autoplay blocked */ });
            syncHeroUI(true);
        }
    }

    function toggleOurSongAudio() {
        if (isOurSongPlaying) {
            ourSongAudio.pause();
            syncOurSongUI(false);
        } else {
            if (isHeroPlaying) {
                heroAudio.pause();
                syncHeroUI(false);
            }
            ourSongAudio.play().catch(() => { /* autoplay blocked */ });
            syncOurSongUI(true);
        }
    }

    if (fab) fab.addEventListener('click', toggleHeroAudio);
    if (heroBtn) heroBtn.addEventListener('click', toggleHeroAudio);
    if (songBtn) songBtn.addEventListener('click', toggleOurSongAudio);

    if (heroAudio) heroAudio.addEventListener('ended', () => syncHeroUI(false));
    if (ourSongAudio) ourSongAudio.addEventListener('ended', () => syncOurSongUI(false));

    // ======================================================
    // 4. GOOGLE SHEETS INTEGRATION (Dynamic Passes)
    // ======================================================
    // Reemplaza esta URL con el enlace de tu Google Sheet publicado como CSV
    const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRom-JWAVHCwhQRXFmF78lIgp5EGIcPYD-VU4ruSzoj08RxEhzPinHvOdU5SC8AJfNZKXlmx8702M_k/pub?gid=0&single=true&output=csv";

    // Función para obtener parámetros de la URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        const val = urlParams.get(param);
        return val ? val.trim() : null;
    }

    const invitadoId = getQueryParam('invitado');
    const passesContent = document.getElementById('passes-content');
    const passesLoading = document.getElementById('passes-loading');
    const passesError = document.getElementById('passes-error');
    const passesEmpty = document.getElementById('passes-empty');

    if (invitadoId) {
        // Fetch real al CSV
        fetch(SHEET_CSV_URL)
            .then(response => response.text())
            .then(csvText => {
                // Parseo manual sencillo de CSV separando por saltos de línea (manejando \r\n de Windows/Google)
                const rows = csvText.split(/\r?\n/).map(row => row.split(',').map(cell => cell.trim()));
                // Asumiendo columnas: ID, Nombres, NumeroPases, Mesa
                const guestData = rows.find(row => row[0] && row[0] === invitadoId);

                passesLoading.style.display = 'none';

                if (guestData) {
                    passesContent.style.display = 'block';
                    document.getElementById('guest-names').textContent = guestData[1] || 'Invitados Especiales';
                    document.getElementById('guest-count').textContent = guestData[2] || '1';
                    
                    const tableNum = guestData[3] || '0';
                    const tableCard = document.getElementById('table-card');
                    if (tableNum === '0' || tableNum === 0) {
                        if (tableCard) tableCard.style.display = 'none';
                    } else {
                        if (tableCard) tableCard.style.display = 'block';
                        document.getElementById('guest-table').textContent = tableNum;
                    }

                    // Check confirmation status (Column 5 / index 4)
                    const confirmStatus = (guestData[4] || '').toUpperCase();
                    const rsvpButtons = document.getElementById('rsvp-buttons');
                    const rsvpConfirmed = document.getElementById('rsvp-confirmed');
                    
                    if (confirmStatus === 'SI' || confirmStatus === 'SÍ' || confirmStatus === 'S' || confirmStatus === 'CONFIRMADO') {
                        if (rsvpButtons) rsvpButtons.style.display = 'none';
                        if (rsvpConfirmed) rsvpConfirmed.style.display = 'block';
                    } else {
                        if (rsvpButtons) rsvpButtons.style.display = 'flex';
                        if (rsvpConfirmed) rsvpConfirmed.style.display = 'none';
                    }
                } else {
                    passesError.style.display = 'block';
                }
            })
            .catch(err => {
                console.error("Error cargando pases:", err);
                passesLoading.style.display = 'none';
                passesError.style.display = 'block';
            });
    } else {
        // Vista general sin parámetro especial
        passesLoading.style.display = 'none';
        passesEmpty.style.display = 'block';
    }

    // ======================================================
    // 5. CAROUSEL LOGIC
    // ======================================================
    const track = document.getElementById('gallery-track');
    const slides = track ? Array.from(track.children) : [];
    const nextButton = document.getElementById('carousel-next');
    const prevButton = document.getElementById('carousel-prev');
    const dotsNav = document.getElementById('carousel-indicators');

    if (slides.length > 0 && nextButton && prevButton && dotsNav) {
        // Create indicator dots dynamically
        slides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('indicator-dot');
            if (idx === 0) dot.classList.add('active');
            dotsNav.appendChild(dot);
        });

        const dots = Array.from(dotsNav.children);
        let currentIndex = 0;

        function moveToSlide(index) {
            if (!track || slides.length === 0) return;
            
            // Move track
            track.style.transform = `translateX(-${index * 100}%)`;
            
            // Update dots
            dots.forEach(d => d.classList.remove('active'));
            if (dots[index]) dots[index].classList.add('active');
            
            // Update current class on slides for potential CSS usage or accessibility
            slides.forEach(s => s.classList.remove('current'));
            if (slides[index]) slides[index].classList.add('current');
            
            currentIndex = index;
        }

        nextButton.addEventListener('click', () => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= slides.length) nextIndex = 0;
            moveToSlide(nextIndex);
        });

        prevButton.addEventListener('click', () => {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) prevIndex = slides.length - 1;
            moveToSlide(prevIndex);
        });

        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('.indicator-dot');
            if (!targetDot) return;
            const targetIndex = dots.findIndex(dot => dot === targetDot);
            moveToSlide(targetIndex);
        });

        // SWIPE & DRAG SUPPORT
        let startX = 0;
        let isDragging = false;

        const handleSwipeStart = (x) => {
            startX = x;
            isDragging = true;
        };

        const handleSwipeEnd = (x) => {
            if (!isDragging) return;
            const diff = startX - x;
            const threshold = 50; // pixels

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Swipe Left -> Next
                    let nextIndex = currentIndex + 1;
                    if (nextIndex >= slides.length) nextIndex = 0;
                    moveToSlide(nextIndex);
                } else {
                    // Swipe Right -> Prev
                    let prevIndex = currentIndex - 1;
                    if (prevIndex < 0) prevIndex = slides.length - 1;
                    moveToSlide(prevIndex);
                }
            }
            isDragging = false;
        };

        // Touch events
        track.addEventListener('touchstart', (e) => {
            handleSwipeStart(e.touches[0].clientX);
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            handleSwipeEnd(e.changedTouches[0].clientX);
        }, { passive: true });

        track.addEventListener('touchcancel', () => {
            isDragging = false;
        }, { passive: true });

        // Mouse events
        track.addEventListener('mousedown', (e) => {
            handleSwipeStart(e.clientX);
            track.style.cursor = 'grabbing';
        });
        
        window.addEventListener('mouseup', (e) => {
            if (isDragging) {
                handleSwipeEnd(e.clientX);
                track.style.cursor = 'grab';
            }
        });

        // Prevent image dragging from interfering
        track.addEventListener('dragstart', (e) => e.preventDefault());
    }

});
