document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let username = document.getElementById("username").value;
    let usernameError = document.getElementById("usernameError");
    let password = document.getElementById("password").value;
    let passwordError = document.getElementById("passwordError");
    let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    
    if (username.length < 15) {
        usernameError.style.display = "block";
    } else {
        usernameError.style.display = "none";
    }

    if (!passwordPattern.test(password)) {
        passwordError.style.display = "block";
    } else {
        passwordError.style.display = "none";
    }

    if (username.length >= 15 && passwordPattern.test(password)) {
        alert("Login successful");
        window.location.href = "index.html";
    }
});
