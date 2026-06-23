import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getDatabase, ref, set, push, onValue, update } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

class MovieSync {
    constructor() {
        this.db = getDatabase(initializeApp({
            databaseURL: "https://vmeste-bbf68-default-rtdb.firebaseio.com"
        }));
        this.video = document.getElementById('video');
        this.chat = document.getElementById('chat');
        this.roomIdEl = document.getElementById('roomId');
        this.statusEl = document.getElementById('status');
        this.statusTextEl = this.statusEl.querySelector('.status-text');
        this.friendIdInput = document.getElementById('friendId');
        this.messageInput = document.getElementById('messageInput');
        this.joinBtn = document.getElementById('joinBtn');
        this.sendBtn = document.getElementById('sendBtn');
        this.videoUrlInput = document.getElementById('videoUrl');
        this.loadVideoBtn = document.getElementById('loadVideoBtn');
        this.copyRoomBtn = document.getElementById('copyRoomBtn');
        this.toggleSettingsBtn = document.getElementById('toggleSettingsBtn');
        this.settingsPanel = document.getElementById('settingsPanel');
        this.notifSound = document.getElementById('notifSound');
        
        this.roomId = null;
        this.userId = 'u' + Math.random().toString(36).substr(2, 9);
        this.lastMsg = 0;
        this.isRemote = false;
        this.audioEnabled = false;
        
        this.setupEventListeners();
        this.createRoom();
        this.setupVideoListeners();
    }

