// (function () {
//   console.log("🌸 injected.js RUNNING (XHR + FETCH)");

//   // --- INTERCEPT XHR ---
//   const originalOpen = XMLHttpRequest.prototype.open;
//   const originalSend = XMLHttpRequest.prototype.send;

//   XMLHttpRequest.prototype.open = function (method, url) {
//     this._url = url;
//     return originalOpen.apply(this, arguments);
//   };

//   XMLHttpRequest.prototype.send = function () {
//     this.addEventListener("load", function () {
//       handleResponse(this._url, this.responseText);
//     });

//     return originalSend.apply(this, arguments);
//   };

//   // --- INTERCEPT FETCH ---
//   const originalFetch = window.fetch;

//   window.fetch = async function (...args) {
//     const response = await originalFetch.apply(this, args);

//     try {
//       const url = args[0];

//       const clone = response.clone();
//       const text = await clone.text();

//       handleResponse(url, text);
//     } catch (e) {
//       console.log("❌ fetch intercept error", e);
//     }

//     return response;
//   };

//   // --- SHARED HANDLER ---
//   function handleResponse(url, text) {
//     try {
//       if (typeof url !== "string") return;

//       if (!url.includes("/graphql/")) return;

//       console.log("🔥 intercepted:", url);

//       let data;
//       try {
//         data = JSON.parse(text);
//       } catch {
//         return;
//       }

//       function extractUsers(obj) {
//         const results = [];

//         function walk(o) {
//           if (!o || typeof o !== "object") return;

//           if (o.__typename === "User") {
//             const handle = o?.core?.screen_name;
//             const location = o?.location?.location;
//             const description = o?.legacy?.description;

//             console.log("👤 USER:", handle);
//             console.log("📍 location:", location);

//             if (handle) {
//               results.push({
//                 screen_name: handle,
//                 location: location || "",
//                 description: description || ""
//               });
//             }
//           }

//           for (const key in o) {
//             walk(o[key]);
//           }
//         }

//         walk(obj);
//         return results;
//       }

//       const users = extractUsers(data);

//       console.log("🧠 users found:", users.length);

//       users.forEach(user => {
//         window.postMessage({
//           type: "X_USER_LOCATION",
//           handle: user.screen_name,
//           location: user.location,
//           description: user.description
//         }, "*");
//       });

//     } catch (e) {
//       console.log("❌ handler error", e);
//     }
//   }
// })();