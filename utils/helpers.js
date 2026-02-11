// ===================================
// HELPERS - Вспомогательные функции
// ===================================

const Helpers = {
    // Случайное число в диапазоне
    random(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    // Случайное целое число
    randomInt(min, max) {
        return Math.floor(this.random(min, max + 1));
    },
    
    // Ограничение значения
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },
    
    // Линейная интерполяция
    lerp(start, end, t) {
        return start + (end - start) * t;
    },
    
    // Расстояние между двумя точками
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
};

console.log('📜 helpers.js загружен');
