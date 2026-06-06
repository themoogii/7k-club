const events = [
  {
    id: "night-loop-07",
    title: "Night Loop 07",
    day: "Tue",
    date: "02",
    time: "20:30",
    distance: "7K",
    pace: "Easy-Steady",
    vibe: "Night loop. Easy-steady. Streetlight mood.",
    description: "City-light 7K with regroup points and a Night Runner stamp.",
    tags: ["night", "stamp"],
    labels: ["Easy", "Coffee", "Stamp"],
    after: "Coffee",
    stamp: "Night Runner / City Lights",
    going: 42,
    sponsor: "7K Coffee Cartel",
    road: "Central city light loop",
    meetup: "Sukhbaatar Square / north side",
    itinerary: ["20:10 check-in", "20:25 warm-up", "20:30 roll out", "21:20 coffee finish"],
    route: "M72 178 C116 96, 185 92, 228 138 S317 210, 374 142 S444 98, 466 154",
    start: [72, 178],
    avatars: ["MK", "AL", "SR", "TY", "JY"],
  },
  {
    id: "first-timer-friday",
    title: "First-Timer Friday",
    day: "Fri",
    date: "05",
    time: "19:00",
    distance: "5K",
    pace: "No One Gets Dropped",
    vibe: "New faces welcome. Fast people behave.",
    description: "A beginner-safe 5K for first-timers and comeback seasons.",
    tags: ["beginner", "coffee"],
    labels: ["First", "Safe", "Matcha"],
    after: "Matcha",
    stamp: "First Club Run",
    going: 58,
    sponsor: "Matcha Station UB",
    road: "Beginner-safe central loop",
    meetup: "National Garden entrance",
    itinerary: ["18:40 check-in", "18:55 intro circle", "19:00 easy 5K", "19:45 matcha after"],
    route: "M58 168 C96 130, 142 130, 168 162 S250 216, 298 164 S366 74, 450 114",
    start: [58, 168],
    avatars: ["EN", "BO", "NL", "KA", "OT"],
  },
  {
    id: "coffee-recovery-5k",
    title: "Coffee Recovery 5K",
    day: "Sat",
    date: "06",
    time: "10:00",
    distance: "5K",
    pace: "Conversation Pace",
    vibe: "Soft 5K. Cafe finish. Debrief required.",
    description: "A relaxed recovery loop ending at the cafe table.",
    tags: ["coffee"],
    labels: ["Coffee", "Social", "Soft"],
    after: "Coffee",
    stamp: "Coffee Run Merchant",
    going: 36,
    sponsor: "Compound Coffee",
    road: "Cafe recovery loop",
    meetup: "Compound Coffee front door",
    itinerary: ["09:45 bag drop", "09:55 group photo", "10:00 soft 5K", "10:35 cafe table"],
    route: "M64 118 C136 80, 202 132, 242 112 S328 72, 384 126 S416 204, 468 178",
    start: [64, 118],
    avatars: ["MN", "ZA", "LC", "IU", "DM"],
  },
  {
    id: "sunday-long-run",
    title: "Sunday Long Run",
    day: "Sun",
    date: "07",
    time: "08:00",
    distance: "14K",
    pace: "Steady",
    vibe: "Long loop. Pacer groups. Breakfast after.",
    description: "A steady 14K for runners entering their race arc.",
    tags: ["stamp"],
    labels: ["Long", "Pacers", "Stamp"],
    after: "Breakfast",
    stamp: "Sunday Discipline",
    going: 48,
    sponsor: "7K Breakfast Club",
    road: "River long-run line",
    meetup: "River path east gate",
    itinerary: ["07:40 pacer groups", "07:55 warm-up", "08:00 14K start", "09:35 breakfast after"],
    route: "M46 190 C116 226, 172 168, 206 122 S292 58, 344 118 S406 220, 474 130",
    start: [46, 190],
    avatars: ["TS", "HK", "VN", "RJ", "SS"],
  },
];

let selectedId = events[1].id;
let activeFilter = "all";
const rsvped = new Set();
const eventRsvpState = new Map();
const eventRegistrations = new Set();
const eventComments = new Map([
  ["night-loop-07", [
    { avatar: "AN", name: "Anu", text: "Is this beginner friendly if I have not run at night before?", time: "12m" },
    { avatar: "MK", name: "Munkh", text: "Yes. We regroup twice and nobody gets dropped.", time: "9m" },
  ]],
  ["first-timer-friday", [
    { avatar: "BO", name: "Bolor", text: "Bringing two first-timers. Keep it soft please.", time: "21m" },
  ]],
]);

const cardsEl = document.querySelector("#eventCards");
const breadcrumbNav = document.querySelector("#breadcrumbNav");
const resultCountEl = document.querySelector("#resultCount");
const nextDropStatEl = document.querySelector("#nextDropStat");
const weeklyGoingStatEl = document.querySelector("#weeklyGoingStat");
const toastEl = document.querySelector("#toast");
const rsvpButton = document.querySelector("#rsvpButton");
const calendarSavePanel = document.querySelector("#calendarSavePanel");
const googleCalendarButton = document.querySelector("#googleCalendarButton");
const iosCalendarButton = document.querySelector("#iosCalendarButton");
const eventDialog = document.querySelector("#eventDialog");
const eventImageInput = document.querySelector("#eventImageInput");
const eventImagePreview = document.querySelector("#eventImagePreview");
const eventInvitePreview = document.querySelector("#eventInvitePreview");
const racePhotoUpload = document.querySelector("#racePhotoUpload");
const raceFolderGrid = document.querySelector("#raceFolderGrid");
const racePhotoGrid = document.querySelector("#racePhotoGrid");
const photoLightbox = document.querySelector("#photoLightbox");
const photoLightboxImage = document.querySelector("#photoLightboxImage");
const photoLightboxTitle = document.querySelector("#photoLightboxTitle");
const photoLightboxMeta = document.querySelector("#photoLightboxMeta");
const photoLightboxDownloadButton = document.querySelector("#photoLightboxDownloadButton");
const closePhotoLightboxButton = document.querySelector("#closePhotoLightboxButton");
const photoCountStat = document.querySelector("#photoCountStat");
const selectedRaceStat = document.querySelector("#selectedRaceStat");
const uploadRaceSelect = document.querySelector("#uploadRaceSelect");
const uploadZoneSelect = document.querySelector("#uploadZoneSelect");
const photoSearchInput = document.querySelector("#photoSearchInput");
const eventStravaRouteInput = document.querySelector("#eventStravaRouteInput");
const builderRoutePath = document.querySelector("#builderRoutePath");
const builderRouteStart = document.querySelector("#builderRouteStart");
const builderRouteLabel = document.querySelector("#builderRouteLabel");
const heroTextRotate = document.querySelector("#heroTextRotate");
const platformVideo = document.querySelector("#platformVideo");
const platformCard = document.querySelector("#platformCard");
const platformCardHeading = document.querySelector("#platformCardHeading");
const platformCardBadge = document.querySelector("#platformCardBadge");
const platformCardGoal = document.querySelector("#platformCardGoal");
const platformTaskList = document.querySelector("#platformTaskList");
const platformCardProgress = document.querySelector("#platformCardProgress");
const platformCardEta = document.querySelector("#platformCardEta");
const homeHorizonCanvas = document.querySelector("#homeHorizonCanvas");
const homeScrollProgress = document.querySelector("#homeScrollProgress");
const joinPledgeButton = document.querySelector("#joinPledgeButton");
const pledgeRulesButton = document.querySelector("#pledgeRulesButton");
const karmaRulesTopButton = document.querySelector("#karmaRulesTopButton");
const karmaBackButton = document.querySelector("#karmaBackButton");
const karmaLockButton = document.querySelector("#karmaLockButton");
const karmaShareButton = document.querySelector("#karmaShareButton");
const karmaBreakCard = document.querySelector("#karmaBreakCard");
const karmaBreakFace = document.querySelector("#karmaBreakFace");
const karmaBreakDebris = document.querySelector("#karmaBreakDebris");
const karmaBreakDamage = document.querySelector("#karmaBreakDamage");
const karmaBreakRespawn = document.querySelector("#karmaBreakRespawn");
const publishChallengeButton = document.querySelector("#publishChallengeButton");
const eventPageRsvpButton = document.querySelector("#eventPageRsvpButton");
const eventPageGoogleButton = document.querySelector("#eventPageGoogleButton");
const eventPageIosButton = document.querySelector("#eventPageIosButton");
const eventPublicShareButton = document.querySelector("#eventPublicShareButton");
const eventBackButton = document.querySelector("#eventBackButton");
const threeCalendarMonth = document.querySelector("#threeCalendarMonth");
const threeCalendarStage = document.querySelector("#threeCalendarStage");
const threeCalendarWall = document.querySelector("#threeCalendarWall");
const calendarPrevMonth = document.querySelector("#calendarPrevMonth");
const calendarNextMonth = document.querySelector("#calendarNextMonth");
const eventCommentList = document.querySelector("#eventCommentList");
const eventCommentInput = document.querySelector("#eventCommentInput");
const eventCommentButton = document.querySelector("#eventCommentButton");
const eventCompleteRegistrationButton = document.querySelector("#eventCompleteRegistrationButton");
const eventConfirmationTitle = document.querySelector("#eventConfirmationTitle");
const eventConfirmationCopy = document.querySelector("#eventConfirmationCopy");
const eventConfirmationStatus = document.querySelector("#eventConfirmationStatus");
const eventConfirmationMeta = document.querySelector("#eventConfirmationMeta");
const eventConfirmationWallButton = document.querySelector("#eventConfirmationWallButton");
const eventConfirmationCalendarButton = document.querySelector("#eventConfirmationCalendarButton");
const eventConfirmationShareButton = document.querySelector("#eventConfirmationShareButton");
const eventProfilePhotoInput = document.querySelector("#eventProfilePhotoInput");
const attendeeSphere = document.querySelector("#attendeeSphere");
const eventCopyLinkButton = document.querySelector("#eventCopyLinkButton");
const eventBlastButton = document.querySelector("#eventBlastButton");
const eventShareButton = document.querySelector("#eventShareButton");
const eventDownloadQrButton = document.querySelector("#eventDownloadQrButton");
const eventQrImage = document.querySelector("#eventQrImage");
const eventHostProfileButton = document.querySelector("#eventHostProfileButton");
const authDialog = document.querySelector("#authDialog");
const navAuthButton = document.querySelector("#navAuthButton");
const accountDropdown = document.querySelector("#accountDropdown");
const accountDropdownTrigger = document.querySelector("#accountDropdownTrigger");
const accountDropdownMenu = document.querySelector("#accountDropdownMenu");
const accountTriggerAvatar = document.querySelector("#accountTriggerAvatar");
const accountAuthMenuText = document.querySelector("#accountAuthMenuText");
const accountMenuLabel = document.querySelector("#accountMenuLabel");
const profileAccountAuthButton = document.querySelector("#profileAccountAuthButton");
const profileAccountSignOutButton = document.querySelector("#profileAccountSignOutButton");
const profileAccountStatus = document.querySelector("#profileAccountStatus");
const profilePhotoInput = document.querySelector("#profilePhotoInput");
const profileCropPreview = document.querySelector("#profileCropPreview");
const profilePhotoZoom = document.querySelector("#profilePhotoZoom");
const profilePhotoX = document.querySelector("#profilePhotoX");
const profilePhotoY = document.querySelector("#profilePhotoY");
const saveProfilePhotoButton = document.querySelector("#saveProfilePhotoButton");
const labSignInButton = document.querySelector("#labSignInButton");
const labPreviewButton = document.querySelector("#labPreviewButton");
const labHistoryButton = document.querySelector("#labHistoryButton");
const labCoachInput = document.querySelector("#labCoachInput");
const labCoachSendButton = document.querySelector("#labCoachSendButton");
const labFormCheckButton = document.querySelector("#labFormCheckButton");
const labPlanButton = document.querySelector("#labPlanButton");
const labSaveNoteButton = document.querySelector("#labSaveNoteButton");
const labWaveCanvas = document.querySelector("#labWaveCanvas");
const labCoachTranscript = document.querySelector("#labCoachTranscript");
const labFormVideoInput = document.querySelector("#labFormVideoInput");
const labWorkbenchCard = document.querySelector("#labWorkbenchCard");
const labWorkbenchLabel = document.querySelector("#labWorkbenchLabel");
const labWorkbenchTitle = document.querySelector("#labWorkbenchTitle");
const labWorkbenchStatus = document.querySelector("#labWorkbenchStatus");
const labWorkbenchBody = document.querySelector("#labWorkbenchBody");
const labWorkbenchActions = document.querySelector("#labWorkbenchActions");
const closeAuthDialogButton = document.querySelector("#closeAuthDialogButton");
const googleAuthButton = document.querySelector("#googleAuthButton");
const appleAuthButton = document.querySelector("#appleAuthButton");
const sendPhoneCodeButton = document.querySelector("#sendPhoneCodeButton");
const verifyPhoneButton = document.querySelector("#verifyPhoneButton");
const emailAuthButton = document.querySelector("#emailAuthButton");
const authPhoneInput = document.querySelector("#authPhoneInput");
const authCodeInput = document.querySelector("#authCodeInput");
const authEmailInput = document.querySelector("#authEmailInput");
const authNameInput = document.querySelector("#authNameInput");
const authModeLabel = document.querySelector("#authModeLabel");
const exportCsvButton = document.querySelector("#exportCsvButton");
const scheduleReminderButton = document.querySelector("#scheduleReminderButton");
const clockHourMarks = document.querySelector("#clockHourMarks");
const clockHourHand = document.querySelector("#clockHourHand");
const clockMinuteHand = document.querySelector("#clockMinuteHand");
const clockSecondHand = document.querySelector("#clockSecondHand");
const clockDateEl = document.querySelector("#clockDate");
const glassClockDigital = document.querySelector("#glassClockDigital");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const enhancedMotionTargets = new WeakSet();
const rippleTargets = ".primary-button, .secondary-button, .ghost-button, .nav-action, .filter, .day-card, .race-photo-card button";
const tiltTargets = ".event-card, .calendar-row, .race-photo-card, .race-selector button, .race-albums button, .passport-wall article, .calendar-day, .platform-card, .pledge-card";
const clockTimezone = "Asia/Ulaanbaatar";
const clockMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let selectedRace = "Ulaanbaatar Marathon 2026";
let photoSearchQuery = "";
let activeLightboxPhotoId = null;
let selectedFolderPhotoIds = [];
let activeReplyTarget = null;
let calendarDateRef = new Date(2026, 5, 1);
let calendarTiltX = 18;
let calendarTiltY = 0;
let calendarDragging = false;
let calendarDragStart = null;
let activeCalendarEventId = null;
let activeCalendarView = localStorage.getItem("sevenKCalendarView") || "calendar";
const customCalendarEvents = [];
const authStorageKey = "sevenKAuthUser";
const profileStorageKey = "sevenKProfile";
const rsvpStorageKey = "sevenKRsvpRows";
const labStorageKey = "sevenKLabNotes";
let authUser = readAuthUser();
let authReason = "account";
let profileSettings = readProfileSettings();
let rsvpRows = readRsvpRows();
let labNotes = readLabNotes();
let activeLabOutput = "";
let sphereRotation = { x: 10, y: 20 };
let sphereVelocity = { x: 0, y: 0 };
let sphereDragging = false;
let sphereLastPointer = null;
let sphereAnimationFrame = null;
let currentSphereAttendees = [];
hydrateRsvpRows();
const racePhotoBaseCounts = {
  "Ulaanbaatar Marathon 2026": 12840,
  "Darkhan Marathon 2026": 7640,
  "Erdenet Half Marathon 2026": 4920,
  "7K Night Race 2026": 0,
};
const racePhotos = [
  {
    id: "ub-0241",
    race: "Ulaanbaatar Marathon 2026",
    zone: "Finish Line",
    bib: "0241",
    title: "Finish kick",
    meta: "Ulaanbaatar Marathon 2026 / full-res available",
    src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1080&q=90",
    ratio: "portrait",
    thumbClass: "photo-a",
  },
  {
    id: "ub-1188",
    race: "Ulaanbaatar Marathon 2026",
    zone: "Course / Street Energy",
    bib: "1188",
    title: "Coffee crew",
    meta: "Street Energy / full-res available",
    src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=90",
    ratio: "landscape",
    thumbClass: "photo-b",
  },
  {
    id: "ub-start-03",
    race: "Ulaanbaatar Marathon 2026",
    zone: "Start Line",
    bib: "wave-03",
    title: "Start wave 03",
    meta: "Start Line / full-res available",
    src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=90",
    ratio: "landscape",
    thumbClass: "photo-c",
  },
  {
    id: "ub-0777",
    race: "Ulaanbaatar Marathon 2026",
    zone: "Course / Street Energy",
    bib: "0777",
    title: "Bridge surge",
    meta: "Course / AI bib detected / full-res available",
    src: "https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=1080&q=90",
    ratio: "portrait",
    thumbClass: "photo-b",
  },
  {
    id: "ub-1904",
    race: "Ulaanbaatar Marathon 2026",
    zone: "Run Club Village",
    bib: "1904",
    title: "Club village",
    meta: "Run Club Village / full-res available",
    src: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1600&q=90",
    ratio: "landscape",
    thumbClass: "photo-c",
  },
  {
    id: "darkhan-0312",
    race: "Darkhan Marathon 2026",
    zone: "Finish Line",
    bib: "0312",
    title: "Finish straight",
    meta: "Darkhan Marathon 2026 / full-res available",
    src: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=1080&q=90",
    ratio: "portrait",
    thumbClass: "photo-a",
  },
  {
    id: "darkhan-0818",
    race: "Darkhan Marathon 2026",
    zone: "Start Line",
    bib: "0818",
    title: "Cold start",
    meta: "Start Line / AI bib detected / full-res available",
    src: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=90",
    ratio: "landscape",
    thumbClass: "photo-c",
  },
  {
    id: "darkhan-2240",
    race: "Darkhan Marathon 2026",
    zone: "Podium / Awards",
    bib: "2240",
    title: "Medal wall",
    meta: "Podium / Awards / full-res available",
    src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1080&q=90",
    ratio: "portrait",
    thumbClass: "photo-b",
  },
  {
    id: "erdenet-0770",
    race: "Erdenet Half Marathon 2026",
    zone: "Course / Street Energy",
    bib: "0770",
    title: "Hill turn",
    meta: "Erdenet Half Marathon 2026 / full-res available",
    src: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?auto=format&fit=crop&w=1600&q=90",
    ratio: "landscape",
    thumbClass: "photo-b",
  },
  {
    id: "erdenet-1442",
    race: "Erdenet Half Marathon 2026",
    zone: "Finish Line",
    bib: "1442",
    title: "Last 100",
    meta: "Finish Line / AI bib detected / full-res available",
    src: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1080&q=90",
    ratio: "portrait",
    thumbClass: "photo-a",
  },
];

