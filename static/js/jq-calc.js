
function compStartDay(startMonths, startDays, months) {
    
    var iter_nr = 0,
        prev_startMonths_days = 0;
    
    while (startMonths - 1 > 0) {
        prev_startMonths_days += months[iter_nr];
        iter_nr += 1;
        startMonths -= 1;
    }

    var startDayIndex = startDays + prev_startMonths_days;
    return startDayIndex;
    
}

function compEndDay(endMonths, endDays, months) {
    
    var iter_nr = 0,
        prev_endMonths_days = 0;
    
    while (endMonths - 1 > 0) {
        prev_endMonths_days += months[iter_nr];
        iter_nr += 1;
        endMonths -= 1;
    }

    var endDay = endDays + prev_endMonths_days;
    return endDay;
}


function priceToDay(startDays, startMonths, startYear, endYear, startDayIndex, lenghtOfStay, daysInMonth) {


    var dayOfStay  = [],
        priceOfDay = [],
        currDay    = startDays,
        currMonth  = startMonths,
        currYear   = startYear;
    

        
    for (lenghtOfStay; lenghtOfStay > 0; lenghtOfStay--) {
        var daysLimit = daysInMonth[currMonth - 1],
            currDayFormatted = ('0' + currDay).slice(-2),
            currMonthFormatted = ('0' + currMonth).slice(-2);

        if (currDay < daysLimit) {

            dayOfStay.push(currYear + '-' + currMonthFormatted + '-' + currDayFormatted);
            priceOfDay.push(datesTable[startDayIndex - 1]);

            startDayIndex += 1;
            currDay += 1;
        }else if (currDay === daysLimit) {

            dayOfStay.push(currYear + '-' + currMonthFormatted + '-' + currDayFormatted);
            priceOfDay.push(datesTable[startDayIndex - 1]);

            currMonth += 1;
            if (currMonth == 13) {
                currYear += 1,
                currMonth = 1,
                startDayIndex = 0,
                currDay = 1;
            }
            
            
            startDayIndex += 1;
            currDay = 1;
        }else {
       
        }

     }
        

    
    
        

    
    var dayPriceComb = [dayOfStay, priceOfDay];
    return dayPriceComb;
    
}

function calcInit() {
    
    var adultsAmt = parseInt($('#AdultsCount').text()),
        childrenAmt = parseInt($('#ChildrenCount').text()),
        guestsAmt = adultsAmt + childrenAmt;
    
    if (fp.selectedDates.length == 2 || fp2.selectedDates.length == 2) {
            var startDate = FlatpickrInstance.prototype.formatDate(fp.selectedDates[0], "Y-m-d"),
            endDate = FlatpickrInstance.prototype.formatDate(fp.selectedDates[1], "Y-m-d")
            
            calcCost(startDate, endDate, guestsAmt);
        }
    
}

 
function calcCost(sdate, edate, guestsamt) {
    
    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

    // 1. wyznaczenie indeksu dnia przyjazdu i wyjazdu
        startYear        = Number(sdate.slice(0, 4)),
        startMonths      = Number(sdate.slice(5, 7)),
        startDays        = Number(sdate.slice(8, 10)),
        endYear          = Number(edate.slice(0, 4)),
        endMonths        = Number(edate.slice(5, 7)),
        endDays          = Number(edate.slice(8, 10)),
        startDayIndex    = compStartDay(startMonths, startDays, daysInMonth),
        endDayIndex      = compEndDay(endMonths, endDays, daysInMonth)
        
    // 2. obliczenie iloĹci dni od dnia przyjazdu do wyjazdu (wĹÄcznie)
        if (startYear == endYear) {
            lenghtOfStay = endDayIndex - startDayIndex;
        }else if (startYear < endYear) {
            currYear = 365 - startDayIndex;
            nextYear = 0 + endDayIndex;
            lenghtOfStay = currYear + nextYear;
        }
        
    
    if (guestsamt > standardGuestsAmt) {
        var additGuestsAmt   = guestsamt - standardGuestsAmt,
            dAdditGuestsCost = additGuestsAmt * additionalGuestCost,
            tAdditGuestsCost = dAdditGuestsCost * lenghtOfStay;
    } else {
        var additGuestsAmt   = 0,
            dAdditGuestsCost = 0,
            tAdditGuestsCost = 0;
    }
    
      // 3. data w formacie yyyy-mm-dd dla kaĹźdego dnia + cena
    var dayAndPrice   = priceToDay(startDays, startMonths, startYear, endYear, startDayIndex, lenghtOfStay, daysInMonth),
        
        dayOfStay     = dayAndPrice[0],
        priceOfDay    = dayAndPrice[1],
        
      // 4. cena caĹkowita + Ĺrednia cena za dzieĹ
        totalPriceExG = Math.round(calcTotal(lenghtOfStay, dayOfStay, priceOfDay)),
        totalPrice    = totalPriceExG + tAdditGuestsCost,
        avgDayPrice   = Math.round(totalPrice / lenghtOfStay),
        discount7     = 0,
        discount14    = 0;
        

    if (lenghtOfStay > 14) {
        discount7 = Math.round(-((7 * avgDayPrice) * (discOneRate / 100)));
        discount14 = Math.round(-(((lenghtOfStay - 14) * avgDayPrice) * (discTwoRate / 100)));
    } else if (lenghtOfStay > 7) {
        discount7 = Math.round(-((lenghtOfStay - 7) * avgDayPrice) * (discOneRate / 100));
        discount14 = 0;
    } else if (lenghtOfStay <= 7) {
        discount7 = 0;
        discount14 = 0;
    }


    $.fn.updateCalcResults(lenghtOfStay, avgDayPrice, totalPrice, discount7, discount14);
}


