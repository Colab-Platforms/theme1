// how-to-play.js - JavaScript functionality for the How To Play page

document.addEventListener('DOMContentLoaded', function() {
    console.log('How To Play page DOM loaded, initializing...');
    
    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Profile menu toggle functionality
    setupProfileMenuToggle();

    // Back to top functionality
    setupBackToTop();

    // Handle sidemenu toggle
    setupSidemenuToggle();
    
    // Add explicit event handler for close button
    const closeButton = document.querySelector('.closeButton');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            console.log('Close button clicked');
            closeSidemenu();
        });
    }
    
    console.log('How To Play page initialized successfully');
});

// Get current user data from localStorage
function getCurrentUser() {
    try {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const user = JSON.parse(userData);
            return {
                ...user,
                isLoggedIn: true
            };
        }
    } catch (error) {
        console.error('Error getting current user:', error);
    }
    return { isLoggedIn: false };
}

// Set up profile menu toggle
function setupProfileMenuToggle() {
    const sideMenuTogglers = document.querySelectorAll('.sideMenuToggler');
    const sidemenuWrapper = document.getElementById('sidemenuWrapper');
    
    if (sideMenuTogglers.length > 0 && sidemenuWrapper) {
        sideMenuTogglers.forEach(toggler => {
            toggler.addEventListener('click', function() {
                console.log('Sidemenu toggler clicked in how-to-play.js');
                sidemenuWrapper.classList.toggle('show');
                document.body.classList.toggle('sidemenu-open');
                
                // Force the sidemenu to show if it's not showing after toggle
                if (!sidemenuWrapper.classList.contains('show')) {
                    sidemenuWrapper.classList.add('show');
                    document.body.classList.add('sidemenu-open');
                    console.log('Force-showing sidemenu');
                }
            });
        });
    } else {
        console.log('Profile menu elements not found', {
            togglers: sideMenuTogglers ? sideMenuTogglers.length : 0,
            wrapper: sidemenuWrapper ? 'found' : 'not found'
        });
    }
}

// Close sidemenu
function closeSidemenu() {
    console.log('Closing sidemenu from how-to-play.js');
    const sidemenuWrapper = document.getElementById('sidemenuWrapper');
    if (sidemenuWrapper) {
        sidemenuWrapper.classList.remove('show');
        document.body.classList.remove('sidemenu-open');
        console.log('Sidemenu closed successfully');
    } else {
        console.error('Sidemenu wrapper not found when trying to close');
    }
}

// Set up back to top functionality
function setupBackToTop() {
    const backToTop = document.getElementById('backToTop');
    const progressPercentage = document.getElementById('progressPercentage');
    
    window.addEventListener('scroll', function() {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (progressPercentage) {
            progressPercentage.textContent = Math.round(scrolled) + '%';
        }
        
        if (backToTop) {
            if (window.scrollY > 300) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Set up sidemenu toggle
function setupSidemenuToggle() {
    const profileMenuOptions = document.getElementById('profileMenuOptions');
    const currentUser = getCurrentUser();

    // Log debug info
    console.log('Setting up sidemenu toggle', {
        profileMenuOptions: profileMenuOptions ? 'found' : 'not found',
        currentUser: currentUser
    });

    // Check if user is logged in
    if (currentUser && currentUser.isLoggedIn) {
        // Show profile menu options
        if (profileMenuOptions) {
            profileMenuOptions.style.display = 'block';
        }
        
        // Hide login/signup forms if they exist
        const loginFormSide = document.getElementById('loginFormSide');
        const signupFormSide = document.getElementById('signupFormSide');
        
        if (loginFormSide) loginFormSide.style.display = 'none';
        if (signupFormSide) signupFormSide.style.display = 'none';
        
        // Show logged in state
        const loggedInState = document.getElementById('loggedInState');
        if (loggedInState) {
            loggedInState.style.display = 'block';
            const sideUserName = document.getElementById('sideUserName');
            const sideUserEmail = document.getElementById('sideUserEmail');
            
            if (sideUserName) sideUserName.textContent = `Welcome ${currentUser.name}`;
            if (sideUserEmail) sideUserEmail.textContent = currentUser.email;
        }
    }
}