const platformItems = [
  {
    label: "Events",
    title: "Weekly Run Drop",
    badge: "Club Live",
    video: "https://assets.mixkit.co/videos/preview/mixkit-man-and-woman-jogging-through-a-park-in-the-city-40754-large.mp4",
    goal: "Turn weekly runs into drops.",
    progress: "4 runs staged",
    eta: "Next run tonight",
    tasks: [
      { title: "Route posted", meta: "Night Loop 07 / 7K", status: "completed" },
      { title: "Pace groups", meta: "Easy / social / steady", status: "completed" },
      { title: "RSVP wave", meta: "42 going", status: "progress" },
      { title: "Coffee finish", meta: "Pending", status: "pending" },
    ],
  },
  {
    label: "Race Photos",
    title: "Bib Photo Finder",
    badge: "AI Bib",
    video: "https://assets.mixkit.co/videos/preview/mixkit-large-crowd-of-marathon-runners-15687-large.mp4",
    goal: "Search bib. Download HQ.",
    progress: "12,840 photos stored",
    eta: "Bib scan active",
    tasks: [
      { title: "Race selected", meta: "UB Marathon", status: "completed" },
      { title: "Finish album", meta: "1,306 photos", status: "completed" },
      { title: "Bib scan", meta: "AI matching", status: "progress" },
      { title: "HQ release", meta: "Pending", status: "pending" },
    ],
  },
  {
    label: "Run Passport",
    title: "City Stamp Book",
    badge: "Collected",
    video: "https://assets.mixkit.co/videos/preview/mixkit-woman-jogging-down-a-road-seen-from-the-air-33369-large.mp4",
    goal: "Collect city loops and race rituals.",
    progress: "6 stamps unlocked",
    eta: "Next stamp: Night",
    tasks: [
      { title: "City loop", meta: "UB verified", status: "completed" },
      { title: "Club check-in", meta: "7K Night", status: "completed" },
      { title: "Stamp minting", meta: "City Lights", status: "progress" },
      { title: "Story export", meta: "Pending", status: "pending" },
    ],
  },
  {
    label: "Runner Identity",
    title: "Runner Identity",
    badge: "Aura",
    video: "https://assets.mixkit.co/videos/preview/mixkit-back-view-of-man-running-down-street-717-large.mp4",
    goal: "Make your running identity shareable.",
    progress: "Night Runner built",
    eta: "Aura refresh daily",
    tasks: [
      { title: "Run rhythm", meta: "Night miles", status: "completed" },
      { title: "Archetype", meta: "Night Runner", status: "completed" },
      { title: "Aura card", meta: "Coffee / grit", status: "progress" },
      { title: "Story export", meta: "Pending", status: "pending" },
    ],
  },
];

function filteredEvents() {
  if (activeFilter === "all") return events;
  return events.filter((event) => event.tags.includes(activeFilter));
}

function eventById(id) {
  return events.find((event) => event.id === id) || events[0];
}

const heroRotatingTexts = ["cultural", "race-day", "photo", "club", "story"];
let heroRotateIndex = 0;
let activePlatformIndex = 0;

function splitGraphemes(text) {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    return Array.from(new Intl.Segmenter("en", { granularity: "grapheme" }).segment(text), ({ segment }) => segment);
  }
  return Array.from(text);
}

function renderHeroRotateText(text) {
  heroTextRotate.innerHTML = `
    <span class="sr-only">${text}</span>
    <span class="text-rotate-word" aria-hidden="true">
      ${splitGraphemes(text)
        .map((char, index) => `<span class="text-rotate-char" style="--char-index:${index}">${char}</span>`)
        .join("")}
    </span>
  `;
}

function renderPlatformTab(index = 0) {
  if (!platformVideo) return;
  const item = platformItems[index] || platformItems[0];
  activePlatformIndex = index;

  document.querySelectorAll("[data-platform-tab]").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.platformTab) === index);
  });

  platformCard.classList.remove("is-switching");
  void platformCard.offsetWidth;
  platformCard.classList.add("is-switching");

  platformVideo.classList.remove("is-switching");
  void platformVideo.offsetWidth;
  platformVideo.classList.add("is-switching");
  platformVideo.src = item.video;
  platformVideo.load();
  platformVideo.play().catch(() => {});

  platformCardHeading.textContent = item.title;
  platformCardBadge.textContent = item.badge;
  platformCardGoal.textContent = item.goal;
  platformCardProgress.textContent = item.progress;
  platformCardEta.textContent = item.eta;
  platformTaskList.innerHTML = item.tasks
    .map(
      (task) => `
        <div class="platform-task ${task.status}">
          <span class="platform-task-status" aria-hidden="true"></span>
          <div>
            <strong>${task.title}</strong>
            <small>${task.meta}</small>
          </div>
        </div>
      `
    )
    .join("");
}

function initPlatformTabs() {
  if (!platformVideo) return;
  document.querySelectorAll("[data-platform-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      renderPlatformTab(Number(button.dataset.platformTab));
    });
  });
  renderPlatformTab(0);
}

function startHeroTextRotate() {
  if (!heroTextRotate) return;
  renderHeroRotateText(heroRotatingTexts[heroRotateIndex]);
  window.setInterval(() => {
    heroTextRotate.classList.add("is-exiting");
    window.setTimeout(() => {
      heroRotateIndex = (heroRotateIndex + 1) % heroRotatingTexts.length;
      heroTextRotate.classList.remove("is-exiting");
      renderHeroRotateText(heroRotatingTexts[heroRotateIndex]);
    }, 260);
  }, 2000);
}

function renderCards() {
  const visible = filteredEvents();
  resultCountEl.textContent = `${visible.length} ${visible.length === 1 ? "drop" : "drops"}`;

  if (!visible.some((event) => event.id === selectedId)) {
    selectedId = visible[0]?.id || events[0].id;
  }

  cardsEl.innerHTML = visible
    .map((event) => {
      const isSelected = event.id === selectedId;
      const isGoing = rsvped.has(event.id);
      return `
        <button class="event-card ${isSelected ? "selected" : ""}" type="button" data-event-id="${event.id}">
          <div class="event-date">
            <span>${event.day}</span>
            <strong>${event.date}</strong>
            <em>${event.time}</em>
          </div>
          <div class="event-main">
            <div class="event-meta">${event.distance} / ${event.pace}</div>
            <h4>${event.title}</h4>
            <p>${event.vibe}</p>
            <div class="event-tags">
              ${event.labels
                .map((label) => `<span class="${label.includes("Stamp") ? "signal" : ""}">${label}</span>`)
                .join("")}
            </div>
          </div>
          <div class="event-rsvp">${isGoing ? "Going" : `${event.going} going`}</div>
        </button>
      `;
    })
    .join("");

  document.querySelectorAll(".event-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectedId = card.dataset.eventId;
      renderCards();
      renderDetail();
    });
  });
  enhanceMotionTargets();
}

function renderDetail() {
  const event = eventById(selectedId);
  const going = event.going + (rsvped.has(event.id) ? 1 : 0);

  document.querySelector("#detailTitle").textContent = event.title;
  document.querySelector("#detailDescription").textContent = event.description;
  document.querySelector("#detailDate").textContent = `${event.day} ${event.date} / ${event.time}`;
  document.querySelector("#detailDistance").textContent = event.distance;
  document.querySelector("#detailPace").textContent = event.pace;
  document.querySelector("#detailAfter").textContent = event.after;
  document.querySelector("#detailStamp").textContent = event.stamp;
  document.querySelector("#detailGoing").textContent = `${going} going`;
  document.querySelector("#shareTitle").textContent = event.title;
  document.querySelector("#shareMeta").textContent = `${event.day} ${event.date} / ${event.distance} / ${event.pace}`;
  const routePath = document.querySelector("#routePath");
  routePath.setAttribute("d", event.route);
  routePath.classList.remove("route-draw");
  void routePath.getBoundingClientRect();
  routePath.classList.add("route-draw");
  document.querySelector("#routeStart").setAttribute("cx", event.start[0]);
  document.querySelector("#routeStart").setAttribute("cy", event.start[1]);
  document.querySelector("#avatarStack").innerHTML = event.avatars
    .map((avatar) => `<span class="avatar">${avatar}</span>`)
    .join("");
  rsvpButton.textContent = rsvped.has(event.id) ? "You are going" : "RSVP";
  calendarSavePanel.hidden = !rsvped.has(event.id);
  nextDropStatEl.textContent = event.title;
  weeklyGoingStatEl.textContent = String(events.reduce((sum, item) => sum + item.going, 0) + rsvped.size);
}

function eventRsvpCounts(event) {
  const state = eventRsvpState.get(event.id);
  const registered = eventRegistrations.has(event.id);
  return {
    going: event.going + (registered && (state === "going" || rsvped.has(event.id)) ? 1 : 0),
    maybe: Math.max(4, Math.round(event.going * 0.18)) + (registered && state === "maybe" ? 1 : 0),
    cant: Math.max(2, Math.round(event.going * 0.08)) + (registered && state === "cant" ? 1 : 0),
  };
}

function baseAttendees(event) {
  const names = ["Munkh", "Anu", "Enkhee", "Bolor", "Tugs", "Saruul", "Namuun", "Oyu"];
  const images = [
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=420&q=80",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=420&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=420&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=420&q=80",
    "",
  ];
  return event.avatars.map((initials, index) => ({
    id: `${event.id}-base-${index}`,
    name: names[index] || `Runner ${index + 1}`,
    initials,
    avatarData: images[index] || "",
    avatarCrop: { zoom: 120, x: 50, y: 50 },
  }));
}

function currentUserAttendee(event) {
  if (!authUser) return null;
  return {
    id: `${event.id}-you`,
    name: authDisplayName(authUser),
    initials: userInitials(authUser),
    avatarData: profileSettings.avatarData || authUser.avatarData || "",
    avatarCrop: avatarCrop(),
    isYou: true,
  };
}

function attendeesForEvent(event) {
  const attendees = baseAttendees(event);
  const row = rsvpRows.find((item) => item.eventId === event.id && item.registered && item.status === "going");
  const user = row ? currentUserAttendee(event) : null;
  return user ? [user, ...attendees] : attendees;
}

function rsvpStateLabel(state) {
  if (state === "going") return "Going";
  if (state === "maybe") return "Maybe";
  if (state === "cant") return "Can't Go";
  return "RSVP";
}

function publicEventUrl(event) {
  return `7k.club/e/${event.id}`;
}

function eventShareUrl(event) {
  return `https://${publicEventUrl(event)}`;
}

function eventQrUrl(event) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=14&data=${encodeURIComponent(eventShareUrl(event))}`;
}

function renderEventComments(event) {
  const comments = eventComments.get(event.id) || [
    { avatar: "7K", name: "7K Host", text: "Drop questions here. Host replies stay with the event.", time: "now" },
  ];
  eventCommentList.innerHTML = comments
    .map((comment, index) => `
      <article class="comment-item" data-comment-index="${index}">
        <span class="avatar">${comment.avatar}</span>
        <div>
          <strong>${comment.name}</strong>
          <p>${comment.text}</p>
          <div class="comment-actions">
            <small>${comment.time}</small>
            <button type="button" data-reply-comment="${index}">Reply</button>
            <button class="like-btn" type="button" data-like-comment="${index}" aria-label="Like comment">👍</button>
          </div>
          ${
            comment.replies?.length
              ? `<div class="comment-replies">
                  ${comment.replies
                    .map((reply) => `
                      <div class="comment-reply">
                        <span class="avatar">${reply.avatar}</span>
                        <div>
                          <strong>${reply.name}</strong>
                          <p>${reply.text}</p>
                          <small>${reply.time}</small>
                        </div>
                      </div>
                    `)
                    .join("")}
                </div>`
              : ""
          }
        </div>
      </article>
    `)
    .join("");
}

function renderEventPage() {
  const event = eventById(selectedId);
  const counts = eventRsvpCounts(event);
  const activeState = eventRsvpState.get(event.id) || "";
  const started = Boolean(activeState);
  const registered = eventRegistrations.has(event.id);
  const stateLabel = rsvpStateLabel(activeState);
  const eventPage = document.querySelector('[data-page="event"]');
  eventPage.classList.toggle("event-rsvp-started", started);
  eventPage.classList.toggle("event-registered", registered);
  eventPage.classList.toggle("event-going", registered && activeState === "going");
  document.querySelector("#eventPageMeta").textContent = `${event.day} ${event.date} / ${event.time} / ${event.distance}`;
  document.querySelector("#eventPageTitle").textContent = event.title;
  document.querySelector("#eventPageHost").textContent = `Hosted by 7K Running Club / ${event.meetup}`;
  document.querySelector("#eventPageHeadline").textContent = event.vibe;
  document.querySelector("#eventPageDescription").textContent = event.description;
  document.querySelector("#eventPageGoing").textContent = `${counts.going} going`;
  document.querySelector("#eventPageDateTime").textContent = `${event.day} ${event.date} / ${event.time}`;
  document.querySelector("#eventPageLocation").textContent = event.meetup;
  document.querySelector("#eventPageCapacity").textContent = `${Math.max(60, event.going + 20)} capacity`;
  document.querySelector("#eventSponsorName").textContent = event.sponsor;
  document.querySelector("#eventPublicUrl").textContent = publicEventUrl(event);
  eventQrImage.src = eventQrUrl(event);
  document.querySelector("#eventRoadName").textContent = event.road;
  document.querySelector("#eventRouteMeta").textContent = `${event.distance} / ${event.pace}`;
  document.querySelector("#eventStepNotice").textContent = registered
    ? `Step 3 / Confirmed as ${stateLabel}. The event wall is unlocked.`
    : started
      ? `Step 2 / ${stateLabel} selected. Complete the runner form to unlock the event wall.`
      : "Step 1 / Choose RSVP status to enter this event page.";
  eventPageRsvpButton.textContent = registered ? `You are ${stateLabel}` : started ? "Continue RSVP" : "Start RSVP";
  if (eventConfirmationTitle) eventConfirmationTitle.textContent = `${event.title} is saved.`;
  if (eventConfirmationCopy) {
    eventConfirmationCopy.textContent =
      activeState === "going"
        ? "You are on the run list. The wall, route, and calendar tools are open."
        : activeState === "maybe"
          ? "You are marked maybe. You can still follow updates, wall posts, and route details."
          : "We saved your response. You can still see public updates and change status anytime.";
  }
  if (eventConfirmationStatus) eventConfirmationStatus.textContent = stateLabel;
  if (eventConfirmationMeta) eventConfirmationMeta.textContent = `${event.day} ${event.date} / ${event.time} / ${event.distance}`;
  document.querySelector("#rsvpGoingCount").textContent = counts.going;
  document.querySelector("#rsvpMaybeCount").textContent = counts.maybe;
  document.querySelector("#rsvpCantCount").textContent = counts.cant;
  document.querySelectorAll("[data-rsvp-state]").forEach((button) => {
    button.classList.toggle("active", button.dataset.rsvpState === activeState);
  });

  const eventRoutePath = document.querySelector("#eventRoutePath");
  eventRoutePath.setAttribute("d", event.route);
  eventRoutePath.classList.remove("route-draw");
  void eventRoutePath.getBoundingClientRect();
  eventRoutePath.classList.add("route-draw");
  document.querySelector("#eventRouteStart").setAttribute("cx", event.start[0]);
  document.querySelector("#eventRouteStart").setAttribute("cy", event.start[1]);

  const attendees = attendeesForEvent(event);
  document.querySelector("#eventParticipantGrid").innerHTML = attendees
    .slice(0, 6)
    .map((person) => `
      <div>
        ${avatarMarkup(person)}
        <strong>${person.isYou ? `${person.name} / You` : person.name}</strong>
      </div>
    `)
    .join("");
  renderAttendeeSphere(attendees, registered && activeState === "going");

  document.querySelector("#eventItineraryList").innerHTML = event.itinerary
    .map((item) => {
      const [time, ...rest] = item.split(" ");
      return `
        <div>
          <span>${time}</span>
          <strong>${rest.join(" ")}</strong>
        </div>
      `;
    })
    .join("");
  renderEventComments(event);
}

function renderAttendeeSphere(attendees, unlocked) {
  if (!attendeeSphere) return;
  currentSphereAttendees = unlocked ? attendees : [];
  if (!unlocked) {
    attendeeSphere.innerHTML = "";
    return;
  }
  attendeeSphere.innerHTML = attendees
    .map((person, index) => `
      <button class="sphere-avatar${person.avatarData ? " has-image" : ""}${person.isYou ? " is-you" : ""}"
        type="button"
        data-sphere-index="${index}"
        aria-label="${person.name}"
        ${avatarImageStyle(person.avatarData, person.avatarCrop)}>
        ${person.avatarData ? "" : person.initials || initialsFromName(person.name)}
      </button>
    `)
    .join("");
  positionAttendeeSphere();
}

function positionAttendeeSphere() {
  if (!attendeeSphere || !currentSphereAttendees.length) return;
  const nodes = [...attendeeSphere.querySelectorAll("[data-sphere-index]")];
  const radius = Math.min(106, attendeeSphere.clientWidth * 0.34 || 104);
  const center = attendeeSphere.clientWidth / 2 || 145;
  const yCenter = attendeeSphere.clientHeight / 2 || 145;
  const rotX = (sphereRotation.x * Math.PI) / 180;
  const rotY = (sphereRotation.y * Math.PI) / 180;
  const golden = Math.PI * (3 - Math.sqrt(5));

  nodes.forEach((node, index) => {
    const count = Math.max(nodes.length, 1);
    const y = 1 - (index / Math.max(count - 1, 1)) * 2;
    const horizontal = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * index;
    let x = Math.cos(theta) * horizontal * radius;
    let z = Math.sin(theta) * horizontal * radius;
    let yy = y * radius;

    const x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
    const z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
    x = x1;
    z = z1;

    const y2 = yy * Math.cos(rotX) - z * Math.sin(rotX);
    const z2 = yy * Math.sin(rotX) + z * Math.cos(rotX);
    yy = y2;
    z = z2;

    const depth = (z + radius) / (radius * 2);
    const scale = 0.55 + depth * 0.55;
    const opacity = z < -radius * 0.72 ? 0.18 : 0.55 + depth * 0.45;
    node.style.left = `${center + x}px`;
    node.style.top = `${yCenter + yy}px`;
    node.style.opacity = String(opacity);
    node.style.zIndex = String(Math.round(100 + z));
    node.style.transform = `translate(-50%, -50%) scale(${scale})`;
  });
}

function initAttendeeSphere() {
  if (!attendeeSphere || sphereAnimationFrame) return;

  attendeeSphere.addEventListener("pointerdown", (event) => {
    sphereDragging = true;
    sphereVelocity = { x: 0, y: 0 };
    sphereLastPointer = { x: event.clientX, y: event.clientY };
    attendeeSphere.setPointerCapture?.(event.pointerId);
  });

  attendeeSphere.addEventListener("pointermove", (event) => {
    if (!sphereDragging || !sphereLastPointer) return;
    const dx = event.clientX - sphereLastPointer.x;
    const dy = event.clientY - sphereLastPointer.y;
    sphereRotation.y += dx * 0.45;
    sphereRotation.x -= dy * 0.32;
    sphereVelocity = { x: -dy * 0.04, y: dx * 0.06 };
    sphereLastPointer = { x: event.clientX, y: event.clientY };
    positionAttendeeSphere();
  });

  const stopDrag = () => {
    sphereDragging = false;
    sphereLastPointer = null;
  };
  attendeeSphere.addEventListener("pointerup", stopDrag);
  attendeeSphere.addEventListener("pointercancel", stopDrag);

  attendeeSphere.addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest("[data-sphere-index]") : null;
    if (!button) return;
    const person = currentSphereAttendees[Number(button.dataset.sphereIndex)];
    if (person?.isYou) {
      setPage("profile");
      showToast("Your runner profile opened.");
    } else if (person) {
      showToast(`${person.name}'s event profile opened.`);
    }
  });

  const animate = () => {
    if (!prefersReducedMotion.matches && currentSphereAttendees.length) {
      if (!sphereDragging) {
        sphereRotation.y += 0.18 + sphereVelocity.y;
        sphereRotation.x += sphereVelocity.x;
        sphereVelocity.x *= 0.94;
        sphereVelocity.y *= 0.94;
      }
      positionAttendeeSphere();
    }
    sphereAnimationFrame = requestAnimationFrame(animate);
  };
  sphereAnimationFrame = requestAnimationFrame(animate);
}

