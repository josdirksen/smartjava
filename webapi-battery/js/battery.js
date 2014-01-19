/**
 *  based, a little bit, on
 *  http://www.developer.nokia.com/Community/Wiki/Battery_JavaScript_component_for_Symbian_Web_Runtime
 */
function Battery(emptyBatterySrc, fullBatterySrc, batteryWidth, batteryHeight)
{
    this.batteryHeight = batteryHeight;
    this.batteryWidth = batteryWidth;

    this.emptyBatteryElement = null;
    this.domElement = null;

    this.chargerConnected = false;

    this.init(emptyBatterySrc, fullBatterySrc);
}


Battery.prototype.init = function(emptyBatterySrc, fullBatterySrc)
{
    var el = document.createElement('div');

    var fullImage = document.createElement('img');
    fullImage.style.position = 'absolute';
    fullImage.src = fullBatterySrc;

    this.emptyBatteryElement = document.createElement('div');
    this.emptyBatteryElement.style.position = 'absolute';
    this.emptyBatteryElement.style.overflow = 'hidden';
    this.emptyBatteryElement.style.width = this.batteryWidth + 'px';
    this.emptyBatteryElement.style.height = '0px';

    var emptyImage = document.createElement('img');
    emptyImage.src = emptyBatterySrc;

    this.emptyBatteryElement.appendChild(emptyImage);

    el.appendChild(fullImage);
    el.appendChild(this.emptyBatteryElement);

    this.domElement = el;
}

/**
 * Updates battery with the given value (0 - 100 range)
 * @param {Number} value
 */
Battery.prototype.updateBattery = function(value)
{
    if(value == undefined || value < 0)
        value = 0;

    if(!this.chargerConnected)
        this.batteryValue = value;

    var height = Math.round(((100 - value) * this.batteryHeight) / 100);

    console.log("height:" + height)
    this.emptyBatteryElement.style.height = height + 'px';
}