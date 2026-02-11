// ===================================
// ENGINE - Игровой движок
// ===================================

/**
 * Игровой движок с фиксированным таймстепом
 * Управляет game loop и обновлением игры
 */
class Engine {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        
        // Время
        this.lastTime = 0;
        this.deltaTime = 0;
        this.accumulator = 0;
        this.currentTime = 0;
        
        // FPS
        this.fps = 0;
        this.frameCount = 0;
        this.fpsTime = 0;
        
        // Фиксированный timestep для физики (60 FPS)
        this.fixedTimeStep = 1000 / CONFIG.PERFORMANCE.TARGET_FPS; // 16.67ms
        this.maxFrameTime = 250; // Максимум 250ms (защита от спирали смерти)
        
        // Коллекции объектов для обновления
        this.updateables = new Set();
        this.renderables = new Set();
        
        // Колбэки
        this.onUpdate = null;
        this.onRender = null;
        this.onFpsUpdate = null;
        
        console.log('✓ Engine инициализирован');
    }
    
    /**
     * Запуск движка
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.lastTime = performance.now();
        this.fpsTime = this.lastTime;
        
        console.log('🎮 Engine запущен');
        this.gameLoop();
    }
    
    /**
     * Остановка движка
     */
    stop() {
        this.isRunning = false;
        console.log('⏹️ Engine остановлен');
    }
    
    /**
     * Пауза/возобновление
     */
    togglePause() {
        this.isPaused = !this.isPaused;
        if (!this.isPaused) {
            // Сбрасываем время чтобы избежать большого deltaTime
            this.lastTime = performance.now();
        }
        console.log(this.isPaused ? '⏸️ Пауза' : '▶️ Продолжить');
        return this.isPaused;
    }
    
    /**
     * Главный игровой цикл
     */
    gameLoop() {
        if (!this.isRunning) return;
        
        // Текущее время
        this.currentTime = performance.now();
        this.deltaTime = this.currentTime - this.lastTime;
        this.lastTime = this.currentTime;
        
        // Защита от слишком большого deltaTime (например, вкладка неактивна)
        if (this.deltaTime > this.maxFrameTime) {
            this.deltaTime = this.maxFrameTime;
        }
        
        // Обновление FPS
        this.updateFPS();
        
        if (!this.isPaused) {
            // Накопитель для фиксированного timestep
            this.accumulator += this.deltaTime;
            
            // Обновление с фиксированным шагом (для физики)
            while (this.accumulator >= this.fixedTimeStep) {
                this.update(this.fixedTimeStep / 1000); // Конвертируем в секунды
                this.accumulator -= this.fixedTimeStep;
            }
        }
        
        // Отрисовка (всегда, даже на паузе)
        this.render(this.deltaTime / 1000);
        
        // Следующий кадр
        requestAnimationFrame(() => this.gameLoop());
    }
    
    /**
     * Обновление игровой логики
     */
    update(dt) {
        // Вызываем колбэк если есть
        if (this.onUpdate) {
            this.onUpdate(dt);
        }
        
        // Обновляем все зарегистрированные объекты
        for (let obj of this.updateables) {
            if (obj.update) {
                obj.update(dt);
            }
        }
    }
    
    /**
     * Отрисовка
     */
    render(dt) {
        // Вызываем колбэк если есть
        if (this.onRender) {
            this.onRender(dt);
        }
        
        // Отрисовываем все зарегистрированные объекты
        for (let obj of this.renderables) {
            if (obj.render) {
                obj.render(dt);
            }
        }
    }
    
    /**
     * Обновление FPS счетчика
     */
    updateFPS() {
        this.frameCount++;
        
        // Обновляем FPS каждую секунду
        if (this.currentTime - this.fpsTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsTime = this.currentTime;
            
            // Вызываем колбэк
            if (this.onFpsUpdate) {
                this.onFpsUpdate(this.fps);
            }
            
            if (CONFIG.DEBUG.SHOW_FPS) {
                console.log(`FPS: ${this.fps}`);
            }
        }
    }
    
    /**
     * Регистрация объекта для обновления
     */
    registerUpdateable(obj) {
        this.updateables.add(obj);
    }
    
    /**
     * Удаление объекта из обновления
     */
    unregisterUpdateable(obj) {
        this.updateables.delete(obj);
    }
    
    /**
     * Регистрация объекта для отрисовки
     */
    registerRenderable(obj) {
        this.renderables.add(obj);
    }
    
    /**
     * Удаление объекта из отрисовки
     */
    unregisterRenderable(obj) {
        this.renderables.delete(obj);
    }
    
    /**
     * Получить текущий FPS
     */
    getFPS() {
        return this.fps;
    }
    
    /**
     * Получить deltaTime в секундах
     */
    getDeltaTime() {
        return this.deltaTime / 1000;
    }
}

console.log('📜 engine.js загружен');
