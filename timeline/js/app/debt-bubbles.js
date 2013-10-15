function Bubbles() {


    Bubbles.prototype.addBubble = function(id, events, container_width) {
        var format = d3.time.format("%Y-%m-%d");

        // create the elements to add
        var toAdd = $('<div></div>')
            .attr("id","bubble-"+id)
            .addClass("bubble")
            .css("bottom",events[id].position * CONS.BUBBLE_POSITION_OFFSET + CONS.BUBBLE_POSITON_BOTTOM_OFFSET);

        var bq = $('<blockquote></blockquote>')
            .addClass("triangle-border");
        var head = $('<div></div>').addClass("head").text(events[id].eventname);
        var date = $('<div></div>').addClass("date").text(format(CONS.days[events[id].day]));
        var p = $('<p></p>')
            .text(events[id].description);

        $("#bubble_content").append(toAdd);

        // position the bubble in the div.
        var position = (events[id].day * CONS.DAYS_WIDTH);

        // add the offset to set the bubble directly on the correct position
        $("#bubble-" + id).css("left",Math.round(container_width/2 + position + CONS.DAYS_HOR_OFFSET));


        toAdd.append(bq);
        bq.append(head).append(date).append(p);
    }

    //called when the slider updates, this moves the bubbles.
    Bubbles.prototype.moveBubbles = function(relPosition) {
        $('#bubble_wrapper').css("left",Math.round(-1 * (CONS.days.length*CONS.DAYS_WIDTH) * relPosition));
    }

}