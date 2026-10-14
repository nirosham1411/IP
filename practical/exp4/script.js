let currentTrain = "";
let trainName = "";
let seats = [];
let passenger = {};
let bookings = [];
let bookedSeats = [3, 9];
let pnrCounter = 2546789120;

function searchTrains(event) {
    event.preventDefault();

    let from = document.getElementById("from").value.toLowerCase();
    let to = document.getElementById("to").value.toLowerCase();
    let rows = document.querySelectorAll("#trainList tr");
    let count = 0;

    rows.forEach(function (row) {
        let source = row.cells[2].textContent.toLowerCase();
        let destination = row.cells[3].textContent.toLowerCase();

        let match = source.includes(from) && destination.includes(to);

        row.style.display = match ? "" : "none";

        if (match) count++;
    });

    alert(count + " train(s) found.");
}

function selectTrain(number, name) {
    currentTrain = number;
    trainName = name;
    seats = [];

    document.getElementById("trainSelected").textContent =
        "Train: " + name + " (" + number + ")";

    document.getElementById("selectedSeats").textContent = "None";

    let seatList = document.getElementById("seatList");
    seatList.innerHTML = "";

    for (let i = 1; i <= 20; i++) {
        let button = document.createElement("button");

        button.textContent = i;
        button.className = "seat";

        if (bookedSeats.includes(i)) {
            button.classList.add("booked");
            button.disabled = true;
        }

        button.onclick = function () {
            if (seats.includes(i)) {
                seats = seats.filter(function (seat) {
                    return seat !== i;
                });

                button.classList.remove("selected");
            } else {
                seats.push(i);
                button.classList.add("selected");
            }

            document.getElementById("selectedSeats").textContent =
                seats.length ? seats.join(", ") : "None";

            calculateFare();
        };

        seatList.appendChild(button);
    }

    document.getElementById("seats").scrollIntoView();
}

function calculateFare() {
    let fares = {
        SL: 350,
        "3A": 900,
        "2A": 1500,
        "1A": 2500
    };

    let selectedClass = document.getElementById("travelClass").value;

    document.getElementById("fare").textContent =
        seats.length * fares[selectedClass];
}

document.getElementById("travelClass").addEventListener("change", calculateFare);

function savePassenger(event) {
    event.preventDefault();

    passenger = {
        name: document.getElementById("passengerName").value,
        age: document.getElementById("passengerAge").value,
        gender: document.getElementById("gender").value,
        email: document.getElementById("passengerEmail").value
    };

    alert("Passenger details saved successfully.");
}

function makePayment() {
    if (!currentTrain || seats.length === 0) {
        alert("Please select a train and seats first.");
        return;
    }

    if (!passenger.name) {
        alert("Please enter passenger details first.");
        document.getElementById("passenger").scrollIntoView();
        return;
    }

    let fare = Number(document.getElementById("fare").textContent);
    let pnr = String(++pnrCounter);
    let date = document.getElementById("journeyDate").value;
    let selectedClass = document.getElementById("travelClass").value;
    let mode = document.getElementById("paymentMode").value;

    let booking = {
        pnr: pnr,
        train: trainName,
        number: currentTrain,
        from: document.getElementById("from").value,
        to: document.getElementById("to").value,
        date: date,
        travelClass: selectedClass,
        seats: [...seats],
        fare: fare,
        status: "Confirmed"
    };

    if (mode === "Online Payment") {
        if (!confirm("Proceed with demo payment of ₹" + fare + "?")) {
            return;
        }
    }

    bookings.push(booking);

    seats.forEach(function (seat) {
        bookedSeats.push(seat);
    });

    addBookingRow(booking);

    alert(
        "Booking successful!\n" +
        "Passenger: " + passenger.name + "\n" +
        "PNR: " + pnr + "\n" +
        "Train: " + trainName + "\n" +
        "Fare: ₹" + fare + "\n" +
        "Payment: " + mode
    );

    seats = [];
    document.getElementById("selectedSeats").textContent = "None";
    document.getElementById("fare").textContent = "0";
}

function addBookingRow(booking) {
    let body = document.getElementById("bookingHistory");
    let row = body.insertRow();

    [
        booking.pnr,
        booking.train,
        booking.from,
        booking.to,
        booking.date,
        booking.travelClass,
        booking.seats.join(", "),
        "₹" + booking.fare,
        booking.status
    ].forEach(function (value) {
        row.insertCell().textContent = value;
    });

    let action = row.insertCell();

    let printButton = document.createElement("button");
    printButton.textContent = "Print";
    printButton.onclick = function () {
        printTicket(booking);
    };

    let cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.onclick = function () {
        cancelByPNR(booking.pnr);
    };

    action.append(printButton, cancelButton);
}

