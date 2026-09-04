const filterButtons = document.querySelectorAll(".filter-btn");
const deploymentSites = document.querySelectorAll(".deployment-site");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedFilter = button.getAttribute("data-filter");

        filterButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        deploymentSites.forEach((site) => {
            const siteStatus = site.getAttribute("data-status");

            if (selectedFilter === "all" || siteStatus === selectedFilter) {
                site.style.display = "block";
            } else {
                site.style.display = "none";
            }
        });
    });
});