    setupEventListeners() {
        this.joinBtn.addEventListener('click', () => this.joinRoom());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.loadVideoBtn.addEventListener('click', () => this.loadVideo());
        this.copyRoomBtn.addEventListener('click', () => this.copyRoomId());
        this.toggleSettingsBtn.addEventListener('click', () => this.toggleSettings());
        
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        this.videoUrlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.loadVideo();
        });

        // Включение звука после первого взаимодействия
        document.addEventListener('click', () => this.enableAudio(), { once: true });
        document.addEventListener('touchstart', () => this.enableAudio(), { once: true });
    }

    enableAudio() {
        if (this.audioEnabled) return;
        this.notifSound.volume = 0.5;
        this.notifSound.play().then(() => {
            this.notifSound.pause();
            this.notifSound.currentTime = 0;
            this.audioEnabled = true;
        }).catch(() => {});
    }

    playNotificationSound() {
        // Вибрация
        if (navigator.vibrate) {
            navigator.vibrate([50, 30, 50]);
        }
        
        // Звук
        if (this.audioEnabled) {
            this.notifSound.currentTime = 0;
            this.notifSound.play().catch(() => {});
        }
        
        // Визуальное уведомление
        this.showToast('🔔 Новое сообщение');
    }

    showToast(message) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    toggleSettings() {
        this.settingsPanel.classList.toggle('collapsed');
        const isCollapsed = this.settingsPanel.classList.contains('collapsed');
        this.toggleSettingsBtn.textContent = isCollapsed ? '⚙️' : '✖️';
    }

    copyRoomId() {
        if (!this.roomId) return;
        navigator.clipboard.writeText(this.roomId).then(() => {
            this.showToast('✅ ID скопирован!');
        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = this.roomId;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showToast('✅ ID скопирован!');
        });
    }

    loadVideo() {
        const url = this.videoUrlInput.value.trim();
        if (!url) {
            this.showToast('⚠️ Введите ссылку');
            return;
        }
        
        this.video.src = url;
        this.video.load();
        this.video.play().catch(() => {});
        
        if (this.roomId) {
            update(ref(this.db, `rooms/${this.roomId}/video`), {
                play: true,
                time: 0,
                src: url
            });
        }
        
        this.addMsg('🎬 Видео загружено!', 'system');
        this.videoUrlInput.value = '';
        this.showToast('✅ Видео загружено!');
    }

    genId() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    createRoom() {
        this.roomId = this.genId();
        set(ref(this.db, `rooms/${this.roomId}`), {
            created: Date.now(),
            video: { play: false, time: 0 }
        });
        
        this.roomIdEl.textContent = this.roomId;
        this.setStatus('Ожидание...', 'connected');
        this.addMsg(`🎉 Комната ${this.roomId}`, 'system');
        this.listenRoom();
    }

    joinRoom() {
        const id = this.friendIdInput.value.trim().toUpperCase();
        if (!id) {
            this.showToast('⚠️ Введите ID');
            return;
        }
        
        this.roomId = id;
        const roomRef = ref(this.db, `rooms/${id}`);
        
        onValue(roomRef, (snap) => {
            if (snap.exists()) {
                this.roomIdEl.textContent = id;
                this.setStatus('Подключено', 'connected');
                this.addMsg(`✅ В комнате ${id}`, 'system');
                this.listenRoom();
                this.showToast('✅ Подключено!');
                // Сворачиваем панель после подключения
                if (!this.settingsPanel.classList.contains('collapsed')) {
                    this.toggleSettings();
                }
            } else {
                this.showToast('❌ Комната не найдена');
            }
        }, { onlyOnce: true });
    }

    listenRoom() {
        // Сообщения
        onValue(ref(this.db, `rooms/${this.roomId}/messages`), (snap) => {
            if (!snap.exists()) return;
            
            const messages = snap.val();
            const msgArray = Object.values(messages);
            
            msgArray.forEach(msg => {
                if (msg.time > this.lastMsg && msg.user !== this.userId) {
                    this.playNotificationSound();
                    this.addMsg(msg.text, 'other');
                    this.lastMsg = msg.time;
                }
            });
        });

        // Видео
        onValue(ref(this.db, `rooms/${this.roomId}/video`), (snap) => {
            if (!snap.exists()) return;
            
            const state = snap.val();
            
            if (state.src && state.src !== this.video.src) {
                this.video.src = state.src;
                this.video.load();
                this.addMsg('🎬 Друг загрузил видео', 'system');
            }
            
            if (this.isRemote || !state.play) {
                if (Math.abs(this.video.currentTime - state.time) > 0.5) {
                    this.video.currentTime = state.time;
                }
                if (state.play && this.video.paused) {
                    this.video.play().catch(() => {});
                } else if (!state.play && !this.video.paused) {
                    this.video.pause();
                }
            }
        });
    }

    sendMessage() {
        const text = this.messageInput.value.trim();
        if (!text || !this.roomId) return;

        const time = Date.now();
        push(ref(this.db, `rooms/${this.roomId}/messages`), {
            text, time, user: this.userId
        });

        this.addMsg(text, 'my');
        this.lastMsg = time;
        this.messageInput.value = '';
    }

    syncVideo(play, time) {
        if (!this.roomId) return;
        this.isRemote = false;
        update(ref(this.db, `rooms/${this.roomId}/video`), { play, time });
        setTimeout(() => this.isRemote = true, 300);
    }

    setupVideoListeners() {
        let wasPlaying = false;
        
        this.video.onplay = () => {
            wasPlaying = true;
            this.syncVideo(true, this.video.currentTime);
        };
        
        this.video.onpause = () => {
            wasPlaying = false;
            this.syncVideo(false, this.video.currentTime);
        };
        
        this.video.onseeked = () => {
            this.syncVideo(!this.video.paused, this.video.currentTime);
        };
        
        // Фикс fullscreen
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement === null && wasPlaying && this.video.paused) {
                setTimeout(() => {
                    this.video.play().catch(() => {});
                }, 100);
            }
        });
        
        this.video.addEventListener('webkitendfullscreen', () => {
            if (wasPlaying && this.video.paused) {
                setTimeout(() => {
                    this.video.play().catch(() => {});
                }, 100);
            }
        });
    }

    addMsg(text, type) {
        const div = document.createElement('div');
        div.className = `message ${type}`;
        div.textContent = text;
        this.chat.appendChild(div);
        this.chat.scrollTop = this.chat.scrollHeight;
    }

    setStatus(text, className) {
        this.statusTextEl.textContent = text;
        this.statusEl.className = `status ${className}`;
    }
}

new MovieSync();