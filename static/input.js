
const usernameInput = document.getElementById("s_uname");
const emailInput=document.getElementById("s_email");
const passwordInput = document.getElementById("s_pass");
const checkusernameInput=document.getElementById("l_uname");
const checkpasswordInput=document.getElementById("l_pas");

    function send1() {
        const username = usernameInput.value;
        const password = passwordInput.value;
        const email=emailInput.value;

        // Validate input if needed

        // Create a JSON object with the user data
        const userData = {
            "username": username,
            "password": password,
            "email": email
        };

        // Send a POST request to your FastAPI endpoint
        fetch("/signup/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            // Display a message to the user
            const resp2=data.message;
            console.log(resp2);
            if (resp2=="User registered successfully"){
                window.location.href="/";
            }
            else{
                alert(resp2)
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }
    function send2(){
        const username=checkusernameInput.value;
        const password=checkpasswordInput.value;

        const userData = {
            "username": username,
            "password": password
        };
        fetch("/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            // Display a message to the user
            const resp2=data.message
            console.log(resp2)
            if(resp2=="Login Successful"){
                window.location.href="/";
            }
            else{
                alert(resp2)
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });

    }