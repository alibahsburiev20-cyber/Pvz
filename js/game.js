// ===================================
// GAME - Главный класс игры
// ===================================

/**
 * Главный класс игры
 * Управляет всей игровой логикой
 */
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Создаем движок и рендерер
        this.engine = new Engine();
        this.renderer = new Renderer(canvas);
        
        // Игровое состояние
        this.state = {
            budget: CONFIG.GAME.INITIAL_BUDGET,
            baseHealth: CONFIG.GAME.BASE_HEALTH,
            wave: 1,
            maxWaves: 5,
            isPlaying: false,
            isPaused: false
        };
        
        // Коллекции игровых объектов
        this.units = [];          // Полицейские
        this.zombies = [];        // Зомби
        this.projectiles = [];    // Пули
        this.effects = [];        // Эффекты
        
        // Тестовые объекты для демонстрации
        this.testObjects = [];
        this.createTestObjects();
        
        // Подключаем колбэки движка
        this.setupEngineCallbacks();
        
        console.log('✓ Game инициализирована');
    }
    
    /**
     * Настройка колбэков движка
     */
    setupEngineCallbacks() {
        // Обновление логики
        this.engine.onUpdate = (dt) => this.update(dt);
        
        // Отрисовка
        this.engine.onRender = (dt) => this.render(dt);
        
        // Обновление FPS
        this.engine.onFpsUpdate = (fps) => {
            // Можно обновить UI
            if (CONFIG.DEBUG.SHOW_FPS) {
                console.log(`FPS: ${fps}`);
            }
        };
    }
    
    /**
     * Создание тестовых объектов
     */
    createTestObjects() {
        // Создаем несколько движущихся квадратов для демонстрации
        const colors = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0'];
        
        for (let i = 0; i < 5; i++) {
            this.testObjects.push({
                x: Helpers.random(200, 1000),
                y: CONFIG.GRID.OFFSET_Y + i * CONFIG.GRID.CELL_SIZE + CONFIG.GRID.CELL_SIZE / 2,
                width: 40,
                height: 40,
                color: colors[i],
                speedX: Helpers.random(20, 100), // пикселей в секунду
                speedY: 0,
                
                update: function(dt) {
                    // Движение вправо
                    this.x += this.speedX * dt;
                    
                    // Если вышел за правую границу - возвращаем слева
                    if (this.x > 1280) {
                        this.x = 100;
                    }
                },
                
                render: function(ctx) {
                    ctx.fillStyle = this.color;
                    ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
                    
                    // Обводка
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
                }
            });
        }
    }
    
    /**
     * Запуск игры
     */
    start() {
        this.state.isPlaying = true;
        this.engine.start();
        console.log('🎮 Игра запущена!');
    }
    
    /**
     * Остановка игры
     */
    stop() {
        this.state.isPlaying = false;
        this.engine.stop();
        console.log('⏹️ Игра остановлена');
    }
    
    /**
     * Пауза/возобновление
     */
    togglePause() {
        this.state.isPaused = this.engine.togglePause();
        return this.state.isPaused;
    }
    
    /**
     * Обновление игровой логики
     */
    update(dt) {
        if (!this.state.isPlaying) return;
        
        // Обновляем тестовые объекты
        for (let obj of this.testObjects) {
            obj.update(dt);
        }
        
        // Обновляем юнитов
        for (let unit of this.units) {
            if (unit.update) unit.update(dt);
        }
        
        // Обновляем зомби
        for (let zombie of this.zombies) {
            if (zombie.update) zombie.update(dt);
        }
        
        // Обновляем снаряды
        for (let projectile of this.projectiles) {
            if (projectile.update) projectile.update(dt);
        }
        
        // Обновляем эффекты
        for (let effect of this.effects) {
            if (effect.update) effect.update(dt);
        }
        
        // Удаляем мертвые объекты
        this.cleanup();
    }
    
    /**
     * Отрисовка
     */
    render(dt) {
        // Начинаем новый кадр
        this.renderer.beginFrame();
        
        // Отрисовка сетки
        this.renderer.drawGrid();
        
        // Отрисовка тестовых объектов
        for (let obj of this.testObjects) {
            obj.render(this.ctx);
        }
        
        // Отрисовка юнитов
        for (let unit of this.units) {
            if (unit.render) unit.render(this.ctx);
        }
        
        // Отрисовка зомби
        for (let zombie of this.zombies) {
            if (zombie.render) zombie.render(this.ctx);
        }
        
        // Отрисовка снарядов
        for (let projectile of this.projectiles) {
            if (projectile.render) projectile.render(this.ctx);
        }
        
        // Отрисовка эффектов
        for (let effect of this.effects) {
            if (effect.render) effect.render(this.ctx);
        }
        
        // UI поверх всего
        this.renderUI();
        
        // FPS счетчик
        this.renderer.drawFPS(this.engine.getFPS());
        
        // Текст паузы
        if (this.state.isPaused) {
            this.renderPauseOverlay();
        }
        
        // Завершаем кадр
        this.renderer.endFrame();
    }
    
    /**
     * Отрисовка UI (на canvas)
     */
    renderUI() {
        const ctx = this.ctx;
        
        // Информация о текущем состоянии
        const grid = CONFIG.GRID;
        const textY = grid.OFFSET_Y - 20;
        
        // Тень для текста
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // Заголовок
        this.renderer.drawText(
            'ЭТАП 2: Игровой цикл работает!',
            this.canvas.width / 2,
            textY,
            'bold 24px Arial',
            '#4CAF50',
            'center'
        );
        
        // Сбрасываем тень
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Инструкции
        const instructions = [
            'Движущиеся квадраты демонстрируют game loop',
            'Нажми ПРОБЕЛ для паузы',
            `FPS: ${this.engine.getFPS()} | DeltaTime: ${(this.engine.getDeltaTime() * 1000).toFixed(2)}ms`
        ];
        
        let y = this.canvas.height - 80;
        for (let text of instructions) {
            this.renderer.drawText(
                text,
                this.canvas.width / 2,
                y,
                '14px Arial',
                '#FFFFFF',
                'center'
            );
            y += 20;
        }
    }
    
    /**
     * Отрисовка оверлея паузы
     */
    renderPauseOverlay() {
        const ctx = this.ctx;
        
        // Полупрозрачный фон
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Текст паузы
        this.renderer.drawText(
            '⏸️ ПАУЗА',
            this.canvas.width / 2,
            this.canvas.height / 2,
            'bold 48px Arial',
            '#FFFFFF',
            'center'
        );
        
        this.renderer.drawText(
            'Нажми ПРОБЕЛ чтобы продолжить',
            this.canvas.width / 2,
            this.canvas.height / 2 + 50,
            '20px Arial',
            '#AAAAAA',
            'center'
        );
    }
    
    /**
     * Очистка мертвых объектов
     */
    cleanup() {
        // Удаляем объекты с флагом isDead
        this.units = this.units.filter(u => !u.isDead);
        this.zombies = this.zombies.filter(z => !z.isDead);
        this.projectiles = this.projectiles.filter(p => !p.isDead);
        this.effects = this.effects.filter(e => !e.isDead);
    }
    
    /**
     * Добавить юнита
     */
    addUnit(unit) {
        this.units.push(unit);
    }
    
    /**
     * Добавить зомби
     */
    addZombie(zombie) {
        this.zombies.push(zombie);
    }
    
    /**
     * Добавить снаряд
     */
    addProjectile(projectile) {
        this.projectiles.push(projectile);
    }
    
    /**
     * Добавить эффект
     */
    addEffect(effect) {
        this.effects.push(effect);
    }
    
    /**
     * Получить состояние игры
     */
    getState() {
        return this.state;
    }
    
    /**
     * Изменение размера
     */
    resize(width, height) {
        this.renderer.resize(width, height);
    }
}

console.log('📜 game.js загружен');
