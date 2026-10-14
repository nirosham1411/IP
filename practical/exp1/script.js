function searchBooks() {
    let search = document.getElementById("searchBox").value.toLowerCase().trim();
    let books = document.querySelectorAll(".book");

    books.forEach(function (book) {
        let content = book.textContent.toLowerCase();
        if (content.includes(search)) {
            book.style.display = "";
        } else {
            book.style.display = "none";
        }
    });
}

// Borrow book
function borrowBook(bookName) {
    alert("You have requested to borrow: " + bookName);
}

// Login
function login(event) {
    event.preventDefault();

    let emailInput = document.getElementById("email");
    let passwordInput = document.getElementById("password");
    let email = emailInput.value.trim();
    let password = passwordInput.value.trim();

    if (email !== "" && password !== "") {
        alert("Login successful! Welcome, " + email);
        event.target.reset();
    } else {
        alert("Please enter email and password.");
    }
}

// Download material
function downloadMaterial(materialName) {
    let name = materialName || "Study material";
    alert(name + " download started.");
}

// Admin actions
function adminAction(actionName) {
    alert(actionName + " action selected.");
}

// Contact form
function contactForm(event) {
    event.preventDefault();
    alert("Your message has been sent successfully!");
    event.target.reset();
}

