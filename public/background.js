console.log("YouTube Study Guard background is running!");

// ─── Constants ────────────────────────────────────────────────────────────────
const TIMER_TOTAL   = 25 * 60; // 25 minutes in seconds
const ALARM_NAME    = "focusTimerTick";

// ─── In-memory allowed tabs ───────────────────────────────────────────────────
let allowedYouTubeTabs = new Set();

// ─── Helpers: Study Mode ──────────────────────────────────────────────────────

async function getStudyMode() {
    const data = await chrome.storage.local.get({ studyModeEnabled: true });
    return data.studyModeEnabled;
}

async function setStudyMode(enabled) {
    await chrome.storage.local.set({ studyModeEnabled: enabled });
    console.log("Study Mode set to:", enabled);
}

// ─── Helpers: Timer ───────────────────────────────────────────────────────────

async function getTimerState() {
    const data = await chrome.storage.local.get({
        timerSeconds: TIMER_TOTAL,
        timerStatus:  "idle",   // 'idle' | 'running' | 'paused' | 'done'
        timerTotal:   TIMER_TOTAL,
    });
    return data;
}

async function saveTimerState(patch) {
    await chrome.storage.local.set(patch);
}

async function startTimer() {
    const state = await getTimerState();
    const seconds = state.timerStatus === "done" ? TIMER_TOTAL : state.timerSeconds;

    await saveTimerState({ timerSeconds: seconds, timerStatus: "running" });

    // Create a repeating alarm — fires every 1 second
    chrome.alarms.create(ALARM_NAME, { periodInMinutes: 1 / 60 });

    console.log("Focus timer started. Seconds remaining:", seconds);
}

async function pauseTimer() {
    chrome.alarms.clear(ALARM_NAME);
    await saveTimerState({ timerStatus: "paused" });
    console.log("Focus timer paused.");
}

async function resumeTimer() {
    const state = await getTimerState();
    if (state.timerStatus !== "paused") return;

    await saveTimerState({ timerStatus: "running" });
    chrome.alarms.create(ALARM_NAME, { periodInMinutes: 1 / 60 });
    console.log("Focus timer resumed. Seconds remaining:", state.timerSeconds);
}

async function resetTimer() {
    chrome.alarms.clear(ALARM_NAME);
    await saveTimerState({
        timerSeconds: TIMER_TOTAL,
        timerStatus:  "idle",
    });
    console.log("Focus timer reset.");
}

// ─── Alarm listener (timer tick) ─────────────────────────────────────────────

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name !== ALARM_NAME) return;

    const state = await getTimerState();
    if (state.timerStatus !== "running") {
        chrome.alarms.clear(ALARM_NAME);
        return;
    }

    const newSeconds = Math.max(0, state.timerSeconds - 1);

    if (newSeconds === 0) {
        chrome.alarms.clear(ALARM_NAME);
        await saveTimerState({ timerSeconds: 0, timerStatus: "done" });
        console.log("Focus timer done!");
    } else {
        await saveTimerState({ timerSeconds: newSeconds });
    }
});

// ─── Message listener ─────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    // ── YouTube access ──────────────────────────────────────────────────────

    if (message.type === "YOUTUBE_DETECTED") {
        console.log("YouTube detected. URL:", message.url);
    }

    if (message.type === "YOUTUBE_NAVIGATION") {
        const tabId = sender.tab?.id;
        console.log("YouTube navigation. New URL:", message.url);

        // If this tab was allowed, verify it's still on a study-safe path.
        // YouTube is a SPA — pushState navigations (e.g. clicking the logo)
        // never trigger webNavigation.onBeforeNavigate, so we guard here.
        if (tabId && allowedYouTubeTabs.has(tabId)) {
            try {
                const pathname = new URL(message.url).pathname;
                const isStudyPath = pathname === "/watch" || pathname === "/results";
                if (!isStudyPath) {
                    console.log("Allowed tab navigated to non-study URL — revoking access and redirecting to guard.");
                    allowedYouTubeTabs.delete(tabId);
                    chrome.tabs.update(tabId, { url: chrome.runtime.getURL("guard.html") });
                }
            } catch (_) {
                // malformed URL — ignore
            }
        }
    }

    if (message.type === "VIDEO_OPENED") {
        console.log("Video opened. URL:", message.url);
    }

    if (message.type === "ALLOW_YOUTUBE") {
        const tabId = sender.tab.id;
        console.log("Allowing YouTube for tab:", tabId);
        allowedYouTubeTabs.add(tabId);
    }

    if (message.type === "CHECK_YOUTUBE_ACCESS") {
        const tabId = sender.tab.id;
        const allowed = allowedYouTubeTabs.has(tabId);
        console.log("YouTube access check — tab:", tabId, "allowed:", allowed);
        sendResponse({ allowed });
        return true;
    }

    if (message.type === "CLOSE_GUARD_TAB") {
        const tabId = sender.tab.id;
        console.log("Closing guard tab:", tabId);
        chrome.tabs.remove(tabId);
    }

    // ── Study Mode ──────────────────────────────────────────────────────────

    if (message.type === "SET_STUDY_MODE") {
        setStudyMode(message.enabled);
    }

    if (message.type === "GET_STUDY_MODE") {
        getStudyMode().then((enabled) => sendResponse({ enabled }));
        return true; // keep channel open for async response
    }

    // ── Focus Timer ─────────────────────────────────────────────────────────

    if (message.type === "TIMER_START") {
        startTimer().then(() => sendResponse({ ok: true }));
        return true;
    }

    if (message.type === "TIMER_PAUSE") {
        pauseTimer().then(() => sendResponse({ ok: true }));
        return true;
    }

    if (message.type === "TIMER_RESUME") {
        resumeTimer().then(() => sendResponse({ ok: true }));
        return true;
    }

    if (message.type === "TIMER_RESET") {
        resetTimer().then(() => sendResponse({ ok: true }));
        return true;
    }

    if (message.type === "GET_TIMER_STATE") {
        getTimerState().then((state) => sendResponse(state));
        return true;
    }
});

// ─── Navigation guard ─────────────────────────────────────────────────────────

function isYouTube(url) {
    return url.startsWith("https://www.youtube.com/");
}

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    if (details.frameId !== 0) return;
    if (!isYouTube(details.url)) return;

    const studyModeEnabled = await getStudyMode();
    if (!studyModeEnabled) {
        console.log("Study Mode is OFF — allowing YouTube navigation.");
        return;
    }

    if (allowedYouTubeTabs.has(details.tabId)) {
        // Even for allowed tabs, enforce study-safe paths on full navigations.
        try {
            const pathname = new URL(details.url).pathname;
            const isStudyPath = pathname === "/watch" || pathname === "/results";
            if (isStudyPath) {
                console.log("YouTube allowed (study path) for tab:", details.tabId);
                return;
            }
            // Non-study path — revoke and fall through to redirect.
            console.log("Allowed tab navigated to non-study URL (full nav) — revoking.");
            allowedYouTubeTabs.delete(details.tabId);
        } catch (_) { /* ignore */ }
    }

    console.log("Study Mode ON — redirecting to guard...");
    chrome.tabs.update(details.tabId, {
        url: chrome.runtime.getURL("guard.html"),
    });
});

// ─── Tab cleanup ──────────────────────────────────────────────────────────────

chrome.tabs.onRemoved.addListener((tabId) => {
    allowedYouTubeTabs.delete(tabId);
});