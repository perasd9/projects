let session = new Session();
session = session.getSession();

if(session !== "")
    window.location.href = "hexa.html";
else
    ;


let registrationButton = document.querySelector("#registracija");
let customModal = document.querySelector(".custom-modal");
let closeButton = document.querySelector(".close-modal");


registrationButton.addEventListener("click", ()=>{
    customModal.style.display = "block";
});

closeButton.addEventListener("click", ()=>{
    customModal.style.display = "none";
});

let config = {
    "korisnicko_ime" : {
        required: true,
        minlength: 5,
        maxlength: 50
    },
    "email": {
        required: true,
        email: true,
        minlength: 5,
        maxlength: 50
    },
    "lozinka": {
        required:true,
        minlength: 7,
        maxlength: 50,
        matching: "ponovi_lozinku"
    },
    "ponovi_lozinku":{
        required: true,
        minlength: 7,
        maxlength: 50,
        matching: "lozinka"
    }
};

let validator = new Validator(config, "#registration-form");

document.querySelector("#registration-form").addEventListener("submit", (event) =>{
    event.preventDefault();

    if(validator.validationPassed()){
        let user = new User();

        user.username = document.querySelector("#korisnicko_ime").value;
        user.email = document.querySelector("#email").value;
        user.password = document.querySelector("#lozinka").value;
        
        user.create();

    }
});

document.querySelector("#login-form").addEventListener("submit", event =>{
    event.preventDefault();

    let email = document.querySelector("#login-email").value;
    let password = document.querySelector("#login-password").value;

    let user = new User();

    user.email = email;
    user.password = password;

    user.login();
});

