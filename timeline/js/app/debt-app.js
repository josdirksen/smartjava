// stub
(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

// this file ties everything together
function DebtApp() {

    that = this;

    // main elements
    this.interestData = [];
    this.bubbles = {};
    this.debtTimeLine = {};
    this.debtMap = {};

    // static variable used to render map
    DebtApp.debtMap = {};

    // variables to control animation, local scope
    var currentStep = 0;
    var forward = true;
    var running = false;

    // keep track of current day
    this.currentDay = {};

    // keep track of current slider position
    var currentSliderPosition = 0;

    // keeps track of the events in the timeline
    var events = [];

    // width of container
    var container_width = $('div#main').width();
    // slider contains a single month
    var WIDTH_SLIDER = (container_width / CONS.DAYS_WIDTH) * (CONS.TIME_LINE_WIDTH / CONS.days.length);
    // total steps we need to take for a full slide
    var totalSteps = CONS.STEPS_PER_DAY * CONS.days.length;
    // our timeline has a fixed width to slide around
    var totalWidthTimeLine = CONS.TIME_LINE_WIDTH - container_width + WIDTH_SLIDER;
    // the slider has the page size to slide around
    var totalWidthSlider = container_width - WIDTH_SLIDER;


    this.colorScale = new chroma.ColorScale({
        colors:['#aaffD9', '#99000D']
    });
    this.outputDateFormat = d3.time.format("%Y-%m-%d");

    // the callback whenever the SVG element is dragged.
    this.drag = d3.behavior.drag()
        .on("drag", function (d, i) {
            // calculate new position
            var slider = this;
            var newPos = currentSliderPosition + d3.event.dx;
            if (newPos >= 0 && newPos <= totalWidthSlider) {
                currentSliderPosition = newPos;
            }

            // update timeline and slider

            that.debtTimeLine.setTimelinePosition(currentSliderPosition, totalWidthSlider, container_width, totalWidthTimeLine, WIDTH_SLIDER);
            d3.select(this).attr("transform", function (d, i) {
                return "translate(" + [ currentSliderPosition , 0 ] + ")"
            });

            // update bubbles
            that.bubbles.moveBubbles(currentSliderPosition / totalWidthSlider);

            // we have totalsteps for the whole range
            currentStep = ((totalSteps / totalWidthSlider) * currentSliderPosition);

            // update the current day in the main timeline
            that.updateCurrentDay(currentSliderPosition);
        });

    // constructor
    DebtApp.prototype.debtApp = function() {
        this.loadInterestData();
        this.bubbles = new Bubbles();
        this.debtTimeLine = new DebtTimeline();
        this.debtTimeLine.addMainTimeline();
        this.debtTimeLine.addDaysTimeLine();
        this.debtTimeLine.addSlider(this.drag);
        this.addTimeTicks(timelineEvents);
        // add the three.js map
        this.debtMap = new DebtMap();
        this.debtMap.initScene();
        this.debtMap.addGeoObject();

        this.attachClickHandlers();

        // assign to static, so we can reference from async render
        DebtApp.debtMap = this.debtMap;
        $("#date_content").text("");
    }

    DebtApp.prototype.callback = function(date) {

        var interestData = this.interestData;

        var csvFormat = d3.time.format("%Y%m%d");
        var day = csvFormat(date);

        for (var i = 0; i < CONS.KEYS.length; i++) {
            var rate = interestData[CONS.KEYS[i]][day];

            if (rate != null) {
                var colorArray = this.colorScale.getColor(rate / 8);
                this.debtMap.updateColors(CONS.KEYS[i], colorArray, rate);
            }
        }

        requestAnimationFrame(this.render);
        $("#date_content").text("- " + this.outputDateFormat(date) + " -");
    }

    DebtApp.prototype.render = function() {
        DebtApp.debtMap.render();
    }

    DebtApp.prototype.updateCurrentDay = function(sliderPosition) {
        // sliderposition is relative to the totalWidthSlider
        var relPosition = sliderPosition / (totalWidthSlider);
        var dayPosition = Math.round(relPosition * CONS.days.length);

        if (CONS.days[dayPosition] != that.currentDay) {
            that.currentDay = CONS.days[dayPosition];
            this.callback(that.currentDay);
        }
    }

    DebtApp.prototype.addTimeTicks = function(data) {
        // first parse the dates and map to days in ticker
        var inputDateFormat = d3.time.format("%Y-%m-%d");
        for (var i = 0; i < data.events.length; i++) {
            var date = inputDateFormat.parse(data.events[i].date);
            for (var j = 0; j < CONS.days.length; j++) {
                if (CONS.days[j].getTime() == date.getTime()) {
                    events.push(
                        {
                            "eventname":data.events[i].eventname,
                            "description":data.events[i].description,
                            "color":data.events[i].color,
                            "position":data.events[i].position,
                            "day":j
                        }
                    );
                    break;
                }
            }
        }

        this.debtTimeLine.addTimeTicks(events);
        for (var i = 0; i < events.length; i++) {
            this.bubbles.addBubble(i, events, container_width);
            this.bubbles.moveBubbles(0);
        }
    }



    DebtApp.prototype.loadInterestData = function() {


            function parseTheRows(parsedrows) {
                var countryKey = CONS.KEYS[i];
                var data = [];

                parsedrows.forEach(function(o) {
                    var dateValue = o.Date;
                    data[dateValue] = o.Rate;
                });

                i++;
                if (i != CONS.KEYS.length) {
                    d3.csv("data/rates/rates-" + CONS.KEYS[i] + ".csv", parseTheRows);
                }

                that.interestData[countryKey] = data;
            }

            var i = 0;
            d3.csv("data/rates/rates-" + CONS.KEYS[i] + ".csv", parseTheRows);

    }

    DebtApp.prototype.attachClickHandlers = function() {
        $("#play").click(function () {
            if (!running) {
                running = true;
                requestAnimationFrame(that.animate);
            }
        });

        $("#stop").click(function () {
            running = false;
        });

        $("#slower").click(function () {
            CONS.SPEED = Math.max(1, --CONS.SPEED);
        });

        $("#faster").click(function () {
            CONS.SPEED++;
        });
    }

    DebtApp.prototype.animate = function() {
        if (running) {

            currentStep += (forward) ? CONS.SPEED : CONS.SPEED * -1;

            var translateSlider = (totalWidthSlider / totalSteps) * currentStep;

            currentSliderPosition = translateSlider;

            if (forward && (currentStep >= totalSteps)) forward = false;
            if (!forward && (currentStep <= 0)) forward = true;


            that.debtTimeLine.slider.attr("transform", "translate(" + translateSlider + ",0)");
            that.debtTimeLine.setTimelinePosition(translateSlider, totalWidthSlider, container_width, totalWidthTimeLine, WIDTH_SLIDER);

            // update bubbles
            that.bubbles.moveBubbles(currentSliderPosition / totalWidthSlider);

            that.updateCurrentDay(currentSliderPosition);
            requestAnimationFrame(that.animate);
        }
    }

    // call the constructor
    this.debtApp();
}