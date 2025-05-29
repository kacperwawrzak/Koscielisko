var gallery = document.getElementById('ModalGallery');
var img = document.getElementById('photoPreview');

img.onclick = function() {
    openModal("gallery");
};

// modal contact
var contact = document.getElementById('ModalContact');
var contactButton = document.getElementById('ContactButton');
var contactButtonMobile = document.getElementById('MobileContactButton');

contactButton.onclick = function() {
    openModal("contact");
};

contactButtonMobile.onclick = function() {
    openModal("contact");
};

function openModal(modalType) {
    if (modalType === "gallery") {

        $(gallery).fadeIn(200);
        $(gallery).css("display", "block");
        $("body").css("overflow", "hidden");
        $("#CloseGallery").on("click", {modalname: "gallery"}, closeModal);
    } else if (modalType === "contact") {
        var strPhoneNo = phoneNo.toString();
        if ($('#OwnerPhoneNumber').text().trim() === '') {
            $('#OwnerPhoneNumber').text(strPhoneNo.slice(0, 3) + ' xxx xxx');
        }
    
        $(contact).fadeIn( 200);
        $(contact).css("display", "flex");
        $("body").css("overflow", "hidden");
        $("#CloseContact").on("click", {modalname: "contact"}, closeModal);
        $("#RevealPhoneNumber").on("click", function() {
            $("#OwnerPhoneNumber").text(strPhoneNo.slice(0, 3) + ' ' + strPhoneNo.slice(3, 6) + ' ' + strPhoneNo.slice(6, 9));
            $("#PhoneRequest").fadeIn("slow", function() {
                // Animation complete
            });
        });

    }
}

// When the user clicks on <span> (x), close the modal
function closeModal(event) {
    
    if (event.data.modalname === "gallery") {
        gallery.style.display = "none";
        $("body").css("overflow", "scroll");
        $('#CloseGallery').off('click');
        
    } else if (event.data.modalname === "contact") {
        contact.style.display = "none";
        $("body").css("overflow", "scroll");
        $('#CloseContact').off('click');
        $("#RevealPhoneNumber").off("click");
    }

}
        
        
        
