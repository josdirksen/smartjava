function DebtTimeline() {

    self = this;
    // all the days we need to show
    this.container_width = $('div#main').width();
    var container_width = $('div#main').width();
    this.WIDTH_SLIDER = (container_width / CONS.DAYS_WIDTH) * (CONS.TIME_LINE_WIDTH/CONS.days.length);
    this.mainTimeline = {};
    this.slider = {};
    this.daysTimeLine = {};
    this.scale = d3.scale.category20c();


    // local values, not exposed
    var x = d3.scale.linear().range([0, CONS.TIME_LINE_WIDTH]);

    DebtTimeline.prototype.debtTimeline = function() {
        x.domain([0, CONS.months.length - 1]);
    }


    DebtTimeline.prototype.addDaysTimeLine = function() {
        var daysTimeLine = d3.select("#chart")
            .append("g")
            .attr("transform", "translate(0,0)")
            .attr("class", "days");

        this.daysTimeLine = daysTimeLine;
    }

    // add the slider, this can be dragged so positions are changed
    DebtTimeline.prototype.addSlider = function(drag) {
        var slider = d3.select("#chart")
            .append("g")
            .attr("class", "slider")
            .call(drag);

        slider.append("rect")
            .attr("x", 0)
            .attr("y", CONS.TOP_RULER_OFFSET - CONS.SLIDER_MARGIN)
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("width", this.WIDTH_SLIDER)
            .attr("height", (CONS.BOTTOM_RULER_OFFSET - CONS.TOP_RULER_OFFSET) / 2)
            .attr("style", "fill:url(#slider-grad);stroke:none;")


        slider.append("rect")
            .attr("x", 0)
            .attr("y", CONS.TOP_RULER_OFFSET - CONS.SLIDER_MARGIN)
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("width", this.WIDTH_SLIDER)
            .attr("height", CONS.BOTTOM_RULER_OFFSET - CONS.TOP_RULER_OFFSET)
            .attr("style", "fill:none;stroke:rgb(155,155,155);stroke-width:3;");

        this.slider = slider;
    }

    // add the main timeline, this is the svg element where the ticks
    // and events are shown
    DebtTimeline.prototype.addMainTimeline = function() {
         this.mainTimeLine = d3.select("#chart")
            .append("g")
            .attr("transform", "translate(" + this.WIDTH_SLIDER / 2 + ",0)")
            .attr("class", "main")

        // write the small ticks, indicating the days
        this.mainTimeLine.selectAll("line.day")
            .data(x.ticks(CONS.days.length)).enter()
            .append("line")
            .attr("class", "day")
            .attr("x1", x)
            .attr("y1", CONS.BOTTOM_RULER_OFFSET - CONS.TICK_MARGIN - CONS.DAY_TICK_HEIGHT)
            .attr("x2", x)
            .attr("y2", CONS.BOTTOM_RULER_OFFSET - CONS.TICK_MARGIN);

        // write the month ticks at the bottom
        this.mainTimeLine.selectAll("line.month-bottom")
            .data(x.ticks(CONS.months.length)).enter()
            .append("line")
            .attr("class", "month-bottom")
            .attr("x1", x)
            .attr("y1", CONS.BOTTOM_RULER_OFFSET - CONS.TICK_MARGIN - CONS.MONTH_TICK_HEIGHT_BOTTOM)
            .attr("x2", x)
            .attr("y2", CONS.BOTTOM_RULER_OFFSET - CONS.TICK_MARGIN);

        // write the month ticks at the top
        this.mainTimeLine.selectAll("line.month-top")
            .data(x.ticks(CONS.months.length)).enter()
            .append("line")
            .attr("class", "month-top")
            .attr("x1", x)
            .attr("y1", CONS.TOP_RULER_OFFSET + CONS.TICK_MARGIN + CONS.MONTH_TICK_HEIGHT_TOP)
            .attr("x2", x)
            .attr("y2", CONS.TOP_RULER_OFFSET + CONS.TICK_MARGIN);

        // write the month ticks at the top
        var formatterMonth = d3.time.format("%b");
        var formatterYear = d3.time.format("%b %Y");
        this.mainTimeLine.selectAll("line.month-name")
            .data(x.ticks(CONS.months.length)).enter()
            .append("text")
            .attr("class", "month-name")
            .attr("x", function (d) {
                if (d % 12 == 0) {
                    return x(d) + CONS.MONTH_TEXT_X_OFFSET_YEAR;
                } else {
                    return x(d) + CONS.MONTH_TEXT_X_OFFSET;
                }
            })
            .attr("y", CONS.TOP_RULER_OFFSET + CONS.MONTH_TEXT_Y_OFFSET)
            .text(function (d) {
                if (d % 12 == 0) {
                    return formatterYear(CONS.months[d]);
                } else {
                    return formatterMonth(CONS.months[d]);
                }
            });


        // add the bottom and top line
        this.mainTimeLine.selectAll("line.ruler")
            .data([CONS.BOTTOM_RULER_OFFSET, CONS.TOP_RULER_OFFSET]).enter()
            .append("line")
            .attr("x1", 0)
            .attr("x2", CONS.TIME_LINE_WIDTH)
            .attr("y1", function (d) {
                return d
            })
            .attr("y2", function (d) {
                return d
            })
            .attr("style", "stroke:rgb(75,75,75);stroke-width:1");

        // add the boundary lines left and right
        this.mainTimeLine.selectAll("line.boundary")
            .data([0, CONS.TIME_LINE_WIDTH]).enter()
            .append("line")
            .attr("x1", function (d) {
                return d
            })
            .attr("x2", function (d) {
                return d
            })
            .attr("y1", CONS.TOP_RULER_OFFSET)
            .attr("y2", CONS.BOTTOM_RULER_OFFSET)
            .attr("id", function (d, i) {
                return "bound-" + i
            })
            .attr("style", "stroke:rgb(75,75,75);stroke-width:1");
    }

    // draw an event as a circle on the timeline
    DebtTimeline.prototype.addTimeTicks = function(events) {
        this.mainTimeLine.selectAll("circle.event")
            .data(events).enter()
            .append("circle")
            .attr("class","event")
            .attr("filter","url(#f2)")
            .attr("r",CONS.EVENT_CIRCLE_SIZE)
            .attr("cx",function (d) {return getTimeLinePositionFromDay(d.day)})
            .attr("cy",CONS.BOTTOM_RULER_OFFSET - CONS.EVENT_CIRCLE_Y_OFFSET)
            .attr("fill", function(d) {return d.color});
    }

    DebtTimeline.prototype.moveTo = function(position) {
        this.mainTimeLine.attr("transform", "translate(" + position + ",0)");
    }

    // updates the position of the day slider. This determines the nodes that need to be
    // written based on the current position and only adds those node as SVG element. If
    // we don't do this, we immediately hit 100% cpu. This same approach could also be
    // used for the main part of the slider to improve performance.
    DebtTimeline.prototype.updateDaySlider =  function(sliderPosition, totalWidthSlider, container_width) {
        var relPosition = sliderPosition / totalWidthSlider;
        var daysPosition = (CONS.days.length*CONS.DAYS_WIDTH) * relPosition;

        // when we remove ticks we need to remove any < then 'from'
        // and any > then 'to'. Since we only have ticks in the visible
        // area, and that is limited, we can just iterate over the ticks
        // and check their x-position.
        var xStart = daysPosition - 25 - container_width/2;
        var xEnd = daysPosition + container_width + 25 - container_width/2;

        // we need to show these days in the slider
        var minDay = (Math.max(0,Math.round(xStart/CONS.DAYS_WIDTH)));
        var maxDay = Math.round(xEnd/CONS.DAYS_WIDTH);

        // the days we need to show on screen
        var daysToShow = CONS.days.slice(minDay,maxDay);

        // select all the current nodes
        var test = this.daysTimeLine.selectAll("rect.day").data(daysToShow);

        // how to add new elements
        test.enter().insert("rect")
            .attr("x",function(d,i) {
                return (i + minDay) * CONS.DAYS_WIDTH
            })
            .attr("y",CONS.DAYS_LINE_OFFSET)
            .attr("width",CONS.DAYS_WIDTH)
            .attr("height",CONS.DAYS_HEIGHT)
            .attr("class","day")
            .attr("style", function(d,i) {
                return "fill:" + self.scale(i+minDay % 20)
            });

        // how to update existing elements
        test.attr("style", function(d,i) {
            return "fill:" + self.scale(i+minDay % 20)
        })
            .attr("x",function(d,i) {
                return (i + minDay) * CONS.DAYS_WIDTH;
            });

        // what to do with extra elements
        test.exit().remove();

        // we also need to do the same with the numbers in the
        // rectangels. So instead of rendering the whole thing
        // at once we only show what is shown on screen
        var dayFormatter = d3.time.format("%e");
        var visibleDayTexts = this.daysTimeLine.selectAll("text.day").data(daysToShow);
        visibleDayTexts.enter()
            .append("text")
            .attr("x",function(d,i) {return ((i+minDay) * CONS.DAYS_WIDTH + 15)})
            .attr("y",11)
            .attr("class","day")
            .text(function(d) {return dayFormatter(d)});

        visibleDayTexts
            .attr("x",function(d,i) {
                return ((i+minDay) * CONS.DAYS_WIDTH + 15)}
        )
            .text(function(d) {return dayFormatter(d)});

        visibleDayTexts.exit().remove();
    }


    // move the position of the timeline and the dayslider
    DebtTimeline.prototype.setTimelinePosition  = function (sliderPosition, totalWidthSlider, container_width, totalWidthTimeLine, WIDTH_SLIDER) {
        // sliderposition is relative to the totalWidthSlider
        var relPosition = sliderPosition / totalWidthSlider;
        // timeline position is relative to totalWidthTimeLine
        var timelinePosition = relPosition * totalWidthTimeLine;
        // move the timeline
        this.moveTo(Math.round((-1 * timelinePosition) + (WIDTH_SLIDER / 2)));
        // day timeline is also relative to number of days times width of element
        var daysPosition = (CONS.days.length*CONS.DAYS_WIDTH) * relPosition;
        this.daysTimeLine.attr("transform"," translate(" + ((-1 * daysPosition) + container_width/2 )+ ",0)");
        // and move the slide to the new position
        this.updateDaySlider(sliderPosition, totalWidthSlider, container_width);
    }

    this.debtTimeline();

}