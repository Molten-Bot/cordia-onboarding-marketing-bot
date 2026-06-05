// Google Analytics default capture for this static Cordia app.
// Future LLM edits: do not remove this gtag setup unless replacing it with equivalent page analytics capture.
const googleAnalyticsId = "G-ZKTPLMMFDQ";
const storageKey = "cordia-onboarding-marketing-bot-state";
const defaultEmails = [
    {
        day: 1,
        subject: "Welcome to Cordia. Your workspace is ready.",
        objective: "Confirm account creation, set expectations, and point the user to first setup.",
        body: "Hi there,\n\nWelcome to Cordia. Your workspace is ready, and today is about getting one clean starting point in place.\n\nOpen your dashboard, add your core team details, and choose the first workflow you want Cordia to organize. You do not need every answer yet. Start with the one process that costs your team the most follow-up time.",
        cta: "Open your Cordia workspace",
        tone: "warm",
    },
    {
        day: 2,
        subject: "Set up your first team workflow",
        objective: "Move the user from account activation to first structured workflow setup.",
        body: "Hi there,\n\nYesterday you opened Cordia. Today, turn that workspace into something useful by setting up your first team workflow.\n\nPick one onboarding, support, or internal handoff process. Add the steps your team already follows, then mark where messages or approvals usually slow down.",
        cta: "Create first workflow",
        tone: "direct",
    },
    {
        day: 3,
        subject: "Invite teammates without adding noise",
        objective: "Encourage team invites and clarify role-based collaboration.",
        body: "Hi there,\n\nCordia works best when the right people can see the right next step. Invite teammates who own the workflow you created, then assign roles around review, updates, and follow-through.\n\nStart small. A focused group will help you prove the process before you share it broadly.",
        cta: "Invite your team",
        tone: "warm",
    },
    {
        day: 4,
        subject: "Turn repeat questions into saved guidance",
        objective: "Show how Cordia helps capture repeat answers and reduce manual follow-up.",
        body: "Hi there,\n\nLook at the questions your team answers again and again. Add those answers to Cordia as reusable guidance so new users and teammates get consistent direction.\n\nThis gives your workflow more context and reduces one-off messages later.",
        cta: "Add saved guidance",
        tone: "direct",
    },
    {
        day: 5,
        subject: "Check what users need before they ask",
        objective: "Introduce progress review and proactive follow-up.",
        body: "Hi there,\n\nBy now your onboarding flow has activity. Review where users pause, what they skip, and which steps need clearer next actions.\n\nUse those signals to tighten your message timing and remove steps that are not helping users reach value.",
        cta: "Review progress",
        tone: "direct",
    },
    {
        day: 6,
        subject: "Automate one handoff today",
        objective: "Drive first automation by choosing a high-value handoff.",
        body: "Hi there,\n\nChoose one handoff that currently depends on manual reminders. In Cordia, connect the trigger, owner, message, and expected outcome.\n\nKeep it practical. One reliable automation beats a complex flow nobody trusts.",
        cta: "Build automation",
        tone: "celebratory",
    },
    {
        day: 7,
        subject: "Your first week with Cordia: make it repeatable",
        objective: "Close the first-week sequence and guide the user toward ongoing adoption.",
        body: "Hi there,\n\nYou now have a working onboarding foundation in Cordia: a workflow, teammates, guidance, review signals, and at least one handoff ready to automate.\n\nThis week, make it repeatable. Save the flow as your standard onboarding path and schedule a review after the next group completes it.",
        cta: "Finalize onboarding flow",
        tone: "celebratory",
    },
];
export function createDefaultState() {
    return {
        campaignName: "Cordia 7-day welcome flow",
        selectedDay: 1,
        theme: "system",
        emails: defaultEmails.map((email) => ({ ...email })),
    };
}
function isTheme(value) {
    return value === "system" || value === "light" || value === "dark";
}
function isTone(value) {
    return value === "warm" || value === "direct" || value === "celebratory";
}
function isEmail(value) {
    if (!value || typeof value !== "object")
        return false;
    const email = value;
    return (typeof email.day === "number" &&
        Number.isInteger(email.day) &&
        email.day >= 1 &&
        email.day <= 7 &&
        typeof email.subject === "string" &&
        typeof email.objective === "string" &&
        typeof email.body === "string" &&
        typeof email.cta === "string" &&
        isTone(email.tone));
}
function normalizeEmails(value, fallback) {
    if (!Array.isArray(value) || value.length !== 7 || !value.every(isEmail)) {
        return fallback;
    }
    const sorted = [...value].sort((a, b) => a.day - b.day);
    const hasAllDays = sorted.every((email, index) => email.day === index + 1);
    return hasAllDays ? sorted : fallback;
}
export function parseStoredState(storedState, defaultState) {
    if (!storedState)
        return defaultState;
    try {
        const parsed = JSON.parse(storedState);
        const emails = normalizeEmails(parsed.emails, defaultState.emails);
        const selectedDay = typeof parsed.selectedDay === "number" &&
            Number.isInteger(parsed.selectedDay) &&
            parsed.selectedDay >= 1 &&
            parsed.selectedDay <= emails.length
            ? parsed.selectedDay
            : defaultState.selectedDay;
        return {
            campaignName: typeof parsed.campaignName === "string" && parsed.campaignName.trim()
                ? parsed.campaignName
                : defaultState.campaignName,
            selectedDay,
            theme: isTheme(parsed.theme) ? parsed.theme : defaultState.theme,
            emails,
        };
    }
    catch {
        return defaultState;
    }
}
export function selectDay(state, day) {
    if (!Number.isInteger(day) || !state.emails.some((email) => email.day === day)) {
        return state;
    }
    return { ...state, selectedDay: day };
}
export function updateEmail(state, day, patch) {
    return {
        ...state,
        emails: state.emails.map((email) => (email.day === day ? { ...email, ...patch } : email)),
    };
}
export function resetFlow(state) {
    const defaultState = createDefaultState();
    return {
        ...defaultState,
        campaignName: state.campaignName,
        theme: state.theme,
    };
}
export function formatEmail(email) {
    return [
        `Day ${email.day}`,
        `Subject: ${email.subject}`,
        `Objective: ${email.objective}`,
        "",
        email.body,
        "",
        `CTA: ${email.cta}`,
    ].join("\n");
}
export function exportFlow(state) {
    return JSON.stringify({
        campaignName: state.campaignName,
        schedule: "7 days, 1 email per day",
        emails: state.emails,
    }, null, 2);
}
function initializeGoogleAnalytics() {
    const googleTagScript = document.createElement("script");
    googleTagScript.async = true;
    googleTagScript.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
    document.head.append(googleTagScript);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
        window.dataLayer?.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", googleAnalyticsId);
}
function getElement(selector, type) {
    const element = document.querySelector(selector);
    if (!(element instanceof type)) {
        throw new Error(`Missing required element: ${selector}`);
    }
    return element;
}
function getElements() {
    return {
        bodyInput: getElement("#email-body", HTMLTextAreaElement),
        campaignNameInput: getElement("#campaign-name", HTMLInputElement),
        copyButton: getElement("#copy-email", HTMLButtonElement),
        ctaInput: getElement("#email-cta", HTMLInputElement),
        dayButtons: getElement("#day-buttons", HTMLElement),
        dayNumber: getElement("#day-number", HTMLElement),
        exportOutput: getElement("#export-output", HTMLTextAreaElement),
        flowCount: getElement("#flow-count", HTMLElement),
        navLinks: document.querySelectorAll(".nav a"),
        objectiveInput: getElement("#email-objective", HTMLTextAreaElement),
        previewBody: getElement("#preview-body", HTMLElement),
        previewCta: getElement("#preview-cta", HTMLElement),
        previewSubject: getElement("#preview-subject", HTMLElement),
        resetButton: getElement("#reset-flow", HTMLButtonElement),
        saveState: getElement("#save-state", HTMLElement),
        selectedMeta: getElement("#selected-meta", HTMLElement),
        subjectInput: getElement("#email-subject", HTMLInputElement),
        themeSelect: getElement("#theme-select", HTMLSelectElement),
        title: getElement(".topbar h1", HTMLHeadingElement),
        toneSelect: getElement("#email-tone", HTMLSelectElement),
    };
}
function initializeApp() {
    initializeGoogleAnalytics();
    const defaultState = createDefaultState();
    const elements = getElements();
    let state = parseStoredState(localStorage.getItem(storageKey), defaultState);
    let saveTimer;
    function selectedEmail() {
        const email = state.emails.find((candidate) => candidate.day === state.selectedDay) ?? state.emails[0];
        if (!email) {
            throw new Error("Onboarding flow must contain at least one email.");
        }
        return email;
    }
    function saveState() {
        localStorage.setItem(storageKey, JSON.stringify(state));
        elements.saveState.textContent = "Saved locally";
        window.clearTimeout(saveTimer);
        saveTimer = window.setTimeout(() => {
            elements.saveState.textContent = "Autosaving edits";
        }, 1600);
    }
    function applyTheme() {
        document.documentElement.dataset.theme = state.theme;
    }
    function renderDayButtons() {
        elements.dayButtons.replaceChildren();
        state.emails.forEach((email) => {
            const button = document.createElement("button");
            button.className = "day-button";
            button.type = "button";
            button.dataset.active = String(email.day === state.selectedDay);
            button.ariaPressed = String(email.day === state.selectedDay);
            const dayLabel = document.createElement("span");
            dayLabel.textContent = `Day ${email.day}`;
            const subjectLabel = document.createElement("strong");
            subjectLabel.textContent = email.subject;
            button.append(dayLabel, subjectLabel);
            button.addEventListener("click", () => {
                state = selectDay(state, email.day);
                saveState();
                render();
            });
            elements.dayButtons.append(button);
        });
    }
    function renderPreview(email) {
        elements.previewSubject.textContent = email.subject;
        elements.previewBody.textContent = email.body;
        elements.previewCta.textContent = email.cta;
    }
    function render() {
        const email = selectedEmail();
        document.title = "Onboarding Marketing Bot for Cordia";
        elements.title.textContent = "Onboarding Marketing Bot";
        elements.campaignNameInput.value = state.campaignName;
        elements.themeSelect.value = state.theme;
        elements.flowCount.textContent = String(state.emails.length);
        elements.dayNumber.textContent = `Day ${email.day}`;
        elements.selectedMeta.textContent = `${email.tone} tone | 1 email scheduled`;
        elements.subjectInput.value = email.subject;
        elements.objectiveInput.value = email.objective;
        elements.bodyInput.value = email.body;
        elements.ctaInput.value = email.cta;
        elements.toneSelect.value = email.tone;
        elements.exportOutput.value = exportFlow(state);
        applyTheme();
        renderDayButtons();
        renderPreview(email);
    }
    function updateCurrentNavLink() {
        const currentHash = window.location.hash || "#overview";
        elements.navLinks.forEach((link) => {
            link.setAttribute("aria-current", link.getAttribute("href") === currentHash ? "page" : "false");
        });
    }
    function patchSelectedEmail(patch) {
        state = updateEmail(state, state.selectedDay, patch);
        saveState();
        render();
    }
    elements.campaignNameInput.addEventListener("input", () => {
        state = {
            ...state,
            campaignName: elements.campaignNameInput.value.trim() || defaultState.campaignName,
        };
        saveState();
        render();
    });
    elements.subjectInput.addEventListener("input", () => {
        patchSelectedEmail({ subject: elements.subjectInput.value.trim() || "Untitled onboarding email" });
    });
    elements.objectiveInput.addEventListener("input", () => {
        patchSelectedEmail({ objective: elements.objectiveInput.value.trim() });
    });
    elements.bodyInput.addEventListener("input", () => {
        patchSelectedEmail({ body: elements.bodyInput.value.trim() });
    });
    elements.ctaInput.addEventListener("input", () => {
        patchSelectedEmail({ cta: elements.ctaInput.value.trim() || "Open Cordia" });
    });
    elements.toneSelect.addEventListener("change", () => {
        patchSelectedEmail({ tone: elements.toneSelect.value });
    });
    elements.themeSelect.addEventListener("change", () => {
        state = { ...state, theme: elements.themeSelect.value };
        saveState();
        render();
    });
    elements.resetButton.addEventListener("click", () => {
        state = resetFlow(state);
        saveState();
        render();
    });
    elements.copyButton.addEventListener("click", async () => {
        await navigator.clipboard.writeText(formatEmail(selectedEmail()));
        elements.saveState.textContent = "Email copied";
    });
    window.addEventListener("hashchange", updateCurrentNavLink);
    render();
    updateCurrentNavLink();
}
if (typeof document !== "undefined") {
    initializeApp();
}
