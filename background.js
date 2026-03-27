// background.js - X Styler Engine
console.log("🛠️ Service Worker: Reglas de desbloqueo de seguridad activas.");

const RULE_ID = 1;

/**
 * This rule intercepts all requests made from an IFRAME 
 * towards x.com and removes the security headers that prevent reading 
 * from the content from our script (index.js).
 */
chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: [RULE_ID],
  addRules: [
    {
      id: RULE_ID,
      priority: 1,
      action: {
        type: "modifyHeaders",
        responseHeaders: [
          // We removed the restriction that prevents the page from being an "iframe"
          { header: "x-frame-options", operation: "remove" },
          // We removed the security policy that restricts cross-frame access
          { header: "content-security-policy", operation: "remove" },
          // Forzamos que se permita el acceso desde el origen actual
          { header: "access-control-allow-origin", operation: "set", value: "*" }
        ]
      },
      condition: {
        // We only apply this to x.com so as not to compromise security on other sites
        urlFilter: "x.com/*",
        // We only make modifications when the resource is loaded as a subframe (iframe).
        resourceTypes: ["sub_frame"]
      }
    }
  ]
}, () => {
  if (chrome.runtime.lastError) {
    console.error("❌ Error al cargar las reglas:", chrome.runtime.lastError);
  } else {
    console.log("✅ Dynamic Network Rules successfully applied.");
  }
});

// Debug listener: alerts us when the content script (index.js) sends something
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "DEBUG_LOG") {
        console.log("📢 Message from page:", message.data);
    }
});