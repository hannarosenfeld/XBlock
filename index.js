// index.js - X Styler
console.log("🌸 X Styler: Sistema de filtrado por ubicación activo");

// 1. Initial style settings
const style = document.createElement('style');
style.innerHTML = `
    /* Opcional: añade un borde sutil a los posts procesados para debug */
    /* article[data-testid="tweet"] { border-left: 2px solid #1da1f2; } */
`;
document.head.appendChild(style);

// 2. Create the invisible iframe (our "secret browser")
const hiddenFrame = document.createElement('iframe');
hiddenFrame.style.display = 'none';
hiddenFrame.id = 'x-styler-proxy';
document.body.appendChild(hiddenFrame);

const seenUsers = new Set();
let isProcessing = false;
const queue = [];

// 3. Main function to verify location
async function processQueue() {
    if (isProcessing || queue.length === 0) return;
    
    isProcessing = true;
    const { url, element } = queue.shift();

    hiddenFrame.src = url;

    let attempts = 0;
    const maxAttempts = 15; // Try for a maximum of 15 seconds per profile.

    const checkInterval = setInterval(() => {
        attempts++;
        try {
            const frameDoc = hiddenFrame.contentDocument || hiddenFrame.contentWindow.document;
            if (!frameDoc) return;

            // We are looking for the element that contains the location
const pivot = Array.from(frameDoc.querySelectorAll('[data-testid="pivot"]'))
                               .find(el => el.innerText.includes("Account based in") || 
                                          el.innerText.includes("Cuenta ubicada en"));

            if (pivot) {
                clearInterval(checkInterval);
                const spans = pivot.querySelectorAll("span");
                const country = spans[1]?.textContent.trim();
                
                console.log(`🌍 Perfil: ${url} | Ubicación: ${country}`);

                if (country === "Pakistan" || country === "Pakistán") {
                    element.style.transition = "opacity 0.5s";
                    element.style.opacity = "0";
                    setTimeout(() => { element.style.display = "none"; }, 500);
                    console.log("🚫 Post ocultado: Origen Pakistán.");
                }

                isProcessing = false;
                processQueue(); // Process the next one in the queue
            }
        } catch (e) {
            // Security or loading error, we'll wait for the next attempt
        }

        if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            isProcessing = false;
            processQueue();
        }
    }, 1000);
}

// 4. Observer to detect new tweets while scrolling
const observer = new MutationObserver(() => {
    const posts = document.querySelectorAll('article[data-testid="tweet"]');

    posts.forEach(post => {
        const userEl = post.querySelector('[data-testid="User-Name"]');
        if (!userEl) return;

        // Extract the handle (@user)
        const handleEl = Array.from(userEl.querySelectorAll("span"))
                              .find(span => span.textContent.trim().startsWith("@"));
        
        if (handleEl) {
            const handle = handleEl.textContent.trim();
            
            if (!seenUsers.has(handle)) {
                seenUsers.add(handle);
                const username = handle.slice(1);
                const aboutUrl = `x.com/${username}/about`;

                // We add it to the processing queue
                queue.push({ url: aboutUrl, element: post });
                processQueue();
            }
        }
    });
});

// 5. Start the observation of the DOM
observer.observe(document.body, { 
    childList: true, 
    subtree: true 
});