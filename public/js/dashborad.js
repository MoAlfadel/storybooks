let storiesBoxes = document.querySelectorAll(".stories-box");
let followBoxes = document.querySelectorAll(".follow-box");
let storiesFilters = document.querySelectorAll(".stories-container .filter li");
let followFilters = document.querySelectorAll(
    ".followers-container .filter li"
);
let mainFilters = document.querySelectorAll(".main-filter li");
let mainContainers = document.querySelectorAll(".main-container");

console.log(mainFilters);
mainFilters.forEach((btn) => {
    btn.addEventListener("click", function () {
        mainFilters.forEach((btn) => btn.classList.remove("activeMainBtn"));
        this.classList.add("activeMainBtn");
        mainContainers.forEach((container) =>
            container.classList.remove("activeMainContainer")
        );
        document
            .getElementById(`${this.getAttribute("data-set")}`)
            .classList.add("activeMainContainer");
    });
});

storiesFilters.forEach((filterBtn) => {
    filterBtn.addEventListener("click", function () {
        storiesFilters.forEach((btn) => btn.classList.remove("activeBtn"));
        this.classList.add("activeBtn");
        storiesBoxes.forEach((box) => {
            box.classList.remove("activeBox");
        });

        document
            .getElementById(`${this.getAttribute("data-set")}`)
            .classList.add("activeBox");
    });
});
followFilters.forEach((filterBtn) => {
    filterBtn.addEventListener("click", function () {
        followFilters.forEach((btn) => btn.classList.remove("activeBtn"));
        this.classList.add("activeBtn");
        followBoxes.forEach((box) => {
            box.classList.remove("activeBox");
        });

        document
            .getElementById(`${this.getAttribute("data-set")}`)
            .classList.add("activeBox");
    });
});