function calcTotal(lenghtOfStay, dayOfStay, priceOfDay) {
    d = 0;
    var totalCost = 0;
    while (lenghtOfStay > 0) {
        totalCost += Number(priceOfDay[d]);

        lenghtOfStay -= 1;
        
        d += 1; 
    }
    
    return totalCost;
}



// UPDATING PRICE CALCULATOR RESULTS ------------------------

$.fn.updateCalcResults = function(lenghtOfStay, avgDayPrice, totalPrice, discount7, discount14) {
    var initInfo = $('.price-calculator__info'),
        initInfoD = $('#PCInfoSidebar'),
        initInfoM = $('#PCInfoMobile'),
        calendarInputSidebar = $('#DateRangeD'),
        calcResults = $('.price-calculator__results');
    
    
    
    
    $( initInfo ).animate({
        opacity: 0
        }, 200, function() {
        $( initInfo ).animate({
            height:0, padding:0, margin:8}, 200, function(){
            
            $(initInfo).css("display", "none");
            $(calendarInputSidebar).css("marginTop", "15px");
        });
    });

    

    $( calcResults ).animate({
        backgroundColor: '#569ff7'
        }, 100, "linear", function() {
        $( calcResults ).animate({
            backgroundColor: 'rgba(0,0,0,0)'
        }, 300, "linear");
    });



    $(".price-preview__from").text('');
    $(".price-preview__avg-price").text(avgDayPrice);
    $(".avg-day-price").text(avgDayPrice);
    $(".lenght-of-stay").text(lenghtOfStay);
    $(".total-price").text(totalPrice);
    $(".discount7").text(discount7);
    $(".discount14").text(discount14);
    $(".total-value").text(totalPrice + discount7 + discount14);
    
    if ($('.price-calculator__results').hasClass('price-calculator__results--hidden')) {
        ($('.price-calculator__results').removeClass('price-calculator__results--hidden'))
    }

    
    if (discount7 < 0) {
        if ($('.price-calculator__results-row--discount7').hasClass('price-calculator__results-row--hidden')) {
            $('.price-calculator__results-row--discount7').removeClass('price-calculator__results-row--hidden')
        }
    } else if (discount7 == 0) {
        if (!$('.price-calculator__results-row--discount7').hasClass('price-calculator__results-row--hidden')) {
            $('.price-calculator__results-row--discount7').addClass('price-calculator__results-row--hidden')
            }
    }
        
    if (discount14 < 0) {
        if ($('.price-calculator__results-row--discount14').hasClass('price-calculator__results-row--hidden')) {
            $('.price-calculator__results-row--discount14').removeClass('price-calculator__results-row--hidden')
        } 
    } else if (discount14 == 0) {
        if (!$('.price-calculator__results-row--discount14').hasClass('price-calculator__results-row--hidden')) {
            $('.price-calculator__results-row--discount14').addClass('price-calculator__results-row--hidden')
        }
    }



};

