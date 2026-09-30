# Site Deployment Planner

## What Is This?

The Site Deployment Planner is a web application for organizing and tracking technology deployments across multiple locations. It displays deployment dates, locations, equipment scope, device counts, and current status.

Users can add, edit, and delete deployments, search by site name, location, or scope, and filter by status or overdue deployments. Dashboard totals automatically update when records change.

The planner starts with four fictional example deployments. Records are saved in the browser and remain after refreshing the page. They are not shared between devices or browsers, and clearing browser storage removes saved records.

## Why Does It Exist?

I built this project around the site deployment work I encounter professionally. Technology deployments involve multiple locations, preparation stages, equipment requirements, and schedules that need to be tracked at the same time.

The purpose is to provide a simple dashboard for organizing that information, updating deployments as plans change, and identifying locations that need attention.

## What Tools Did I Use?

- **HTML:** Used to structure the dashboard, deployment cards, and labeled form fields.
- **CSS:** Used for consistent typography, colors, status indicators, and layouts that adapt to different screen sizes.
- **JavaScript:** Used to manage deployment records, validate entries, handle search and filters, identify overdue deployments, and update dashboard totals.
- **localStorage:** Used to save records in the browser without requiring a database or server.
- **Visual Studio Code:** Used to write and organize the project files.
- **Git, GitHub, and GitHub Desktop:** Used to track changes, store the repository, and publish updates.
- **GitHub Pages:** Used to host the project at a publicly accessible URL.
- **ChatGPT:** Used for help with implementation decisions, troubleshooting, code review, and documentation.

I chose HTML, CSS, and JavaScript without a framework to keep the project manageable and avoid unnecessary setup for its core features.

## How to Access It

[View the Site Deployment Planner](https://jason-lohoefer.github.io/site-deployment-planner/)

### Using the Planner

1. Complete the Add Deployment form to create a record.
2. Use search and status filters to find deployments.
3. Select Edit on a deployment, update its fields, and save your changes. Cancel returns the form to adding a new deployment.
4. Select Delete and confirm to remove a deployment.
5. Use the Overdue filter to find deployments scheduled before today that are not completed.

Overdue dates are based on the user's local date. Dashboard totals represent all deployments, even when search or filters show only some records.

To run the project locally, keep index.html, style.css, and script.js in the same folder and open index.html in a modern browser. No installation or build step is required.

## What Changed from Project 01 to Project 02?

Project 01 established the dashboard with four example deployments, status filters, and site search. The changes since that milestone focused on making the planner useful for managing records.

- **Added deployment creation and browser storage:** Users can enter their own deployments and retain them after refreshing.
- **Added editing:** Users can correct information and update dates or statuses. This addresses Lorenzo's peer feedback about managing existing deployments.
- **Added deletion with confirmation:** Users can remove records they no longer need while avoiding accidental deletion.
- **Unified deployment records:** Both example deployments and user-created records support editing, deletion, search, and filtering.
- **Added overdue indicators and filtering:** Users can identify unfinished deployments whose scheduled dates have passed.
- **Removed fixed progress percentages:** The original percentages were tied to status rather than completed work. Dates, status, and overdue indicators provide more useful information within the current scope.
- **Expanded search:** Search now includes deployment scope alongside site name and location.
- **Improved usability:** Added save messages, a cancel-edit option, visible keyboard focus, and controls that adapt to smaller screens.
- **Improved validation and storage handling:** Entries are checked before saving, and storage errors produce a visible message. Previously saved deployments can be imported.
- **Updated documentation:** The README describes the final MVP, and REFLECTION.md discusses decisions, results, and lessons learned.

Shared accounts, a central database, and progress based on individual tasks remain possible future improvements.