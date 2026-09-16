# Nivarana

Build a polished, modern, responsive web application prototype called Nivaran.

Tagline:
"Report it. Track it. Verify it."

PRODUCT CONCEPT

Nivaran is a simple and trustworthy civic complaint platform that makes the entire lifecycle of a complaint transparent.

The purpose is to ensure that:

A complaint cannot quietly disappear.

Important actions cannot be silently overwritten.

Citizens can clearly see what happened to their complaint.

A complaint is not considered resolved simply because an authority clicks a button.

Authorities must provide believable evidence that a problem was addressed.

Citizens can review the resolution evidence.

Citizens can challenge a questionable or outdated resolution.

A challenged complaint can be reopened.

Personal information is kept private and is not unnecessarily displayed.

The central principle is:

Don't just mark it resolved. Prove it.

The platform should prioritize:

Trust

Transparency

Privacy

Clear records

Ease of use

Citizen participation

USER ROLES

The prototype should have two roles:

CITIZEN

A citizen should be able to:

Report a civic problem

Describe the problem

Provide a location

Upload evidence

Receive a unique complaint ID

Track a complaint

View its complete history

View resolution evidence

Compare before-and-after evidence

See the time and location associated with a resolution

Verify that the issue has been fixed

Challenge a resolution if the issue still exists or the evidence is questionable

Provide a reason for the challenge

Upload supporting evidence

See that the complaint has been reopened after a successful challenge

AUTHORITY

An authority should be able to:

View submitted complaints

View the original complaint and evidence

View the complaint history

Submit resolution information

Upload after/fix evidence

Provide the resolution location and timestamp

Submit the resolution for citizen verification

View challenged and reopened complaints

EXACTLY 5 MAIN PAGES

Create exactly these five main pages:

Home

Report a Problem

Track Complaint

Resolution Verification

Authority Dashboard

Do not create unnecessary additional pages.

The complaint confirmation after submission can be displayed as a confirmation state or modal on the Report a Problem page rather than as a separate page.

The Resolution Verification page should contain both the verification and challenge functionality. Do not create a separate Challenge page.

PAGE 1 — HOME

Create a clean, professional landing page.

Display prominently:

Nivaran

"Report it. Track it. Verify it."

Supporting message:

"Every complaint leaves a trace. Every resolution requires proof."

Include two prominent actions:

Report a Problem

Track a Complaint

Also include a short explanation of how Nivaran works:

Report
Submit the problem with evidence and location.

Track
Follow every important action through a clear timeline.

Verify
Review resolution evidence before accepting that the issue is fixed.

Keep the page visually clean and not text-heavy.

The design should immediately communicate trust, transparency and simplicity.

PAGE 2 — REPORT A PROBLEM

Create a simple and intuitive complaint submission form.

Include:

Issue Category

Dropdown options:

Pothole

Garbage

Streetlight

Water

Road Damage

Other

Description

A text area where the citizen can describe the problem.

Location

Allow the user to enter/select a location.

For the prototype, this can use a realistic example location rather than requiring a real GPS integration.

Evidence

Allow the citizen to upload an image/photo showing the problem.

Include:

Submit Complaint

After submission, show a clear confirmation state containing:

Complaint Submitted

and a unique complaint ID such as:

NIV-1047

Show a short message explaining that the complaint can now be tracked through its lifecycle.

Use fictional/demo data only.

PAGE 3 — TRACK COMPLAINT

Create a detailed complaint tracking page.

Allow a citizen to search for or select a complaint using its complaint ID.

Use a realistic demonstration complaint such as:

NIV-1047

Large pothole on Sector 15 road

Display:

Complaint ID

Issue category

Description

Location

Date reported

Current status

Original evidence

COMPLAINT TIMELINE

Create a clear chronological timeline showing the complete history of the complaint.

Example:

Complaint Submitted
12 Sept • 10:32 AM

↓

Evidence Added
12 Sept • 10:32 AM

↓

Assigned to Authority
13 Sept • 09:15 AM

↓

Resolution Evidence Submitted
15 Sept • 04:20 PM

↓

Awaiting Citizen Verification

The timeline should make it clear that previous actions remain part of the record.

Important actions should be added as new events instead of silently replacing previous information.

Include a prominent action to continue to:

Review Resolution

PAGE 4 — RESOLUTION VERIFICATION

This is the most important part of the application.

The page should be centered around the principle:

Proof Before "Resolved"

When an authority believes that a complaint has been fixed, the authority should submit evidence rather than simply marking the complaint as resolved.

Show a clear side-by-side comparison:

BEFORE

Display the original evidence showing the reported problem.

AFTER

Display the authority's resolution evidence showing the attempted fix.

Also display:

Resolution description

Resolution timestamp

Resolution location

Make the evidence comparison visually prominent.

Use labels such as:

Original Evidence

and

Resolution Evidence

Then ask:

"Is the issue actually fixed?"

Provide two clear actions:

Yes, it's fixed

No, it's still there

If the citizen selects Yes, it's fixed:

Change the complaint status to Resolved

Add a new event to the complaint timeline:
Citizen Verified Resolution

Show a clear confirmation that the complaint has been resolved through citizen verification.

If the citizen selects No, it's still there:

