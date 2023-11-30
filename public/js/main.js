const menuBtn = document.getElementById("menuBtn");
const links = document.getElementById("links");
let flashBox = document.getElementById("flash");
let cancelFlashBtn = document.getElementById("cancelFlash");
let main = document.getElementById("main");

menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    main.classList.toggle("active");
    links.classList.toggle("active");
});
if (cancelFlashBtn)
    cancelFlashBtn.addEventListener("click", () => {
        flashBox.style.display = "none";
    });

let fileInput = document.getElementById("file-upload-input");
let fileSelect = document.getElementById("file-select");

if (fileSelect)
    fileSelect.addEventListener("click", () => {
        fileInput.click();
    });
if (fileInput)
    fileInput.onchange = function () {
        let filename = fileInput.files.length;
        let selectName = document.getElementsByClassName("file-select-name")[0];
        selectName.innerText = `${filename} Files Chosen`;
    };
// --------------------

const sumMenuBtn = document.getElementById("subBtn");
sumMenuBtn.addEventListener("click", () => {
    document.getElementById("subLinks").classList.toggle("active");
    document.getElementById("downIcon").classList.toggle("active");
});

const mainLinks = document.querySelectorAll(".links li a");

mainLinks.forEach((a) => {
    if (a.href === location.href) a.classList.add("active");
});
