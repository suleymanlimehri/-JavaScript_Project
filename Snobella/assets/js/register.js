document.addEventListener("DOMContentLoaded", () => {
    let form = document.querySelector("form");
    let name = document.querySelector("#name");
    let username = document.querySelector("#username");
    let email = document.querySelector("#email");
    let password = document.querySelector("#password");
    let confirmpassword = document.querySelector("#confirmpassword");

    let users = JSON.parse(localStorage.getItem("users")) || [];

    form.addEventListener("submit", submit);

    function submit(e) {
        e.preventDefault();
        let uniqueUser = users.some(
            (item) => item.username === username.value || item.email === email.value
        );
        if (uniqueUser) {
            toast("Bu istifadəçi adı və ya e-poçt artıq mövcuddur.");
            return;
        }
        let usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
        if (!usernameRegex.test(username.value)) {
            toast("İstifadəçi adı minimum 3, maksimum 20 simvol olmalıdır.");
            return;
        }
        let emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email.value)) {
            toast("Zəhmət olmasa düzgün e-poçt daxil edin.");
            return;
        }
        let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%&]).{8,}$/;
        if (!passwordRegex.test(password.value)) {
            toast("Şifrə minimum 8 simvol, 1 böyük hərf, 1 kiçik hərf, 1 rəqəm və 1 xüsusi simvol içerməlidir.");
            let check1=document.querySelector(".check1")
            let check=document.querySelector(".check")
            check.style.display = "block";
            check.style.backgroundColor = "red";
            check1.style.display = "block";
            check1.style.backgroundColor = "red";
            return;
        } else {
            let check1=document.querySelector(".check1")
            let check=document.querySelector(".check")
            check.style.display = "block";
            check.style.backgroundColor = "green";
            check1.style.display = "block";
            check1.style.backgroundColor = "green";

        }
        if (password.value !== confirmpassword.value) {
            toast("Şifrələr uyğun deyil.");
            return;
        }
        id=uuidv4()
        let newUser = {
            name: name.value,
            username: username.value,
            email: email.value,
            password: password.value,
            isLogined: false,
            id,
            wishlist: [],
            quantity:0,
            basket:[],
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        toast("Qeydiyyat uğurla tamamlandı!");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    }

    let toast = (text) => {
        Toastify({
            text: text,
            duration: 3000,
            position: "right",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
    };
});