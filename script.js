const filterButtons = document.querySelectorAll(".filter-btn");
const deploymentSites = document.querySelectorAll(".deployment-site");

const searchInput = document.getElementById("site-search");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");

let activeFilter = "all";

function updateDeployments() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    let visibleSites = 0;

    deploymentSites.forEach((site) => {
        const siteStatus = site.getAttribute("data-status");
        const searchData = site.getAttribute("data-search").toLowerCase();

        const matchesFilter =
            activeFilter === "all" || siteStatus === activeFilter;

        const matchesSearch =
            searchData.includes(searchTerm);

        if (matchesFilter && matchesSearch) {
            site.style.display = "block";
            visibleSites++;
        } else {
            site.style.display = "none";
        }
    });

    if (visibleSites === 1) {
        resultCount.textContent = "Showing 1 site";
    } else {
        resultCount.textContent = `Showing ${visibleSites} sites`;
    }

    if (visibleSites === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {

        activeFilter = button.getAttribute("data-filter");

        filterButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        updateDeployments();
    });
});

searchInput.addEventListener("input", updateDeployments);