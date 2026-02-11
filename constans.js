// ===================================
// CONSTANTS - Константы игры
// ===================================

const CONSTANTS = {
    // Направления
    DIRECTION: {
        LEFT: 'left',
        RIGHT: 'right',
        UP: 'up',
        DOWN: 'down'
    },
    
    // Состояния сущностей
    STATE: {
        IDLE: 'idle',
        WALK: 'walk',
        RUN: 'run',
        ATTACK: 'attack',
        SHOOT: 'shoot',
        RELOAD: 'reload',
        DEATH: 'death',
        DISABLED: 'disabled'
    },
    
    // Типы юнитов
    UNIT_TYPE: {
        // Полицейские
        PATROL: 'patrol',
        SWAT: 'swat',
        SNIPER: 'sniper',
        FLAMETHROWER: 'flamethrower',
        DISPATCHER: 'dispatcher',
        MEDIC: 'medic',
        K9: 'k9',
        HELICOPTER: 'helicopter',
        
        // Защита
        BARRICADE: 'barricade',
        POLICE_CAR: 'police_car',
        ARMORED_VEHICLE: 'armored_vehicle',
        
        // Оборудование
        FLASHBANG: 'flashbang',
        CLAYMORE: 'claymore',
        ELECTRIC_FENCE: 'electric_fence'
    },
    
    // Типы зомби
    ZOMBIE_TYPE: {
        BASIC: 'basic',
        HELMET: 'helmet',
        BIKER: 'biker',
        SHIELD: 'shield',
        SPRINTER: 'sprinter',
        TANK: 'tank',
        BOMBER: 'bomber',
        ARMORED: 'armored',
        BOSS: 'boss'
    },
    
    // Типы снарядов
    PROJECTILE_TYPE: {
        BULLET: 'bullet',
        SNIPER_BULLET: 'sniper_bullet',
        FIRE_STREAM: 'fire_stream',
        ELECTRIC_ARC: 'electric_arc'
    },
    
    // Эффекты
    EFFECT_TYPE: {
        EXPLOSION: 'explosion',
        BLOOD: 'blood',
        MUZZLE_FLASH: 'muzzle_flash',
        SMOKE: 'smoke',
        FIRE: 'fire',
        ELECTRIC: 'electric',
        HEAL: 'heal'
    },
    
    // События
    EVENT: {
        UNIT_PLACED: 'unit_placed',
        UNIT_DESTROYED: 'unit_destroyed',
        ZOMBIE_SPAWNED: 'zombie_spawned',
        ZOMBIE_KILLED: 'zombie_killed',
        WAVE_START: 'wave_start',
        WAVE_COMPLETE: 'wave_complete',
        LEVEL_WIN: 'level_win',
        LEVEL_LOSE: 'level_lose',
        BUDGET_CHANGED: 'budget_changed',
        HEALTH_CHANGED: 'health_changed'
    }
};

Object.freeze(CONSTANTS);

console.log('📜 constants.js загружен');
