let selectedFlight = null;
let passenger = null;
let tickets = [];
let pnrCounter = 100001;

function searchFlights(event) {
    event.preventDefault();

    let source = document.getElementById("source").value.toLowerCase();
    let destination = document.getElementById("destination").value.toLowerCase();
    let rows = document.querySelectorAll("#flightList tr");
    let count = 0;

    rows.forEach(function (row) {
        let match = row.cells[2].textContent.toLowerCase().includes(source) &&
            row.cells[3].textContent.toLowerCase().includes(destination);

        row.style.display = match ? "" : "none";

        if (match) count++;
    });

    alert(count + " flight(s) found.");
}

function selectFlight(number, airline, fare) {
    selectedFlight = {
        number: number,
        airline: airline,
        fare: fare,
        source: document.getElementById("source").value || "Chennai",
        destination: document.getElementById("destination").value || "Delhi",
        date: document.getElementById("travelDate").value
    };

    document.getElementById("selectedFlight").textContent =
        airline + " - " + number;

    document.getElementById("fare").textContent = fare;
    document.getElementById("paymentFare").textContent = fare;

    document.getElementById("booking").scrollIntoView();
}

function bookTicket(event) {
    event.preventDefault();

    if (!selectedFlight) {
        alert("Please select a flight first.");
        return;
    }

    passenger = {
        name: document.getElementById("passengerName").value,
        age: document.getElementById("passengerAge").value,
        gender: document.getElementById("gender").value,
        email: document.getElementById("passengerEmail").value,
        seat: document.getElementById("seatNumber").value
    };

    document.getElementById("payment").scrollIntoView();

    alert("Passenger details saved. Continue to payment.");
}

function makePayment(event) {
    event.preventDefault();

    if (!selectedFlight || !passenger) {
        alert("Please select a flight and enter passenger details.");
        return;
    }

    let ticket = {
        pnr: String(pnrCounter++),
        flight: selectedFlight.number,
        airline: selectedFlight.airline,
        passenger: passenger.name,
        source: selectedFlight.source,
        destination: selectedFlight.destination,
        date: selectedFlight.date,
        seat: passenger.seat,
        fare: selectedFlight.fare,
        status: "Confirmed"
    };

    tickets.push(ticket);
    addTicketRow(ticket);

    alert(
        "Payment successful!\n" +
        "Booking confirmed.\n" +
        "PNR: " + ticket.pnr +
        "\nConfirmation email would be sent to " + passenger.email
    );

    document.getElementById("tickets").scrollIntoView();
}

document.getElementById("payment").querySelector("form").addEventListener("submit", makePayment);

function addTicketRow(ticket) {
    let body = document.getElementById("ticketList");
    let row = body.insertRow();

    [
        ticket.pnr,
        ticket.flight,
        ticket.passenger,
        ticket.source,
        ticket.destination,
        ticket.date || "Not selected",
        ticket.seat,
        "₹" + ticket.fare,
        ticket.status
    ].forEach(function (value) {
        row.insertCell().textContent = value;
    });

    let action = row.insertCell();

    let printButton = document.createElement("button");
    printButton.textContent = "Print";
    printButton.onclick = function () {
        printTicket(ticket);
    };

    let cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.onclick = function () {
        cancelByPNR(ticket.pnr);
    };

    action.append(printButton, cancelButton);
}

function checkStatus(event) {
    event.preventDefault();

    let pnr = document.getElementById("pnrInput").value;
    let ticket = tickets.find(function (item) {
        return item.pnr === pnr;
    });

    document.getElementById("statusResult").textContent = ticket
        ? "Flight: " + ticket.flight + " | Status: " + ticket.status
        : "PNR not found.";
}

function cancelTicket(event) {
    event.preventDefault();

    cancelByPNR(document.getElementById("cancelPNR").value);
}

function cancelByPNR(pnr) {
    let ticket = tickets.find(function (item) {
        return item.pnr === pnr;
    });

    if (!ticket || ticket.status === "Cancelled") {
        alert("Ticket not found or already cancelled.");
        return;
    }

    if (confirm("Do you want to cancel this ticket?")) {
        ticket.status = "Cancelled";
        refreshTickets();
        alert("Ticket cancelled. Refund will be processed according to airline rules.");
    }
}

function refreshTickets() {
    document.getElementById("ticketList").innerHTML = "";
    tickets.forEach(addTicketRow);
}

function printTicket(ticket) {
    let page = window.open("", "_blank");

    page.document.write(
        "<h1>SkyWay Airlines E-Ticket</h1>" +
        "<p>PNR: " + ticket.pnr + "</p>" +
        "<p>Flight: " + ticket.flight + "</p>" +
        "<p>Passenger: " + ticket.passenger + "</p>" +
        "<p>From: " + ticket.source + "</p>" +
        "<p>To: " + ticket.destination + "</p>" +
        "<p>Date: " + (ticket.date || "Not selected") + "</p>" +
        "<p>Seat: " + ticket.seat + "</p>" +
        "<p>Fare: ₹" + ticket.fare + "</p>" +
        "<p>Status: " + ticket.status + "</p>"
    );

    page.document.close();
    page.print();
}

function login(event) {
    event.preventDefault();
    alert("Login successful. Demo only.");
}

function registerUser(event) {
    event.preventDefault();
    alert("Registration successful. Demo only.");
}

function forgotPassword(event) {
    event.preventDefault();
    alert("Password reset request submitted. Demo only.");
}

function submitFeedback(event) {
    event.preventDefault();

    let name = document.getElementById("feedbackName").value;
    let rating = document.getElementById("rating").value;
    let message = document.getElementById("feedbackText").value;

    let entry = document.createElement("p");
    entry.textContent = name + " - " + rating + ": " + message;

    document.getElementById("feedbackList").appendChild(entry);
    event.target.reset();

    alert("Feedback submitted successfully.");
}

function addFlight() {
    let number = prompt("Enter flight number:");
    let airline = prompt("Enter airline name:");
    let source = prompt("Enter source:");
    let destination = prompt("Enter destination:");
    let fare = Number(prompt("Enter fare:"));

    if (!number || !airline || !source || !destination || !fare || fare < 0) {
        alert("Please enter valid flight details.");
        return;
    }

    let row = document.getElementById("flightList").insertRow();

    [
        number,
        airline,
        source,
        destination,
        "10:00 AM",
        "01:00 PM",
        "Economy",
        "40",
        "₹" + fare
    ].forEach(function (value) {
        row.insertCell().textContent = value;
    });

    let action = row.insertCell();
    let button = document.createElement("button");

    button.textContent = "Book";
    button.onclick = function () {
        selectFlight(number, airline, fare);
    };

    action.appendChild(button);

    alert("Flight added successfully.");
}

function updateFlight() {
    alert("Flight update option selected. Demo only.");
}

function manageSeats() {
    alert("Seat availability management selected. Demo only.");
}

function manageUsers() {
    alert("User management selected. Demo only.");
}

function generateReport() {
    let confirmed = tickets.filter(function (ticket) {
        return ticket.status === "Confirmed";
    }).length;

    let cancelled = tickets.filter(function (ticket) {
        return ticket.status === "Cancelled";
    }).length;

    document.getElementById("report").textContent =
        "Total Tickets: " + tickets.length +
        " | Confirmed: " + confirmed +
        " | Cancelled: " + cancelled;
}