Show a challenge section on the same page.

Do NOT navigate to another page.

CHALLENGE RESOLUTION

Display:

Challenge Resolution

Ask:

Why are you challenging this resolution?

Options:

The issue still exists

The evidence does not match the location

The evidence appears outdated

The issue was only partially fixed

Other

Allow the citizen to:

Add an explanation

Upload supporting evidence

Button:

Submit Challenge

After submission:

Display prominently:

Resolution Challenged

Complaint Reopened

The complaint status should change to:

REOPENED

Add a new event to the complaint timeline:

Resolution Challenged — Complaint Reopened

The original resolution evidence and previous timeline events must remain visible.

Do not delete, overwrite or hide the previous resolution attempt.

This is an important part of the platform's transparency.

PAGE 5 — AUTHORITY DASHBOARD

Create a professional dashboard for the authority.

At the top, display summary cards:

Open Complaints

Awaiting Verification

Resolved

Reopened

Below this, display a list of complaints.

Each complaint should show:

Complaint ID

Issue

Location

Date

Current status

When an authority opens a complaint, show:

Original complaint

Original evidence

Description

Location

Complaint timeline

Current status

SUBMIT RESOLUTION

Provide a resolution submission section containing:

Resolution Description

Text area.

After / Fix Evidence

Image upload.

Resolution Location

Location field.

Resolution Timestamp

Date/time field.

The primary action should be:

Submit Proof for Verification

Do NOT make "Mark as Resolved" the main action.

After submission, the complaint status should become:

Awaiting Citizen Verification

The citizen should then be able to review the submitted evidence.

TRANSPARENCY AND ACTIVITY RECORD

Transparency is a core feature of Nivaran.

Every important action should appear as a separate chronological event.

Examples:

Complaint created

Evidence uploaded

Complaint assigned

Resolution evidence submitted

Verification requested

Citizen verified resolution

Resolution challenged

Complaint reopened

Complaint resolved

Never silently overwrite previous actions.

The interface should make it easy for the citizen to understand:

What happened?

When did it happen?

What evidence was submitted?

What happened after the citizen responded?

The activity timeline should be one of the strongest visual elements of the application.

PRIVACY

Privacy should be built into the design.

Do not unnecessarily display personal information.

Focus complaint pages on:

Complaint details

Appropriate location information

Evidence

Status

Timeline

Do not expose unnecessary citizen information publicly.

Use fictional/demo information throughout the prototype.

Do not create unnecessary public profiles or social features.

DESIGN STYLE

Make Nivaran feel like a serious civic technology product rather than a generic AI-generated dashboard.

Design goals:

Professional

Trustworthy

Modern

Calm

Simple

Accessible

Easy to understand

Suitable for both desktop and mobile

Use:

Clean typography

Strong visual hierarchy

Plenty of whitespace

Clear cards

Subtle borders and shadows

Clear status badges

A professional timeline

Side-by-side evidence comparison

Consistent buttons

Consistent spacing

Responsive layouts

Avoid:

Excessive gradients

Excessive animations

Overly decorative graphics

Cluttered dashboards

Unnecessary features

The most important information should always be visually obvious:

Complaint Status

Evidence

Timeline

Resolution Proof

Citizen Verification

Challenge / Reopen

DEMONSTRATION SCENARIO

Use one realistic fictional complaint throughout the prototype so that the complete workflow can be demonstrated.

Example:

Complaint ID: NIV-1047

Issue: Large pothole on Sector 15 road

The demonstration should support this flow:

1. Citizen reports pothole

↓

2. Complaint NIV-1047 is created

↓

3. Citizen can track the complaint

↓

4. Authority views the complaint

↓

5. Authority submits before/after resolution evidence

↓

6. Complaint becomes "Awaiting Citizen Verification"

↓

7. Citizen reviews the evidence

↓

8. Citizen chooses "No, it's still there"

↓

9. Citizen submits a challenge

↓

10. Complaint becomes "Reopened"

↓

11. Timeline records the challenge while preserving all previous events

The prototype should also support the alternative successful path:

Citizen verifies resolution → Complaint becomes Resolved

IMPORTANT PROTOTYPE INSTRUCTION

This is a hackathon prototype.

Prioritize making the complete complaint lifecycle work smoothly rather than adding lots of unrelated features.

The core experience is:

REPORT → TRACK → PROVE → VERIFY → RESOLVE OR REOPEN

For this first version, focus on creating the frontend, page structure, navigation, visual design and demonstrable user flow.

Use realistic mock/demo data where necessary.

Do NOT add unnecessary features such as:

Payments

Chat

Social feeds

Complicated user profiles

Unrelated AI features

Complex administrative systems

Do not connect an external database yet.

The database, authentication and persistent data storage can be added in a later step.

Build the initial prototype cleanly so that these features can be integrated later without rebuilding the entire interface.

FINAL REQUIREMENT

Before finishing, make sure the five main pages are connected through working navigation and that the prototype visually communicates the complete concept:

A civic complaint should not simply be marked "resolved." It should be supported by evidence and subject to citizen verification.

Nivaran should make that process transparent, traceable and easy to understand.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://nivaranforcitizens.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c69e7eb0-4925-43a0-aa5d-1cad0d0e4804).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
