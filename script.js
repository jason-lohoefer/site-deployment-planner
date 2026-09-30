const statusLabels = {
    planned: "Planned",
    ready: "Ready",
    "in-progress": "In Progress",
    completed: "Completed"
};

const initialDeployments = [
    {
        id: "example-1",
        siteCode: "SITE 01",
        name: "Austin Campus",
        location: "Austin, Texas",
        date: "2026-09-15",
        scope: "Network + Camera",
        devices: 18,
        status: "planned"
    },
    {
        id: "example-2",
        siteCode: "SITE 02",
        name: "Denver Operations Center",
        location: "Denver, Colorado",
        date: "2026-09-22",
        scope: "Camera Expansion",
        devices: 24,
        status: "ready"
    },
    {
        id: "example-3",
        siteCode: "SITE 03",
        name: "Dallas Distribution Center",
        location: "Dallas, Texas",
        date: "2026-09-10",
        scope: "Full Site Rollout",
        devices: 32,
        status: "in-progress"
    },
    {
        id: "example-4",
        siteCode: "SITE 04",
        name: "Phoenix Regional Office",
        location: "Phoenix, Arizona",
        date: "2026-09-05",
        scope: "Security Upgrade",
        devices: 16,
        status: "completed"
    }
];

const storageKey = "siteDeploymentsV2";
const deploymentForm = document.getElementById("deployment-form");
const deploymentList = document.getElementById("deployment-list");
const searchInput = document.getElementById("site-search");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");
const saveMessage = document.getElementById("save-message");
const cancelButton = document.getElementById("cancel-edit");
const submitButton = document.getElementById("submit-button");
const filterButtons = document.querySelectorAll(".filter-btn");

const fieldIds = {
    name: "site-name",
    location: "site-location",
    date: "deployment-date",
    scope: "deployment-scope",
    devices: "device-count",
    status: "deployment-status"
};

let activeFilter = "all";
let editingId = null;
let storageNeedsRecovery = false;

