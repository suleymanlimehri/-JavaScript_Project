document.addEventListener("DOMContentLoaded",()=>{
    let users=JSON.parse(localStorage.getItem("users"))
    let form=document.querySelector("form")
    let username=document.querySelector("#username")
    let password=document.querySelector("#password")
    form.addEventListener("submit",login)

    function login(e){
        e.preventDefault()
        let isLoginuser=users.find((user)=>user.username==username.value && user.password ==password.value)

        // task1
        // Username ve ya Email - Düzgün formatda olmalıdır. 
        let usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
        if (!usernameRegex.test(username.value)) {
            toast("minimum 3 maximum 20 characters only alphabet numbers underscores can be hyphens");
            return;
        }

        // task2
        // Sifre - Minimum 8 simvol; müvafiq şifrə qaydalarına uyğun olmalıdır.

        let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%&]).{8,}$/;
        if (!passwordRegex.test(password.value) ) {
            toast("The password must be incorrect, at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and special characters.");
        }

        if(isLoginuser){
            isLoginuser.isLogined=true;
            localStorage.setItem("users",JSON.stringify(users))
            toast("user login succesfull")
            setTimeout(() => {
                window.location.href="index.html"
            }, 1000);
        } 
    }

    let toast=(text)=>{
        Toastify({
       text: `${text}`,
       duration: 3000,
       position: "right",
       stopOnFocus: true, 
       style: {
         background: "linear-gradient(to right,rgb(83, 253, 233),rgb(162, 255, 1))",
       },
       onClick: function(){}
     }).showToast();
    }
})