getTimeLinePositionFromDay = function(posInDayArray) {
    return Math.round(CONS.TIME_LINE_WIDTH * (posInDayArray / CONS.days.length));
}