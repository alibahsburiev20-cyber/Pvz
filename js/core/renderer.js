// ===================================
// RENDERER - Система отрисовки
// ===================================

/**
 * Система отрисовки на Canvas
 * Управляет всей графикой игры
 */
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        if (!this.ctx) {
            throw new Error('Не удалось получить 2D контекст!');
        }
        
        // Размеры
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Камера (для будущего скроллинга)
        this.camera = {
            x: 0,
            y: 0,
            zoom: 1
        };
        
        // Слои для отрисовки (сортировка по Z-index)
        this.layers = new Map();
        this.initLayers();
        
        // Настройки отрисовки
        this.enableAntialiasing = true;
        this.enableShadows = CONFIG.PERFORMANCE.ENABLE_SHADOWS;
        
        console.log('✓ Renderer инициализирован:', this.width, 'x', this.height);
    }
    
    /**
     * Инициализация слоев
     */
    initLayers() {
        const zIndices = CONFIG.Z_INDEX;
        
        for (let key in zIndices) {
            this.layers.set(zIndices[key], []);
        }
    }
    
    /**
     * Очистка canvas
     */
    clear() {
        this.ctx.fillStyle = CONFIG.CANVAS.BACKGROUND_COLOR;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    /**
     * Начало нового кадра
     */
    beginFrame() {
        this.clear();
        
        // Сохраняем состояние контекста
        this.ctx.save();
        
        // Применяем камеру
        this.ctx.translate(-this.camera.x, -this.camera.y);
        this.ctx.scale(this.camera.zoom, this.camera.zoom);
        
        // Очищаем слои
        for (let layer of this.layers.values()) {
            layer.length = 0;
        }
    }
    
    /**
     * Конец кадра
     */
    endFrame() {
        // Восстанавливаем состояние контекста
        this.ctx.restore();
    }
    
    /**
     * Отрисовка всех слоев
     */
    renderLayers() {
        // Сортируем слои по Z-index и отрисовываем
        const sortedLayers = Array.from(this.layers.entries()).sort((a, b) => a[0] - b[0]);
        
        for (let [zIndex, objects] of sortedLayers) {
            for (let obj of objects) {
                if (obj && obj.render) {
                    obj.render(this.ctx);
                }
            }
        }
    }
    
    /**
     * Добавить объект для отрисовки в определенный слой
     */
    addToLayer(zIndex, obj) {
        if (!this.layers.has(zIndex)) {
            this.layers.set(zIndex, []);
        }
        this.layers.get(zIndex).push(obj);
    }
    
    /**
     * Отрисовка сетки
     */
    drawGrid() {
        const grid = CONFIG.GRID;
        const ctx = this.ctx;
        
        ctx.strokeStyle = grid.LINE_COLOR;
        ctx.lineWidth = grid.LINE_WIDTH;
        
        const startX = grid.OFFSET_X;
        const startY = grid.OFFSET_Y;
        const gridWidth = grid.COLS * grid.CELL_SIZE;
        const gridHeight = grid.ROWS * grid.CELL_SIZE;
        
        // Фон сетки (полупрозрачный)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(startX, startY, gridWidth, gridHeight);
        
        // Вертикальные линии
        for (let i = 0; i <= grid.COLS; i++) {
            const x = startX + i * grid.CELL_SIZE;
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, startY + gridHeight);
            ctx.stroke();
        }
        
        // Горизонтальные линии
        for (let i = 0; i <= grid.ROWS; i++) {
            const y = startY + i * grid.CELL_SIZE;
            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(startX + gridWidth, y);
            ctx.stroke();
        }
        
        // Рамка вокруг сетки
        ctx.strokeStyle = CONFIG.COLORS.GRID;
        ctx.lineWidth = 3;
        ctx.strokeRect(startX, startY, gridWidth, gridHeight);
    }
    
    /**
     * Отрисовка прямоугольника
     */
    drawRect(x, y, width, height, color, fill = true) {
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        
        if (fill) {
            this.ctx.fillRect(x, y, width, height);
        } else {
            this.ctx.strokeRect(x, y, width, height);
        }
    }
    
    /**
     * Отрисовка круга
     */
    drawCircle(x, y, radius, color, fill = true) {
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        
        if (fill) {
            this.ctx.fill();
        } else {
            this.ctx.stroke();
        }
    }
    
    /**
     * Отрисовка текста
     */
    drawText(text, x, y, font = '16px Arial', color = '#FFFFFF', align = 'left') {
        this.ctx.font = font;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = align;
        this.ctx.fillText(text, x, y);
    }
    
    /**
     * Отрисовка FPS
     */
    drawFPS(fps) {
        if (!CONFIG.DEBUG.SHOW_FPS) return;
        
        const x = this.width - 10;
        const y = 30;
        
        // Фон
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(x - 80, y - 25, 75, 30);
        
        // FPS текст
        const color = fps >= 55 ? '#4CAF50' : fps >= 30 ? '#FF9800' : '#F44336';
        this.drawText(`FPS: ${fps}`, x - 5, y, 'bold 16px Arial', color, 'right');
    }
    
    /**
     * Преобразование экранных координат в мировые
     */
    screenToWorld(screenX, screenY) {
        return {
            x: (screenX / this.camera.zoom) + this.camera.x,
            y: (screenY / this.camera.zoom) + this.camera.y
        };
    }
    
    /**
     * Преобразование мировых координат в экранные
     */
    worldToScreen(worldX, worldY) {
        return {
            x: (worldX - this.camera.x) * this.camera.zoom,
            y: (worldY - this.camera.y) * this.camera.zoom
        };
    }
    
    /**
     * Установка позиции камеры
     */
    setCameraPosition(x, y) {
        this.camera.x = x;
        this.camera.y = y;
    }
    
    /**
     * Установка зума камеры
     */
    setCameraZoom(zoom) {
        this.camera.zoom = Helpers.clamp(zoom, 0.5, 2.0);
    }
    
    /**
     * Изменение размера canvas
     */
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
    }
}

console.log('📜 renderer.js загружен');
