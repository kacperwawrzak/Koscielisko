

$('.scrollable-tab-bar__tab').click(function (event) {
    
    var this_offset = $(window).scrollTop();
    var that_id     = '#' + $(this).attr('id') + '-anch'
    var that_offset = $(that_id).offset().top - 48;
    var offset_diff = Math.abs(that_offset - this_offset);
    var base_speed  = 1000; // Time in ms per 1,000 pixels
    var speed       = (offset_diff * base_speed) / 1000;
    
    $("html,body").animate({
        scrollTop: that_offset
    }, speed);

});


//Nie uĹźywany
/*
function onScroll(event) {
    var scrollPos = $(document).scrollTop() + 50;
    
    $('.new-tab').each(function () {
        var currLink = $(this);
        var refElement = '#' + $(this).attr('id') + '-anch';
        var elementHeight = $(refElement).outerHeight();
        
        if ($(refElement).offset().top <= scrollPos && $(refElement).offset().top + elementHeight > scrollPos + 70) {

            var activeTab           = currLink.attr('id');
            console.log(activeTab)
            $('#' + activeTab).animate({
                "border-bottom-width": "3px"
            }, 300);
                
            

    };
})}

$(document).ready(function () {
    $(document).on("scroll", onScroll);

});
*/
