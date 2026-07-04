// Store the selector for the navigation element in a variable
const navbutton = document.getElementById('ham-btn');
const navlinks = document.querySelector('#nav-bar');

// Toggle the show class off and on when the button is clicked
  navbutton.addEventListener('click', () => {
    navbutton.classList.toggle('show');
    navlinks.classList.toggle('show');
  });


