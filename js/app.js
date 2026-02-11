// ===================================
// POLICE VS ZOMBIES - APP INIT
// ===================================

/**
 * Главный класс приложения
 * Инициализирует игру и управляет жизненным циклом
 */
class App {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.game = null;
        this.isLoaded = false;
        
        console.log('🚔 Police vs Zombies v' + CONFIG.VERSION);
        console.log('Инициализация приложения...');
    }
    
    /**
     * Инициализация приложения
     */
    async init() {
        try {
            // 1. Получаем canvas
            this.setupCanvas();
            
            // 2. Проверяем поддержку браузера
            this.checkBrowserSupport();
            
            // 3. Определяем устройство
            this.detectDevice();
            
            // 4. Загружаем ресурсы
            await this.loadAssets();
            
            // 5. Инициализируем игру
            this.initGame();
            
            // 6. Настраиваем обработчики событий
            this.setupEventListeners();
            
            // 7. Скрываем экран загрузки
            this.hideLoadingScreen();
            
            // 8. Запускаем игру
            this.start();
            
            this.isLoaded = true;
            console.log('✅ Приложение загружено успешно!');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации:', error);
            this.showError('Ошибка загрузки игры. Пожалуйста, обновите страницу.');
        }
    }
    
    /**
     * Настройка canvas
     */
    setupCanvas() {
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) {
            throw new Error('Canvas элемент не найден!');
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error('Не удалось получить 2D контекст!');
        }
        
        // Устанавливаем размер canvas
        this.resizeCanvas();
        
        console.log('✓ Canvas настроен:', this.canvas.width, 'x', this.canvas.height);
    }
    
    /**
     * Проверка поддержки браузера
     */
    checkBrowserSupport() {
        // Проверяем Canvas API
        if (!this.canvas.getContext) {
            throw new Error('Ваш браузер не поддерживает Canvas API');
        }
        
        // Проверяем localStorage
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
        } catch (e) {
            console.warn('⚠️ localStorage недоступен');
        }
        
        console.log('✓ Браузер поддерживается');
    }
    
    /**
     * Определение типа устройства
     */
    detectDevice() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent);
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        window.DEVICE = {
            isMobile: isMobile && !isTablet,
            isTablet: isTablet,
            isDesktop: !isMobile && !isTablet,
            isTouchDevice: isTouchDevice,
            orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
        };
        
        console.log('✓ Устройство определено:', window.DEVICE);
        
        // Применяем класс к body
        if (window.DEVICE.isMobile) {
            document.body.classList.add('mobile');
        }
        if (window.DEVICE.isTablet) {
            document.body.classList.add('tablet');
        }
    }
    
    /**
     * Загрузка ресурсов
     */
    async loadAssets() {
        const loadingText = document.getElementById('loading-text');
        const loadingProgress = document.getElementById('loading-progress');
        
        // Симуляция загрузки (в реальной игре здесь будут загружаться изображения и звуки)
        const steps = [
            { text: 'Загрузка графики...', progress: 20 },
            { text: 'Загрузка звуков...', progress: 40 },
            { text: 'Загрузка данных...', progress: 60 },
            { text: 'Инициализация систем...', progress: 80 },
            { text: 'Почти готово...', progress: 100 }
        ];
        
        for (let step of steps) {
            loadingText.textContent = step.text;
            loadingProgress.style.width = step.progress + '%';
            await this.delay(300); // Задержка для демонстрации
        }
        
        console.log('✓ Ресурсы загружены');
    }
    
    /**
     * Инициализация игры
     */
    initGame() {
        // Создаем экземпляр игры
        // (пока просто заглушка, настоящий Game будет создан позже)
        this.game = {
            canvas: this.canvas,
            ctx: this.ctx,
            isRunning: false,
            
            // Временные данные для демонстрации
            budget: CONFIG.GAME.INITIAL_BUDGET,
            wave: 1,
            maxWaves: 5,
            baseHealth: CONFIG.GAME.BASE_HEALTH
        };
        
        // Обновляем UI
        this.updateUI();
        
        console.log('✓ Игра инициализирована');
    }
    
    /**
     * Настройка обработчиков событий
     */
    setupEventListeners() {
        // Изменение размера окна
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Изменение ориентации
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.resizeCanvas(), 100);
        });
        
        // Кнопки управления
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.togglePause());
        }
        
        const speedBtn = document.getElementById('speed-btn');
        if (speedBtn) {
            speedBtn.addEventListener('click', () => this.toggleSpeed());
        }
        
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettings());
        }
        
        // Предотвращаем контекстное меню на canvas
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Клавиатура
        window.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        console.log('✓ Обработчики событий настроены');
    }
    
    /**
     * Изменение размера canvas
     */
    resizeCanvas() {
        const container = document.getElementById('game-container');
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        const aspectRatio = CONFIG.CANVAS.WIDTH / CONFIG.CANVAS.HEIGHT;
        
        let newWidth, newHeight;
        
        if (containerWidth / containerHeight > aspectRatio) {
            // Ограничены по высоте
            newHeight = containerHeight;
            newWidth = containerHeight * aspectRatio;
        } else {
            // Ограничены по ширине
            newWidth = containerWidth;
            newHeight = containerWidth / aspectRatio;
        }
        
        this.canvas.width = CONFIG.CANVAS.WIDTH;
        this.canvas.height = CONFIG.CANVAS.HEIGHT;
        this.canvas.style.width = Math.floor(newWidth) + 'px';
        this.canvas.style.height = Math.floor(newHeight) + 'px';
        
        // Обновляем информацию об ориентации
        if (window.DEVICE) {
            window.DEVICE.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        }
    }
    
    /**
     * Скрытие экрана загрузки
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }
    
    /**
     * Показ ошибки
     */
    showError(message) {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.querySelector('.loading-content h1').textContent = '❌ Ошибка';
            loadingScreen.querySelector('#loading-text').textContent = message;
            loadingScreen.querySelector('.loading-bar').style.display = 'none';
        }
    }
    
    /**
     * Запуск игры
     */
    start() {
        this.game.isRunning = true;
        this.gameLoop();
        console.log('✓ Игра запущена');
    }
    
    /**
     * Основной игровой цикл
     */
    gameLoop() {
        if (!this.game.isRunning) return;
        
        // Очищаем canvas
        this.ctx.fillStyle = CONFIG.CANVAS.BACKGROUND_COLOR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рисуем сетку (временно)
        this.drawGrid();
        
        // Рисуем текст
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('POLICE VS ZOMBIES', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Игра готова к разработке!', this.canvas.width / 2, this.canvas.height / 2 + 20);
        this.ctx.fillText('Этап 1 завершен ✓', this.canvas.width / 2, this.canvas.height / 2 + 60);
        
        // Следующий кадр
        requestAnimationFrame(() => this.gameLoop());
    }
    
    /**
     * Отрисовка сетки (временная)
     */
    drawGrid() {
        const grid = CONFIG.GRID;
        this.ctx.strokeStyle = grid.LINE_COLOR;
        this.ctx.lineWidth = grid.LINE_WIDTH;
        
        const startX = grid.OFFSET_X;
        const startY = grid.OFFSET_Y;
        const gridWidth = grid.COLS * grid.CELL_SIZE;
        const gridHeight = grid.ROWS * grid.CELL_SIZE;
        
        // Вертикальные линии
        for (let i = 0; i <= grid.COLS; i++) {
            const x = startX + i * grid.CELL_SIZE;
            this.ctx.beginPath();
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, startY + gridHeight);
            this.ctx.stroke();
        }
        
        // Горизонтальные линии
        for (let i = 0; i <= grid.ROWS; i++) {
            const y = startY + i * grid.CELL_SIZE;
            this.ctx.beginPath();
            this.ctx.moveTo(startX, y);
            this.ctx.lineTo(startX + gridWidth, y);
            this.ctx.stroke();
        }
    }
    
    /**
     * Обновление UI
     */
    updateUI() {
        const budgetDisplay = document.getElementById('budget-display');
        const waveDisplay = document.getElementById('wave-display');
        const healthDisplay = document.getElementById('health-display');
        
        if (budgetDisplay) budgetDisplay.textContent = this.game.budget;
        if (waveDisplay) waveDisplay.textContent = `Волна ${this.game.wave}/${this.game.maxWaves}`;
        if (healthDisplay) healthDisplay.textContent = this.game.baseHealth;
    }
    
    /**
     * Пауза
     */
    togglePause() {
        this.game.isRunning = !this.game.isRunning;
        console.log(this.game.isRunning ? 'Игра возобновлена' : 'Игра на паузе');
        if (this.game.isRunning) {
            this.gameLoop();
        }
    }
    
    /**
     * Изменение скорости
     */
    toggleSpeed() {
        // Заглушка
        console.log('Переключение скорости');
    }
    
    /**
     * Открытие настроек
     */
    openSettings() {
        console.log('Открытие настроек');
        alert('Настройки будут добавлены позже!');
    }
    
    /**
     * Обработка клавиш
     */
    handleKeyPress(e) {
        switch(e.key) {
            case 'Escape':
            case ' ':
                this.togglePause();
                break;
            case 'ArrowUp':
                // Увеличить скорость
                break;
            case 'ArrowDown':
                // Уменьшить скорость
                break;
        }
    }
    
    /**
     * Утилита: задержка
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ===================================
// ЗАПУСК ПРИЛОЖЕНИЯ
// ===================================

// Ждем полной загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

function initApp() {
    window.app = new App();
    window.app.init();
}

// Глобальная обработка ошибок
window.addEventListener('error', (e) => {
    console.error('💥 Глобальная ошибка:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('💥 Необработанный promise:', e.reason);
});

console.log('📜 app.js загружен');
