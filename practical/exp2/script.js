
// Hotel search

function searchHotel() {

    let destination =
        document.getElementById("destination").value;

    let guests =
        document.getElementById("guests").value;

    if (destination === "" || guests === "") {

        alert("Please enter destination and number of guests.");

        return;
    }

    alert(
        "Searching hotels in " +
        destination +
        " for " +
        guests +
        " guest(s)."
    );
}


// Select room

function selectRoom(room) {

    document.getElementById("roomType").value = room;

    document.getElementById("booking")
        .scrollIntoView();

}


// Make booking

function makeBooking(event) {

    event.preventDefault();

    let room =
        document.getElementById("roomType").value;

    let checkin =
        document.getElementById("bookingCheckin").value;

    let checkout =
        document.getElementById("bookingCheckout").value;

    if (checkin >= checkout) {

        alert("Check-out date must be after check-in date.");

        return;
    }

    alert(
        "Room is available!\n\n" +
        "Room: " + room +
        "\nCheck-in: " + checkin +
        "\nCheck-out: " + checkout +
        "\n\nProceeding to payment."
    );

    document.getElementById("payment")
        .scrollIntoView();
}


// Login

function login(event) {

    event.preventDefault();

    alert("Login successful!");
}


// Register

function registerUser(event) {

    event.preventDefault();

    alert("Registration successful!");
}


// Payment

function payment(event) {

    event.preventDefault();

    alert(
        "Payment successful!\n" +
        "Booking confirmed.\n" +
        "Confirmation email sent."
    );
}


// Modify booking

function changeBooking() {

    alert(
        "Booking can be modified up to 3 days before arrival."
    );
}


// Cancel booking

function cancelBooking() {

    let confirmCancel =
        confirm("Are you sure you want to cancel this booking?");

    if (confirmCancel) {

        alert("Booking cancelled successfully.");

    }

}


// Edit profile

function editProfile() {

    alert("Profile editing option selected.");

}


// Contact form

function contactForm(event) {

    event.preventDefault();

    alert("Your message has been sent successfully!");

}


// Admin

function adminAction(action) {

    alert(
        "Administrator action selected: " +
        action
    );

}
