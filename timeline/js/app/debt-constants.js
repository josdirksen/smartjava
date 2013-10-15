var CONS  = {


    // TIMELINE constants
    DAYS_LINE_OFFSET : 1,
    DAYS_HEIGHT:15,
    DAYS_WIDTH:50,
    DAYS_HOR_OFFSET : -40,

    BUBBLE_POSITON_BOTTOM_OFFSET : -28,
    BUBBLE_POSITION_OFFSET : 50,

    TIME_LINE_WIDTH : 5000,
    BOTTOM_RULER_OFFSET : 50,
    TOP_RULER_OFFSET : 14,

    TICK_MARGIN : 2,
    DAY_TICK_HEIGHT : 5,
    MONTH_TICK_HEIGHT_BOTTOM : 10,
    MONTH_TICK_HEIGHT_TOP : 5,
    MONTH_TEXT_X_OFFSET : -11,
    MONTH_TEXT_X_OFFSET_YEAR : -20,
    MONTH_TEXT_Y_OFFSET : 16,

    EVENT_CIRCLE_Y_OFFSET : 17,
    EVENT_CIRCLE_SIZE : 3,

    SLIDER_MARGIN : 0,

    STEPS_PER_DAY : 10,
    SPEED : 1.1,
    MAX_RATE : 10,

    // COUNTRY CONSTANTS
    KEYS : ['be','de','fi','fr','gr','ie','it','nl','at','pt','es','sk'],
    days : d3.time.days(new Date(2009, 8, 1), new Date(2012, 7, 1)),
    months : d3.time.months(new Date(2009, 8, 1), new Date(2012, 7, 2)),

    // THREE.JS CONSTANTS
    // set the scene size
    WIDTH : 904,
    HEIGHT : 604,

    // set some camera attributes
    VIEW_ANGLE : 45,
    NEAR : 0.1,
    FAR : 10000,

    CAMERA_X : 80,
    CAMERA_Y : 200,
    CAMERA_Z : 150
}