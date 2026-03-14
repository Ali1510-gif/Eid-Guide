/**
 * Interactive Audio Player for Takbeerat & Duas
 * A premium embedded audio player to listen and recite along with proper professional pronunciation.
 */

class AudioPlayer {
    constructor() {
        this.containerId = 'audio-player-container';
        // Using local professional recitations
        this.tracks = [
            { 
                id: 'takbeerat', 
                title: 'Eid Takbeerat - Makkah', 
                desc: 'Proper professional recitation from the Grand Mosque',
                src: 'assets/audio/takbeerat.mp3',
                durationText: '29:00' // Approximately based on the search result
            },
            { 
                id: 'dua_fatiha', 
                title: 'Surah Al-Fatiha - Mishary', 
                desc: 'Professional recitation by Sheikh Mishary Rashid Al-Afasy',
                src: 'assets/audio/fatiha.mp3',
                durationText: '00:52'
            }
        ];
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.audioElement = new Audio();
        
        // Bind event listeners for audio object
        this.audioElement.addEventListener('timeupdate', () => this.updateProgress());
        this.audioElement.addEventListener('ended', () => this.onTrackEnd());
        this.audioElement.addEventListener('loadedmetadata', () => this.onMetadataLoaded());
        this.audioElement.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayPauseUI();
        });
        this.audioElement.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayPauseUI();
        });

        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onReady());
        } else {
            this.onReady();
        }
    }

    onReady() {
        console.log('AudioPlayer: onReady called');
        this.render();
        this.loadTrack(this.currentTrackIndex);

        document.addEventListener('languageChanged', () => {
            this.render();
            this.loadTrack(this.currentTrackIndex);
            if (this.isPlaying) {
                this.audioElement.play().catch(e => console.error(e));
                this.updatePlayPauseUI();
            }
        });
    }

    getTranslation(path, fallback) {
        if (window.LanguageManager && window.LanguageManager.currentLangData) {
            const translation = window.LanguageManager.getValueFromPath(window.LanguageManager.currentLangData, path);
            if (translation) return translation;
        }
        return fallback;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const title = this.getTranslation('audio_player.title', 'Spiritual Audio');
        const desc = this.getTranslation('audio_player.desc', 'Listen to professional recitations with proper pronunciation.');

        let trackOptionsHtml = '';
        this.tracks.forEach((track, index) => {
            const trackTitle = this.getTranslation(`audio_player.track${index + 1}_title`, track.title);
            const trackDesc = this.getTranslation(`audio_player.track${index + 1}_desc`, track.desc);
            
            trackOptionsHtml += `
                <div class="audio-track-item ${index === this.currentTrackIndex ? 'active' : ''}" onclick="window.eidAudioPlayer.selectTrack(${index})">
                    <div class="track-icon">
                        <i class="fa-solid fa-music"></i>
                    </div>
                    <div class="track-info">
                        <h6 class="mb-0 fw-bold">${trackTitle}</h6>
                        <small class="text-muted">${trackDesc}</small>
                    </div>
                </div>
            `;
        });

        container.innerHTML = `
            <div class="glass-card p-4 p-md-5 mt-4">
                <div class="text-center mb-5">
                    <span class="badge bg-soft-primary px-3 py-2 rounded-pill mb-3">Professional Recitations</span>
                    <h2 class="fw-bold text-dark">
                        <i class="fa-solid fa-headphones text-accent me-2"></i> ${title}
                    </h2>
                    <p class="text-muted">${desc}</p>
                </div>

                <div class="row align-items-center justify-content-center">
                    <div class="col-lg-10">
                        <div class="audio-player-premium p-4">
                            <div class="row gy-4 align-items-center">
                                <!-- Track List -->
                                <div class="col-md-5 border-end-md">
                                    <h5 class="mb-3 fw-bold text-dark">Playlist</h5>
                                    <div class="track-list" id="audio-track-list">
                                        ${trackOptionsHtml}
                                    </div>
                                </div>
                                
                                <!-- Player Controls -->
                                <div class="col-md-7 ps-md-4 text-center">
                                    <div class="current-track-display mb-4">
                                        <div class="playing-animation mb-3" id="playing-bars" style="opacity: 0;">
                                            <span class="bar bar1"></span>
                                            <span class="bar bar2"></span>
                                            <span class="bar bar3"></span>
                                            <span class="bar bar4"></span>
                                            <span class="bar bar5"></span>
                                        </div>
                                        <h4 class="fw-bold mb-1" id="current-track-title">${this.tracks[this.currentTrackIndex].title}</h4>
                                        <p class="text-muted small mb-0" id="current-track-desc">${this.tracks[this.currentTrackIndex].desc}</p>
                                    </div>
                                    
                                    <!-- Progress Bar -->
                                    <div class="audio-progress-container mb-4">
                                        <span class="time-display" id="audio-current-time">00:00</span>
                                        <input type="range" class="audio-slider" id="audio-progress" value="0" min="0" max="100" oninput="window.eidAudioPlayer.seek(this.value)">
                                        <span class="time-display" id="audio-duration">${this.tracks[this.currentTrackIndex].durationText}</span>
                                    </div>

                                    <!-- Controls -->
                                    <div class="audio-controls d-flex justify-content-center align-items-center gap-4">
                                        <button class="btn btn-icon btn-light" onclick="window.eidAudioPlayer.prevTrack()">
                                            <i class="fa-solid fa-backward-step"></i>
                                        </button>
                                        <button class="btn btn-play-main shadow-lg" id="btn-play-pause" onclick="window.eidAudioPlayer.togglePlay()">
                                            <i class="fa-solid fa-play fa-xl"></i>
                                        </button>
                                        <button class="btn btn-icon btn-light" onclick="window.eidAudioPlayer.nextTrack()">
                                            <i class="fa-solid fa-forward-step"></i>
                                        </button>
                                    </div>
                                    
                                    <!-- Volume Control -->
                                    <div class="volume-container mt-4 d-flex align-items-center justify-content-center gap-2">
                                        <i class="fa-solid fa-volume-low text-muted"></i>
                                        <input type="range" class="volume-slider" id="audio-volume" value="100" min="0" max="100" oninput="window.eidAudioPlayer.setVolume(this.value)">
                                        <i class="fa-solid fa-volume-high text-muted"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.injectStyles();
    }

    injectStyles() {
        if (!document.getElementById('audio-player-styles')) {
            const style = document.createElement('style');
            style.id = 'audio-player-styles';
            style.textContent = `
                .audio-player-premium {
                    background: linear-gradient(145deg, #ffffff, #f0f2f5);
                    border-radius: 24px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    border: 1px solid rgba(255,255,255,0.8);
                }
                .track-list {
                    max-height: 250px;
                    overflow-y: auto;
                    padding-right: 10px;
                }
                .audio-track-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 12px 15px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-bottom: 8px;
                    background: #f8f9fa;
                    border: 1px solid transparent;
                }
                .audio-track-item:hover {
                    background: #fff;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .audio-track-item.active {
                    background: var(--primary-light, #e6f7f2);
                    border-color: var(--primary-color, #10B981);
                }
                .audio-track-item .track-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary-color, #10B981);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }
                .audio-track-item.active .track-icon {
                    background: var(--primary-color, #10B981);
                    color: white;
                }
                .audio-progress-container {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .time-display {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #6c757d;
                    min-width: 45px;
                }
                .audio-slider, .volume-slider {
                    -webkit-appearance: none;
                    width: 100%;
                    height: 6px;
                    border-radius: 3px;
                    background: #e9ecef;
                    outline: none;
                }
                .audio-slider::-webkit-slider-thumb, .volume-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: var(--primary-color, #10B981);
                    cursor: pointer;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    transition: transform 0.1s;
                }
                .audio-slider::-webkit-slider-thumb:hover, .volume-slider::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                }
                .btn-play-main {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: var(--primary-color, #10B981);
                    color: white;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                .btn-play-main:hover {
                    background: var(--primary-dark, #059669);
                    transform: scale(1.05);
                    color: white;
                }
                .btn-icon {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: white;
                    border: 1px solid #e9ecef;
                    color: #495057;
                    transition: all 0.3s ease;
                }
                .btn-icon:hover {
                    background: #f8f9fa;
                    color: var(--primary-color, #10B981);
                }
                .volume-container {
                    max-width: 200px;
                    margin: 0 auto;
                }
                
                /* Playing Bars Animation */
                .playing-animation {
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    height: 30px;
                    gap: 4px;
                    transition: opacity 0.3s;
                }
                .playing-animation .bar {
                    width: 4px;
                    background-color: var(--accent-color, #F59E0B);
                    border-radius: 2px;
                    animation: sound-bars 1.2s ease-in-out infinite;
                }
                .playing-animation .bar1 { animation-delay: 0.0s; height: 10px; }
                .playing-animation .bar2 { animation-delay: 0.2s; height: 20px; }
                .playing-animation .bar3 { animation-delay: 0.4s; height: 30px; }
                .playing-animation .bar4 { animation-delay: 0.6s; height: 15px; }
                .playing-animation .bar5 { animation-delay: 0.8s; height: 25px; }
                
                @keyframes sound-bars {
                    0% { transform: scaleY(0.5); }
                    50% { transform: scaleY(1.2); }
                    100% { transform: scaleY(0.5); }
                }
                
                @media (min-width: 768px) {
                    .border-end-md {
                        border-right: 1px solid #e9ecef;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    loadTrack(index) {
        if (index < 0 || index >= this.tracks.length) return;
        
        this.currentTrackIndex = index;
        const track = this.tracks[index];
        this.audioElement.src = track.src;
        this.audioElement.load();
        
        const titleEl = document.getElementById('current-track-title');
        const descEl = document.getElementById('current-track-desc');
        if (titleEl) titleEl.textContent = this.getTranslation(`audio_player.track${index + 1}_title`, track.title);
        if (descEl) descEl.textContent = this.getTranslation(`audio_player.track${index + 1}_desc`, track.desc);
        
        const durEl = document.getElementById('audio-duration');
        if (durEl) durEl.textContent = track.durationText;

        const progressBar = document.getElementById('audio-progress');
        const timeEl = document.getElementById('audio-current-time');
        if (progressBar) progressBar.value = 0;
        if (timeEl) timeEl.textContent = "00:00";

        const items = document.querySelectorAll('.audio-track-item');
        items.forEach((item, i) => {
            if (i === index) item.classList.add('active');
            else item.classList.remove('active');
        });
    }

    selectTrack(index) {
        if (this.currentTrackIndex === index) {
            this.togglePlay();
            return;
        }
        
        const wasPlaying = this.isPlaying;
        this.loadTrack(index);
        if (wasPlaying) {
            this.audioElement.play().catch(console.error);
        }
    }

    togglePlay() {
        if (this.isPlaying) {
            this.audioElement.pause();
        } else {
            this.audioElement.play().catch(e => {
                console.error("Audio playback error:", e);
                alert("Audio could not be played. Please interact with the page first or check the audio source.");
            });
        }
    }

    updatePlayPauseUI() {
        const btn = document.getElementById('btn-play-pause');
        const animation = document.getElementById('playing-bars');
        if (!btn) return;

        if (this.isPlaying) {
            btn.innerHTML = '<i class="fa-solid fa-pause fa-xl"></i>';
            if (animation) animation.style.opacity = '1';
        } else {
            btn.innerHTML = '<i class="fa-solid fa-play fa-xl"></i>';
            if (animation) animation.style.opacity = '0';
        }
    }

    onMetadataLoaded() {
        const durEl = document.getElementById('audio-duration');
        if (durEl && !isNaN(this.audioElement.duration) && this.audioElement.duration !== Infinity) {
            durEl.textContent = this.formatTime(this.audioElement.duration);
        }
    }

    updateProgress() {
        const progressBar = document.getElementById('audio-progress');
        const timeEl = document.getElementById('audio-current-time');
        
        if (!progressBar || !timeEl || isNaN(this.audioElement.duration)) return;

        const current = this.audioElement.currentTime;
        const duration = this.audioElement.duration;
        
        progressBar.value = (current / duration) * 100;
        timeEl.textContent = this.formatTime(current);
    }

    seek(percent) {
        if (isNaN(this.audioElement.duration)) return;
        const seekTime = (percent / 100) * this.audioElement.duration;
        this.audioElement.currentTime = seekTime;
    }

    setVolume(value) {
        this.audioElement.volume = value / 100;
    }

    nextTrack() {
        let nextIndex = this.currentTrackIndex + 1;
        if (nextIndex >= this.tracks.length) nextIndex = 0;
        this.selectTrack(nextIndex);
        if (!this.isPlaying) this.togglePlay();
    }

    prevTrack() {
        let prevIndex = this.currentTrackIndex - 1;
        if (prevIndex < 0) prevIndex = this.tracks.length - 1;
        this.selectTrack(prevIndex);
        if (!this.isPlaying) this.togglePlay();
    }

    onTrackEnd() {
        this.isPlaying = false;
        this.updatePlayPauseUI();
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

window.eidAudioPlayer = new AudioPlayer();
