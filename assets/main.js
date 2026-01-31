// Basic year + lightweight click tracking hook point (optional)
document.getElementById("year").textContent = new Date().getFullYear();

// If you later add Cloudflare Web Analytics or PostHog etc, this makes it easy to wire in.
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-track]");
  if (!el) return;
  // console.log("track:", el.getAttribute("data-track"));
});
