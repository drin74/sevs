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
        this.friendIdInput = document.getElementById('friendId');
        this.messageInput = document.getElementById('messageInput');
        this.joinBtn = document.getElementById('joinBtn');
        this.sendBtn = document.getElementById('sendBtn');
        
        this.roomId = null;
        this.userId = 'u' + Math.random().toString(36).substr(2, 9);
        this.lastMsg = 0;
        this.isRemote = false;
        
        this.setupEventListeners();
        this.createRoom();
        this.setupVideoListeners();
    }

    setupEventListeners() {
        this.joinBtn.addEventListener('click', () => this.joinRoom());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
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
        this.addMsg(`Комната ${this.roomId} создана`, 'system');
        this.listenRoom();
    }

    joinRoom() {
        const id = this.friendIdInput.value.trim().toUpperCase();
        if (!id) return alert('Введите ID');
        
        this.roomId = id;
        const roomRef = ref(this.db, `rooms/${id}`);
        
        onValue(roomRef, (snap) => {
            if (snap.exists()) {
                this.roomIdEl.textContent = id;
                this.setStatus('Подключено', 'connected');
                this.addMsg(`В комнате ${id}`, 'system');
                this.listenRoom();
            } else {
                alert('Комната не найдена');
            }
        }, { onlyOnce: true });
    }

    listenRoom() {
        onValue(ref(this.db, `rooms/${this.roomId}/messages`), (snap) => {
            if (!snap.exists()) return;
            
            Object.values(snap.val()).forEach(msg => {
                if (msg.time > this.lastMsg && msg.user !== this.userId) {
                    this.addMsg(msg.text, 'other');
                    this.lastMsg = msg.time;
                }
            });
        });

   
        onValue(ref(this.db, `rooms/${this.roomId}/video`), (snap) => {
            if (!snap.exists() || !this.isRemote) return;
            
            const state = snap.val();
            if (Math.abs(this.video.currentTime - state.time) > 0.5) {
                this.video.currentTime = state.time;
            }
            state.play ? this.video.play().catch(()=>{}) : this.video.pause();
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
        this.video.onplay = () => this.syncVideo(true, this.video.currentTime);
        this.video.onpause = () => this.syncVideo(false, this.video.currentTime);
        this.video.onseeked = () => this.syncVideo(!this.video.paused, this.video.currentTime);
    }

    addMsg(text, type) {
        const div = document.createElement('div');
        div.className = `message ${type}`;
        div.textContent = text;
        this.chat.appendChild(div);
        this.chat.scrollTop = this.chat.scrollHeight;
    }

    setStatus(text, className) {
        this.statusEl.textContent = text;
        this.statusEl.className = `status ${className}`;
    }
}


new MovieSync();