// GUESTS ---------------------------------------


// BIND ON Guests Input to open guests picker on click
$('.price-calculator__input--guests').on('click', openGuestsPickerWindow);


// Opening guests picker after click and setting it's position and dimension
function openGuestsPickerWindow(evt) {
    var gp = $('#GuestPicker');
    var gpVis = gp.css("opacity");
    
    if (maxGuests == 1) {
        $('#AddAdult').addClass('guest-input__button--disabled');
        $('#AddChild').addClass('guest-input__button--disabled');
        $("#AddAdult").prop('disabled', true);
        $("#AddChild").prop('disabled', true);
    }
    
    if (gp.width() == 0) {
        var gpPad = gp.outerWidth();
    }else {
        var gpPad = gp.outerWidth() - gp.innerWidth;
    }
    
    
    if (gpVis == 0) {
        
        var gpInp = $(this);
        var gpInpHeight = gpInp.outerHeight();
        var gpInpWidth = gpInp.outerWidth();
        var gpInpTop = gpInp.offset().top;
        var gpInpLeft = gpInp.offset().left;

        
        $(gp).css({"top": gpInpTop + gpInpHeight, "left": gpInpLeft, "width": gpInpWidth - gpPad});
        


        $('#GuestPicker').addClass('price-calculator__guests-picker--active');
        $('#GuestPicker').addClass('price-calculator__animate');
        $('.guest-input__button').on('click', changeGuestAmt);
    }

    
}

//Click, scroll, resize events handlers = Close Picker Window

$(document).click(function(e) {
    
    var container = $("#GuestPicker");
    var guestInput = $(".price-calculator__input--guests");
    
    
    if (container.hasClass('price-calculator__guests-picker--active')) {

        if ((!container.is(e.target) && container.has(e.target).length === 0) 
            && (!guestInput.is(e.target) && guestInput.has(e.target).length === 0))
        {
            closeGuestsPickerWindow();
        }
    }
});

$(document).scroll(function() {
    
    var container = $("#GuestPicker");
    
    if (container.hasClass('price-calculator__guests-picker--active')) {

        closeGuestsPickerWindow();
    }
    
});

$( window ).resize(function() {
    
    var container = $("#GuestPicker");
    
    if (container.hasClass('price-calculator__guests-picker--active')) {

        closeGuestsPickerWindow();
    }
    
});


// CLOSE Guests Picker Window ---------------------

function closeGuestsPickerWindow() {
    var gp = $('#GuestPicker');
    
    
    
    $('#GuestsAmountInput').removeClass('mdc-elevation--z4');
    $('#GuestsAmountInputMob').removeClass('mdc-elevation--z4');
    $('#GuestPicker').removeClass('price-calculator__guests-picker--active');
    $('#GuestPicker').removeClass('price-calculator__animate');
    $('.guest-input__button').off('click');
    
    var adultsAmt = parseInt($('#AdultsCount').text()),
        childrenAmt = parseInt($('#ChildrenCount').text()),
        guestsAmt = adultsAmt + childrenAmt;

    if (adultsAmt == gAdultsAmt && childrenAmt == gChildrenAmt) {

    }else {

        gAdultsAmt = adultsAmt;
        gChildrenAmt = childrenAmt;
        
        calcInit()
    }

}