function upsertRsvpRow(event, status, registered) {
  const existingIndex = rsvpRows.findIndex((row) => row.eventId === event.id);
  const row = {
    eventId: event.id,
    eventTitle: event.title,
    status,
    registered,
    displayName: authDisplayName(authUser),
    initials: userInitials(authUser),
    avatarData: profileSettings.avatarData || authUser?.avatarData || "",
    avatarCrop: avatarCrop(),
    emergencyContact: document.querySelector("#eventEmergencyInput")?.value.trim() || "",
    paceGroup: document.querySelector("#eventPaceGroupInput")?.value || "",
    notes: document.querySelector("#eventNotesInput")?.value.trim() || "",
    updatedAt: new Date().toISOString(),
  };
  if (existingIndex >= 0) rsvpRows[existingIndex] = row;
  else rsvpRows.push(row);
  saveRsvpRows();
  syncSevenKRecord("rsvp", row);
}

function openEventPage(eventId) {
  selectedId = eventId;
  renderCards();
  renderDetail();
  renderEventPage();
  setPage("event");
}

function openKarmaEntryPage() {
  setPage("karma-entry");
}

function breadcrumbItems(pageName) {
  const eventTitle = eventById(selectedId).title;
  const map = {
    home: [{ label: "Home", page: "home" }],
    events: [{ label: "Home", page: "home" }, { label: "Events", page: "events" }],
    event: [{ label: "Home", page: "home" }, { label: "Events", page: "events" }, { label: eventTitle, page: "event" }],
    club: [{ label: "Home", page: "home" }, { label: "Run Club", page: "club" }],
    karma: [{ label: "Home", page: "home" }, { label: "Karma Challenge", page: "karma" }],
    "karma-entry": [{ label: "Home", page: "home" }, { label: "Karma Challenge", page: "karma" }, { label: "Entry", page: "karma-entry" }],
    lab: [{ label: "Home", page: "home" }, { label: "7K Lab", page: "lab" }],
    photos: [{ label: "Home", page: "home" }, { label: "Race Photos", page: "photos" }],
    profile: [{ label: "Home", page: "home" }, { label: "Profile", page: "profile" }],
    "profile-account": [{ label: "Home", page: "home" }, { label: "Profile", page: "profile" }, { label: "Account", page: "profile-account" }],
    "profile-setup": [{ label: "Home", page: "home" }, { label: "Profile", page: "profile" }, { label: "Setup", page: "profile-setup" }],
    "profile-regulars": [{ label: "Home", page: "home" }, { label: "Profile", page: "profile" }, { label: "Regulars", page: "profile-regulars" }],
    "profile-notifications": [{ label: "Home", page: "home" }, { label: "Profile", page: "profile" }, { label: "Notifications", page: "profile-notifications" }],
    "profile-heatmap": [{ label: "Home", page: "home" }, { label: "Profile", page: "profile" }, { label: "Heatmap", page: "profile-heatmap" }],
    admin: [{ label: "Home", page: "home" }, { label: "Admin", page: "admin" }],
  };
  return map[pageName] || map.home;
}

function renderBreadcrumb(pageName) {
  const items = breadcrumbItems(pageName);
  breadcrumbNav.hidden = pageName === "home";
  breadcrumbNav.innerHTML = items
    .map((item, index) => `
      <button type="button" data-breadcrumb-page="${item.page}" ${index === items.length - 1 ? "aria-current=\"page\"" : ""}>
        ${item.label}
      </button>
    `)
    .join("<span>/</span>");
}

function eventDateString(event) {
  return `${isoDay(2026, 5, Number(event.date))}T${event.time}:00`;
}

function eventStatusDate(event) {
  return new Date(eventDateString(event));
}

function calendarStatusForDate(date) {
  const now = new Date();
  const eventDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (eventDay.getTime() < today.getTime()) return "past";
  if (eventDay.getTime() === today.getTime()) return "current";
  return "upcoming";
}

function calendarStatusLabel(status) {
  if (status === "past") return "Past";
  if (status === "current") return "Today";
  return "Upcoming";
}

function renderCalendarLists() {
  const calendarRows = events
    .map((event) => {
      const status = calendarStatusForDate(eventStatusDate(event));
      return `
        <button class="calendar-row is-${status}" type="button" data-event-id="${event.id}">
          <span>${event.day} ${event.date}<br>${event.time}<em>${calendarStatusLabel(status)}</em></span>
          <div>
            <strong>${event.title}</strong>
            <small>${event.distance} / ${event.pace} / ${event.after} after</small>
          </div>
          <small>${event.labels.join(" / ")}</small>
        </button>
      `;
    })
    .join("");

  document.querySelector("#calendarEventList").innerHTML = calendarRows;

  document.querySelectorAll("#calendarEventList [data-event-id]").forEach((item) => {
    item.addEventListener("click", () => {
      openEventPage(item.dataset.eventId);
    });
  });
  enhanceMotionTargets();
}

function padDatePart(value) {
  return String(value).padStart(2, "0");
}

function isoDay(year, monthIndex, day) {
  return `${year}-${padDatePart(monthIndex + 1)}-${padDatePart(day)}`;
}

function formatMonthYear(date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function formatEventDateTime(dateString) {
  const date = new Date(dateString);
  return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" })} / ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
}

function seededCalendarEvents() {
  return events.map((event) => ({
    id: event.id,
    sourceId: event.id,
    title: event.title,
    date: eventDateString(event),
    removable: false,
  }));
}

function allCalendarEvents() {
  return [...seededCalendarEvents(), ...customCalendarEvents];
}

function calendarEventsForDay(dateString) {
  return allCalendarEvents().filter((event) => event.date.slice(0, 10) === dateString);
}

function setCalendarTilt() {
  if (!threeCalendarWall) return;
  threeCalendarWall.style.setProperty("--tilt-x", `${calendarTiltX}deg`);
  threeCalendarWall.style.setProperty("--tilt-y", `${calendarTiltY}deg`);
}

function renderThreeDCalendar() {
  if (!threeCalendarWall || !threeCalendarMonth) return;
  const year = calendarDateRef.getFullYear();
  const month = calendarDateRef.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1));
  const rowCount = Math.ceil(days.length / 7);
  const wallCenterRow = (rowCount - 1) / 2;
  threeCalendarMonth.textContent = formatMonthYear(calendarDateRef);
  threeCalendarWall.innerHTML = days
    .map((day, index) => {
      const row = Math.floor(index / 7);
      const rowOffset = row - wallCenterRow;
      const z = Math.max(-80, 42 - Math.abs(rowOffset) * 22);
      const dateString = isoDay(year, month, day.getDate());
      const dayEvents = calendarEventsForDay(dateString);
      const dayStatus = dayEvents.length ? calendarStatusForDate(new Date(dayEvents[0].date)) : "";
      const weekday = day.toLocaleDateString("en-US", { weekday: "short" });
      return `
        <div class="three-day-panel ${dayEvents.length ? `has-events is-${dayStatus}` : ""}" style="--z:${z}px; z-index:${Math.round(100 - Math.abs(rowOffset))}">
          <div class="three-day-content">
            <div class="three-day-top">
              <span class="three-day-number">${day.getDate()}</span>
              <span class="three-day-name">${weekday}</span>
            </div>
            <div class="three-event-field">
              ${dayEvents
                .map((event, eventIndex) => {
                  const left = 8 + (eventIndex * 34) % 86;
                  const top = 8 + Math.floor((eventIndex * 34) / 86) * 28;
                  const status = calendarStatusForDate(new Date(event.date));
                  return `
                    <button
                      class="three-event-dot is-${status} ${activeCalendarEventId === event.id ? "active" : ""}"
                      type="button"
                      data-calendar-event-dot="${event.id}"
                      title="${event.title}"
                      style="left:${left}px; top:${top}px"
                      aria-label="${event.title}"
                    ></button>
                  `;
                })
                .join("")}
            </div>
            <span class="three-day-count">${dayEvents.length ? `${calendarStatusLabel(dayStatus)} / ` : ""}${dayEvents.length} event${dayEvents.length === 1 ? "" : "s"}</span>
          </div>
          ${
            dayEvents.some((event) => event.id === activeCalendarEventId)
              ? dayEvents
                  .filter((event) => event.id === activeCalendarEventId)
                  .map((event) => `
                    <div class="three-event-popover">
                      <header>
                        <div>
                          <strong>${event.title}</strong>
                          <small>${calendarStatusLabel(calendarStatusForDate(new Date(event.date)))} / ${formatEventDateTime(event.date)}</small>
                        </div>
                      </header>
                      <div class="three-event-actions">
                        <button class="secondary-button" type="button" data-calendar-open-event="${event.sourceId || ""}">Open</button>
                        <button class="secondary-button" type="button" data-calendar-save-event="${event.sourceId || ""}">Google</button>
                        ${event.removable ? `<button class="ghost-button" type="button" data-calendar-remove-event="${event.id}">Delete</button>` : ""}
                      </div>
                    </div>
                  `)
                  .join("")
              : ""
          }
        </div>
      `;
    })
    .join("");
  setCalendarTilt();
}

function initThreeDCalendar() {
  if (!threeCalendarWall || !threeCalendarStage) return;
  renderThreeDCalendar();

  calendarPrevMonth?.addEventListener("click", () => {
    calendarDateRef = new Date(calendarDateRef.getFullYear(), calendarDateRef.getMonth() - 1, 1);
    activeCalendarEventId = null;
    renderThreeDCalendar();
  });

  calendarNextMonth?.addEventListener("click", () => {
    calendarDateRef = new Date(calendarDateRef.getFullYear(), calendarDateRef.getMonth() + 1, 1);
    activeCalendarEventId = null;
    renderThreeDCalendar();
  });

  threeCalendarStage.addEventListener("wheel", (event) => {
    calendarTiltX = Math.max(0, Math.min(56, calendarTiltX + event.deltaY * 0.02));
    calendarTiltY = Math.max(-48, Math.min(48, calendarTiltY + event.deltaX * 0.05));
    setCalendarTilt();
  }, { passive: true });

  threeCalendarStage.addEventListener("pointerdown", (event) => {
    calendarDragging = true;
    calendarDragStart = { x: event.clientX, y: event.clientY };
    threeCalendarStage.classList.add("is-dragging");
    threeCalendarStage.setPointerCapture(event.pointerId);
  });

  threeCalendarStage.addEventListener("pointermove", (event) => {
    if (!calendarDragging || !calendarDragStart) return;
    const dx = event.clientX - calendarDragStart.x;
    const dy = event.clientY - calendarDragStart.y;
    calendarTiltY = Math.max(-60, Math.min(60, calendarTiltY + dx * 0.1));
    calendarTiltX = Math.max(0, Math.min(60, calendarTiltX - dy * 0.1));
    calendarDragStart = { x: event.clientX, y: event.clientY };
    setCalendarTilt();
  });

  const stopDrag = () => {
    calendarDragging = false;
    calendarDragStart = null;
    threeCalendarStage.classList.remove("is-dragging");
  };
  threeCalendarStage.addEventListener("pointerup", stopDrag);
  threeCalendarStage.addEventListener("pointercancel", stopDrag);

  threeCalendarWall.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const dot = target.closest("[data-calendar-event-dot]");
    if (dot) {
      activeCalendarEventId = activeCalendarEventId === dot.dataset.calendarEventDot ? null : dot.dataset.calendarEventDot;
      renderThreeDCalendar();
      return;
    }
    const removeButton = target.closest("[data-calendar-remove-event]");
    if (removeButton) {
      const index = customCalendarEvents.findIndex((item) => item.id === removeButton.dataset.calendarRemoveEvent);
      if (index >= 0) customCalendarEvents.splice(index, 1);
      activeCalendarEventId = null;
      renderThreeDCalendar();
      showToast("Calendar event removed.");
      return;
    }
    const openButton = target.closest("[data-calendar-open-event]");
    if (openButton?.dataset.calendarOpenEvent) {
      openEventPage(openButton.dataset.calendarOpenEvent);
      return;
    }
    const saveButton = target.closest("[data-calendar-save-event]");
    if (saveButton?.dataset.calendarSaveEvent) {
      window.open(googleCalendarUrl(eventById(saveButton.dataset.calendarSaveEvent)), "_blank", "noopener,noreferrer");
      showToast("Opening Google Calendar save page.");
    }
  });
}

function setCalendarView(view) {
  activeCalendarView = view === "list" ? "list" : "calendar";
  localStorage.setItem("sevenKCalendarView", activeCalendarView);
  document.querySelectorAll("[data-calendar-view]").forEach((button) => {
    const isActive = button.dataset.calendarView === activeCalendarView;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-current", String(isActive));
  });
  document.querySelectorAll("[data-calendar-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.calendarPanel !== activeCalendarView;
    panel.classList.toggle("is-focused", panel.dataset.calendarPanel === activeCalendarView);
  });
}

function initCalendarViewToggle() {
  document.querySelectorAll("[data-calendar-view]").forEach((button) => {
    button.addEventListener("click", () => {
      setCalendarView(button.dataset.calendarView);
      if (activeCalendarView === "calendar") renderThreeDCalendar();
      showToast(activeCalendarView === "calendar" ? "Calendar view." : "List view.");
    });
  });
  setCalendarView(activeCalendarView);
}

