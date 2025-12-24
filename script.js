/**
 * GymBroze Master Script
 * Student Footprints: Updated with South African specific validation for 
 * Cape Town postcodes and phone number formats.
 */

// FOOTPRINT: Global User Database stored in LocalStorage to persist between pages.
let userDatabase = JSON.parse(localStorage.getItem('gymbroze_users')) || [];

document.addEventListener("DOMContentLoaded", () => {

    /* ============================================================
       1. REGISTRATION & LOGIN SYSTEM
       ============================================================ */
    
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");

    // LOGIC FOR SIGNIN.HTML (Registration)
        if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault(); 
            
            const email = document.getElementById("userEmail").value;
            const password = document.getElementById("userPassword").value;
            const phone = document.getElementById("userPhone").value.trim();
            const postcode = document.getElementById("postcode").value.trim();
            const age = document.getElementById("userAge").value;

            let isValid = true;

            const startsWithZero = phone.startsWith("0") && phone.length === 10;
            const startsWithSA = phone.startsWith("+27") && phone.length === 12;

            if (!startsWithZero && !startsWithSA) {
                isValid = false;
                alert("Phone must be 10 digits starting with '0' OR '+27' followed by 9 digits.");
            }

            const pcInt = parseInt(postcode);
            if (isNaN(pcInt) || pcInt < 7400 || pcInt > 8099 || postcode.length !== 4) {
                isValid = false;
                alert("Postcode must be 4 digits between 7400 and 8099.");
            }

            if (age < 18 || age > 45) {
                isValid = false;
                alert("Age must be between 18-45.");
            }

            if (isValid && email && password) {
                userDatabase.push({ 
                    email: email, 
                    password: password,
                    phone: phone,
                    postcode: postcode 
                });
                localStorage.setItem('gymbroze_users', JSON.stringify(userDatabase));
                alert("Registration Successful!");
                window.location.href = "login.html";
            }
        });
    }

    // LOGIC FOR LOGIN.HTML (Verification)
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;

            const userFound = userDatabase.find(user => user.email === email && user.password === password);

            if (userFound) {
                alert("Welcome back! Let's smash those goals.");
                window.location.href = "index.html";
            } else {
                alert("Details not found. Check your info or Register first!");
            }
        });
    }

    /* ============================================================
       2. LANDING PAGE ONLY: SLIDESHOW & MODAL
       ============================================================ */
    
    const trainerContainer = document.getElementById("trainer-slideshow-container");

    if (trainerContainer) {
        const modal = document.getElementById("trainer-modal");
        const modalBody = document.getElementById("modal-body");
        const closeBtn = document.querySelector(".close-modal");
        const trainerWrappers = document.querySelectorAll(".trainer-card-wrapper");

        let currentIndex = 0;

        const showTrainers = () => {
            trainerWrappers.forEach(tw => tw.style.display = 'none');
            for (let i = 0; i < 3; i++) {
                let indexToShow = (currentIndex + i) % trainerWrappers.length;
                if (trainerWrappers[indexToShow]) {
                    trainerWrappers[indexToShow].style.display = 'block';
                    trainerWrappers[indexToShow].classList.add('fade-in');
                }
            }
            currentIndex = (currentIndex + 1) % trainerWrappers.length;
        };

        setInterval(showTrainers, 5000);
        showTrainers();

        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                modalBody.innerHTML = card.innerHTML;
                modal.style.display = "block";
                document.body.classList.add("modal-active");
            });
        });

        const closeModal = () => {
            modal.style.display = "none";
            document.body.classList.remove("modal-active");
        };

        if (closeBtn) closeBtn.onclick = closeModal;

        window.addEventListener('click', (event) => {
            if (modal.style.display === "block" && !modal.contains(event.target)) {
                closeModal();
            }
        });
    }

    /* ============================================================
       3. SMOOTH SCROLL (Universal)
       ============================================================ */
    const trainerLink = document.querySelector('a[href="#trainers-anchor"]');
    if (trainerLink) {
        trainerLink.addEventListener('click', function(e) {
            const targetSection = document.querySelector('#trainers-anchor');
            if (targetSection) {
                e.preventDefault();
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});