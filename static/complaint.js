const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');
        const container = document.getElementById('container');
        
        signUpButton.addEventListener('click', () => {
            container.classList.add("right-panel-active");
        });
        
        signInButton.addEventListener('click', () => {
            container.classList.remove("right-panel-active");
        });

// Get the anchor tag by its id
var emailLink = document.getElementById("emailLink");


// Add click event listener to the anchor tag
emailLink.addEventListener("click", function(event) {
    // Prevent the default behavior of the anchor tag
    event.preventDefault();

    // Get the email address from your user data (replace this with your actual data retrieval logic)
    var emailAddress = "njmeenakshi.csbs2022@citchennai.com"; // Replace this with the user's email address
    var subjectInput=encodeURIComponent(document.getElementById("subject").value);
    var bodyInput=encodeURIComponent(document.getElementById("body").value);

    var mailto_url=`mailto:${emailAddress}?subject=${subjectInput}&body=${bodyInput}`;
    window.location.href=mailto_url;
});