function initKarmaBreakCard() {
  if (!karmaBreakCard || !karmaBreakFace || !karmaBreakDebris) return;

  const maxRange = 45;
  const thresholds = [0.28, 0.5, 0.72, 0.9];
  const chunks = [
    "polygon(12% 8%, 88% 18%, 72% 92%, 20% 78%)",
    "polygon(24% 0, 100% 30%, 62% 100%, 0 76%)",
    "polygon(0 24%, 62% 0, 100% 70%, 28% 100%)",
    "polygon(16% 0, 86% 12%, 100% 88%, 0 66%)",
  ];

  let dragging = false;
  let broken = false;
  let pointerStart = { x: 0, y: 0 };
  let dragStart = { x: 0, y: 0 };
  let lastPointer = { x: 0, y: 0 };
  let lastTime = 0;
  let position = { x: 0, y: 0 };
  let damage = 0;
  let spawned = 0;
  let moved = false;
  let respawnTimer = null;
  let progressTimer = null;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const setCardTransform = () => {
    const transform = `translate(${position.x}px, ${position.y}px) rotate(${position.x * 0.16}deg)`;
    karmaBreakFace.style.transform = transform;
    karmaBreakDebris.style.transform = transform;
  };

  const updateDamageUi = () => {
    karmaBreakCard.style.setProperty("--break-damage", damage.toFixed(2));
    karmaBreakCard.classList.toggle("damage-one", damage >= 0.1);
    karmaBreakCard.classList.toggle("damage-two", damage >= 0.5);
    karmaBreakCard.classList.toggle("damage-three", damage >= 0.86);
    if (karmaBreakDamage) {
      karmaBreakDamage.textContent = damage > 0 ? `${Math.round(damage * 100)}% DMG` : "INTACT";
    }
  };

  const spawnDebris = () => {
    while (spawned < thresholds.length && damage >= thresholds[spawned]) {
      const chip = document.createElement("span");
      chip.className = "karma-debris-chip";
      chip.style.left = `${12 + Math.random() * 76}%`;
      chip.style.top = `${12 + Math.random() * 72}%`;
      chip.style.rotate = `${Math.random() * 260 - 130}deg`;
      chip.style.clipPath = chunks[spawned % chunks.length];
      karmaBreakDebris.appendChild(chip);
      spawned += 1;
    }
  };

  const resetCard = () => {
    window.clearTimeout(respawnTimer);
    window.clearInterval(progressTimer);
    broken = false;
    dragging = false;
    moved = false;
    damage = 0;
    spawned = 0;
    position = { x: 0, y: 0 };
    karmaBreakCard.classList.remove("is-dragging", "is-broken", "damage-one", "damage-two", "damage-three");
    karmaBreakFace.style.transform = "";
    karmaBreakDebris.style.transform = "";
    karmaBreakDebris.innerHTML = "";
    if (karmaBreakRespawn) karmaBreakRespawn.style.width = "0%";
    updateDamageUi();
  };

  const breakCard = () => {
    if (broken) return;
    broken = true;
    dragging = false;
    karmaBreakCard.classList.remove("is-dragging");
    karmaBreakCard.classList.add("is-broken");
    showToast("Commitment broke. It respawns in a second.");

    const startedAt = Date.now();
    progressTimer = window.setInterval(() => {
      const progress = clamp(((Date.now() - startedAt) / 7000) * 100, 0, 100);
      if (karmaBreakRespawn) karmaBreakRespawn.style.width = `${progress}%`;
    }, 80);

    respawnTimer = window.setTimeout(resetCard, 7000);
  };

  const snapBack = () => {
    position = { x: 0, y: 0 };
    setCardTransform();
    karmaBreakCard.classList.remove("is-dragging");
  };

  karmaBreakCard.addEventListener("pointerdown", (event) => {
    if (broken) return;
    dragging = true;
    moved = false;
    pointerStart = { x: event.clientX, y: event.clientY };
    dragStart = { x: event.clientX - position.x, y: event.clientY - position.y };
    lastPointer = { x: event.clientX, y: event.clientY };
    lastTime = Date.now();
    karmaBreakCard.classList.add("is-dragging");
    karmaBreakCard.setPointerCapture?.(event.pointerId);
  });

  karmaBreakCard.addEventListener("pointermove", (event) => {
    if (!dragging || broken) return;
    const now = Date.now();
    const dt = Math.max(1, now - lastTime);
    const velocityX = (event.clientX - lastPointer.x) / dt;
    const velocityY = (event.clientY - lastPointer.y) / dt;
    const rawX = event.clientX - dragStart.x;
    const rawY = event.clientY - dragStart.y;
    const nextX = clamp(rawX, -maxRange, maxRange);
    const nextY = clamp(rawY, -maxRange, maxRange);
    const totalMove = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
    moved = moved || totalMove > 8;
    position = { x: nextX, y: nextY };
    setCardTransform();

    const hitHorizontal = Math.abs(nextX) >= maxRange - 1 && Math.abs(velocityX) > 0.35;
    const hitVertical = Math.abs(nextY) >= maxRange - 1 && Math.abs(velocityY) > 0.45;
    if (hitHorizontal || hitVertical) {
      damage = clamp(damage + (hitHorizontal ? 0.075 : 0.035), 0, 1);
      karmaBreakCard.classList.add("is-flashing");
      window.setTimeout(() => karmaBreakCard.classList.remove("is-flashing"), 120);
      spawnDebris();
      updateDamageUi();
      if (damage >= 1) breakCard();
    } else if (damage > 0 && !moved) {
      damage = clamp(damage - 0.01, 0, 1);
      updateDamageUi();
    }

    lastPointer = { x: event.clientX, y: event.clientY };
    lastTime = now;
  });

  const finishDrag = (openOnTap = true) => {
    if (!dragging) return;
    dragging = false;
    if (openOnTap && !broken && !moved) {
      openKarmaEntryPage();
      showToast("Karma Challenge opened.");
      return;
    }
    if (!broken) snapBack();
  };

  karmaBreakCard.addEventListener("pointerup", () => finishDrag(true));
  karmaBreakCard.addEventListener("pointercancel", () => finishDrag(false));

  karmaBreakCard.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (!broken) {
      openKarmaEntryPage();
      showToast("Karma Challenge opened.");
    }
  });

  updateDamageUi();
}

function setPage(pageName) {
  const canonicalPage = pageName === "calendar" ? "events" : pageName;
  const targetPage = document.querySelector(`[data-page="${canonicalPage}"]`) ? canonicalPage : "home";
  document.body.dataset.currentPage = targetPage;
  document.body.classList.toggle("karma-brand-active", targetPage === "karma" || targetPage === "karma-entry");
  renderBreadcrumb(targetPage);
  document.querySelectorAll(".page").forEach((page) => {
    const isActive = page.dataset.page === targetPage;
    page.classList.toggle("active", isActive);
    if (isActive) {
      page.classList.remove("page-entering");
      void page.offsetWidth;
      page.classList.add("page-entering");
    }
  });

  document.querySelectorAll(".nav a").forEach((link) => {
    const linkPage = link.getAttribute("href").replace("#", "") || "home";
    const activePage =
      targetPage === "event" ? "events" : targetPage === "karma-entry" ? "karma" : targetPage.startsWith("profile-") ? "profile" : targetPage;
    link.classList.toggle("active", linkPage === activePage);
  });

  if (window.location.hash !== `#${targetPage}`) {
    history.replaceState(null, "", `#${targetPage}`);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
  if (targetPage === "events") {
    window.requestAnimationFrame(() => {
      renderThreeDCalendar();
      setCalendarView(activeCalendarView);
    });
  }
  if (targetPage === "lab" && !authUser) {
    showToast("7K Lab is locked. The coach is stretching behind the door.");
  }
  enhanceMotionTargets();
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toastEl.classList.remove("show"), 2400);
}

function readAuthUser() {
  try {
    return JSON.parse(localStorage.getItem(authStorageKey) || "null");
  } catch {
    return null;
  }
}

function saveAuthUser(user) {
  authUser = user;
  localStorage.setItem(authStorageKey, JSON.stringify(user));
  updateAuthUi();
}

function clearAuthUser() {
  authUser = null;
  localStorage.removeItem(authStorageKey);
  updateAuthUi();
}

async function signOutCurrentUser() {
  if (window.SevenKAuth?.configured?.()) {
    await window.SevenKAuth.signOut().catch(() => null);
  }
  clearAuthUser();
}

function userInitials(user) {
  const base = user?.name || user?.email || user?.phone || "Guest";
  const parts = base.replace(/[@+._-]/g, " ").trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] || "7").concat(parts[1]?.[0] || "K").toUpperCase();
}

function authDisplayName(user) {
  if (!user) return "Guest mode";
  return user.name || user.email || user.phone || "7K runner";
}

function readProfileSettings() {
  try {
    return JSON.parse(localStorage.getItem(profileStorageKey) || "{}");
  } catch {
    return {};
  }
}

function saveProfileSettings(settings, sync = true) {
  profileSettings = {
    ...profileSettings,
    ...settings,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(profileStorageKey, JSON.stringify(profileSettings));
  if (authUser) {
    authUser = { ...authUser, ...profileSettings };
    localStorage.setItem(authStorageKey, JSON.stringify(authUser));
  }
  updateAuthUi();
  if (sync) syncSevenKRecord("profile", profilePayload());
}

function readRsvpRows() {
  try {
    return JSON.parse(localStorage.getItem(rsvpStorageKey) || "[]");
  } catch {
    return [];
  }
}

function saveRsvpRows() {
  localStorage.setItem(rsvpStorageKey, JSON.stringify(rsvpRows));
}

function readLabNotes() {
  try {
    return JSON.parse(localStorage.getItem(labStorageKey) || "[]");
  } catch {
    return [];
  }
}

function saveLabNotes() {
  localStorage.setItem(labStorageKey, JSON.stringify(labNotes.slice(0, 24)));
}

function hydrateRsvpRows() {
  rsvpRows.forEach((row) => {
    if (!row?.eventId || !row?.status) return;
    eventRsvpState.set(row.eventId, row.status);
    if (row.registered) eventRegistrations.add(row.eventId);
    if (row.status === "going" && row.registered) rsvped.add(row.eventId);
  });
}

function profilePayload() {
  return {
    displayName: authDisplayName(authUser),
    email: authUser?.email || "",
    phone: authUser?.phone || "",
    method: authUser?.method || "",
    avatarData: profileSettings.avatarData || authUser?.avatarData || "",
    avatarCrop: profileSettings.avatarCrop || authUser?.avatarCrop || { zoom: 112, x: 50, y: 50 },
    updatedAt: profileSettings.updatedAt || new Date().toISOString(),
  };
}

function syncSevenKRecord(type, payload) {
  const bridge = window.SevenKSupabase;
  if (!bridge) return Promise.resolve({ provider: "local" });
  const action = type === "profile" ? bridge.saveProfile : bridge.saveEventRsvp;
  if (typeof action !== "function") return Promise.resolve({ provider: "local" });
  return Promise.resolve(action(payload)).catch(() => {
    showToast("Saved locally. Supabase sync needs project keys or network.");
    return { provider: "local" };
  });
}

async function hydrateSupabaseSession() {
  if (!window.SevenKAuth?.configured?.()) return;
  const user = await window.SevenKAuth.currentUser().catch(() => null);
  if (!user) return;
  saveAuthUser(user);
  await syncSevenKRecord("profile", profilePayload());
}

function avatarCrop() {
  return profileSettings.avatarCrop || authUser?.avatarCrop || { zoom: 112, x: 50, y: 50 };
}

function avatarImageStyle(src, crop = avatarCrop()) {
  if (!src) return "";
  return `style="background-image:url('${src}'); background-size:${crop.zoom || 112}%; background-position:${crop.x || 50}% ${crop.y || 50}%;"`;
}

function avatarMarkup(person, className = "avatar") {
  const src = person.avatarData || "";
  const label = person.initials || initialsFromName(person.name);
  return `<span class="${className}${src ? " has-image" : ""}" ${avatarImageStyle(src, person.avatarCrop)}>${src ? "" : label}</span>`;
}

function initialsFromName(name) {
  const parts = String(name || "7K Runner").replace(/[@+._-]/g, " ").trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] || "7").concat(parts[1]?.[0] || "").toUpperCase();
}

function updateAuthUi() {
  const signedIn = Boolean(authUser);
  document.body.classList.toggle("signed-in", signedIn);
  if (navAuthButton) navAuthButton.textContent = signedIn ? userInitials(authUser) : "Sign in";
  if (accountTriggerAvatar) {
    accountTriggerAvatar.textContent = signedIn ? userInitials(authUser) : "7K";
  }
  if (accountAuthMenuText) accountAuthMenuText.textContent = signedIn ? "Sign out" : "Sign in";
  if (accountMenuLabel) accountMenuLabel.textContent = signedIn ? authDisplayName(authUser) : "7K Account";
  if (profileAccountAuthButton) profileAccountAuthButton.textContent = signedIn ? "Edit sign-in methods" : "Sign in / create account";
  if (profileAccountSignOutButton) profileAccountSignOutButton.hidden = !signedIn;
  if (profileAccountStatus) {
    profileAccountStatus.textContent = signedIn
      ? `${authDisplayName(authUser)} / ${authUser.method}`
      : "Guest mode";
  }
  const profileTitle = document.querySelector('[data-page="profile"] h1');
  const profilePhoto = document.querySelector(".profile-photo");
  if (profileTitle && signedIn) profileTitle.textContent = authDisplayName(authUser).split("@")[0];
  const avatarData = profileSettings.avatarData || authUser?.avatarData || "";
  const crop = avatarCrop();
  if (profilePhoto) {
    profilePhoto.classList.toggle("has-image", Boolean(avatarData));
    profilePhoto.style.backgroundImage = avatarData ? `url('${avatarData}')` : "";
    profilePhoto.style.backgroundSize = `${crop.zoom || 112}%`;
    profilePhoto.style.backgroundPosition = `${crop.x || 50}% ${crop.y || 50}%`;
    profilePhoto.textContent = avatarData ? "" : signedIn ? userInitials(authUser) : "MK";
  }
  updateProfileCropPreview();
}

function openAuthDialog(reason = "account") {
  authReason = reason;
  if (authModeLabel) {
    authModeLabel.textContent =
      reason === "rsvp"
        ? "Sign in once, then your RSVP, reminders, and event tools stay connected."
        : reason === "lab"
        ? "Unlock 7K Lab so coach chats, form checks, and run plans can save to your profile."
        : "Choose how you want to enter the club house.";
  }
  authDialog?.showModal();
}

function completeAuth(user) {
  saveAuthUser({
    ...user,
    signedInAt: new Date().toISOString(),
  });
  if (authReason === "lab") document.body.classList.remove("lab-preview");
  authDialog?.close();
  showToast(
    authReason === "rsvp"
      ? "Account ready. Continue your RSVP."
      : authReason === "lab"
      ? "7K Lab unlocked. Coach is awake."
      : "Signed in. Your 7K profile is ready."
  );
}

function requireAuth(reason = "account") {
  if (authUser) return true;
  openAuthDialog(reason);
  showToast("Sign in first so we can save this to your profile.");
  return false;
}

function updateProfileCropPreview() {
  if (!profileCropPreview) return;
  const avatarData = profileSettings.avatarData || authUser?.avatarData || "";
  const crop = avatarCrop();
  profileCropPreview.classList.toggle("has-image", Boolean(avatarData));
  profileCropPreview.style.backgroundImage = avatarData ? `url('${avatarData}')` : "";
  profileCropPreview.style.backgroundSize = `${crop.zoom || 112}%`;
  profileCropPreview.style.backgroundPosition = `${crop.x || 50}% ${crop.y || 50}%`;
  profileCropPreview.textContent = avatarData ? "" : authUser ? userInitials(authUser) : "MK";
  if (profilePhotoZoom) profilePhotoZoom.value = String(crop.zoom || 112);
  if (profilePhotoX) profilePhotoX.value = String(crop.x || 50);
  if (profilePhotoY) profilePhotoY.value = String(crop.y || 50);
}

function updateAvatarCropFromControls(sync = false) {
  const crop = {
    zoom: Number(profilePhotoZoom?.value || 112),
    x: Number(profilePhotoX?.value || 50),
    y: Number(profilePhotoY?.value || 50),
  };
  profileSettings = { ...profileSettings, avatarCrop: crop };
  updateAuthUi();
  if (sync) saveProfileSettings({ avatarCrop: crop });
}

