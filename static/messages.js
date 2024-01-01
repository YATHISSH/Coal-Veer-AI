async function fetchData() {
    try {
        const response = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        console.log("Success")
        if(data.message==1){
            document.getElementById("login").style.display = "none";
            document.getElementsById("bot-response").innerHTML="Hi "+ data.username +" 👋 I am an AI Coal Veer.\nHow can I help you today?";
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


let timeoutId;

    function handleInput() {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(function() {
            const inputValue = document.getElementById('message').value;
            
            
            if (inputValue.trim() !== '') {
                //console.log('Input value after idle time:', inputValue);
                var newText=document.getElementById("message").value;
            fetch('/process_text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: newText }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from FastAPI:', data);
            document.getElementById("message").value=data.processed_text+" ";
        })
        .catch(error => {
            console.error('Error sending data to FastAPI:', error);
        });
            }
        }, 3000);
    }

    document.getElementById('message').addEventListener('input', handleInput);

function sendlang(language){
    fetch("/lang-selection/",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({lang:language})
    })
        .then(response=>response.json())
        .then(data =>{
            console.log(data);
        })
        .catch(error=>{
            console.error("Error sending selected laguage",error)
        })
    
}