// ===================================
// POLICE VS ZOMBIES - CONFIGURATION
// ===================================

const CONFIG = {
    // Версия игры
    VERSION: '0.1.0',
    
    // Canvas настройки
    CANVAS: {
        WIDTH: 1280,              // Базовая ширина
        HEIGHT: 720,              // Базовая высота
        BACKGROUND_COLOR: '#1a1a1a',
        SCALE_MODE: 'fit'         // 'fit', 'fill', 'stretch'
    },
    
    // Игровая сетка
    GRID: {
        ROWS: 5,                  // Количество линий (дорожек)
        COLS: 10,                 // Количество колонок
        CELL_SIZE: 96,            // Размер клетки в пикселях
        OFFSET_X: 100,            // Отступ слева
        OFFSET_Y: 100,            // Отступ сверху
        LINE_COLOR: 'rgba(76, 175, 80, 0.2)',
        LINE_WIDTH: 1
    },
    
    // Игровой баланс
    GAME: {
        INITIAL_BUDGET: 200,      // Начальный бюджет
        BUDGET_GENERATION: 25,    // Сколько генерит солнце
        BUDGET_INTERVAL: 10000,   // Интервал генерации (мс)
        BASE_HEALTH: 100,         // Здоровье базы
        
        WAVE_DELAY: 15000,        // Задержка между волнами (мс)
        ZOMBIE_SPAWN_INTERVAL: 2000, // Интервал между зомби (мс)
        
        SPEEDS: {
            NORMAL: 1.0,
            FAST: 2.0
        }
    },
    
    // FPS и производительность
    PERFORMANCE: {
        TARGET_FPS: 60,
        MAX_PARTICLES: 100,       // Максимум частиц
        PARTICLE_QUALITY: 'medium', // 'low', 'medium', 'high'
        ENABLE_SHADOWS: true,
        ENABLE_EFFECTS: true
    },
    
    // Звук
    AUDIO: {
        MASTER_VOLUME: 0.7,
        MUSIC_VOLUME: 0.5,
        SFX_VOLUME: 0.8,
        ENABLED: true,
        MUSIC_ENABLED: true
    },
    
    // Управление
    INPUT: {
        ENABLE_KEYBOARD: true,
        ENABLE_MOUSE: true,
        ENABLE_TOUCH: true,
        DRAG_THRESHOLD: 5         // Пикселей для начала drag
    },
    
    // Отладка
    DEBUG: {
        ENABLED: false,           // Режим отладки
        SHOW_FPS: true,
        SHOW_GRID: true,
        SHOW_HITBOXES: false,
        SHOW_PATHS: false,
        LOG_LEVEL: 'info'         // 'none', 'error', 'warn', 'info', 'debug'
    },
    
    // Сохранения
    SAVE: {
        AUTO_SAVE: true,
        SAVE_INTERVAL: 30000,     // Автосохранение каждые 30 сек
        STORAGE_KEY: 'pvz_save_data'
    },
    
    // Цвета (для рендеринга)
    COLORS: {
        POLICE: '#2196F3',        // Синий
        ZOMBIE: '#F44336',        // Красный
        PROJECTILE: '#FFEB3B',    // Желтый
        DEFENSE: '#9E9E9E',       // Серый
        GRID: 'rgba(76, 175, 80, 0.2)',
        SELECTION: 'rgba(76, 175, 80, 0.5)',
        RANGE_INDICATOR: 'rgba(33, 150, 243, 0.2)'
    },
    
    // Z-индексы для слоев
    Z_INDEX: {
        BACKGROUND: 0,
        GRID: 1,
        DEFENSE: 10,
        ZOMBIES: 20,
        POLICE: 30,
        PROJECTILES: 40,
        EFFECTS: 50,
        UI: 100
    }
};

// Freeze конфигурацию, чтобы случайно не изменить
Object.freeze(CONFIG);

// Экспорт для консоли (отладка)
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
