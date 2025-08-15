// sidebar toggle
body = document.getElementsByTagName("body")[0];
const navToggleBtnOpen = document.getElementById("sidebar-toggle-btn-open");
const navToggleBtnClose = document.getElementById("sidebar-toggle-btn-close");

navToggleBtnOpen && navToggleBtnOpen.addEventListener("click", () => {
  body.classList.add("sidebar-open-body");
});

navToggleBtnClose && navToggleBtnClose.addEventListener("click", () => {
  body.classList.remove("sidebar-open-body");
});