// ADD and REMOVE guests within fixed amount, disable and activate buttons
function changeGuestAmt(evt) {
    
    var btnClickedId = $(this).attr('id'),
        adultsAmt = parseInt($('#AdultsCount').text()),
        childrenAmt = parseInt($('#ChildrenCount').text()),
        smallChildrenAmt = parseInt($('#SmallChildrenCount').text());
    
    
    if (btnClickedId == 'RemoveAdult') {
        $('#AdultsCount').text(adultsAmt - 1);
        if (adultsAmt - 1 == 1) {
            $('#RemoveAdult').addClass('guest-input__button--disabled');
            $("#RemoveAdult").prop('disabled', true);
        }
        
        if ( (adultsAmt - 1) + childrenAmt == (maxGuests - 1)) {
            $('#AddAdult').removeClass('guest-input__button--disabled');
            $("#AddAdult").prop('disabled', false);
            $('#AddChild').removeClass('guest-input__button--disabled');
            $("#AddChild").prop('disabled', false);
        }
        
        updateGuestsInputTextValue();
        
    } else if (btnClickedId == 'AddAdult') {
        $('#AdultsCount').text(adultsAmt + 1);
        $('#RemoveAdult').removeClass('guest-input__button--disabled');
        $("#RemoveAdult").prop('disabled', false);
        
        if ( (adultsAmt + 1) + childrenAmt == maxGuests) {
            $('#AddAdult').addClass('guest-input__button--disabled');
            $("#AddAdult").prop('disabled', true);
            $('#AddChild').addClass('guest-input__button--disabled');
            $("#AddChild").prop('disabled', true);
        }
        
        updateGuestsInputTextValue();
        
    }else if (btnClickedId == "RemoveChild") {
        $('#ChildrenCount').text(childrenAmt - 1);
        if (childrenAmt - 1 == 0) {
            $('#RemoveChild').addClass('guest-input__button--disabled');
            $("#RemoveChild").prop('disabled', true);
        }
        
        if ( (childrenAmt - 1) + adultsAmt == (maxGuests - 1)) {
            $('#AddAdult').removeClass('guest-input__button--disabled');
            $("#AddAdult").prop('disabled', false);
            $('#AddChild').removeClass('guest-input__button--disabled');
            $("#AddChild").prop('disabled', false);
        }
        
        updateGuestsInputTextValue();
        
    }else if (btnClickedId == "AddChild") {
        $('#ChildrenCount').text(childrenAmt + 1);
        $('#RemoveChild').removeClass('guest-input__button--disabled');
        $("#RemoveChild").prop('disabled', false);
        
        if ( (childrenAmt + 1) + adultsAmt == maxGuests) {
            $('#AddAdult').addClass('guest-input__button--disabled');
            $("#AddAdult").prop('disabled', true);
            $('#AddChild').addClass('guest-input__button--disabled');
            $("#AddChild").prop('disabled', true);
        }
        
        updateGuestsInputTextValue();
        
    }else if (btnClickedId == 'RemoveSmallChild') {
        $('#SmallChildrenCount').text(smallChildrenAmt - 1);
        if (smallChildrenAmt - 1 == 0) {
            $('#RemoveSmallChild').addClass('guest-input__button--disabled');
            $("#RemoveSmallChild").prop('disabled', true);
        }
        
        if (smallChildrenAmt - 1 == 5) {
            $('#AddSmallChild').removeClass('guest-input__button--disabled');
            $("#AddSmallChild").prop('disabled', false);
        }
        
        updateGuestsInputTextValue();
        
    }else if (btnClickedId == 'AddSmallChild') {
        $('#SmallChildrenCount').text(smallChildrenAmt + 1);
        $('#RemoveSmallChild').removeClass('guest-input__button--disabled');
        $("#RemoveSmallChild").prop('disabled', false);
        
        if (smallChildrenAmt + 1 == 6) {
            $('#AddSmallChild').addClass('guest-input__button--disabled');
            $("#AddSmallChild").prop('disabled', true);
        }
        
        updateGuestsInputTextValue();
        
    }
}



function updateGuestsInputTextValue() {
    var adultsAmt = parseInt($('#AdultsCount').text()),
        childrenAmt = parseInt($('#ChildrenCount').text()),
        smallChildrenAmt = parseInt($('#SmallChildrenCount').text()),
        
        guests = adultsAmt + childrenAmt,
        guestsInputTextValue = '';
    
    if (guests == 1) {
        var guestsInputTextValue = '1 goĹÄ';
    } else {
        var guestsInputTextValue = guests + ' goĹci';
    }
    
    if (smallChildrenAmt > 0) {
        if (smallChildrenAmt == 1) {
            var guestsInputTextValue = guestsInputTextValue + ', 1 maĹe dziecko';
        } else {
            var guestsInputTextValue = guestsInputTextValue + ', ' + smallChildrenAmt + ' maĹych dzieci';
        }
    }
    
    $('#GuestsAmountInput').attr('placeholder', guestsInputTextValue);
    $('#GuestsAmountInputMob').attr('placeholder', guestsInputTextValue);
}

    
    
    
    
    

    
    
    
    