function imageFileToAvatarData(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("Missing file"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 640;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = size;
        canvas.height = size;
        const scale = Math.max(size / img.width, size / img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        context.drawImage(img, (size - width) / 2, (size - height) / 2, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.86));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function handleProfilePhotoFile(file, source = "profile") {
  if (!file) return;
  if (!requireAuth("account")) return;
  const avatarData = await imageFileToAvatarData(file).catch(() => "");
  if (!avatarData) {
    showToast("That image could not be read. Try another photo.");
    return;
  }
  saveProfileSettings({
    avatarData,
    avatarCrop: profileSettings.avatarCrop || { zoom: 112, x: 50, y: 50 },
  });
  renderEventPage();
  showToast(source === "rsvp" ? "Profile picture attached to RSVP." : "Profile picture saved.");
}

async function sendPhoneCode(phone) {
  if (window.SevenKAuth?.sendSmsCode) {
    return window.SevenKAuth.sendSmsCode(phone);
  }
  return { provider: "prototype", code: "123456" };
}

async function verifyPhoneCode(phone, code) {
  if (window.SevenKAuth?.verifySmsCode) {
    return window.SevenKAuth.verifySmsCode(phone, code);
  }
  return code === "123456";
}

function initHorizonHero() {
  if (!homeHorizonCanvas) return;
  const ctx = homeHorizonCanvas.getContext("2d");
  const hero = homeHorizonCanvas.closest(".horizon-hero");
  const stars = Array.from({ length: 180 }, () => ({
    x: Math.random(),
    y: Math.random() * 0.72,
    z: 0.25 + Math.random() * 1.25,
    r: 0.4 + Math.random() * 1.8,
    pulse: Math.random() * Math.PI * 2,
  }));
  const resize = () => {
    const rect = hero.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    homeHorizonCanvas.width = Math.max(1, Math.floor(rect.width * ratio));
    homeHorizonCanvas.height = Math.max(1, Math.floor(rect.height * ratio));
    homeHorizonCanvas.style.width = `${rect.width}px`;
    homeHorizonCanvas.style.height = `${rect.height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };
  const drawMountain = (width, height, baseY, amplitude, color, offset) => {
    ctx.beginPath();
    ctx.moveTo(-40, height);
    ctx.lineTo(-40, baseY);
    for (let x = -40; x <= width + 40; x += 28) {
      const y =
        baseY +
        Math.sin((x + offset) * 0.012) * amplitude +
        Math.cos((x + offset) * 0.021) * amplitude * 0.42;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width + 40, height);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };
  const render = (time = 0) => {
    const rect = hero.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const pageMax = document.documentElement.scrollHeight - window.innerHeight || 1;
    const progress = Math.min(window.scrollY / pageMax, 1);
    if (homeScrollProgress) homeScrollProgress.style.width = `${progress * 100}%`;

    ctx.clearRect(0, 0, width, height);
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, "#040609");
    sky.addColorStop(0.5, "#0a1024");
    sky.addColorStop(1, "#030403");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(Math.sin(time * 0.00015) * 14, progress * -70);
    stars.forEach((star) => {
      const twinkle = 0.48 + Math.sin(time * 0.002 + star.pulse) * 0.34;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,244,${0.3 + twinkle * 0.58})`;
      ctx.arc(star.x * width, star.y * height, star.r * star.z, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    const glow = ctx.createRadialGradient(width * 0.52, height * 0.48, 20, width * 0.52, height * 0.48, width * 0.45);
    glow.addColorStop(0, "rgba(0,255,0,0.16)");
    glow.addColorStop(0.36, "rgba(31,51,137,0.18)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(0,255,0,0.16)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i += 1) {
      const y = height * 0.6 + i * 32 + progress * 45;
      ctx.beginPath();
      ctx.moveTo(width * 0.12, y);
      ctx.quadraticCurveTo(width * 0.5, y - 90 - i * 7, width * 0.9, y + Math.sin(i + time * 0.001) * 22);
      ctx.stroke();
    }

    drawMountain(width, height, height * 0.74 + progress * 90, 42, "rgba(10, 18, 38, 0.92)", time * 0.035);
    drawMountain(width, height, height * 0.8 + progress * 50, 58, "rgba(3, 8, 18, 0.95)", time * 0.055);

    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(width * 0.18, height * 0.78);
    ctx.bezierCurveTo(width * 0.34, height * 0.68, width * 0.52, height * 0.86, width * 0.78, height * 0.7);
    ctx.stroke();

    window.requestAnimationFrame(render);
  };
  resize();
  window.addEventListener("resize", resize);
  window.requestAnimationFrame(render);
}

function initLabWave() {
  if (!labWaveCanvas) return;
  const ctx = labWaveCanvas.getContext("2d");
  const panel = labWaveCanvas.closest(".lab-wave-panel");
  if (!ctx || !panel) return;

  const promptBase = "Ask the 7K coach about";
  const promptSuggestions = [
    " pace for Night Loop",
    " recovery after 10K",
    " cadence and arm swing",
    " race week nerves",
    " FreeMoCap form check",
    " easy run discipline",
  ];
  let promptIndex = 0;
  let promptChar = 0;
  let deleting = false;

  const stepPlaceholder = () => {
    if (!labCoachInput || labCoachInput.value) return;
    const current = promptSuggestions[promptIndex % promptSuggestions.length];
    if (!deleting) {
      promptChar += 1;
      if (promptChar >= current.length + 12) deleting = true;
    } else {
      promptChar -= 1;
      if (promptChar <= 0) {
        promptChar = 0;
        deleting = false;
        promptIndex = (promptIndex + 1) % promptSuggestions.length;
      }
    }
    labCoachInput.placeholder = `${promptBase}${current.slice(0, Math.min(promptChar, current.length))}...`;
  };

  window.setInterval(stepPlaceholder, 78);

  let width = 1;
  let height = 1;
  let ratio = 1;
  const mouse = { x: 0, y: 0, active: false };
  const glowMemory = [];

  const resize = () => {
    const rect = panel.getBoundingClientRect();
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    labWaveCanvas.width = Math.floor(width * ratio);
    labWaveCanvas.height = Math.floor(height * ratio);
    labWaveCanvas.style.width = `${width}px`;
    labWaveCanvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const pointer = (event) => {
    const rect = labWaveCanvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
    mouse.active = true;
  };

  const leave = () => {
    mouse.active = false;
  };

  labWaveCanvas.addEventListener("pointermove", pointer);
  labWaveCanvas.addEventListener("pointerdown", pointer);
  labWaveCanvas.addEventListener("pointerleave", leave);
  window.addEventListener("pointerup", leave);

  const drawTaperedBar = (x, baseY, barWidth, barHeight, alpha, glow, time, index) => {
    const lean = -0.34;
    const topWidth = Math.max(2, barWidth * (0.18 + glow * 0.2));
    const drift = Math.sin(time * 0.0008 + index * 0.7) * 5;

    ctx.save();
    ctx.translate(x + drift, baseY);
    ctx.rotate(lean);
    ctx.beginPath();
    ctx.moveTo(-barWidth / 2, 0);
    ctx.lineTo(barWidth / 2, 0);
    ctx.lineTo(topWidth / 2, -barHeight);
    ctx.lineTo(-topWidth / 2, -barHeight);
    ctx.closePath();

    const barGradient = ctx.createLinearGradient(0, 0, 0, -barHeight);
    barGradient.addColorStop(0, `rgba(31,61,188,${alpha * 0.2})`);
    barGradient.addColorStop(0.55, `rgba(31,61,188,${alpha * 0.5})`);
    barGradient.addColorStop(1, `rgba(125,220,255,${alpha * 0.74})`);
    ctx.fillStyle = barGradient;
    ctx.shadowColor = glow > 0.05 ? "rgba(0,255,102,0.72)" : "rgba(31,61,188,0.35)";
    ctx.shadowBlur = 10 + glow * 34;
    ctx.fill();

    if (glow > 0.2) {
      ctx.globalAlpha = glow * 0.55;
      ctx.fillStyle = "#00ff66";
      ctx.fill();
    }
    ctx.restore();
  };

  const render = (time = 0) => {
    window.requestAnimationFrame(render);
    if (document.body.dataset.currentPage !== "lab") return;
    const waveTime = prefersReducedMotion.matches ? 0 : time;

    ctx.clearRect(0, 0, width, height);
    const background = ctx.createLinearGradient(0, 0, width, height);
    background.addColorStop(0, "rgba(4,10,12,0.98)");
    background.addColorStop(0.55, "rgba(8,12,22,0.94)");
    background.addColorStop(1, "rgba(2,5,9,0.98)");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    const field = ctx.createRadialGradient(width * 0.74, height * 0.36, 12, width * 0.74, height * 0.36, width * 0.48);
    field.addColorStop(0, "rgba(31,61,188,0.32)");
    field.addColorStop(0.48, "rgba(0,255,102,0.08)");
    field.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = field;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(0,255,102,0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 7; i += 1) {
      const y = height * 0.2 + i * 30;
      ctx.beginPath();
      ctx.moveTo(0, y + Math.sin(waveTime * 0.0006 + i) * 14);
      ctx.bezierCurveTo(width * 0.34, y - 46, width * 0.62, y + 58, width, y - 18);
      ctx.stroke();
    }

    const barWidth = 12;
    const gap = 10;
    const extendLeft = 210;
    const span = width + extendLeft + 80;
    const count = Math.max(22, Math.floor(span / (barWidth + gap)));
    const startX = -extendLeft;
    const baseY = height - (width < 520 ? 22 : 34);

    for (let i = 0; i < count; i += 1) {
      const x = startX + i * (barWidth + gap);
      const t = i / Math.max(1, count - 1);
      const waveA = Math.sin(waveTime * 0.0012 + t * 9.4) * 0.5 + 0.56;
      const waveB = Math.sin(waveTime * 0.00074 + t * 18.5 + 1.6) * 0.5 + 0.5;
      const barHeight = Math.max(22, waveA * height * 0.62 + waveB * height * 0.22);
      const dist = Math.abs(mouse.x - x);
      const proximity = mouse.active ? Math.max(0, 1 - dist / Math.max(180, width * 0.34)) : 0;
      glowMemory[i] = (glowMemory[i] || 0) * 0.88 + proximity * 0.28;
      const alpha = 0.24 + t * 0.14 + glowMemory[i] * 0.52;
      drawTaperedBar(x, baseY, barWidth, barHeight, alpha, glowMemory[i], waveTime, i);
    }

    ctx.globalAlpha = 0.11;
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 46; i += 1) {
      const x = (Math.sin(waveTime * 0.00011 + i * 31.7) * 0.5 + 0.5) * width;
      const y = (Math.cos(waveTime * 0.00013 + i * 19.2) * 0.5 + 0.5) * height;
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.globalAlpha = 1;
  };

  resize();
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(resize);
    observer.observe(panel);
  } else {
    window.addEventListener("resize", resize);
  }
  window.requestAnimationFrame(render);
}

function escapeLabHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function setLabToolActive(toolId) {
  document.querySelectorAll(".lab-tool-card").forEach((card) => {
    const button = card.querySelector("button");
    card.classList.toggle("is-active", button?.id === toolId);
  });
}

function showLabWorkbench({ label = "Lab output", title = "Coach memory", status = "ready", html = "", actions = "" }) {
  if (!labWorkbenchCard || !labWorkbenchBody) return;
  labWorkbenchCard.hidden = false;
  if (labWorkbenchLabel) labWorkbenchLabel.textContent = label;
  if (labWorkbenchTitle) labWorkbenchTitle.textContent = title;
  if (labWorkbenchStatus) labWorkbenchStatus.textContent = status;
  labWorkbenchBody.innerHTML = html || "<p>No output yet.</p>";
  if (labWorkbenchActions) labWorkbenchActions.innerHTML = actions;
}

function appendCoachBubble(kind, text) {
  if (!labCoachTranscript) return;
  const bubble = document.createElement("div");
  bubble.className = `coach-bubble coach-bubble-${kind}`;
  bubble.textContent = text;
  labCoachTranscript.appendChild(bubble);
  labCoachTranscript.scrollTop = labCoachTranscript.scrollHeight;
}

function currentRunnerContext() {
  const event = eventById(selectedId);
  const userName = authDisplayName(authUser);
  const goingRows = rsvpRows.filter((row) => row.status === "going");
  return {
    event,
    userName,
    goingCount: goingRows.length,
    hasAvatar: Boolean(profileSettings.avatarData || authUser?.avatarData),
  };
}

function labCoachReply(prompt) {
  const lower = prompt.toLowerCase();
  const { event, userName } = currentRunnerContext();
  if (lower.includes("pace") || lower.includes("speed")) {
    return `${userName}, lock the first third at conversation pace. For ${event.title}, that means ${event.pace.toLowerCase()} until everyone settles, then only lift if your breathing is still calm.`;
  }
  if (lower.includes("recover") || lower.includes("sore") || lower.includes("rest")) {
    return "Recovery plan: 20-30 minutes easy walk, water before caffeine, calves/hips mobility, and no hard effort tomorrow. If pain is sharp or changes your stride, stop and get it checked.";
  }
  if (lower.includes("form") || lower.includes("cadence") || lower.includes("arm") || lower.includes("freemocap")) {
    return "Form cue: film 8-12 seconds from the side and front. I will look for tall posture, arms crossing centerline, overstride, hip drop, and cadence rhythm. Keep the clip simple.";
  }
  if (lower.includes("night") || lower.includes("dark")) {
    return "Night run kit: reflective layer, small light, relaxed warmup, and no headphones in traffic zones. Start easier than you think. Streetlight pace wins.";
  }
  if (lower.includes("karma") || lower.includes("challenge")) {
    return "For Karma Challenge, pick a goal boring enough to repeat. The win is consistency, not drama. Bank the money back by making the daily target almost automatic.";
  }
  if (lower.includes("race") || lower.includes("marathon")) {
    return "Race week rule: reduce volume, keep two short shakeouts, sleep like it is training, and stop testing new gear. Confidence comes from boring choices.";
  }
  return `For ${event.title}: keep the plan simple. Warm up 8 minutes, run the first 2K controlled, check breathing before changing pace, and write one note after the run so your Lab memory gets smarter.`;
}

function labCoachEventContext(event) {
  return {
    id: event.id,
    title: event.title,
    day: event.day,
    date: event.date,
    time: event.time,
    distance: event.distance,
    pace: event.pace,
    vibe: event.vibe,
    description: event.description,
    meetup: event.meetup,
    itinerary: event.itinerary,
    after: event.after,
    sponsor: event.sponsor,
    road: event.road,
  };
}

async function askChatGptCoach(prompt) {
  const { event, userName, goingCount, hasAvatar } = currentRunnerContext();
  const recentNotes = labNotes.slice(0, 3).map((note) => ({
    type: note.type,
    eventTitle: note.eventTitle,
    text: note.text,
    createdAt: note.createdAt,
  }));

  try {
    const response = await fetch("/api/ai-coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        context: {
          runnerName: userName,
          selectedEvent: labCoachEventContext(event),
          goingCount,
          hasProfilePicture: hasAvatar,
          recentLabNotes: recentNotes,
        },
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    return typeof data?.reply === "string" && data.reply.trim() ? data : null;
  } catch {
    return null;
  }
}

function saveLabOutput(type, text) {
  const note = {
    id: `lab-${Date.now()}`,
    type,
    text,
    eventId: selectedId,
    eventTitle: eventById(selectedId).title,
    createdAt: new Date().toISOString(),
  };
  labNotes.unshift(note);
  saveLabNotes();
  saveProfileSettings({ labNotesCount: labNotes.length }, false);
  return note;
}

function renderLabHistory() {
  const rows = labNotes.length
    ? labNotes
        .map((note) => `
          <li>
            <strong>${note.type} / ${note.eventTitle || "7K Lab"}</strong>
            <span>${escapeLabHtml(note.text)}</span>
          </li>
        `)
        .join("")
    : `<li><strong>No saved notes yet.</strong><span>Ask the coach, build a plan, or save a form-check result.</span></li>`;

  showLabWorkbench({
    label: "Saved memory",
    title: "Lab history",
    status: `${labNotes.length} notes`,
    html: `<ul class="lab-history-list">${rows}</ul>`,
    actions: `<button class="secondary-button" type="button" data-lab-action="clear-history">Clear history</button>`,
  });
  setLabToolActive("");
}

function renderLabPlan() {
  const event = eventById(selectedId);
  const rsvp = rsvpRows.find((row) => row.eventId === event.id);
  const plan = [
    ["Today", `Easy 25-35 minutes. Finish with 4 relaxed strides if legs feel normal.`],
    ["Before event", `${event.title}: arrive 15 minutes early, start at ${event.pace.toLowerCase()}, and do not chase the front group before 2K.`],
    ["After", `${event.after} after, then write a 1-line note: energy / breathing / soreness.`],
  ];
  if (rsvp?.status === "going") {
    plan.unshift(["RSVP context", `You are marked Going for ${event.title}, so this plan protects that run.`]);
  }
  activeLabOutput = plan.map(([label, copy]) => `${label}: ${copy}`).join(" ");
  showLabWorkbench({
    label: "Run plan",
    title: "This week",
    status: "generated",
    html: `<ul class="lab-workbench-list">${plan.map(([label, copy]) => `<li><strong>${escapeLabHtml(label)}</strong><span>${escapeLabHtml(copy)}</span></li>`).join("")}</ul>`,
    actions: `<button class="primary-button" type="button" data-lab-action="save-current">Save plan</button><button class="secondary-button" type="button" data-lab-action="ask-followup">Ask follow-up</button>`,
  });
  setLabToolActive("labPlanButton");
}

function renderLabFormCheck(file) {
  const fileLine = file
    ? `Clip staged: ${file.name}. ${Math.round(file.size / 1024)} KB ready for the future FreeMoCap pipeline.`
    : "Choose a short side/front running clip. For now, the prototype prepares the checklist and saves the session locally.";
  const cues = [
    ["Camera", "Side view plus front view, 8-12 seconds each."],
    ["Coach scan", "Posture, overstride, hip drop, arm crossover, cadence rhythm."],
    ["Runner cue", "Think tall ribs, quiet shoulders, feet landing under you."],
  ];
  activeLabOutput = `${fileLine} ${cues.map(([label, copy]) => `${label}: ${copy}`).join(" ")}`;
  showLabWorkbench({
    label: "Form check",
    title: "FreeMoCap queue",
    status: file ? "clip staged" : "waiting clip",
    html: `<p>${escapeLabHtml(fileLine)}</p><ul class="lab-workbench-list">${cues.map(([label, copy]) => `<li><strong>${escapeLabHtml(label)}</strong><span>${escapeLabHtml(copy)}</span></li>`).join("")}</ul>`,
    actions: `<button class="primary-button" type="button" data-lab-action="pick-video">Choose clip</button><button class="secondary-button" type="button" data-lab-action="save-current">Save form note</button>`,
  });
  setLabToolActive("labFormCheckButton");
}

function renderLabPreview() {
  document.body.classList.add("lab-preview");
  showLabWorkbench({
    label: "Preview mode",
    title: "Locked until sign-in",
    status: "demo",
    html: `<p>This is the customer view after signing in: coach chat, FreeMoCap-ready form checks, weekly plans, and saved Lab memory. Sign in to save real notes to your runner profile.</p>`,
    actions: `<button class="primary-button" type="button" data-lab-action="unlock">Unlock Lab</button>`,
  });
}

async function sendLabCoachPrompt() {
  if (!requireAuth("lab")) return;
  const prompt = labCoachInput?.value.trim();
  if (!prompt) {
    showLabWorkbench({
      label: "Coach prompt",
      title: "Ask something specific",
      status: "empty",
      html: "<p>Try: “How should I pace Night Loop?” or “Check my cadence after a hard week.”</p>",
    });
    showToast("Ask the coach about pace, recovery, form, or your next event.");
    return;
  }
  appendCoachBubble("user", prompt);
  if (labCoachInput) labCoachInput.value = "";
  if (labCoachSendButton) {
    labCoachSendButton.disabled = true;
    labCoachSendButton.textContent = "Thinking";
  }
  showLabWorkbench({
    label: "Coach answer",
    title: "ChatGPT is checking context",
    status: "thinking",
    html: "<p>The coach is reading your selected event, RSVP context, and recent Lab notes.</p>",
  });

  try {
    const chatGptResult = await askChatGptCoach(prompt);
    const reply = chatGptResult?.reply || labCoachReply(prompt);
    const source = chatGptResult ? "ChatGPT / OpenAI" : "Local fallback";
    appendCoachBubble("ai", reply);
    activeLabOutput = reply;
    showLabWorkbench({
      label: "Coach answer",
      title: "Latest advice",
      status: chatGptResult ? "ChatGPT" : "local fallback",
      html: `<p>${escapeLabHtml(reply)}</p><p><strong>Source</strong> ${escapeLabHtml(source)}</p>`,
      actions: `<button class="primary-button" type="button" data-lab-action="save-current">Save answer</button><button class="secondary-button" type="button" data-lab-action="build-plan">Turn into plan</button>`,
    });
    if (!chatGptResult) {
      showToast("ChatGPT backend is not configured yet. Local coach answered.");
    }
  } finally {
    if (labCoachSendButton) {
      labCoachSendButton.disabled = false;
      labCoachSendButton.textContent = "Send";
    }
  }
}

function eventCalendarInviteWindow(event, durationMinutes = 75) {
  const month = 5;
  const day = Number(event.date);
  const [hour, minute] = event.time.split(":").map(Number);
  const start = new Date(2026, month, day, hour, minute || 0);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  return { start, end };
}

function formatGoogleDate(date) {
  return date.toISOString().replace(/[-:]|\.\d{3}/g, "");
}

function formatICSDate(date) {
  return formatGoogleDate(date);
}

function calendarDescription(event) {
  return `${event.description}\\n\\nDistance: ${event.distance}\\nPace: ${event.pace}\\nAfter: ${event.after}\\nHosted by 7K Running Club`;
}

function googleCalendarUrl(event) {
  const { start, end } = eventCalendarInviteWindow(event);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `7K Run: ${event.title}`,
    dates: `${formatGoogleDate(start)}/${formatGoogleDate(end)}`,
    details: calendarDescription(event),
    location: "Ulaanbaatar, Mongolia",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function escapeICS(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function downloadCalendarInvite(event) {
  const { start, end } = eventCalendarInviteWindow(event);
  const stamp = formatICSDate(new Date());
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//7K Running Club//Run Invite//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@the7k.club`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(end)}`,
    `SUMMARY:${escapeICS(`7K Run: ${event.title}`)}`,
    `DESCRIPTION:${escapeICS(calendarDescription(event))}`,
    "LOCATION:Ulaanbaatar\\, Mongolia",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.id}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function getClockParts() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: clockTimezone,
    hour12: false,
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
    .formatToParts(new Date())
    .reduce((acc, part) => {
      if (part.type !== "literal") acc[part.type] = part.value;
      return acc;
    }, {});

  const hour = Number(parts.hour) % 24;
  return {
    hour,
    minute: Number(parts.minute),
    second: Number(parts.second),
    month: Number(parts.month) - 1,
    day: Number(parts.day),
  };
}

function initGlassClock() {
  if (!clockHourMarks || !clockHourHand || !clockMinuteHand || !clockSecondHand) return;

  clockHourMarks.replaceChildren();
  for (let index = 0; index < 60; index += 1) {
    if (index % 5 === 0) {
      const hourIndex = index / 5;
      const hourNumber = document.createElement("div");
      const angle = (index * 6 * Math.PI) / 180;
      const radius = 69;
      hourNumber.className = "clock-number";
      hourNumber.style.left = `${90 + Math.sin(angle) * radius - 12}px`;
      hourNumber.style.top = `${90 - Math.cos(angle) * radius - 9}px`;
      hourNumber.textContent = hourIndex === 0 ? "12" : String(hourIndex);
      clockHourMarks.appendChild(hourNumber);
    } else {
      const minuteMarker = document.createElement("div");
      minuteMarker.className = "minute-marker";
      minuteMarker.style.transform = `rotate(${index * 6}deg)`;
      clockHourMarks.appendChild(minuteMarker);
    }
  }

  const updateClock = () => {
    const now = new Date();
    const parts = getClockParts();
    const milliseconds = now.getMilliseconds();
    const hourDegrees = (parts.hour % 12) * 30 + (parts.minute / 60) * 30;
    const minuteDegrees = parts.minute * 6 + (parts.second / 60) * 6;
    const secondDegrees = parts.second * 6 + (milliseconds / 1000) * 6;

    clockHourHand.style.transform = `rotate(${hourDegrees}deg)`;
    clockMinuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
    clockSecondHand.style.transform = `rotate(${secondDegrees}deg)`;

    if (clockDateEl) {
      clockDateEl.textContent = `${clockMonthNames[parts.month]} ${parts.day}`;
    }

    if (glassClockDigital) {
      glassClockDigital.textContent = `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
    }

    window.requestAnimationFrame(updateClock);
  };

  updateClock();
}

function formatCount(count) {
  return Number(count).toLocaleString();
}

function raceUploadCount(raceName) {
  return racePhotos.filter((photo) => photo.race === raceName && photo.uploaded).length;
}

function updateSelectedRaceStats() {
  selectedRaceStat.textContent = selectedRace;
  photoCountStat.textContent = formatCount((racePhotoBaseCounts[selectedRace] || 0) + raceUploadCount(selectedRace));
}

function photoMatchesQuery(photo, query) {
  if (!query) return true;
  const haystack = `${photo.bib} ${photo.title} ${photo.race} ${photo.zone} ${photo.meta}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function uniqueRaceNames() {
  return Array.from(new Set([...Object.keys(racePhotoBaseCounts), ...racePhotos.map((photo) => photo.race)]));
}

function photosForRace(raceName) {
  return racePhotos.filter((photo) => photo.race === raceName);
}

function raceFolderCount(raceName) {
  return (racePhotoBaseCounts[raceName] || 0) + raceUploadCount(raceName);
}

function renderRaceFolders() {
  if (!raceFolderGrid) return;
  raceFolderGrid.innerHTML = uniqueRaceNames()
    .map((raceName) => {
      const folderPhotos = photosForRace(raceName);
      const previews = folderPhotos.slice(0, 3);
      const count = raceFolderCount(raceName);
      return `
        <button class="race-folder ${raceName === selectedRace ? "active" : ""}" type="button" data-race-folder="${raceName}" aria-label="Open ${raceName} folder">
          <span class="folder-glow"></span>
          <span class="folder-stage">
            <span class="folder-back"></span>
            <span class="folder-tab"></span>
            <span class="folder-preview-stack">
              ${previews
                .map((photo, index) => `
                  <span
                    class="folder-preview-card"
                    style="--folder-index:${index}; background-image: linear-gradient(180deg, transparent, rgba(0,0,0,0.62)), url('${photo.src}')"
                  >
                    <small>${photo.bib}</small>
                  </span>
                `)
                .join("")}
            </span>
            <span class="folder-front"></span>
            <span class="folder-shine"></span>
          </span>
          <strong>${raceName}</strong>
          <small>${formatCount(count)} photos / official race folder</small>
          <em>${raceName === selectedRace ? "Open now" : "Hover to explore"}</em>
        </button>
      `;
    })
    .join("");
  enhanceMotionTargets();
}

function photoById(photoId) {
  return racePhotos.find((photo) => photo.id === photoId);
}

function hqPhotoSrc(photo) {
  if (!photo) return "";
  if (photo.originalSrc) return photo.originalSrc;
  if (!photo.src || photo.src.startsWith("data:")) return photo.src;
  try {
    const url = new URL(photo.src);
    url.searchParams.set("fit", "max");
    url.searchParams.set("w", "2600");
    url.searchParams.set("q", "100");
    return url.toString();
  } catch {
    return photo.src;
  }
}

function photoFileName(photo) {
  return `7k-${photo.race}-${photo.bib}-${photo.zone}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .concat(".jpg");
}

function openPhotoLightbox(photoId) {
  const photo = photoById(photoId);
  if (!photo) return;
  activeLightboxPhotoId = photo.id;
  photoLightboxTitle.textContent = `Bib ${photo.bib} / ${photo.title || photo.zone}`;
  photoLightboxMeta.textContent = `${photo.race} / ${photo.zone}`;
  photoLightboxImage.src = hqPhotoSrc(photo);
  photoLightboxImage.alt = `Full size race photo for bib ${photo.bib}`;
  photoLightbox.showModal();
}

async function downloadPhoto(photoId) {
  const photo = photoById(photoId);
  if (!photo) return;
  const src = hqPhotoSrc(photo);
  const fileName = photoFileName(photo);

  try {
    const response = await fetch(src);
    if (!response.ok) throw new Error("Photo fetch failed");
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    showToast("HQ original photo download started.");
  } catch {
    const link = document.createElement("a");
    link.href = src;
    link.download = fileName;
    link.target = "_blank";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast("Opening the HQ original photo.");
  }
}

function renderRacePhotoGrid() {
  const photos = racePhotos.filter((photo) => photo.race === selectedRace && photoMatchesQuery(photo, photoSearchQuery));
  selectedFolderPhotoIds = photos.map((photo) => photo.id);

  if (!photos.length) {
    racePhotoGrid.innerHTML = `
      <article class="race-photo-card">
        <div class="photo-thumb photo-c"><span>7K</span></div>
        <strong>No photos in this view yet</strong>
        <small>${selectedRace} / try another bib, race, or folder</small>
        <button type="button" data-download-photo="">Download HQ</button>
      </article>
    `;
    updateSelectedRaceStats();
    renderRaceFolders();
    return;
  }

  racePhotoGrid.innerHTML = photos
    .map((photo, index) => {
      const thumbStyle = photo.src
        ? `style="background-image: linear-gradient(180deg, transparent, rgba(0,0,0,0.65)), url('${photo.src}'); background-size: cover; background-position: center;"`
        : "";
      return `
        <article class="race-photo-card gallery-reveal" style="--gallery-index:${index}" data-race-photo-id="${photo.id}" data-race="${photo.race}">
          <button class="photo-thumb ${photo.thumbClass || ""}" type="button" data-open-photo="${photo.id}" ${thumbStyle} aria-label="Open full size photo for bib ${photo.bib}">
            <span>7K</span>
          </button>
          <strong>Bib ${photo.bib} / ${photo.title || photo.zone}</strong>
          <small>${photo.meta}</small>
          <button type="button" data-download-photo="${photo.id}">Download HQ</button>
        </article>
      `;
    })
    .join("");
  updateSelectedRaceStats();
  renderRaceFolders();
  revealRaceGallery();
  enhanceMotionTargets();
}

function revealRaceGallery() {
  const cards = document.querySelectorAll(".gallery-reveal");
  if (!("IntersectionObserver" in window)) {
    cards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  cards.forEach((card) => observer.observe(card));
}

function enhanceMotionTargets() {
  if (prefersReducedMotion.matches) return;

  document
    .querySelectorAll(
      ".topbar, .hero-panel, .section-heading, .event-card, .detail-panel, .calendar-hero, .calendar-day, .calendar-row, .club-cover, .club-side-panel, .identity-card, .aura-panel, .passport-panel, .heatmap-panel, .passport-wall article, .race-photo-hero, .race-selector button, .race-albums article, .race-albums button, .race-photo-card"
      + ", .platform-tabs-section, .platform-tabs-top, .clipped-platform, .platform-tab, .platform-card, .pledge-section, .pledge-card"
    )
    .forEach((item, index) => {
      if (enhancedMotionTargets.has(item)) return;
      enhancedMotionTargets.add(item);
      item.classList.add("reveal-motion");
      item.style.setProperty("--reveal-index", String(index % 9));
      revealObserver?.observe(item);
    });

  document.querySelectorAll(tiltTargets).forEach((item) => {
    if (item.dataset.tiltReady) return;
    item.dataset.tiltReady = "true";
    item.addEventListener("pointermove", handleTiltMove);
    item.addEventListener("pointerleave", resetTilt);
  });
}

const revealObserver =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      )
    : null;

function handleTiltMove(event) {
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  target.style.setProperty("--tilt-x", `${(0.5 - y) * 6}deg`);
  target.style.setProperty("--tilt-y", `${(x - 0.5) * 7}deg`);
  target.style.setProperty("--glow-x", `${x * 100}%`);
  target.style.setProperty("--glow-y", `${y * 100}%`);
}

function resetTilt(event) {
  const target = event.currentTarget;
  target.style.setProperty("--tilt-x", "0deg");
  target.style.setProperty("--tilt-y", "0deg");
  target.style.setProperty("--glow-x", "50%");
  target.style.setProperty("--glow-y", "50%");
}

function initButtonRipples() {
  document.addEventListener("pointerdown", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest(rippleTargets);
    if (!button || prefersReducedMotion.matches) return;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    ripple.className = "motion-ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    button.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 620);
  });
}

function initCursorLight() {
  if (prefersReducedMotion.matches || window.innerWidth < 900) return;
  const light = document.createElement("div");
  light.className = "runner-cursor-light";
  document.body.appendChild(light);
  window.addEventListener("pointermove", (event) => {
    light.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
  });
}

function initMotionExperience() {
  if (prefersReducedMotion.matches) {
    document.body.classList.add("motion-reduced");
    return;
  }
  document.body.classList.add("motion-ready");
  initCursorLight();
  enhanceMotionTargets();
}

function initResizableNavbar() {
  const rail = document.querySelector(".rail");
  const toggle = document.querySelector("#mobileNavToggle");
  if (!rail) return;

  const closeMobileNav = () => {
    rail.classList.remove("mobile-open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Open navigation");
  };

  const syncCompactState = () => {
    rail.classList.toggle("is-compact", window.scrollY > 100);
  };

  syncCompactState();
  window.addEventListener("scroll", syncCompactState, { passive: true });

  if (!toggle) return;
  toggle.addEventListener("click", () => {
    const isOpen = rail.classList.toggle("mobile-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  document.querySelectorAll(".nav a, .rail-actions .nav-action").forEach((item) => {
    item.addEventListener("click", () => {
      closeMobileNav();
    });
  });

  accountDropdownMenu?.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("[data-account-menu]")) {
      closeMobileNav();
    }
  });
}

function closeAccountDropdown() {
  accountDropdown?.classList.remove("open");
  accountDropdownTrigger?.setAttribute("aria-expanded", "false");
}

function initAccountDropdown() {
  if (!accountDropdown || !accountDropdownTrigger || !accountDropdownMenu) return;

  accountDropdownTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = accountDropdown.classList.toggle("open");
    accountDropdownTrigger.setAttribute("aria-expanded", String(isOpen));
  });

  accountDropdownMenu.addEventListener("click", (event) => {
    const item = event.target instanceof Element ? event.target.closest("[data-account-menu]") : null;
    if (!item) return;
    const action = item.dataset.accountMenu;
    const destinations = {
      profile: "profile",
      account: "profile-account",
      setup: "profile-setup",
      heatmap: "profile-heatmap",
      photos: "photos",
    };
    closeAccountDropdown();
    if (action === "auth") {
      if (authUser) {
        signOutCurrentUser();
        showToast("Signed out on this device.");
      } else {
        openAuthDialog("account");
      }
      return;
    }
    setPage(destinations[action] || "profile");
  });

  document.addEventListener("click", (event) => {
    if (accountDropdown.contains(event.target)) return;
    closeAccountDropdown();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAccountDropdown();
  });
}

function initNightShiftMode() {
  const toggle = document.querySelector("#nightShiftToggle");
  if (!toggle) return;

  const savedMode = window.localStorage.getItem("sevenK-night-shift");
  const shouldStartDark = savedMode === "on";
  toggle.checked = shouldStartDark;
  document.body.classList.toggle("night-shift", shouldStartDark);

  toggle.addEventListener("change", () => {
    document.body.classList.toggle("night-shift", toggle.checked);
    window.localStorage.setItem("sevenK-night-shift", toggle.checked ? "on" : "off");
    showToast(toggle.checked ? "Night shift mode on." : "Night shift mode off.");
  });
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 4) {
  const words = text.split(" ");
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const nextLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(nextLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = nextLine;
    }
  });

  if (line) lines.push(line);

  lines.slice(0, maxLines).forEach((item, index) => {
    ctx.fillText(index === maxLines - 1 && lines.length > maxLines ? `${item}...` : item, x, y + index * lineHeight);
  });

  return y + Math.min(lines.length, maxLines) * lineHeight;
}

function drawRoutePreview(ctx, event, x, y, width, height) {
  ctx.save();
  ctx.strokeStyle = "rgba(245, 242, 232, 0.12)";
  ctx.lineWidth = 2;
  for (let i = 0; i <= 8; i += 1) {
    const gx = x + (width / 8) * i;
    const gy = y + (height / 8) * i;
    ctx.beginPath();
    ctx.moveTo(gx, y);
    ctx.lineTo(gx, y + height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, gy);
    ctx.lineTo(x + width, gy);
    ctx.stroke();
  }

  const route = new Path2D(event.route);
  ctx.translate(x, y);
  ctx.scale(width / 500, height / 260);
  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke(route);
  ctx.fillStyle = "#f5f2e8";
  ctx.beginPath();
  ctx.arc(event.start[0], event.start[1], 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawStoryChrome(ctx) {
  const gradient = ctx.createRadialGradient(540, 520, 80, 540, 520, 1100);
  gradient.addColorStop(0, "rgba(0,255,0,0.08)");
  gradient.addColorStop(0.42, "rgba(23,23,23,0.98)");
  gradient.addColorStop(1, "#101010");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1920);

  ctx.fillStyle = "rgba(245,242,232,0.035)";
  for (let y = 0; y < 1920; y += 6) {
    ctx.fillRect(0, y, 1080, 1);
  }
  for (let x = 0; x < 1080; x += 17) {
    ctx.fillRect(x, 0, 1, 1920);
  }

  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 312);
  ctx.bezierCurveTo(260, 250, 392, 360, 620, 302);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(78, 1800);
  ctx.bezierCurveTo(320, 1720, 520, 1890, 1080, 1740);
  ctx.stroke();

  ctx.strokeStyle = "rgba(245,242,232,0.13)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(250, 930, 390, 820, -0.42, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(820, 930, 390, 820, 0.42, 0, Math.PI * 2);
  ctx.stroke();
}

function drawBrand(ctx) {
  ctx.fillStyle = "#f5f2e8";
  ctx.font = "700 48px Helvetica Neue, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("7k Running Club.", 540, 96);
  ctx.textAlign = "left";
}

function downloadCanvas(canvas, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function makeRunStoryCard() {
  const event = eventById(selectedId);
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d");

  drawStoryChrome(ctx);
  drawBrand(ctx);

  ctx.fillStyle = "rgba(245,242,232,0.68)";
  ctx.font = "700 24px monospace";
  ctx.fillText("7K RUNNING CLUB", 92, 270);

  ctx.fillStyle = "#f5f2e8";
  ctx.font = "700 118px Helvetica Neue, Arial, sans-serif";
  drawWrappedText(ctx, event.title, 92, 440, 820, 110, 3);

  ctx.font = "700 30px monospace";
  ctx.fillText(`${event.day.toUpperCase()} ${event.date} / ${event.time}`, 96, 780);
  ctx.fillText(`${event.distance} / ${event.pace.toUpperCase()}`, 96, 832);

  ctx.strokeStyle = "rgba(245,242,232,0.24)";
  ctx.strokeRect(92, 900, 896, 468);
  drawRoutePreview(ctx, event, 126, 950, 828, 332);

  ctx.fillStyle = "rgba(245,242,232,0.68)";
  ctx.font = "700 28px monospace";
  ctx.fillText("STAMP UNLOCK", 96, 1450);
  ctx.fillStyle = "#f5f2e8";
  ctx.font = "italic 500 60px Georgia, Times New Roman, serif";
  drawWrappedText(ctx, event.stamp, 96, 1522, 760, 60, 2);

  ctx.fillStyle = "rgba(245,242,232,0.68)";
  ctx.font = "400 32px Inter, Arial, sans-serif";
  drawWrappedText(ctx, event.vibe, 96, 1660, 840, 42, 3);

  ctx.strokeStyle = "#00ff00";
  ctx.strokeRect(336, 1778, 408, 72);
  ctx.fillStyle = "#f5f2e8";
  ctx.font = "700 26px Inter, Arial, sans-serif";
  ctx.fillText("Join the run", 466, 1824);

  downloadCanvas(canvas, `7k-${event.id}-story.png`);
  showToast(`${event.title} story PNG downloaded.`);
}

function makeClubStoryCard() {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d");

  drawStoryChrome(ctx);
  drawBrand(ctx);

  ctx.fillStyle = "#f5f2e8";
  ctx.font = "700 120px Helvetica Neue, Arial, sans-serif";
  drawWrappedText(ctx, "7k Running Club", 92, 360, 860, 116, 3);

  ctx.fillStyle = "rgba(245,242,232,0.72)";
  ctx.font = "400 36px Inter, Arial, sans-serif";
  drawWrappedText(
    ctx,
    "Ulaanbaatar run culture. City loops, coffee finishes, winter miles, and discipline that becomes friendship.",
    96,
    740,
    840,
    48,
    4
  );

  ctx.strokeStyle = "rgba(245,242,232,0.24)";
  ctx.strokeRect(92, 980, 896, 420);
  ctx.fillStyle = "rgba(255,255,255,0.03)";
  ctx.fillRect(92, 980, 896, 420);
  ctx.fillStyle = "#f5f2e8";
  ctx.font = "700 96px Helvetica Neue, Arial, sans-serif";
  ctx.fillText("326", 136, 1152);
  ctx.fillText("92", 456, 1152);
  ctx.fillText("18", 706, 1152);
  ctx.fillStyle = "rgba(245,242,232,0.68)";
  ctx.font = "700 26px monospace";
  ctx.fillText("MEMBERS", 140, 1210);
  ctx.fillText("ENERGY", 462, 1210);
  ctx.fillText("ROUTES", 710, 1210);

  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(202, 1538, 96, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#f5f2e8";
  ctx.font = "700 54px Helvetica Neue, Arial, sans-serif";
  ctx.fillText("7K", 166, 1558);
  ctx.font = "700 28px monospace";
  ctx.fillText("CLUB STAMP", 334, 1518);
  ctx.fillStyle = "#f5f2e8";
  ctx.font = "700 48px Helvetica Neue, Arial, sans-serif";
  ctx.fillText("UB CITY LOOP LOYALIST", 334, 1584);

  ctx.strokeStyle = "#00ff00";
  ctx.strokeRect(340, 1778, 400, 72);
  ctx.fillStyle = "#f5f2e8";
  ctx.font = "700 26px Inter, Arial, sans-serif";
  ctx.fillText("Run with us", 472, 1824);

  downloadCanvas(canvas, "7k-running-club-story.png");
  showToast("Club story PNG downloaded.");
}

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderCards();
    renderDetail();
  });
});

document.querySelectorAll(".day-card").forEach((button, index) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".day-card").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    selectedId = events[index].id;
    activeFilter = "all";
    document.querySelectorAll(".filter").forEach((item) => {
      item.classList.toggle("active", item.dataset.filter === "all");
    });
    renderCards();
    renderDetail();
  });
});

rsvpButton.addEventListener("click", () => {
  if (!requireAuth("rsvp")) return;
  const event = eventById(selectedId);
  if (rsvped.has(event.id)) {
    rsvped.delete(event.id);
    showToast("RSVP removed. Your legs have been notified.");
  } else {
    rsvped.add(event.id);
    showToast(`${event.title} RSVP confirmed. Save it to your calendar below.`);
  }
  renderCards();
  renderDetail();
});

googleCalendarButton.addEventListener("click", () => {
  const event = eventById(selectedId);
  window.open(googleCalendarUrl(event), "_blank", "noopener,noreferrer");
  showToast("Opening Google Calendar save page.");
});

iosCalendarButton.addEventListener("click", () => {
  const event = eventById(selectedId);
  downloadCalendarInvite(event);
  showToast("iOS Calendar invite downloaded.");
});

document.querySelectorAll("[data-open-create]").forEach((button) => {
  button.addEventListener("click", () => {
    eventDialog.showModal();
  });
});

document.querySelector("#closeDialogButton").addEventListener("click", () => {
  eventDialog.close();
});

document.querySelector("#saveEventButton").addEventListener("click", () => {
  const name = document.querySelector("#eventNameInput").value.trim() || "Untitled Run";
  const route = eventById(eventStravaRouteInput.value);
  showToast(`${name} invite published with ${route.road} from Strava.`);
});

function updateEventInvitePreview() {
  if (!eventInvitePreview) return;
  const name = document.querySelector("#eventNameInput").value.trim() || "Untitled Run";
  const date = document.querySelector("#eventDateInput").value.trim() || "TBD";
  const time = document.querySelector("#eventTimeInput").value.trim() || "TBD";
  const distance = document.querySelector("#eventDistanceInput").value.trim() || "Run";
  const stravaRoute = eventById(eventStravaRouteInput.value);
  eventInvitePreview.querySelector("strong").textContent = name;
  eventInvitePreview.querySelector("small").textContent = `${date} / ${time} / ${distance} / ${stravaRoute.road}`;
}

function updateBuilderRoutePreview() {
  const route = eventById(eventStravaRouteInput.value);
  builderRoutePath.setAttribute("d", route.route);
  builderRoutePath.classList.remove("route-draw");
  void builderRoutePath.getBoundingClientRect();
  builderRoutePath.classList.add("route-draw");
  builderRouteStart.setAttribute("cx", route.start[0]);
  builderRouteStart.setAttribute("cy", route.start[1]);
  builderRouteLabel.textContent = `${route.road} / ${route.distance} / imported from past Strava activity`;
}

document
  .querySelectorAll("#eventNameInput, #eventDateInput, #eventTimeInput, #eventDistanceInput, #eventStravaRouteInput")
  .forEach((input) => {
    input.addEventListener("input", () => {
      updateEventInvitePreview();
      if (input === eventStravaRouteInput) updateBuilderRoutePreview();
    });
  });

eventStravaRouteInput.addEventListener("change", () => {
  updateBuilderRoutePreview();
  updateEventInvitePreview();
});

document.querySelector("#copyInviteLinkButton").addEventListener("click", () => {
  showToast("Invite link copied: 7k.club/run/rain-run-romantic");
});

document.querySelector("#viewCalendarButton").addEventListener("click", () => {
  setPage("events");
});

document.querySelector("#heroJoinButton").addEventListener("click", () => {
  setPage("club");
  showToast("Club page opened. Join the next run from there.");
});

document.querySelector("#calendarJoinButton").addEventListener("click", () => {
  openEventPage(events[0].id);
  showToast("Next run selected. RSVP is ready.");
});

document.querySelector("#shareClubButton").addEventListener("click", () => {
  makeClubStoryCard();
});

document.querySelector("#downloadRunCardButton").addEventListener("click", () => {
  makeRunStoryCard();
});

document.querySelector("#downloadClubCardButton").addEventListener("click", () => {
  makeClubStoryCard();
});

document.querySelector("#clubShareTopButton").addEventListener("click", () => {
  makeClubStoryCard();
});

document.querySelector("#joinClubButton").addEventListener("click", () => {
  openEventPage(selectedId);
  showToast("Event page opened. RSVP from here.");
});

document.querySelector("#navJoinButton").addEventListener("click", () => {
  openEventPage(selectedId);
  showToast("Next run page opened. RSVP from here.");
});

document.querySelectorAll("[data-home-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.homeAction;
    if (action === "next-event") {
      openEventPage(selectedId);
      showToast("Next drop opened.");
      return;
    }
    if (action === "club") {
      setPage("club");
      showToast("Run Club page opened.");
      return;
    }
    setPage("events");
    showToast("Events opened.");
  });
});

platformCard?.addEventListener("click", () => {
  const destinations = ["events", "photos", "profile", "profile"];
  setPage(destinations[activePlatformIndex] || "events");
  showToast(`${platformCardHeading.textContent} opened.`);
});

platformCard?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    platformCard.click();
  }
});

navAuthButton?.addEventListener("click", () => {
  if (authUser) {
    setPage("profile");
    showToast("Account profile opened.");
    return;
  }
  openAuthDialog("account");
});

closeAuthDialogButton.addEventListener("click", () => {
  authDialog.close();
});

authDialog.addEventListener("click", (event) => {
  if (event.target === authDialog) authDialog.close();
});

document.querySelectorAll("[data-auth-method]").forEach((button) => {
  button.addEventListener("click", () => {
    const method = button.dataset.authMethod;
    document.querySelectorAll("[data-auth-method]").forEach((item) => item.classList.toggle("active", item === button));
    document.querySelectorAll("[data-auth-panel]").forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.authPanel === method);
    });
  });
});

googleAuthButton.addEventListener("click", async () => {
  if (window.SevenKAuth?.configured?.()) {
    googleAuthButton.disabled = true;
    googleAuthButton.textContent = "Opening Google...";
    await window.SevenKAuth.signInWithGoogle().catch(() => {
      showToast("Google sign-in needs to be enabled in Supabase Auth.");
    });
    googleAuthButton.disabled = false;
    googleAuthButton.textContent = "Continue with Google";
    return;
  }
  completeAuth({
    method: "Google",
    name: "7K Runner",
    email: "runner@google.example",
  });
});

appleAuthButton.addEventListener("click", async () => {
  if (window.SevenKAuth?.configured?.()) {
    appleAuthButton.disabled = true;
    appleAuthButton.textContent = "Opening Apple...";
    await window.SevenKAuth.signInWithApple().catch(() => {
      showToast("Apple sign-in needs to be enabled in Supabase Auth.");
    });
    appleAuthButton.disabled = false;
    appleAuthButton.textContent = "Continue with Apple";
    return;
  }
  completeAuth({
    method: "Apple",
    name: "7K Runner",
    email: "runner@icloud.example",
  });
});

sendPhoneCodeButton.addEventListener("click", async () => {
  const phone = authPhoneInput.value.trim();
  if (!phone) {
    showToast("Enter your phone number first.");
    authPhoneInput.focus();
    return;
  }
  sendPhoneCodeButton.disabled = true;
  sendPhoneCodeButton.textContent = "Sending...";
  const result = await sendPhoneCode(phone).catch(() => null);
  sendPhoneCodeButton.disabled = false;
  sendPhoneCodeButton.textContent = "Send code";
  if (!result) {
    showToast("SMS could not be sent. Check auth provider setup.");
    return;
  }
  authCodeInput.placeholder = "123456";
  showToast(result.provider === "prototype" ? "Prototype code is 123456. Connect SMS provider for real codes." : "Verification code sent.");
});

verifyPhoneButton.addEventListener("click", async () => {
  const phone = authPhoneInput.value.trim();
  const code = authCodeInput.value.trim();
  if (!phone) {
    showToast("Enter your phone number first.");
    authPhoneInput.focus();
    return;
  }
  if (code.length < 4) {
    showToast("Enter the code we sent. Prototype code is 123456.");
    authCodeInput.focus();
    return;
  }
  verifyPhoneButton.disabled = true;
  verifyPhoneButton.textContent = "Verifying...";
  const verified = await verifyPhoneCode(phone, code).catch(() => false);
  verifyPhoneButton.disabled = false;
  verifyPhoneButton.textContent = "Verify phone";
  if (!verified) {
    showToast("Wrong code or expired code.");
    return;
  }
  const supabaseUser = window.SevenKAuth?.configured?.()
    ? await window.SevenKAuth.currentUser().catch(() => null)
    : null;
  completeAuth(supabaseUser || {
    method: "Phone",
    phone,
    name: "Phone Runner",
  });
});

emailAuthButton.addEventListener("click", async () => {
  const email = authEmailInput.value.trim();
  const name = authNameInput.value.trim() || email.split("@")[0] || "7K Runner";
  if (!email || !email.includes("@")) {
    showToast("Enter a valid email address.");
    authEmailInput.focus();
    return;
  }
  if (window.SevenKAuth?.configured?.()) {
    emailAuthButton.disabled = true;
    emailAuthButton.textContent = "Sending link...";
    const result = await window.SevenKAuth.signInWithEmail(email, name).catch(() => null);
    emailAuthButton.disabled = false;
    emailAuthButton.textContent = "Continue with email";
    if (!result) {
      showToast("Email auth needs to be enabled in Supabase.");
      return;
    }
    showToast("Check your email for the 7K sign-in link.");
    return;
  }
  completeAuth({
    method: "Email",
    email,
    name,
  });
});

document.querySelector("#shareProfileButton").addEventListener("click", () => {
  showToast("Profile and passport share card queued.");
});

labSignInButton?.addEventListener("click", () => {
  openAuthDialog("lab");
  showToast("Unlocking the coach room. No whistle required.");
});

labPreviewButton?.addEventListener("click", () => {
  renderLabPreview();
  showToast("Preview mode opened. Sign in to save real Lab notes.");
});

labHistoryButton?.addEventListener("click", () => {
  if (!requireAuth("lab")) return;
  renderLabHistory();
  showToast("Lab history opened.");
});

labCoachSendButton?.addEventListener("click", () => {
  sendLabCoachPrompt();
});

labCoachInput?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  sendLabCoachPrompt();
});

labFormCheckButton?.addEventListener("click", () => {
  if (!requireAuth("lab")) return;
  renderLabFormCheck();
  labFormVideoInput?.click();
  showToast("Choose a short running clip for the form-check queue.");
});

labFormVideoInput?.addEventListener("change", () => {
  if (!requireAuth("lab")) return;
  renderLabFormCheck(labFormVideoInput.files?.[0]);
  showToast("Form-check session staged.");
});

labPlanButton?.addEventListener("click", () => {
  if (!requireAuth("lab")) return;
  renderLabPlan();
  showToast("Weekly plan generated.");
});

labSaveNoteButton?.addEventListener("click", () => {
  if (!requireAuth("lab")) return;
  if (!activeLabOutput) {
    renderLabHistory();
    showToast("Nothing new to save yet. Ask the coach or build a plan first.");
    return;
  }
  saveLabOutput("Manual save", activeLabOutput);
  renderLabHistory();
  showToast("Lab note saved.");
});

labWorkbenchActions?.addEventListener("click", (event) => {
  const button = event.target instanceof Element ? event.target.closest("[data-lab-action]") : null;
  if (!button) return;
  const action = button.dataset.labAction;
  if (action === "unlock") {
    openAuthDialog("lab");
    return;
  }
  if (!requireAuth("lab")) return;
  if (action === "pick-video") {
    labFormVideoInput?.click();
    return;
  }
  if (action === "build-plan") {
    renderLabPlan();
    return;
  }
  if (action === "ask-followup") {
    labCoachInput?.focus();
    showToast("Ask what to adjust: distance, pace, recovery, or race week.");
    return;
  }
  if (action === "save-current") {
    if (!activeLabOutput) {
      showToast("Nothing to save yet.");
      return;
    }
    saveLabOutput(labWorkbenchTitle?.textContent || "Lab note", activeLabOutput);
    renderLabHistory();
    showToast("Saved to Lab history.");
    return;
  }
  if (action === "clear-history") {
    labNotes = [];
    saveLabNotes();
    activeLabOutput = "";
    renderLabHistory();
    showToast("Lab history cleared on this device.");
  }
});

profilePhotoInput?.addEventListener("change", () => {
  handleProfilePhotoFile(profilePhotoInput.files?.[0], "profile");
});

eventProfilePhotoInput?.addEventListener("change", () => {
  handleProfilePhotoFile(eventProfilePhotoInput.files?.[0], "rsvp");
});

[profilePhotoZoom, profilePhotoX, profilePhotoY].forEach((input) => {
  input?.addEventListener("input", () => updateAvatarCropFromControls(false));
});

saveProfilePhotoButton?.addEventListener("click", () => {
  if (!requireAuth("account")) return;
  updateAvatarCropFromControls(true);
  renderEventPage();
  showToast("Profile crop saved.");
});

document.querySelectorAll("[data-profile-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.profileAction;
    const destinations = {
      account: "profile-account",
      setup: "profile-setup",
      regulars: "profile-regulars",
      notifications: "profile-notifications",
      heatmap: "profile-heatmap",
      photos: "photos",
      profile: "profile",
    };
    if (destinations[action]) {
      setPage(destinations[action]);
      showToast(`${button.textContent.trim()} opened.`);
      return;
    }
    showToast(`${button.textContent.trim()} opened.`);
  });
});

profileAccountAuthButton?.addEventListener("click", () => {
  openAuthDialog("account");
});

profileAccountSignOutButton?.addEventListener("click", async () => {
  await signOutCurrentUser();
  showToast("Signed out on this device.");
});

document.querySelectorAll("[data-profile-save]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(`${button.textContent.trim()} saved.`);
  });
});

document.querySelector("#photoHelpButton").addEventListener("click", () => {
  showToast("Pick a race, search your bib, then download HQ photos.");
});

raceFolderGrid?.addEventListener("click", (event) => {
  const folder = event.target instanceof Element ? event.target.closest("[data-race-folder]") : null;
  if (!folder) return;
  selectedRace = folder.dataset.raceFolder;
  uploadRaceSelect.value = selectedRace;
  photoSearchQuery = "";
  photoSearchInput.value = "";
  renderRacePhotoGrid();
  showToast(`${selectedRace} folder opened.`);
});

karmaRulesTopButton?.addEventListener("click", () => {
  showToast("Complete the goal to get your money back and split 50% of the missed-goal pool.");
});

joinPledgeButton.addEventListener("click", () => {
  openKarmaEntryPage();
});

pledgeRulesButton.addEventListener("click", () => {
  openKarmaEntryPage();
});

karmaBackButton.addEventListener("click", () => {
  setPage("karma");
});

karmaLockButton.addEventListener("click", async () => {
  if (!requireAuth("account")) return;
  await window.SevenKSupabase?.saveKarmaEntry?.({
    challengeId: "00000000-0000-0000-0000-000000000000",
    amountMnt: 20000,
    status: "locked",
    goalStatus: "pending",
  }).catch(() => null);
  showToast("Karma commitment flow ready. Payment connection comes next.");
});

karmaShareButton.addEventListener("click", () => {
  showToast("Karma Challenge share card queued.");
});

document.querySelectorAll("[data-karma-card]").forEach((button) => {
  button.addEventListener("click", () => {
    openKarmaEntryPage();
    showToast(`${button.textContent.trim()} opened.`);
  });
});

publishChallengeButton.addEventListener("click", async () => {
  const name = document.querySelector("#challengeNameInput").value.trim() || "Untitled Challenge";
  const goal = document.querySelector("#challengeGoalInput").value.trim() || "Custom running goal";
  const commitment = document.querySelector("#challengeCommitmentInput").value.trim() || "Commitment amount";
  const reward = document.querySelector("#challengeRewardInput").value.trim() || "Karma reward split";
  await window.SevenKSupabase?.saveKarmaChallenge?.({
    title: name,
    goal,
    commitmentAmountMnt: Number(String(commitment).replace(/[^0-9]/g, "")) || 0,
    status: "published",
    rules: { reward },
  }).catch(() => {
    showToast("Challenge saved locally. Supabase admin role is needed to publish.");
  });
  showToast(`${name} published: ${goal} / ${commitment}. ${reward}.`);
});

document.querySelector("#adminBackButton").addEventListener("click", () => {
  setPage("home");
});

eventBackButton.addEventListener("click", () => {
  setPage("events");
});

eventPageRsvpButton.addEventListener("click", () => {
  if (!requireAuth("rsvp")) return;
  const event = eventById(selectedId);
  if (!eventRsvpState.has(event.id)) {
    eventRsvpState.set(event.id, "going");
  }
  showToast("RSVP started. Complete the runner form to enter.");
  renderCards();
  renderDetail();
  renderEventPage();
});

document.querySelectorAll("[data-rsvp-state]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!requireAuth("rsvp")) return;
    const event = eventById(selectedId);
    const state = button.dataset.rsvpState;
    eventRsvpState.set(event.id, state);
    eventRegistrations.delete(event.id);
    rsvped.delete(event.id);
    upsertRsvpRow(event, state, false);
    showToast(`${button.querySelector("small").textContent} selected. Complete the form next.`);
    renderCards();
    renderDetail();
    renderEventPage();
  });
});

eventCompleteRegistrationButton.addEventListener("click", () => {
  if (!requireAuth("rsvp")) return;
  const event = eventById(selectedId);
  const state = eventRsvpState.get(event.id);
  if (!state) {
    showToast("Choose Going, Maybe, or Can't Go first.");
    return;
  }
  eventRegistrations.add(event.id);
  if (state === "going") {
    rsvped.add(event.id);
  } else {
    rsvped.delete(event.id);
  }
  upsertRsvpRow(event, state, true);
  showToast(`You're in. ${event.title} unlocked.`);
  renderCards();
  renderDetail();
  renderEventPage();
  document.querySelector("#eventConfirmationCard")?.scrollIntoView({ behavior: "smooth", block: "center" });
});

eventConfirmationWallButton?.addEventListener("click", () => {
  document.querySelector(".event-feed-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
  showToast("Event wall opened.");
});

eventConfirmationCalendarButton?.addEventListener("click", () => {
  window.open(googleCalendarUrl(eventById(selectedId)), "_blank", "noopener,noreferrer");
  showToast("Opening calendar save page.");
});

eventCommentButton.addEventListener("click", () => {
  const value = eventCommentInput.value.trim();
  if (!value) return;
  const comments = eventComments.get(selectedId) || [];
  if (activeReplyTarget?.eventId === selectedId && comments[activeReplyTarget.index]) {
    const cleanValue = value.replace(/^@\S+\s*/, "").trim() || value;
    const targetComment = comments[activeReplyTarget.index];
    targetComment.replies = targetComment.replies || [];
    targetComment.replies.push({ avatar: "YOU", name: "You", text: cleanValue, time: "now" });
    activeReplyTarget = null;
    eventCommentInput.placeholder = "Ask a question, hype the group, mention a friend...";
  } else {
    comments.unshift({ avatar: "YOU", name: "You", text: value, time: "now" });
  }
  eventComments.set(selectedId, comments);
  eventCommentInput.value = "";
  renderEventComments(eventById(selectedId));
  showToast("Comment posted to the event wall.");
});

eventCommentInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    eventCommentButton.click();
  }
});

eventCommentList.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  const likeButton = target.closest("[data-like-comment]");
  if (likeButton) {
    likeButton.classList.add("animate");
    window.setTimeout(() => likeButton.classList.remove("animate"), 350);

    const comment = likeButton.closest(".comment-item");
    const reaction = document.createElement("span");
    reaction.className = "mini-reaction";
    reaction.textContent = "👍";
    reaction.style.right = `${8 + Math.random() * 40}px`;
    reaction.style.bottom = `${8 + Math.random() * 25}px`;
    comment.appendChild(reaction);
    window.setTimeout(() => reaction.remove(), 1800);
    return;
  }

  const replyButton = target.closest("[data-reply-comment]");
  if (replyButton) {
    const comment = replyButton.closest(".comment-item");
    const name = comment?.querySelector("strong")?.textContent || "runner";
    activeReplyTarget = {
      eventId: selectedId,
      index: Number(replyButton.dataset.replyComment),
      name,
    };
    eventCommentInput.value = `@${name} `;
    eventCommentInput.placeholder = `Replying to ${name}`;
    eventCommentInput.focus();
  }
});

eventCopyLinkButton.addEventListener("click", () => {
  const url = eventShareUrl(eventById(selectedId));
  navigator.clipboard?.writeText(url);
  showToast(`Copied ${url}`);
});

async function shareSelectedEventInvite() {
  const event = eventById(selectedId);
  const url = eventShareUrl(event);
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${event.title} / 7K Running Club`,
        text: `${event.distance} ${event.pace} run at ${event.time}.`,
        url,
      });
      showToast("Event share sheet opened.");
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }
  navigator.clipboard?.writeText(url);
  showToast("Share link copied.");
}

eventShareButton.addEventListener("click", shareSelectedEventInvite);
eventPublicShareButton.addEventListener("click", shareSelectedEventInvite);
eventConfirmationShareButton.addEventListener("click", shareSelectedEventInvite);

eventDownloadQrButton.addEventListener("click", () => {
  const event = eventById(selectedId);
  const link = document.createElement("a");
  link.href = eventQrUrl(event);
  link.download = `7k-${event.id}-qr.png`;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast("QR code download opened.");
});

eventBlastButton.addEventListener("click", () => {
  showToast("Blast queued to Going + Maybe runners.");
});

eventHostProfileButton.addEventListener("click", () => {
  setPage("profile");
  showToast("Host profile opened.");
});

exportCsvButton.addEventListener("click", () => {
  showToast("CSV export generated for host dashboard.");
});

scheduleReminderButton.addEventListener("click", () => {
  showToast("Reminder scheduled: 24 hours before + 1 hour before.");
});

document.querySelectorAll("[data-admin-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const labels = {
      "club-info": "Club information editor opened.",
      "karma-ledger": "Karma ledger opened.",
      roles: "Role manager opened.",
      analytics: "Growth analytics opened.",
    };
    showToast(labels[button.dataset.adminAction] || "Admin tool opened.");
  });
});

document.querySelectorAll(".blast-filter-row button").forEach((button) => {
  button.addEventListener("click", () => {
    button.closest(".blast-filter-row")?.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    showToast(`${button.textContent.trim()} selected.`);
  });
});

eventPageGoogleButton.addEventListener("click", () => {
  window.open(googleCalendarUrl(eventById(selectedId)), "_blank", "noopener,noreferrer");
  showToast("Opening Google Calendar save page.");
});

eventPageIosButton.addEventListener("click", () => {
  downloadCalendarInvite(eventById(selectedId));
  showToast("iOS Calendar invite downloaded.");
});

document.querySelector(".brand").addEventListener("click", (event) => {
  event.preventDefault();
  setPage("home");
});

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    setPage(link.getAttribute("href").replace("#", "") || "home");
  });
});

breadcrumbNav.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target.closest("[data-breadcrumb-page]") : null;
  if (!target) return;
  setPage(target.dataset.breadcrumbPage || "home");
});

document.querySelectorAll("[data-select-event]").forEach((item) => {
  item.addEventListener("click", () => {
    openEventPage(item.dataset.selectEvent);
  });
});

eventImageInput.addEventListener("change", () => {
  const file = eventImageInput.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    eventImagePreview.style.backgroundImage = `linear-gradient(180deg, transparent, rgba(0,0,0,0.82)), url("${reader.result}")`;
    eventImagePreview.classList.add("has-image");
    eventImagePreview.querySelector("strong").textContent = file.name.replace(/\.[^/.]+$/, "");
    eventImagePreview.querySelector("small").textContent = "Image ready for the event card";
  });
  reader.readAsDataURL(file);
});

racePhotoUpload.addEventListener("change", () => {
  const files = Array.from(racePhotoUpload.files || []);
  if (!files.length) return;
  const raceName = uploadRaceSelect.value;
  const raceZone = uploadZoneSelect.value;
  let loadedCount = 0;

  files.slice(0, 9).forEach((file, index) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const detectedBib = String(240 + index + Math.floor(Math.random() * 800)).padStart(4, "0");
      const localPhoto = {
        id: `${raceName}-${Date.now()}-${index}`,
        race: raceName,
        zone: raceZone,
        bib: detectedBib,
        title: raceZone,
        meta: `${raceName} / ${raceZone} / AI bib detected / original quality staged`,
        src: reader.result,
        originalSrc: reader.result,
        uploaded: true,
      };
      racePhotos.unshift(localPhoto);
      window.SevenKSupabase?.uploadRacePhoto?.(
        file,
        { title: raceName, slug: raceName },
        { title: raceZone, zone: raceZone, bib: detectedBib }
      )
        .then((result) => {
          if (!result?.photo) return;
          localPhoto.id = result.photo.id;
          localPhoto.src = result.photo.preview_url || result.photo.original_url || localPhoto.src;
          localPhoto.originalSrc = result.photo.original_url || localPhoto.originalSrc;
        })
        .catch(() => {
          showToast("Photo preview saved locally. Supabase admin upload needs host/admin role.");
        });
      loadedCount += 1;
      if (loadedCount === Math.min(files.length, 9)) {
        selectedRace = raceName;
        photoSearchQuery = "";
        photoSearchInput.value = "";
        renderRacePhotoGrid();
      }
    });
    reader.readAsDataURL(file);
  });

  showToast(`${files.length} photo${files.length === 1 ? "" : "s"} stored under ${raceName} / ${raceZone}. AI bib scan queued.`);
});

document.querySelector("#photoSearchButton").addEventListener("click", () => {
  const query = photoSearchInput.value.trim();
  photoSearchQuery = query;
  renderRacePhotoGrid();
  showToast(query ? `AI bib search running for "${query}".` : "Search by bib number, name, race, or club.");
});

document.querySelectorAll("[data-race]").forEach((button) => {
  button.addEventListener("click", () => {
    selectedRace = button.dataset.race;
    racePhotoBaseCounts[selectedRace] = Number(button.dataset.count);
    selectedRaceStat.textContent = selectedRace;
    uploadRaceSelect.value = selectedRace;
    photoSearchQuery = "";
    photoSearchInput.value = "";
    renderRacePhotoGrid();
    showToast(`${button.dataset.race} archive selected.`);
  });
});

document.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  const openButton = target.closest("[data-open-photo]");
  if (openButton) {
    openPhotoLightbox(openButton.dataset.openPhoto);
    return;
  }

  const downloadButton = target.closest("[data-download-photo]");
  if (!downloadButton) return;
  const card = downloadButton.closest("[data-race-photo-id]");
  const photoId = downloadButton.dataset.downloadPhoto || card?.dataset.racePhotoId;
  downloadPhoto(photoId);
});

closePhotoLightboxButton.addEventListener("click", () => {
  photoLightbox.close();
});

photoLightbox.addEventListener("click", (event) => {
  if (event.target === photoLightbox) photoLightbox.close();
});

photoLightboxDownloadButton.addEventListener("click", () => {
  downloadPhoto(activeLightboxPhotoId);
});

initMotionExperience();
initHorizonHero();
initLabWave();
initResizableNavbar();
initAccountDropdown();
initNightShiftMode();
initGlassClock();
updateAuthUi();
updateEventInvitePreview();
updateBuilderRoutePreview();
initPlatformTabs();
initCalendarViewToggle();
renderCards();
renderDetail();
renderCalendarLists();
initThreeDCalendar();
initKarmaBreakCard();
initAttendeeSphere();
renderEventPage();
renderRacePhotoGrid();
startHeroTextRotate();
setPage(window.location.hash.replace("#", "") || "home");
hydrateSupabaseSession().catch(() => {
  showToast("Supabase session restore skipped. Local mode is still active.");
});
