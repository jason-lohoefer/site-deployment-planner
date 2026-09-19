const filterButtons = document.querySelectorAll(".filter-btn");

const searchInput = document.getElementById("site-search");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");

const deploymentForm = document.getElementById("deployment-form");
const deploymentList = document.querySelector(".deployment-list");

let activeFilter = "all";

function getDeploymentSites() {
    return document.querySelectorAll(".deployment-site");
}

function updateDeployments() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const deploymentSites = getDeploymentSites();

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

    resultCount.textContent =
        visibleSites === 1
            ? "Showing 1 site"
            : `Showing ${visibleSites} sites`;

    emptyState.style.display =
        visibleSites === 0 ? "block" : "none";
}

function updateDashboardCounts() {
    const deploymentSites = getDeploymentSites();

    const counts = {
        total: deploymentSites.length,
        planned: 0,
        ready: 0,
        "in-progress": 0,
        completed: 0
    };

    deploymentSites.forEach((site) => {
        const status = site.getAttribute("data-status");

        if (counts[status] !== undefined) {
            counts[status]++;
        }
    });

    const statNumbers = document.querySelectorAll(".stat-number");

    if (statNumbers.length >= 4) {
        statNumbers[0].textContent = counts.total;
        statNumbers[1].textContent = counts.ready;
        statNumbers[2].textContent = counts["in-progress"];
        statNumbers[3].textContent = counts.completed;
    }

    const summaryNumbers =
        document.querySelectorAll(".summary-grid strong");

    if (summaryNumbers.length >= 4) {
        summaryNumbers[0].textContent = counts.planned;
        summaryNumbers[1].textContent = counts.ready;
        summaryNumbers[2].textContent = counts["in-progress"];
        summaryNumbers[3].textContent = counts.completed;
    }

    const summaryText =
        document.querySelector(".summary-copy > p:last-child");

    if (summaryText) {
        summaryText.textContent =
            `${counts.total} locations are being tracked during the current deployment cycle. ` +
            `${counts.completed} completed, ` +
            `${counts["in-progress"]} in progress, ` +
            `${counts.ready} ready, and ` +
            `${counts.planned} planned.`;
    }
}

function formatDate(dateValue) {
    const date = new Date(`${dateValue}T00:00:00`);

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function getStatusDetails(status) {
    const statusDetails = {
        planned: {
            label: "Planned",
            readiness: "Planning",
            progress: 25
        },

        ready: {
            label: "Ready",
            readiness: "Confirmed",
            progress: 70
        },

        "in-progress": {
            label: "In Progress",
            readiness: "On Site",
            progress: 85
        },

        completed: {
            label: "Completed",
            readiness: "Complete",
            progress: 100
        }
    };

    return statusDetails[status];
}

function createDeploymentCard(deployment) {
    const statusDetails =
        getStatusDetails(deployment.status);

    const newSite =
        document.createElement("article");

    newSite.className = "deployment-site";

    newSite.setAttribute(
        "data-status",
        deployment.status
    );

    newSite.setAttribute(
        "data-search",
        `${deployment.name} ${deployment.location}`.toLowerCase()
    );

    newSite.innerHTML = `
        <div class="card-top">
            <span class="site-code">
                ${deployment.siteCode}
            </span>

            <span class="status-badge ${deployment.status}">
                ${statusDetails.label}
            </span>
        </div>

        <h3>${deployment.name}</h3>

        <p class="location">
            ${deployment.location}
        </p>

        <div class="card-details">

            <div>
                <span>Deployment Date</span>
                <strong>
                    ${formatDate(deployment.date)}
                </strong>
            </div>

            <div>
                <span>Deployment Scope</span>
                <strong>
                    ${deployment.scope}
                </strong>
            </div>

            <div>
                <span>Devices</span>
                <strong>
                    ${deployment.devices}
                </strong>
            </div>

            <div>
                <span>Readiness</span>
                <strong>
                    ${statusDetails.readiness}
                </strong>
            </div>

        </div>

        <div class="progress-area">

            <div class="progress-heading">
                <span>Deployment progress</span>
                <strong>
                    ${statusDetails.progress}%
                </strong>
            </div>

            <div class="progress-track">
                <div
                    class="progress-fill"
                    style="
                        width: ${statusDetails.progress}%;
                        ${
                            deployment.status === "completed"
                                ? "background: var(--complete);"
                                : ""
                        }
                    "
                ></div>
            </div>

        </div>
    `;

    deploymentList.appendChild(newSite);

    return newSite;
}

function getSavedDeployments() {
    const saved =
        localStorage.getItem("siteDeployments");

    if (!saved) {
        return [];
    }

    try {
        return JSON.parse(saved);
    } catch (error) {
        return [];
    }
}

function saveDeployments(deployments) {
    localStorage.setItem(
        "siteDeployments",
        JSON.stringify(deployments)
    );
}

function loadSavedDeployments() {
    const savedDeployments =
        getSavedDeployments();

    savedDeployments.forEach((deployment) => {
        createDeploymentCard(deployment);
    });
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {

        activeFilter =
            button.getAttribute("data-filter");

        filterButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        updateDeployments();
    });
});

searchInput.addEventListener(
    "input",
    updateDeployments
);

deploymentForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        const siteName =
            document
                .getElementById("site-name")
                .value
                .trim();

        const siteLocation =
            document
                .getElementById("site-location")
                .value
                .trim();

        const deploymentDate =
            document
                .getElementById("deployment-date")
                .value;

        const deploymentScope =
            document
                .getElementById("deployment-scope")
                .value
                .trim();

        const deviceCount =
            document
                .getElementById("device-count")
                .value;

        const deploymentStatus =
            document
                .getElementById("deployment-status")
                .value;

        const currentSites =
            getDeploymentSites();

        const siteNumber =
            currentSites.length + 1;

        const siteCode =
            `SITE ${String(siteNumber).padStart(2, "0")}`;

        const deployment = {
            siteCode: siteCode,
            name: siteName,
            location: siteLocation,
            date: deploymentDate,
            scope: deploymentScope,
            devices: deviceCount,
            status: deploymentStatus
        };

        createDeploymentCard(deployment);

        const savedDeployments =
            getSavedDeployments();

        savedDeployments.push(deployment);

        saveDeployments(savedDeployments);

        deploymentForm.reset();

        activeFilter = "all";

        filterButtons.forEach((button) => {
            button.classList.remove("active");

            if (
                button.getAttribute("data-filter") === "all"
            ) {
                button.classList.add("active");
            }
        });

        searchInput.value = "";

        updateDeployments();
        updateDashboardCounts();

        const newSite =
            deploymentList.lastElementChild;

        newSite.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
);

loadSavedDeployments();
updateDeployments();
updateDashboardCounts();