function printTicket(booking) {
    let ticket = window.open("", "_blank");

    ticket.document.write(
        "<h2>Railway Reservation Ticket</h2>" +
        "<p>PNR: " + booking.pnr + "</p>" +
        "<p>Train: " + booking.train + "</p>" +
        "<p>From: " + booking.from + "</p>" +
        "<p>To: " + booking.to + "</p>" +
        "<p>Journey Date: " + booking.date + "</p>" +
        "<p>Class: " + booking.travelClass + "</p>" +
        "<p>Seats: " + booking.seats.join(", ") + "</p>" +
        "<p>Fare: ₹" + booking.fare + "</p>"
    );

    ticket.document.close();
    ticket.print();
}

function checkPNR(event) {
    event.preventDefault();

    let pnr = document.getElementById("pnrNumber").value;
    let booking = bookings.find(function (item) {
        return item.pnr === pnr;
    });

    document.getElementById("pnrResult").textContent = booking
        ? "Train: " + booking.train + " | Status: " + booking.status
        : "PNR not found.";
}

function cancelTicket(event) {
    event.preventDefault();

    let pnr = document.getElementById("cancelPNR").value;
    cancelByPNR(pnr);
}

function cancelByPNR(pnr) {
    let booking = bookings.find(function (item) {
        return item.pnr === pnr;
    });

    if (!booking || booking.status === "Cancelled") {
        alert("Booking not found or already cancelled.");
        return;
    }

    if (!confirm("Are you sure you want to cancel this ticket?")) {
        return;
    }

    let journey = new Date(booking.date);
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let days = Math.ceil((journey - today) / (1000 * 60 * 60 * 24));
    let percentage = days > 7 ? 100 : days >= 4 ? 50 : days >= 1 ? 25 : 0;
    let refund = Math.round(booking.fare * percentage / 100);

    booking.status = "Cancelled";

    alert(
        "Ticket cancelled.\n" +
        "PNR: " + booking.pnr + "\n" +
        "Refund percentage: " + percentage + "%\n" +
        "Refund amount: ₹" + refund
    );

    refreshHistory();
}

function refreshHistory() {
    let body = document.getElementById("bookingHistory");
    body.innerHTML = "";

    bookings.forEach(addBookingRow);
}

function login(event) {
    event.preventDefault();
    alert("Login successful. Demo only.");
}

function registerUser(event) {
    event.preventDefault();
    alert("Registration successful. Demo only.");
}

function addTrain() {
    let number = prompt("Enter train number:");
    let name = prompt("Enter train name:");
    let from = prompt("Enter source station:");
    let to = prompt("Enter destination station:");

    if (!number || !name || !from || !to) {
        alert("Please enter all details.");
        return;
    }

    let row = document.getElementById("trainList").insertRow();

    [number, name, from, to, "10:00", "18:00", "SL, 3A", "50"]
        .forEach(function (value) {
            row.insertCell().textContent = value;
        });

    let action = row.insertCell();
    let button = document.createElement("button");

    button.textContent = "View Seats";
    button.onclick = function () {
        selectTrain(number, name);
    };

    action.appendChild(button);
    alert("Train added successfully.");
}

function updateTrain() {
    alert("Train information update selected.");
}

function manageSchedule() {
    alert("Train schedule management selected.");
}

function manageFare() {
    let fare = prompt("Enter new base fare:");

    if (fare !== null && fare.trim() !== "" && Number(fare) >= 0) {
        alert("Base fare updated to ₹" + Number(fare) + " (demo only).");
    }
}

function manageUsers() {
    alert("User management selected.");
}

function updateSeats() {
    alert("Seat availability management selected.");
}

function processRefund() {
    let pnr = prompt("Enter cancelled booking PNR:");

    let booking = bookings.find(function (item) {
        return item.pnr === pnr && item.status === "Cancelled";
    });

    if (booking) {
        alert("Refund processing selected for PNR " + pnr + ".");
    } else {
        alert("Cancelled booking not found.");
    }
}

function generateReport() {
    let confirmed = bookings.filter(function (item) {
        return item.status === "Confirmed";
    }).length;

    let cancelled = bookings.filter(function (item) {
        return item.status === "Cancelled";
    }).length;

    alert(
        "Reservation Report\n" +
        "Total bookings: " + bookings.length + "\n" +
        "Confirmed: " + confirmed + "\n" +
        "Cancelled: " + cancelled
    );
}
