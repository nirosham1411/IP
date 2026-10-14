let selectedBus = "";
let selectedSeats = [];

let bookedSeats = [3, 6, 10, 14];

function searchBuses(event) {
    event.preventDefault();

    let from = document.getElementById("from").value.toLowerCase();
    let to = document.getElementById("to").value.toLowerCase();

    let rows = document.querySelectorAll("#busList tr");
    let found = 0;

    rows.forEach(function (row) {
        let source = row.cells[2].textContent.toLowerCase();
        let destination = row.cells[3].textContent.toLowerCase();

        if (source.includes(from) && destination.includes(to)) {
            row.style.display = "";
            found++;
        } else {
            row.style.display = "none";
        }
    });

    alert(found + " bus(es) found.");
}

function selectBus(bus) {
    selectedBus = bus;
    selectedSeats = [];

    document.getElementById("selectedBus").textContent =
        "Selected Bus: " + bus;

    document.getElementById("seatNumbers").textContent = "None";

    let seatList = document.getElementById("seatList");
    seatList.innerHTML = "";

    for (let i = 1; i <= 16; i++) {
        let button = document.createElement("button");

        button.textContent = i;
        button.className = "seat";

        if (bookedSeats.includes(i)) {
            button.classList.add("booked");
            button.disabled = true;
        }

        button.onclick = function () {
            if (selectedSeats.includes(i)) {
                selectedSeats = selectedSeats.filter(
                    seat => seat !== i
                );
                button.classList.remove("selected");
            } else {
                selectedSeats.push(i);
                button.classList.add("selected");
            }

            document.getElementById("seatNumbers").textContent =
                selectedSeats.length ? selectedSeats.join(", ") : "None";
        };

        seatList.appendChild(button);
    }

    document.getElementById("seats").scrollIntoView();
}

function bookTicket(event) {
    event.preventDefault();

    if (!selectedBus) {
        alert("Please select a bus first.");
        return;
    }

    if (selectedSeats.length === 0) {
        alert("Please select at least one seat.");
        return;
    }

    let name = document.getElementById("passengerName").value;
    let email = document.getElementById("passengerEmail").value;
    let date = document.getElementById("date").value;

    let history = document.getElementById("bookingHistory");
    let row = history.insertRow();

    row.insertCell(0).textContent = "BK" + (history.rows.length + 100);
    row.insertCell(1).textContent = selectedBus;
    row.insertCell(2).textContent = document.getElementById("from").value;
    row.insertCell(3).textContent = document.getElementById("to").value;
    row.insertCell(4).textContent = date || "Not selected";
    row.insertCell(5).textContent = selectedSeats.join(", ");
    row.insertCell(6).textContent = "Confirmed";

    let action = row.insertCell(7);
    let cancel = document.createElement("button");

    cancel.textContent = "Cancel";
    cancel.onclick = function () {
        cancelTicket(cancel);
    };

    action.appendChild(cancel);

    selectedSeats.forEach(seat => bookedSeats.push(seat));

    alert(
        "Booking successful!\n" +
        "Passenger: " + name + "\n" +
        "Email: " + email + "\n" +
        "Bus: " + selectedBus + "\n" +
        "Seats: " + selectedSeats.join(", ") +
        "\nConfirmation email would be sent."
    );

    selectedSeats = [];
    document.getElementById("seatNumbers").textContent = "None";
    document.getElementById("passenger").scrollIntoView();
}

function cancelTicket(button) {
    if (confirm("Do you want to cancel this ticket?")) {
        let row = button.closest("tr");
        row.cells[6].textContent = "Cancelled";
        button.disabled = true;
        button.textContent = "Cancelled";
        alert("Ticket cancelled successfully.");
    }
}

function login(event) {
    event.preventDefault();
    alert("Login successful! (Demo only)");
}

function registerUser(event) {
    event.preventDefault();
    alert("Registration successful! (Demo only)");
}

function postComment(event) {
    event.preventDefault();

    let text = document.getElementById("commentText").value;
    let comment = document.createElement("p");

    comment.textContent = "User: " + text;

    document.getElementById("commentList").appendChild(comment);
    document.getElementById("commentText").value = "";
}

function addBus() {
    let name = prompt("Enter bus name:");
    let category = prompt("Enter bus category:");
    let from = prompt("Enter source:");
    let to = prompt("Enter destination:");
    let time = prompt("Enter departure time:");
    let fare = prompt("Enter fare:");
    let seats = prompt("Enter available seats:");

    if (!name || !category || !from || !to || !time || !fare || !seats) {
        alert("Please enter all bus details.");
        return;
    }

    let row = document.getElementById("busList").insertRow();

    [name, category, from, to, time, "₹" + fare, seats].forEach(
        value => row.insertCell().textContent = value
    );

    let action = row.insertCell();
    let button = document.createElement("button");

    button.textContent = "View Seats";
    button.onclick = function () {
        selectBus(name);
    };

    action.appendChild(button);
    alert("Bus added successfully.");
}

function updateBus() {
    alert("Admin can update bus details here. (Demo)");
}

function manageCategory() {
    let category = prompt("Enter new bus category:");
    if (category) {
        alert("Category added: " + category);
    }
}

function manageUsers() {
    alert("User management selected. (Demo)");
}

function manageNews() {
    let news = prompt("Enter news or announcement:");
    if (news) {
        alert("News added: " + news);
    }
}

function manageComments() {
    alert("Comment management selected. (Demo)");
}

function generateReport() {
    let rows = document.querySelectorAll("#bookingHistory tr");
    let total = 0;
    let cancelled = 0;

    rows.forEach(function (row, index) {
        if (index > 0) {
            if (row.cells[6].textContent === "Cancelled") {
                cancelled++;
            } else {
                total++;
            }
        }
    });

    alert(
        "Booking Report\n" +
        "Total active bookings: " + total + "\n" +
        "Cancelled bookings: " + cancelled
    );
}
