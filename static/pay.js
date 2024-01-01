function pay(){
const name=document.getElementById("name").value;
const email=document.getElementById("email").value; 
const address=document.getElementById("address").value;
const city=document.getElementById("city").value;
const state=document.getElementById("state").value;
const zipcode=document.getElementById("zipcode").value;
const cardname=document.getElementById("cardname").value;
const cardnumber=document.getElementById("cardnumber").value;
const expmonth=document.getElementById("expmonth").value;
const expyear=document.getElementById("expyear").value;
const CVV=document.getElementById("CVV").value;

payment_data={
    name:name,
    email:email,
    address:address,
    city:city,
    state:state,
    zipcode:parseInt(zipcode),
    cardname:cardname,
    cardnumber:parseInt(cardnumber),
    expmonth:parseInt(expmonth),
    expyear:parseInt(expyear),
    CVV:parseInt(CVV)
}
console.log(payment_data)

fetch("/payment/", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(payment_data)
})
.then(response => response.json())
.then(data => {
    console.log(data)
    // Display a message to the user
    const resp2=data.message;
    console.log(resp2);
    if (resp2==1){
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