function createId() {
    if (
        globalThis.crypto &&
        typeof globalThis.crypto.randomUUID === "function"
    ) {
        return globalThis.crypto.randomUUID();
    }

    return `site-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isValidDate(value) {
    if (
        typeof value !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
        return false;
    }

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return false;
    }

    const reconstructed =
        `${String(date.getFullYear()).padStart(4, "0")}-` +
        `${String(date.getMonth() + 1).padStart(2, "0")}-` +
        `${String(date.getDate()).padStart(2, "0")}`;

    return reconstructed === value;
}

function isValidDeployment(deployment) {
    if (!deployment || typeof deployment !== "object") {
        return false;
    }

    const hasText = ["name", "location", "scope"].every((key) => {
        return typeof deployment[key] === "string" &&
            deployment[key].trim().length > 0;
    });

    const devices = Number(deployment.devices);

    return hasText &&
        isValidDate(deployment.date) &&
        Number.isInteger(devices) &&
        devices > 0 &&
        devices <= 1000000 &&
        Object.prototype.hasOwnProperty.call(
            statusLabels,
            deployment.status
        );
}

function copyExamples() {
    return initialDeployments.map((deployment) => ({
        ...deployment
    }));
}

function loadDeployments() {
    try {
        const saved = localStorage.getItem(storageKey);

        if (saved !== null) {
            const parsed = JSON.parse(saved);

            if (!Array.isArray(parsed)) {
                throw new Error("Invalid saved data.");
            }

            const ids = new Set();

            const valid = parsed.every((deployment) => {
                if (
                    !isValidDeployment(deployment) ||
                    typeof deployment.id !== "string" ||
                    !deployment.id ||
                    ids.has(deployment.id)
                ) {
                    return false;
                }

                ids.add(deployment.id);
                return true;
            });

            if (!valid) {
                throw new Error("Invalid saved data.");
            }

            return parsed;
        }

        // Import deployments saved by the earlier version.
        // Keep its storage key unchanged as a backup.
        const previous = localStorage.getItem("siteDeployments");

        if (previous === null) {
            return copyExamples();
        }

        const oldDeployments = JSON.parse(previous);

        if (
            !Array.isArray(oldDeployments) ||
            !oldDeployments.every(isValidDeployment)
        ) {
            throw new Error("Invalid earlier saved data.");
        }

        const imported = oldDeployments.map((deployment, index) => ({
            ...deployment,
            id: createId(),
            siteCode: `SITE ${String(index + 5).padStart(2, "0")}`
        }));

        return [...copyExamples(), ...imported];
    } catch {
        storageNeedsRecovery = true;

        saveMessage.textContent =
            "Saved data could not be loaded. Example sites are shown. " +
            "Your existing stored data has not been changed.";

        return copyExamples();
    }
}

let deployments = loadDeployments();

function localToday() {
    const date = new Date();

    return `${date.getFullYear()}-` +
        `${String(date.getMonth() + 1).padStart(2, "0")}-` +
        `${String(date.getDate()).padStart(2, "0")}`;
}

function isOverdue(deployment) {
    return deployment.status !== "completed" &&
        deployment.date < localToday();
}

function formatDate(value) {
    return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function saveDeployments(nextDeployments) {
    if (storageNeedsRecovery) {
        const confirmed = window.confirm(
            "The previous saved data could not be loaded. " +
            "Save this new list in its place?"
        );

        if (!confirmed) {
            return false;
        }
    }

    try {
        localStorage.setItem(
            storageKey,
            JSON.stringify(nextDeployments)
        );

        deployments = nextDeployments;
        storageNeedsRecovery = false;
        return true;
    } catch {
        saveMessage.textContent =
            "Unable to save. Browser storage may be blocked or full. " +
            "Your deployment list has not changed.";

        return false;
    }
}

// Use textContent so entered text is displayed safely.
function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}

function addDetail(container, label, value, valueClass = "") {
    const detail = createElement("div");

    detail.append(
        createElement("span", "", label),
        createElement("strong", valueClass, value)
    );

    container.append(detail);
}

function createDeploymentCard(deployment) {
    const card = createElement("article", "deployment-site");
    const top = createElement("div", "card-top");

    card.dataset.status = deployment.status;

    top.append(
        createElement(
            "span",
            "site-code",
            deployment.siteCode || "SITE"
        ),
        createElement(
            "span",
            `status-badge ${deployment.status}`,
            statusLabels[deployment.status]
        )
    );

    const details = createElement("div", "card-details");

    addDetail(details, "Deployment Date", formatDate(deployment.date));
    addDetail(details, "Deployment Scope", deployment.scope);
    addDetail(details, "Devices", deployment.devices);

    let scheduleLabel = "Upcoming";

    if (deployment.status === "completed") {
        scheduleLabel = "Completed";
    } else if (isOverdue(deployment)) {
        scheduleLabel = "Overdue";
    } else if (deployment.date === localToday()) {
        scheduleLabel = "Due today";
    }

    addDetail(
        details,
        "Schedule",
        scheduleLabel,
        isOverdue(deployment) ? "overdue" : ""
    );

    const actions = createElement("div", "card-actions");
    const editButton = createElement("button", "secondary-btn", "Edit");
    const deleteButton = createElement("button", "delete-btn", "Delete");

    editButton.type = "button";
    deleteButton.type = "button";

    editButton.setAttribute("aria-label", `Edit ${deployment.name}`);
    deleteButton.setAttribute("aria-label", `Delete ${deployment.name}`);

    editButton.addEventListener("click", () => {
        startEditing(deployment);
    });

    deleteButton.addEventListener("click", () => {
        deleteDeployment(deployment);
    });

    actions.append(editButton, deleteButton);

    card.append(
        top,
        createElement("h3", "", deployment.name),
        createElement("p", "location", deployment.location),
        details,
        actions
    );

    return card;
}

function updateDashboardCounts() {
    const counts = {
        planned: 0,
        ready: 0,
        "in-progress": 0,
        completed: 0
    };

    deployments.forEach((deployment) => {
        counts[deployment.status]++;
    });

    document.getElementById("total-count").textContent =
        deployments.length;

    document.getElementById("ready-count").textContent =
        counts.ready;

    document.getElementById("progress-count").textContent =
        counts["in-progress"];

    document.getElementById("completed-count").textContent =
        counts.completed;

    document.getElementById("summary-planned").textContent =
        counts.planned;

    document.getElementById("summary-ready").textContent =
        counts.ready;

    document.getElementById("summary-progress").textContent =
        counts["in-progress"];

    document.getElementById("summary-completed").textContent =
        counts.completed;

    const overdueCount = deployments.filter(isOverdue).length;

    document.getElementById("summary-text").textContent =
        `${deployments.length} sites are being tracked: ` +
        `${counts.planned} planned, ${counts.ready} ready, ` +
        `${counts["in-progress"]} in progress, and ` +
        `${counts.completed} completed. ` +
        `${overdueCount} ${overdueCount === 1 ? "site is" : "sites are"} overdue.`;

    document.getElementById("today-label").textContent =
        new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
}

function updateDeployments() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    const visibleDeployments = deployments.filter((deployment) => {
        const matchesFilter =
            activeFilter === "all" ||
            (
                activeFilter === "overdue"
                    ? isOverdue(deployment)
                    : deployment.status === activeFilter
            );

        const searchableText =
            `${deployment.name} ${deployment.location} ${deployment.scope}`
                .toLowerCase();

        return matchesFilter && searchableText.includes(searchTerm);
    });

    deploymentList.replaceChildren();

    visibleDeployments.forEach((deployment) => {
        deploymentList.append(createDeploymentCard(deployment));
    });

    resultCount.textContent =
        `Showing ${visibleDeployments.length} of ${deployments.length} sites`;

    emptyState.hidden = visibleDeployments.length > 0;

    // Works with the existing CSS until we update it next.
    emptyState.style.display =
        visibleDeployments.length === 0 ? "block" : "none";

    document.getElementById("empty-description").textContent =
        deployments.length === 0
            ? "Add a deployment above to start your schedule."
            : "Try changing the filter or search term.";

    filterButtons.forEach((button) => {
        const selected = button.dataset.filter === activeFilter;

        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));
    });

    updateDashboardCounts();
}

function resetForm() {
    editingId = null;
    deploymentForm.reset();
    cancelButton.hidden = true;

    document.getElementById("form-heading").textContent =
        "Add Deployment";

    document.getElementById("form-eyebrow").textContent =
        "NEW SITE";

    submitButton.textContent = "Add Deployment";
}

function startEditing(deployment) {
    editingId = deployment.id;

    Object.entries(fieldIds).forEach(([key, id]) => {
        document.getElementById(id).value = deployment[key];
    });

    document.getElementById("form-heading").textContent =
        "Edit Deployment";

    document.getElementById("form-eyebrow").textContent =
        deployment.siteCode || "EDIT SITE";

    submitButton.textContent = "Save Changes";
    cancelButton.hidden = false;

    saveMessage.textContent = `Editing ${deployment.name}.`;

    document.getElementById("site-name").focus();
}

function deleteDeployment(deployment) {
    const confirmed = window.confirm(
        `Delete ${deployment.name}? This cannot be undone.`
    );

    if (!confirmed) {
        return;
    }

    const nextDeployments = deployments.filter((item) => {
        return item.id !== deployment.id;
    });

    if (!saveDeployments(nextDeployments)) {
        return;
    }

    if (editingId === deployment.id) {
        resetForm();
    }

    saveMessage.textContent = `${deployment.name} deleted.`;
    updateDeployments();
    searchInput.focus();
}

function nextSiteCode() {
    const largestNumber = Math.max(
        0,
        ...deployments.map((deployment) => {
            const match = String(deployment.siteCode).match(/^SITE (\d+)$/);
            return match ? Number(match[1]) : 0;
        })
    );

    return `SITE ${String(largestNumber + 1).padStart(2, "0")}`;
}

deploymentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const values = {};

    Object.entries(fieldIds).forEach(([key, id]) => {
        values[key] = document.getElementById(id).value.trim();
    });

    values.devices = Number(values.devices);

    if (!isValidDeployment(values)) {
        saveMessage.textContent =
            "Complete every field with valid information. " +
            "Devices must be a whole number greater than zero.";

        return;
    }

    const existing = deployments.find((deployment) => {
        return deployment.id === editingId;
    });

    const deployment = {
        ...values,
        id: existing ? existing.id : createId(),
        siteCode: existing ? existing.siteCode : nextSiteCode()
    };

    const nextDeployments = existing
        ? deployments.map((item) => {
            return item.id === existing.id ? deployment : item;
        })
        : [...deployments, deployment];

    if (!saveDeployments(nextDeployments)) {
        return;
    }

    saveMessage.textContent =
        `${deployment.name} ${existing ? "updated" : "added"} ` +
        "and saved in this browser.";

    resetForm();
    activeFilter = "all";
    searchInput.value = "";
    updateDeployments();
});

cancelButton.addEventListener("click", () => {
    resetForm();
    saveMessage.textContent = "Edit canceled. No changes were saved.";
    document.getElementById("site-name").focus();
});

searchInput.addEventListener("input", updateDeployments);

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        updateDeployments();
    });
});

// Refresh date-based labels when returning to the page.
window.addEventListener("focus", updateDeployments);

updateDeployments();