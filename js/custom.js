// Ensure the PWA prompt and other functionalities are initialized on every page load
window.addEventListener('load', () => {
    registerServiceWorker();
    setupPwaInstallation();
    setupGoogleAnalytics();
});

// Function to register the service worker for the entire site
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/service-worker.js') // Service worker at root to cover all pages
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    } else {
        console.warn('Service Worker is not supported in this browser.');
    }
}

// Function to set up the PWA installation prompt
function setupPwaInstallation() {
    let deferredPrompt; // Store the beforeinstallprompt event globally
    const isPwaInstalled = localStorage.getItem('pwaInstalled');

    if (!isPwaInstalled) {
        // Add the PWA installation popup HTML
        const popupHTML = `
            <div id="pwa-popup" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.8); color: #333; z-index: 1000; display: flex; align-items: center; justify-content: center;">
                <div style="padding: 20px; background: #f5f5f5; border-radius: 15px; width: 90%; max-width: 400px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); text-align: center;">
                    <h2 style="font-size: 20px; margin-bottom: 10px;">Install Our App!</h2>
                    <p style="font-size: 16px; margin-bottom: 20px;">Enjoy faster access and a seamless experience.</p>
                    <button id="install-button" style="padding: 10px 20px; font-size: 16px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 5px;">Add to Home Screen</button>
                    <button id="close-popup" style="padding: 10px 20px; font-size: 16px; cursor: pointer; background: transparent; color: #888; border: none; margin-top: 10px;">Not Now</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', popupHTML);

        const popup = document.getElementById('pwa-popup');
        const installButton = document.getElementById('install-button');
        const closePopupButton = document.getElementById('close-popup');

        // Listen for the beforeinstallprompt event on every page
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault(); // Prevent the default prompt
            deferredPrompt = e; // Save the event for later use
            popup.style.display = 'flex'; // Show the popup
            console.log('beforeinstallprompt event triggered');
        });

        // Handle install button click
        installButton.addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt(); // Show the install prompt

                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the PWA installation.');
                        localStorage.setItem('pwaInstalled', 'true');
                    } else {
                        console.log('User dismissed the PWA installation.');
                    }
                    deferredPrompt = null;
                    popup.style.display = 'none'; // Hide the popup
                });
            }
        });

        // Close the popup
        closePopupButton.addEventListener('click', () => {
            popup.style.display = 'none'; // Hide the popup
            console.log('PWA popup closed.');
        });

        // Listen for the appinstalled event to track successful installations
        window.addEventListener('appinstalled', () => {
            console.log('PWA installed successfully.');
            localStorage.setItem('pwaInstalled', 'true'); // Mark as installed
            popup.style.display = 'none';
        });
    } else {
        console.log('PWA is already installed.');
    }
}

// Function to set up Google Analytics tracking
function setupGoogleAnalytics() {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-5R231DMLB7';
    document.head.appendChild(script);

    script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-5R231DMLB7');
        console.log('Google Analytics initialized.');
    };
}
