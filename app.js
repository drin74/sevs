* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    color: #fff;
    height: 100vh;
    height: 100dvh; /* Dynamic viewport height для мобильных */
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
}

.container {
    display: flex;
    height: 100%;
    width: 100vw;
}

/* Video Section */
.video-section {
    flex: 3;
    display: flex;
    flex-direction: column;
    background: #000;
    position: relative;
    overflow: hidden;
}

.video-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    background: #000;
    width: 100%;
    height: 100%;
}

#video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #000;
}

/* Chat Section */
.chat-section {
    flex: 1;
    min-width: 350px;
    max-width: 420px;
    background: #1a1a2e;
    color: #fff;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-shadow: -5px 0 30px rgba(0, 0, 0, 0.2);
}

.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    flex-shrink: 0;
}

.header-buttons {
    display: flex;
    gap: 8px;
}

.btn-header {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-header:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.3);
}

.room-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.room-label {
    font-size: 10px;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.room-id {
    font-size: 16px;
    font-weight: 700;
    font-family: 'Courier New', monospace;
    letter-spacing: 1px;
}

/* Settings Panel (сворачиваемая) */
.settings-panel {
    background: #16213e;
    border-bottom: 1px solid #0f3460;
    overflow: hidden;
    transition: max-height 0.3s ease;
    max-height: 500px;
    flex-shrink: 0;
}

.settings-panel.collapsed {
    max-height: 0;
    border-bottom: none;
}

.settings-section {
    padding: 12px 15px;
    border-bottom: 1px solid #0f3460;
}

.settings-section:last-child {
    border-bottom: none;
}

.section-title {
    font-size: 12px;
    color: #888;
    margin-bottom: 8px;
    font-weight: 600;
}

.join-panel {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
}

.join-panel input,
.video-url-panel input {
    flex: 1;
    padding: 10px 12px;
    border: 2px solid #0f3460;
    border-radius: 8px;
    background: #1a1a2e;
    color: #fff;
    font-size: 13px;
    outline: none;
}

.join-panel input::placeholder,
.video-url-panel input::placeholder {
    color: #666;
}

.join-panel input:focus,
.video-url-panel input:focus {
    border-color: #667eea;
}

.btn-success {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    color: white;
    border: none;
    padding: 10px 18px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    font-size: 13px;
    white-space: nowrap;
}

.btn-success:active {
    transform: scale(0.95);
}

.status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #fff;
}

.status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #dc3545;
}

.status.connected .status-dot {
    background: #28a745;
    box-shadow: 0 0 8px #28a745;
}

.video-url-panel {
    display: flex;
    gap: 8px;
}

.btn-video {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    font-size: 13px;
    white-space: nowrap;
}

.btn-video:active {
    transform: scale(0.95);
}

/* Chat - больше места! */
.chat {
    flex: 1;
    padding: 12px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: #1a1a2e;
    min-height: 0; /* Важно для flex */
    -webkit-overflow-scrolling: touch;
}

.message {
    max-width: 85%;
    padding: 10px 14px;
    border-radius: 16px;
    word-wrap: break-word;
    font-size: 14px;
    line-height: 1.4;
    animation: slideIn 0.3s ease-out;
    color: #fff;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.9);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.message.my {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    align-self: flex-end;
    border-bottom-right-radius: 4px;
}

.message.other {
    background: #0f3460;
    align-self: flex-start;
    border-bottom-left-radius: 4px;
}

.message.system {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    align-self: center;
    font-size: 11px;
    text-align: center;
    padding: 6px 12px;
    border-radius: 20px;
}

.input-panel {
    display: flex;
    gap: 10px;
    padding: 12px;
    background: #16213e;
    border-top: 1px solid #0f3460;
    flex-shrink: 0;
}

.input-panel input {
    flex: 1;
    padding: 11px 16px;
    border: 2px solid #0f3460;
    border-radius: 24px;
    background: #1a1a2e;
    color: #fff;
    font-size: 14px;
    outline: none;
}

.input-panel input::placeholder {
    color: #666;
}

.input-panel input:focus {
    border-color: #667eea;
}

.btn-send {
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.btn-send:active {
    transform: scale(0.95);
}

/* МОБИЛЬНАЯ ВЕРСИЯ - без черных полос! */
@media (max-width: 768px) {
    body {
        height: 100vh;
        height: 100dvh;
    }
    
    .container {
        flex-direction: column;
        height: 100%;
    }
    
    .video-section {
        flex: none;
        height: 40vh;
        min-height: 180px;
        max-height: 45vh;
    }
    
    .video-wrapper {
        padding: 0;
    }
    
    #video {
        width: 100%;
        height: 100%;
        max-height: 40vh;
    }
    
    .chat-section {
        flex: 1;
        max-width: 100%;
        min-width: auto;
        height: 60vh;
        min-height: calc(100vh - 180px);
    }
    
    .chat-header {
        padding: 10px 12px;
    }
    
    .room-id {
        font-size: 14px;
    }
    
    .settings-panel {
        max-height: 300px;
    }
    
    .settings-panel.collapsed {
        max-height: 0;
    }
    
    .settings-section {
        padding: 10px 12px;
    }
    
    .join-panel input,
    .video-url-panel input {
        font-size: 13px;
        padding: 9px 11px;
    }
    
    .btn-success,
    .btn-video {
        padding: 9px 15px;
        font-size: 12px;
    }
    
    .chat {
        padding: 10px;
        gap: 6px;
    }
    
    .message {
        max-width: 88%;
        padding: 9px 12px;
        font-size: 13px;
    }
    
    .input-panel {
        padding: 10px;
    }
    
    .input-panel input {
        padding: 10px 14px;
        font-size: 14px;
    }
    
    .btn-send {
        width: 42px;
        height: 42px;
    }
}

/* iPhone X and newer - safe areas */
@supports (padding: max(0px)) {
    body {
        padding-left: env(safe-area-inset-left);
        padding-right: env(safe-area-inset-right);
        padding-bottom: env(safe-area-inset-bottom);
    }
    
    .chat-section {
        padding-bottom: env(safe-area-inset-bottom);
    }
}

/* Toast notification */
.toast {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 11px 20px;
    border-radius: 20px;
    font-size: 13px;
    opacity: 0;
    transition: all 0.3s;
    z-index: 1000;
    pointer-events: none;
    backdrop-filter: blur(10px);
    white-space: nowrap;
}

.toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

/* Scrollbar */
.chat::-webkit-scrollbar {
    width: 5px;
}

.chat::-webkit-scrollbar-track {
    background: transparent;
}

.chat::-webkit-scrollbar-thumb {
    background: #0f3460;
    border-radius: 3px;
}