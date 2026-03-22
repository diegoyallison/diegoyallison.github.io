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
    const target = new Date('June 13, 2026 16:00:00').getTime();
    const daysEl   = document.getElementById('days');
    const hoursEl  = document.getElementById('hours');
    const minsEl   = document.getElementById('minutes');
    const secsEl   = document.getElementById('seconds');

    function pad(n) { return n < 10 ? '0' + n : n; }

    function tick() {
        const diff = target - Date.now();
        if (diff <= 0) {
            daysEl.textContent = hoursEl.textContent = minsEl.textContent = secsEl.textContent = '00';
            return;
        }
        daysEl.textContent  = pad(Math.floor(diff / 864e5));
        hoursEl.textContent = pad(Math.floor((diff % 864e5)  / 36e5));
        minsEl.textContent  = pad(Math.floor((diff % 36e5)   / 6e4));
        secsEl.textContent  = pad(Math.floor((diff % 6e4)    / 1e3));
    }

    tick();
    setInterval(tick, 1000);

    // ======================================================
    // 3. AUDIO — Keep Hero, FAB, and Song Card in sync
    // ======================================================
    const bgAudio      = document.getElementById('bg-audio');
    const fab          = document.getElementById('audio-player');
    const fabIcon      = document.getElementById('audio-icon');
    const heroBtn      = document.getElementById('hero-play-btn');
    const heroIcon     = document.getElementById('hero-play-icon');
    const songBtn      = document.getElementById('song-play-btn');
    const songIcon     = document.getElementById('song-play-icon');

    let isPlaying = false;

    function syncUI(playing) {
        isPlaying = playing;
        const icon = playing ? 'pause' : 'play_arrow';

        // FAB
        fabIcon.textContent = icon;
        fab.classList.toggle('playing', playing);

        // Hero button
        if (heroIcon) heroIcon.textContent = icon;
        if (heroBtn)  heroBtn.classList.toggle('playing', playing);

        // Song card button
        if (songIcon) songIcon.textContent = icon;
    }

    function toggleAudio() {
        if (isPlaying) {
            bgAudio.pause();
            syncUI(false);
        } else {
            bgAudio.play().catch(() => { /* autoplay blocked */ });
            syncUI(true);
        }
    }

    // Wire up all three buttons
    fab.addEventListener('click', toggleAudio);
    if (heroBtn) heroBtn.addEventListener('click', toggleAudio);
    if (songBtn) songBtn.addEventListener('click', toggleAudio);

    // When audio ends naturally
    bgAudio.addEventListener('ended', () => syncUI(false));
});
