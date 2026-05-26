let clickCount = 0;
const messageDiv = document.getElementById('message');
const countSpan = document.getElementById('count');
const magicBtn = document.getElementById('magicBtn');
const colorBtn = document.getElementById('colorBtn');
const resetBtn = document.getElementById('resetBtn');
const colorPicker = document.getElementById('colorPicker');
const userText = document.getElementById('userText');
const textBtn = document.getElementById('textBtn');
const userMessagesDiv = document.getElementById('userMessages');

const messages = [
    'Ура! Ты нажал на кнопку!',
    'Ещё раз! Ты молодец!',
    'Так держать!',
    'Волшебство продолжается!',
    'Ты настоящий волшебник!',
    'Полетели!',
    'Ты супер!',
    'Точное попадание!'
];

magicBtn.addEventListener('click', () => {
    clickCount++;
    countSpan.textContent = clickCount;
    
    const randomIndex = Math.floor(Math.random() * messages.length);
    messageDiv.textContent = messages[randomIndex];
    messageDiv.style.background = '#f0f0f0';
    
    magicBtn.style.transform = 'scale(0.98)';
    setTimeout(() => {
        magicBtn.style.transform = 'scale(1)';
    }, 100);
    
    setTimeout(() => {
        if (messageDiv.textContent === messages[randomIndex]) {
            messageDiv.textContent = '';
        }
    }, 2000);
});

colorBtn.addEventListener('click', () => {
    const colors = ['#667eea', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.background = `linear-gradient(135deg, ${randomColor} 0%, ${colorPicker.value} 100%)`;
    
    messageDiv.textContent = 'Цвет фона изменён!';
    messageDiv.style.background = '#e0e0e0';
    setTimeout(() => {
        if (messageDiv.textContent === 'Цвет фона изменён!') {
            messageDiv.textContent = '';
        }
    }, 1500);
});

resetBtn.addEventListener('click', () => {
    clickCount = 0;
    countSpan.textContent = clickCount;
    messageDiv.textContent = 'Счётчик сброшен!';
    messageDiv.style.background = '#ffe0b3';
    setTimeout(() => {
        if (messageDiv.textContent === 'Счётчик сброшен!') {
            messageDiv.textContent = '';
        }
    }, 1500);
});

colorPicker.addEventListener('input', (e) => {
    document.body.style.background = `linear-gradient(135deg, ${e.target.value} 0%, #764ba2 100%)`;
});

textBtn.addEventListener('click', () => {
    const text = userText.value.trim();
    if (text === '') {
        messageDiv.textContent = 'Напиши что-нибудь сначала!';
        messageDiv.style.background = '#ffe0b3';
        setTimeout(() => {
            if (messageDiv.textContent === 'Напиши что-нибудь сначала!') {
                messageDiv.textContent = '';
            }
        }, 1500);
        return;
    }
    
    addUserMessage(text);
    userText.value = '';
    userText.focus();
});

function addUserMessage(text) {
    const messageItem = document.createElement('div');
    messageItem.className = 'message-item';
    messageItem.innerHTML = `
        ${text}
        <button onclick="this.parentElement.remove()"></button>
    `;
    userMessagesDiv.appendChild(messageItem);
}