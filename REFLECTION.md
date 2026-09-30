# Project Reflection

## Decisions

I chose to build the Site Deployment Planner because it connects closely to what I do for work. Technology deployments involve multiple locations, equipment requirements, schedules, and changing statuses. I wanted to build something that made sense to me and could have a practical use beyond a class assignment.

My first decision was to organize the project around a dashboard. The original version displayed deployment cards with search and status filters. That gave users a way to find information, but the Add Deployment form made the project more useful because they could enter their own sites.

For P02, I focused on giving users control over existing deployments. Lorenzo mentioned in his peer review that someone might need to correct an entry or change a deployment date or status. That was helpful feedback because those changes happen regularly in deployment work. I added editing and deletion so users could manage records after creating them.

I also reconsidered the progress percentages. They were originally tied to status, so every deployment with the same status showed the same percentage. That did not tell users how much work had actually been completed. I removed those percentages and focused on dates, status, and overdue indicators. Meaningful progress tracking would require tasks or milestones, which I decided to leave for a future version.

## What Worked

Choosing a project related to my work made it easier to decide what information mattered. Site name, location, deployment date, scope, device count, and status all help explain what is happening at a location. Having that purpose helped me keep the project focused.

I am most satisfied with how the features work together. Adding, editing, or deleting a deployment updates the dashboard totals. Search and filters work with those same records, and browser storage keeps changes after refreshing the page. That makes the planner feel more like a usable application.

Testing those connections was helpful. I checked that editing a deployment changed its status and that the change remained after refreshing. I also added and deleted a temporary deployment, checked the overdue filter, and searched for a term that returned no results. Those checks helped confirm that the application handled more than just its starting examples.

The peer review also worked well. Lorenzo identified a practical limitation that I could address within the scope of the project. Editing and deletion improved the planner without changing its overall purpose.

## What I Would Do Differently

If I started over, I would plan the data structure and editing process earlier. The first version had example deployments written directly into the HTML. Once I added saved deployments, the project had to handle both the original cards and user-created records. Starting with one collection of deployment data would have made later updates easier.

I would also check smaller screen sizes earlier in the process. Dashboard cards, form fields, and filter buttons need room to work properly. Looking at those layouts throughout development would help me catch spacing issues before the final review.

Browser storage was a manageable choice for this project, but it has limits. Records stay in the browser where they were created and are not shared between devices or users. If I developed this into a tool for a team, I would need a database and user accounts. I would plan that as a separate phase rather than trying to fit it into this submission.

## What I Learned

I learned that getting a page to look finished is only part of building a web application. The information also needs to stay consistent when users add, edit, delete, search, or filter records. Those interactions required more thought than simply displaying deployment cards.

I also learned to question whether a feature provides useful information. The progress bars looked good, but their percentages were based on status rather than completed work. Removing them made the information more straightforward.

I used ChatGPT to help work through implementation decisions, troubleshoot code, and review possible improvements. I still had to apply the changes and test the results. That process showed me why checking the actual behavior matters, even when a suggested change sounds correct.

Finally, I learned that finishing an MVP means deciding what needs to be complete now. There are more features I could add, but this version lets users create, update, remove, find, and track deployments. Focusing on those actions helped me bring the project to a useful stopping point.