console.log("🌸 In index.js")

// 💅🏻 Styling
const style = document.createElement("style");
style.innerHTML = `
  // body {
  //   background-color: hotpink !important;
  // }
  // [aria-label="Home timeline"] {
  //   background-color: #FD7094 !important;
  // }
  article {
    // border: 2px solid red !important;
  }  

  g {
    // color: #FFA8EB !important;
  }
`;

document.head.appendChild(style);

// 📝 Logging user names

const seenUsers = new Set();

const observer = new MutationObserver(() => {
  const elements = document.querySelectorAll('[data-testid="User-Name"]');

  elements.forEach(el => {
    // find the span that contains the handle (starts with @)
    const handleEl = Array.from(el.querySelectorAll("span"))
      .find(span => span.innerText.startsWith("@"));

    const nameEl = el.querySelector('div[dir="ltr"] span');

    const handle = handleEl?.innerText;
    const name = nameEl?.innerText;

    if (handle && !seenUsers.has(handle)) {
      seenUsers.add(handle);

      console.log({
        name,
        handle
      });
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});