/* (주)비에이텍 Main Javascript - main.js */

document.addEventListener('DOMContentLoaded', () => {
    // 0. Initialize Background Music
    const bgMusic = document.getElementById('background-music');
    if (bgMusic) {
        bgMusic.muted = false;
        const playPromise = bgMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // 자동 재생이 차단된 경우, 첫 사용자 상호작용 시 재생
                console.log('Auto-play prevented, will play on user interaction');
                document.addEventListener('click', function resumeAudio() {
                    bgMusic.play();
                    document.removeEventListener('click', resumeAudio);
                }, { once: true });
            });
        }
        
        // 초기 버튼 상태 설정
        const musicBtn = document.getElementById('music-toggle-btn');
        const musicIcon = document.getElementById('music-icon');
        const musicText = document.getElementById('music-text');
        
        if (musicBtn && musicIcon && musicText) {
            setTimeout(() => {
                if (!bgMusic.paused) {
                    musicIcon.classList.add('fa-volume-high');
                    musicIcon.classList.remove('fa-volume-mute');
                    musicText.textContent = '음소거';
                    musicBtn.classList.add('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
                    musicBtn.classList.remove('bg-red-100', 'text-red-700', 'hover:bg-red-200');
                }
            }, 500);
        }
    }

    // 1. Header scroll visual state change
    const mainHeader = document.getElementById('main-header');
    if (mainHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                mainHeader.classList.remove('bg-white/95', 'shadow-sm');
                mainHeader.classList.add('bg-white/95', 'shadow-md', 'backdrop-blur-md');
            } else {
                mainHeader.classList.remove('bg-white/95', 'shadow-md', 'backdrop-blur-md');
                mainHeader.classList.add('bg-white/95', 'shadow-sm');
            }
        });
    }

    // 2. Mobile navigation menu drawer controls
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                if (menuIcon) {
                    menuIcon.classList.remove('fa-bars');
                    menuIcon.classList.add('fa-xmark');
                }
            } else {
                mobileMenu.classList.add('hidden');
                if (menuIcon) {
                    menuIcon.classList.remove('fa-xmark');
                    menuIcon.classList.add('fa-bars');
                }
            }
        });
    }

    // Close mobile menu when clicking layout links
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('button') : [];
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            if (menuIcon) {
                menuIcon.classList.remove('fa-xmark');
                menuIcon.classList.add('fa-bars');
            }
        });
    });

    // 3. Hero Interactive Sine Wave Canvas Animation
    initHeroWaves();

    // 4. Initialize Leaflet Map
    initLeafletMap();

    // 5. Setup Form Submit Validation
    initInquiryForm();

    // 5-1. Setup Chatbot Interaction
    initChatbot();

    // 5-2. Initialize Staff Calendar
    initStaffCalendar();

    // 5-3. Setup Search Interaction
    initSearch();

    // 6. Render Dynamic Products Grid
    renderProducts();

    // 7. Render Projects Table
    filterHistory('all');

    // 8. Initialize Digital Brochure Dragging & Controls
    initBrochureControls();

    // 9. Initialize Card News Campaign Carousel
    renderCardNewsSlide(0);
    startCardNewsTimer();

    // Pause autoplay on mouse hover of viewport container
    const viewport = document.getElementById('card-news-viewport');
    if (viewport) {
        viewport.addEventListener('mouseenter', () => {
            if (cardNewsTimer) clearInterval(cardNewsTimer);
        });
        viewport.addEventListener('mouseleave', () => {
            startCardNewsTimer();
        });
    }
});

/* ==========================================================================
   Background Music Control
   ========================================================================== */
function toggleBackgroundMusic() {
    const bgMusic = document.getElementById('background-music');
    const musicBtn = document.getElementById('music-toggle-btn');
    const musicIcon = document.getElementById('music-icon');
    const musicText = document.getElementById('music-text');
    
    if (bgMusic) {
        if (bgMusic.paused) {
            bgMusic.play();
            musicIcon.classList.remove('fa-volume-mute');
            musicIcon.classList.add('fa-volume-high');
            musicText.textContent = '음소거';
            musicBtn.classList.remove('bg-red-100', 'text-red-700', 'hover:bg-red-200');
            musicBtn.classList.add('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
        } else {
            bgMusic.pause();
            musicIcon.classList.remove('fa-volume-high');
            musicIcon.classList.add('fa-volume-mute');
            musicText.textContent = '재생';
            musicBtn.classList.remove('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
            musicBtn.classList.add('bg-red-100', 'text-red-700', 'hover:bg-red-200');
        }
    }
}

/* ==========================================================================
   SPA Navigation & Routing Logic
   ========================================================================== */
function filterView(viewId) {
    const sections = document.querySelectorAll('.spa-view-section');
    const homeSection = document.getElementById('home');
    
    // Manage header navigation buttons visual states
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        if (btn.id === `nav-btn-${viewId}`) {
            btn.classList.add('active-nav-link');
        } else {
            btn.classList.remove('active-nav-link');
        }
    });

    // Show/hide home section
    if (homeSection) {
        if (viewId === 'home' || viewId === 'all') {
            homeSection.classList.remove('hidden');
            homeSection.style.opacity = '1';
        } else {
            homeSection.classList.add('hidden');
            homeSection.style.opacity = '0';
        }
    }

    // Show/hide other sections
    sections.forEach(section => {
        if (viewId === 'all') {
            section.classList.remove('hidden');
            section.classList.add('active');
            section.style.opacity = '1';
        } else if (section.id === viewId) {
            section.classList.remove('hidden');
            section.classList.add('active');
            section.style.opacity = '1';
        } else {
            section.classList.add('hidden');
            section.classList.remove('active');
            section.style.opacity = '0';
        }
    });

    // Reset Leaflet Map size when showing inquiry tab (where the map is) or all to fix display issues
    if (viewId === 'inquiry' || viewId === 'all') {
        setTimeout(() => {
            if (window.batechMap) {
                window.batechMap.invalidateSize();
            }
        }, 100);
    }
}

function navigateTo(sectionId) {
    // Navigate via filterView first
    filterView(sectionId);

    // If only one section is visible, scroll to top of page
    const homeSection = document.getElementById('home');
    const isSingleSection = homeSection && homeSection.classList.contains('hidden');

    if (isSingleSection) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            // Offset for sticky navigation header
            const offset = 90; 
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
}

/* ==========================================================================
   Product List Filtering
   ========================================================================== */
function filterProducts(category) {
    const cards = document.querySelectorAll('.product-card');
    const filterBtns = document.querySelectorAll('.prod-filter-btn');

    // Update product filter tabs active visual state
    filterBtns.forEach(btn => {
        const onClickAttr = btn.getAttribute('onclick');
        if (onClickAttr && onClickAttr.includes(`'${category}'`)) {
            btn.classList.add('active', 'bg-water-600', 'text-white', 'shadow-md');
            btn.classList.remove('bg-white', 'border-slate-200', 'text-slate-600', 'hover:bg-slate-50');
        } else {
            btn.classList.remove('active', 'bg-water-600', 'text-white', 'shadow-md');
            btn.classList.add('bg-white', 'border-slate-200', 'text-slate-600', 'hover:bg-slate-50');
        }
    });

    // Show/hide grid cards
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

/* ==========================================================================
   Dynamic Products & History Data
   ========================================================================== */
const productsData = [
    {
        id: "booster",
        category: "booster",
        image: "images/brochure.png",
        imageAlt: "브로슈어 속 부스터 펌프 실물 사진",
        imageFocus: "24% 72%",
        badge: "인버터 제어",
        badgeColor: "bg-water-500",
        icon: "fa-solid fa-server",
        iconColor: "text-water-500",
        title: "고효율 개별 인버터 부스터 펌프 시스템",
        desc: "일정 수압 유지와 탁월한 에너지 절감을 동시에 실현하는 최신 지능형 다중 펌프 자동 공급 장치입니다.",
        tag: "빌딩/아파트/공장 공용급수"
    },
    {
        id: "deepwell",
        category: "submersible",
        image: "images/brochure.png",
        imageAlt: "브로슈어 표지 이미지",
        imageFocus: "20% 28%",
        badge: "심정용 수중",
        badgeColor: "bg-cyan-500",
        icon: "fa-solid fa-anchor",
        iconColor: "text-water-600",
        title: "심정 고내구 수중 모터 펌프",
        desc: "고심도 지하수 개발 및 공급에 특화된 완벽 밀폐형 수중 펌프로 가혹한 가동 시간에도 안정적 출력을 냅니다.",
        tag: "농수용/공업용 지하수원"
    },
    {
        id: "centrifugal",
        category: "centrifugal",
        image: "images/brochure.png",
        imageAlt: "브로슈어 속 원심 펌프 실물 사진",
        imageFocus: "64% 72%",
        badge: "다단 원심형",
        badgeColor: "bg-emerald-500",
        icon: "fa-solid fa-gears",
        iconColor: "text-slate-700",
        title: "입형/횡형 고압 다단 원심 펌프",
        desc: "강력한 토출압 and 정밀한 수량 이송에 최적화된 내부 임펠러 구조로 보일러 급수 및 가압 공정에 특화되어 있습니다.",
        tag: "보일러 급수/공정 압력순환"
    },
    {
        id: "wastewater",
        category: "submersible",
        image: "images/brochure.png",
        imageAlt: "브로슈어 내 제품 안내 페이지",
        imageFocus: "50% 72%",
        badge: "오배수 처리",
        badgeColor: "bg-orange-500",
        icon: "fa-solid fa-trash-can",
        iconColor: "text-water-600",
        title: "산업용 비폐쇄성 수중 오배수 펌프",
        desc: "이물질과 고형물이 함유된 슬러지 배수에 걸림 없이 작동하는 Non-clog 임펠러가 장착된 고유량 배수 펌프입니다.",
        tag: "건설현장/정화조/수처리장"
    },
    {
        id: "volute",
        category: "centrifugal",
        image: "images/brochure.png",
        imageAlt: "브로슈어 속 품질 인증 이미지",
        imageFocus: "74% 72%",
        badge: "단단 원심형",
        badgeColor: "bg-blue-500",
        icon: "fa-solid fa-hurricane",
        iconColor: "text-water-500",
        title: "산업용 단단 볼류트 원심 펌프",
        desc: "효율적인 벌크 유체 이송에 정밀 표준화된 원심 가압 장치로, 유지보수가 쉬운 백-풀-아웃 설계를 채택했습니다.",
        tag: "냉난방 순환/일반 송수용"
    },
    {
        id: "panel",
        category: "booster",
        image: "images/brochure.png",
        imageAlt: "브로슈어 소개 페이지",
        imageFocus: "64% 26%",
        badge: "제어 판넬",
        badgeColor: "bg-teal-500",
        icon: "fa-solid fa-tower-broadcast",
        iconColor: "text-cyan-600",
        title: "지능형 펌프 자동제어 연동 시스템 (IoT)",
        desc: "압력 센서 및 온도 감지 모니터링을 통해 원격으로 상태를 자가 진단하고 알람을 송출하는 컨트롤러 캐비닛입니다.",
        tag: "원격 IoT 제어/스마트 빌딩"
    }
];

const historyProjects = [
    { year: "2026", client: "인제종합운동장", project: "관급자재 펌프 제조 및 설치 수주", type: "public", typeKo: "관급/조달" },
    { year: "2026", client: "양양군 남대천", project: "방사상 집수정 구매 설치 낙찰", type: "public", typeKo: "관급/조달" },
    { year: "2026", client: "춘천 아테라더퍼스트", project: "신축단지 상수도 기자재 및 가압 펌프 공급", type: "private", typeKo: "민간/산업" },
    { year: "2025", client: "강원테크노파크", project: "인버터 부스터 가압 펌프 유닛 및 제어반 공급", type: "public", typeKo: "관급/조달" },
    { year: "2024", client: "춘천 퇴계공단 제조사", project: "정밀 폐수 처리 설비 펌프 수명진단 및 오버홀", type: "maintenance", typeKo: "유지보수" },
    { year: "2024", client: "홍천 종합체육관", project: "소방 소화 배관 및 다단 원심펌프 정밀 시공", type: "public", typeKo: "관급/조달" },
    { year: "2023", client: "원주 현대아파트단지", project: "아파트 노후 가압 펌프실 인버터 부스터 시스템 교체", type: "private", typeKo: "민간/산업" },
    { year: "2022", client: "강원특별자치도청 기계실", project: "노후 급수 가압펌프 모터 교체 및 제어 배선 공사", type: "maintenance", typeKo: "유지보수" },
    { year: "2021", client: "춘천시 상수도사업소", project: "송배수용 대용량 원심 볼류트 펌프 및 밸브 설치", type: "public", typeKo: "관급/조달" },
    { year: "2020", client: "태백 농업기술센터", project: "농가 급수 공급용 심정 고내구 수중 모터 펌프 시공", type: "public", typeKo: "관급/조달" }
];

const STAFF_CALENDAR_STORAGE_KEY = 'batech_staff_calendar_events';
const STAFF_CALENDAR_UNLOCK_KEY = 'batech_staff_calendar_unlocked';
const STAFF_CALENDAR_PASSCODE = 'BAETECH2026';

const staffCalendarSeedEvents = [
    {
        id: 'staff-001',
        title: '전사 운영회의',
        category: 'meeting',
        share: 'internal',
        startDate: '2026-06-24',
        endDate: '2026-06-24',
        startTime: '09:30',
        endTime: '11:00',
        location: '본사 2층 회의실',
        notes: '월간 실적 공유, 생산 일정 조정, 현장 이슈 정리'
    },
    {
        id: 'staff-002',
        title: '춘천 아테라더퍼스트 납품 일정',
        category: 'event',
        share: 'team',
        startDate: '2026-06-27',
        endDate: '2026-06-27',
        startTime: '13:00',
        endTime: '15:30',
        location: '출하장',
        notes: '출하 확인, 현장 담당자 연락, 납품 서류 준비'
    },
    {
        id: 'staff-003',
        title: '제어반 점검 마감',
        category: 'deadline',
        share: 'internal',
        startDate: '2026-06-30',
        endDate: '2026-06-30',
        startTime: '',
        endTime: '',
        location: '품질보증부',
        notes: '월말 점검표 제출, 테스트 결과 취합'
    },
    {
        id: 'staff-004',
        title: '정기 설비 유지보수',
        category: 'maintenance',
        share: 'team',
        startDate: '2026-07-03',
        endDate: '2026-07-04',
        startTime: '08:30',
        endTime: '17:30',
        location: '생산동 전 구역',
        notes: '가동 설비, 테스트 벤치, 배선 라인 점검'
    }
];

let staffCalendarState = null;

function normalizeStaffDate(value) {
    if (!value) return '';
    const date = value instanceof Date
        ? value
        : /^\d{4}-\d{2}-\d{2}$/.test(value)
            ? new Date(`${value}T00:00:00`)
            : new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 10);
}

function getCurrentMonthDate(date, monthOffset = 0) {
    const next = new Date(date.getFullYear(), date.getMonth() + monthOffset, 1);
    return next;
}

function formatStaffMonthLabel(date) {
    return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long' }).format(date);
}

function formatStaffDateLabel(dateString) {
    if (!dateString) return '';
    const date = new Date(`${dateString}T00:00:00`);
    return new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }).format(date);
}

function formatStaffDateTime(dateString, timeString) {
    const dateLabel = formatStaffDateLabel(dateString);
    if (!timeString) return dateLabel;
    return `${dateLabel} ${timeString}`;
}

function getStaffCategoryLabel(category) {
    const labels = {
        meeting: '회의',
        event: '행사',
        deadline: '마감',
        maintenance: '유지보수'
    };
    return labels[category] || '일정';
}

function getStaffCategoryClasses(category) {
    const classes = {
        meeting: 'bg-water-50 text-water-700 border-water-200',
        event: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        deadline: 'bg-amber-50 text-amber-700 border-amber-200',
        maintenance: 'bg-slate-100 text-slate-700 border-slate-200'
    };
    return classes[category] || 'bg-slate-100 text-slate-700 border-slate-200';
}

function isStaffEventOnDate(event, dateString) {
    return event.startDate <= dateString && event.endDate >= dateString;
}

function sortStaffEvents(a, b) {
    const startDiff = new Date(`${a.startDate}T00:00:00`) - new Date(`${b.startDate}T00:00:00`);
    if (startDiff !== 0) return startDiff;
    const timeA = a.startTime || '99:99';
    const timeB = b.startTime || '99:99';
    return timeA.localeCompare(timeB);
}

function loadStaffEvents() {
    try {
        const raw = localStorage.getItem(STAFF_CALENDAR_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : null;
        if (Array.isArray(parsed)) {
            return parsed.map(event => ({ ...event }));
        }
    } catch (error) {
        console.warn('Failed to load staff events', error);
    }
    return staffCalendarSeedEvents.map(event => ({ ...event }));
}

function saveStaffEvents(events) {
    localStorage.setItem(STAFF_CALENDAR_STORAGE_KEY, JSON.stringify(events));
}

function initStaffCalendar() {
    const lockCard = document.getElementById('staff-lock-card');
    const dashboard = document.getElementById('staff-dashboard');
    const unlockBtn = document.getElementById('staff-unlock-btn');
    const passcodeInput = document.getElementById('staff-passcode');
    const modalSaveBtn = document.getElementById('staff-event-save-btn');
    const modalDeleteBtn = document.getElementById('staff-event-delete-btn');
    const form = document.getElementById('staff-event-form');

    staffCalendarState = {
        monthOffset: 0,
        selectedDate: normalizeStaffDate(new Date()),
        selectedEventId: null,
        unlocked: localStorage.getItem(STAFF_CALENDAR_UNLOCK_KEY) === 'true',
        events: loadStaffEvents()
    };
    window.staffCalendarState = staffCalendarState;

    if (staffCalendarState.unlocked) {
        if (lockCard) lockCard.classList.add('hidden');
        if (dashboard) dashboard.classList.remove('hidden');
    }

    if (unlockBtn && passcodeInput) {
        unlockBtn.addEventListener('click', unlockStaffCalendar);
        passcodeInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                unlockStaffCalendar();
            }
        });
    }

    if (modalSaveBtn) {
        modalSaveBtn.addEventListener('click', saveStaffEvent);
    }

    if (modalDeleteBtn) {
        modalDeleteBtn.addEventListener('click', deleteStaffEvent);
    }

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            saveStaffEvent();
        });
    }

    document.addEventListener('keydown', handleStaffModalEscape);

    renderStaffCalendar();
    renderStaffEventList();
}

function unlockStaffCalendar() {
    const passcodeInput = document.getElementById('staff-passcode');
    const lockCard = document.getElementById('staff-lock-card');
    const dashboard = document.getElementById('staff-dashboard');

    if (!passcodeInput) return;

    const passcode = passcodeInput.value.trim();
    if (passcode !== STAFF_CALENDAR_PASSCODE) {
        alert('직원 코드가 올바르지 않습니다.');
        passcodeInput.focus();
        return;
    }

    localStorage.setItem(STAFF_CALENDAR_UNLOCK_KEY, 'true');
    if (staffCalendarState) {
        staffCalendarState.unlocked = true;
    }

    if (lockCard) lockCard.classList.add('hidden');
    if (dashboard) dashboard.classList.remove('hidden');
    renderStaffCalendar();
    renderStaffEventList();
}

function staffChangeMonth(delta) {
    if (!staffCalendarState) return;
    staffCalendarState.monthOffset += delta;
    window.staffCalendarState = staffCalendarState;
    renderStaffCalendar();
}

function staffGoToToday() {
    if (!staffCalendarState) return;
    staffCalendarState.monthOffset = 0;
    staffCalendarState.selectedDate = normalizeStaffDate(new Date());
    window.staffCalendarState = staffCalendarState;
    renderStaffCalendar();
    renderStaffEventList();
}

function staffResetCalendar() {
    staffGoToToday();
}

function renderStaffCalendar() {
    const grid = document.getElementById('staff-calendar-grid');
    const monthLabel = document.getElementById('staff-calendar-month-label');
    const selectedLabel = document.getElementById('staff-selected-date-label');
    const daySummary = document.getElementById('staff-day-summary');

    if (!grid || !monthLabel || !selectedLabel || !daySummary || !staffCalendarState) return;

    const baseDate = getCurrentMonthDate(new Date(), staffCalendarState.monthOffset);
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = normalizeStaffDate(new Date());

    monthLabel.textContent = formatStaffMonthLabel(baseDate);
    selectedLabel.textContent = staffCalendarState.selectedDate ? formatStaffDateLabel(staffCalendarState.selectedDate) : '날짜를 선택하세요';

    grid.innerHTML = '';

    for (let i = 0; i < firstDayIndex; i += 1) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'min-h-[104px] sm:min-h-[118px] rounded-2xl border border-transparent';
        grid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        const currentDate = normalizeStaffDate(new Date(year, month, day));
        const events = staffCalendarState.events.filter(event => isStaffEventOnDate(event, currentDate)).sort(sortStaffEvents);
        const isSelected = currentDate === staffCalendarState.selectedDate;
        const isToday = currentDate === today;

        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = `staff-calendar-day text-left min-h-[104px] sm:min-h-[118px] rounded-2xl border p-3 sm:p-4 transition ${isSelected ? 'border-water-500 bg-water-50 shadow-lg shadow-water-100' : 'border-slate-200 bg-white hover:border-water-300 hover:shadow-md'} ${isToday ? 'ring-2 ring-cyan-400/40' : ''}`;
        cell.addEventListener('click', () => {
            staffCalendarState.selectedDate = currentDate;
            staffCalendarState.selectedEventId = events[0] ? events[0].id : null;
            window.staffCalendarState = staffCalendarState;
            renderStaffCalendar();
            renderStaffEventList();
        });

        const titleRow = document.createElement('div');
        titleRow.className = 'flex items-start justify-between gap-2 mb-2';

        const dayNumber = document.createElement('span');
        dayNumber.className = `text-sm sm:text-base font-black ${isToday ? 'text-water-700' : 'text-slate-800'}`;
        dayNumber.textContent = String(day);

        const markerWrap = document.createElement('div');
        markerWrap.className = 'flex items-center gap-1';
        if (isToday) {
            const todayBadge = document.createElement('span');
            todayBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500 text-white';
            todayBadge.textContent = 'TODAY';
            markerWrap.appendChild(todayBadge);
        }
        if (events.length > 3) {
            const moreBadge = document.createElement('span');
            moreBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600';
            moreBadge.textContent = `+${events.length - 3}`;
            markerWrap.appendChild(moreBadge);
        }

        titleRow.appendChild(dayNumber);
        titleRow.appendChild(markerWrap);
        cell.appendChild(titleRow);

        const eventStack = document.createElement('div');
        eventStack.className = 'space-y-1.5';
        events.slice(0, 3).forEach(event => {
            const chip = document.createElement('div');
            chip.className = `staff-event-chip text-[11px] font-bold rounded-lg border px-2 py-1 ${getStaffCategoryClasses(event.category)}`;
            chip.textContent = event.title;
            chip.title = `${event.title} · ${formatStaffDateTime(event.startDate, event.startTime)}`;
            chip.addEventListener('click', (clickEvent) => {
                clickEvent.stopPropagation();
                openStaffEventEditor('edit', event.id);
            });
            eventStack.appendChild(chip);
        });

        if (events.length === 0) {
            const emptyHint = document.createElement('div');
            emptyHint.className = 'mt-4 text-[11px] text-slate-400';
            emptyHint.textContent = '일정 없음';
            eventStack.appendChild(emptyHint);
        }

        cell.appendChild(eventStack);
        grid.appendChild(cell);
    }

    renderStaffDaySummary();
}

function renderStaffDaySummary() {
    const daySummary = document.getElementById('staff-day-summary');
    if (!daySummary || !staffCalendarState) return;

    const selectedEvents = staffCalendarState.events.filter(event => isStaffEventOnDate(event, staffCalendarState.selectedDate)).sort(sortStaffEvents);
    if (selectedEvents.length === 0) {
        daySummary.innerHTML = '<p class="text-slate-300">선택한 날짜에 등록된 일정이 없습니다.</p>';
        return;
    }

    daySummary.innerHTML = '';
    selectedEvents.forEach(event => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'w-full text-left rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition p-4';
        card.addEventListener('click', () => openStaffEventEditor('edit', event.id));

        card.innerHTML = `
            <div class="flex items-start justify-between gap-3">
                <div class="space-y-1">
                    <div class="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStaffCategoryClasses(event.category)}">${getStaffCategoryLabel(event.category)}</div>
                    <h4 class="font-black text-white text-base leading-snug">${escapeHtml(event.title)}</h4>
                    <p class="text-slate-300 text-xs">${escapeHtml(formatStaffDateTime(event.startDate, event.startTime))}${event.endDate !== event.startDate ? ` ~ ${escapeHtml(formatStaffDateTime(event.endDate, event.endTime))}` : event.endTime ? ` ~ ${escapeHtml(event.endTime)}` : ''}</p>
                    ${event.location ? `<p class="text-slate-300 text-xs">${escapeHtml(event.location)}</p>` : ''}
                </div>
                <i class="fa-solid fa-pen-to-square text-cyan-300"></i>
            </div>
        `;
        daySummary.appendChild(card);
    });
}

function renderStaffEventList() {
    const list = document.getElementById('staff-event-list');
    if (!list || !staffCalendarState) return;

    const upcoming = [...staffCalendarState.events]
        .filter(event => event.endDate >= normalizeStaffDate(new Date()))
        .sort(sortStaffEvents)
        .slice(0, 8);

    if (upcoming.length === 0) {
        list.innerHTML = '<p class="text-slate-500 text-sm">등록된 일정이 없습니다. 새 일정을 추가해 주세요.</p>';
        return;
    }

    list.innerHTML = '';
    upcoming.forEach(event => {
        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'w-full text-left rounded-2xl border border-slate-200 p-4 hover:border-water-300 hover:shadow-md transition bg-slate-50/60';
        row.addEventListener('click', () => openStaffEventEditor('edit', event.id));

        row.innerHTML = `
            <div class="flex items-start justify-between gap-4">
                <div class="space-y-2 min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStaffCategoryClasses(event.category)}">${getStaffCategoryLabel(event.category)}</span>
                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">${event.share === 'team' ? '부서 공유' : '직원 공유'}</span>
                    </div>
                    <h4 class="font-black text-slate-900 leading-snug truncate">${escapeHtml(event.title)}</h4>
                    <p class="text-sm text-slate-500">${escapeHtml(formatStaffDateTime(event.startDate, event.startTime))}${event.endDate !== event.startDate ? ` ~ ${escapeHtml(formatStaffDateTime(event.endDate, event.endTime))}` : event.endTime ? ` ~ ${escapeHtml(event.endTime)}` : ''}</p>
                    ${event.location ? `<p class="text-xs text-slate-400">${escapeHtml(event.location)}</p>` : ''}
                </div>
                <i class="fa-solid fa-chevron-right text-slate-400 mt-1"></i>
            </div>
        `;
        list.appendChild(row);
    });
}

function openStaffEventEditor(mode = 'create', eventId = null, dateValue = null) {
    if (!staffCalendarState || !staffCalendarState.unlocked) {
        alert('직원 전용 구역은 먼저 잠금을 해제해야 합니다.');
        return;
    }

    const modal = document.getElementById('staff-event-modal');
    const title = document.getElementById('staff-event-modal-title');
    const subtitle = document.getElementById('staff-event-modal-subtitle');
    const deleteBtn = document.getElementById('staff-event-delete-btn');
    const idField = document.getElementById('staff-event-id');
    const titleField = document.getElementById('staff-event-title');
    const categoryField = document.getElementById('staff-event-category');
    const shareField = document.getElementById('staff-event-share');
    const startDateField = document.getElementById('staff-event-start-date');
    const endDateField = document.getElementById('staff-event-end-date');
    const startTimeField = document.getElementById('staff-event-start-time');
    const endTimeField = document.getElementById('staff-event-end-time');
    const locationField = document.getElementById('staff-event-location');
    const notesField = document.getElementById('staff-event-notes');

    if (!modal || !title || !subtitle || !deleteBtn || !idField || !titleField || !categoryField || !shareField || !startDateField || !endDateField || !startTimeField || !endTimeField || !locationField || !notesField) return;

    const eventData = mode === 'edit' ? staffCalendarState.events.find(event => event.id === eventId) : null;
    const fallbackDate = dateValue || staffCalendarState.selectedDate || normalizeStaffDate(new Date());

    subtitle.textContent = mode === 'edit' ? 'Edit Schedule' : 'Shared Schedule';
    title.textContent = mode === 'edit' ? '일정 수정' : '일정 추가';
    deleteBtn.classList.toggle('hidden', mode !== 'edit');
    idField.value = eventData ? eventData.id : '';
    titleField.value = eventData ? eventData.title : '';
    categoryField.value = eventData ? eventData.category : 'meeting';
    shareField.value = eventData ? eventData.share : 'internal';
    startDateField.value = eventData ? eventData.startDate : fallbackDate;
    endDateField.value = eventData ? eventData.endDate : fallbackDate;
    startTimeField.value = eventData ? eventData.startTime : '';
    endTimeField.value = eventData ? eventData.endTime : '';
    locationField.value = eventData ? eventData.location : '';
    notesField.value = eventData ? eventData.notes : '';

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => titleField.focus(), 50);
}

function closeStaffEventEditor() {
    const modal = document.getElementById('staff-event-modal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function saveStaffEvent() {
    if (!staffCalendarState || !staffCalendarState.unlocked) return;

    const idField = document.getElementById('staff-event-id');
    const titleField = document.getElementById('staff-event-title');
    const categoryField = document.getElementById('staff-event-category');
    const shareField = document.getElementById('staff-event-share');
    const startDateField = document.getElementById('staff-event-start-date');
    const endDateField = document.getElementById('staff-event-end-date');
    const startTimeField = document.getElementById('staff-event-start-time');
    const endTimeField = document.getElementById('staff-event-end-time');
    const locationField = document.getElementById('staff-event-location');
    const notesField = document.getElementById('staff-event-notes');

    if (!idField || !titleField || !categoryField || !shareField || !startDateField || !endDateField || !startTimeField || !endTimeField || !locationField || !notesField) return;

    const title = titleField.value.trim();
    const startDate = startDateField.value;
    const endDate = endDateField.value || startDate;

    if (!title) {
        alert('일정 제목을 입력해 주세요.');
        titleField.focus();
        return;
    }

    if (!startDate) {
        alert('시작 날짜를 입력해 주세요.');
        startDateField.focus();
        return;
    }

    if (endDate < startDate) {
        alert('종료 날짜는 시작 날짜보다 빠를 수 없습니다.');
        endDateField.focus();
        return;
    }

    const eventId = idField.value || `staff-${Date.now()}`;
    const nextEvent = {
        id: eventId,
        title,
        category: categoryField.value,
        share: shareField.value,
        startDate,
        endDate,
        startTime: startTimeField.value,
        endTime: endTimeField.value,
        location: locationField.value.trim(),
        notes: notesField.value.trim()
    };

    const existingIndex = staffCalendarState.events.findIndex(event => event.id === eventId);
    if (existingIndex >= 0) {
        staffCalendarState.events[existingIndex] = nextEvent;
    } else {
        staffCalendarState.events.push(nextEvent);
    }

    saveStaffEvents(staffCalendarState.events);
    localStorage.setItem(STAFF_CALENDAR_UNLOCK_KEY, 'true');
    window.staffCalendarState = staffCalendarState;

    renderStaffCalendar();
    renderStaffEventList();
    closeStaffEventEditor();
    if (window._siteSearchIndex) {
        window._siteSearchIndex = buildSearchIndex();
    }
}

function deleteStaffEvent() {
    if (!staffCalendarState || !staffCalendarState.unlocked) return;

    const idField = document.getElementById('staff-event-id');
    if (!idField || !idField.value) return;

    const confirmed = confirm('이 일정을 삭제하시겠습니까?');
    if (!confirmed) return;

    staffCalendarState.events = staffCalendarState.events.filter(event => event.id !== idField.value);
    saveStaffEvents(staffCalendarState.events);
    window.staffCalendarState = staffCalendarState;

    renderStaffCalendar();
    renderStaffEventList();
    closeStaffEventEditor();
    if (window._siteSearchIndex) {
        window._siteSearchIndex = buildSearchIndex();
    }
}

function handleStaffModalEscape(event) {
    const modal = document.getElementById('staff-event-modal');
    if (!modal || modal.classList.contains('hidden')) return;

    if (event.key === 'Escape') {
        closeStaffEventEditor();
    }
}

const productDetails = {
    booster: {
        title: "고효율 개별 인버터 부스터 펌프 시스템",
        subtitle: "Building & Industry Automatic Water Supply System",
        desc: "최첨단 지능형 개별 인버터 제어 기술이 적용되어 공급 유량 변화에 따라 모터 회전수를 실시간 정밀 제어합니다. 다중 운전 제어로 에너지 소비를 극대화로 낮추고 일정한 급수 압력을 보장합니다.",
        specs: [
            { key: "토출량 범위", val: "5 ㎥/hr ~ 120 ㎥/hr" },
            { key: "사용 양정", val: "최대 180 m" },
            { key: "사용 전원", val: "3상 220V/380V/440V, 50/60Hz" },
            { key: "제어 방식", val: "개별 인버터 PID 일정 압력 제어" },
            { key: "주요 특징", val: "동파 방지 제어, 펌프 균등 가동 교대식 운전, IoT 실시간 원격 진단 연동 가능" }
        ]
    },
    deepwell: {
        title: "심정 고내구 수중 모터 펌프",
        subtitle: "Deep-Well Submersible Motor Pump",
        desc: "고심도의 지하수 개발, 농업 관수 및 공업용 용수 개발에 최적화된 완전 밀폐 수중 모터 펌프입니다. 부식에 강한 고품질 스테인리스 재질로 임펠러와 외관을 마감하여 강력한 성능과 고내구 기계 수명을 약속합니다.",
        specs: [
            { key: "토출량 범위", val: "2 ㎥/hr ~ 80 ㎥/hr" },
            { key: "사용 양정", val: "10 m ~ 250 m" },
            { key: "모터 출력", val: "1.5 HP ~ 40 HP" },
            { key: "주요 재질", val: "Stainless Steel 304 / 316" },
            { key: "적용 분야", val: "지하수 개발, 농업 송수, 공업용수 공급, 취수장 시설" }
        ]
    },
    centrifugal: {
        title: "입형/횡형 고압 다단 원심 펌프",
        subtitle: "Vertical & Horizontal Multistage Centrifugal Pump",
        desc: "보일러 급수, 수처리 RO 필터링 고압 가압 공정, 소방 소화 설비에 탁월한 입형(수직형) 및 횡형(수평형) 고압 펌프입니다. 고온 유체 이송 시 안정적인 메커니컬 씰 밀폐 기술로 누수 오작동을 차단합니다.",
        specs: [
            { key: "토출량 범위", val: "1 ㎥/hr ~ 60 ㎥/hr" },
            { key: "사용 압력", val: "최대 25 bar (2.5 MPa)" },
            { key: "이송 온도", val: "-15 ℃ ~ +120 ℃" },
            { key: "임펠러 형식", val: "고효율 폐쇄형 다단 임펠러" },
            { key: "주요 특징", val: "협소 공간 설치 가능(입형), 저소음/저진동 설계 구조" }
        ]
    },
    wastewater: {
        title: "산업용 비폐쇄성 수중 오배수 펌프",
        subtitle: "Submersible Sewage & Wastewater Pump (Non-Clog)",
        desc: "고형물, 슬러지, 섬유질 이물질이 포함된 하수 처리 및 오배수 이송에 완벽한 무걸림 임펠러 장착 펌프입니다. 견고한 주철 하우징과 모터 내부 이중 오일 씰 챔버를 적용하여 누전을 근본적으로 차단합니다.",
        specs: [
            { key: "토출량 범위", val: "10 ㎥/hr ~ 200 ㎥/hr" },
            { key: "사용 양정", val: "5 m ~ 40 m" },
            { key: "통과 고형물 크기", val: "최대 Ø50 mm (Non-clog 임펠러)" },
            { key: "보호 등급", val: "IP68 완전 방수 및 모터 누전 센서 탑재" },
            { key: "적용 분야", val: "하수처리장, 정화조 배출, 지하 침수 배수, 건설 가설 현장" }
        ]
    },
    volute: {
        title: "산업용 단단 볼류트 원심 펌프",
        subtitle: "Single-stage Volute End-Suction Centrifugal Pump",
        desc: "산업 표준화 규격에 맞춰 설계된 표준 벌크 이송용 볼류트 펌프입니다. 모터와 펌프 바디가 베이스 플레이트 위에서 정밀 축정렬(Alignment) 되어 대량의 냉각수, 순환수, 화학 유체를 안전하게 송수합니다. 유지보수가 용이한 Back pull-out 구조입니다.",
        specs: [
            { key: "토출량 범위", val: "20 ㎥/hr ~ 350 ㎥/hr" },
            { key: "사용 양정", val: "10 m ~ 90 m" },
            { key: "커플링 형식", val: "정밀 플렉시블 스페이서 커플러" },
            { key: "주요 특징", val: "편리한 소모품 교체 정비 구조, 장수명 그랜드 패킹 또는 메커니컬 씰 적용" }
        ]
    },
    panel: {
        title: "지능형 펌프 자동제어 연동 시스템 (IoT)",
        subtitle: "Intelligent Pump Control Panel System",
        desc: "현장 압력 센서 및 차압 발신기와 연동하여 여러 대의 펌프 작동 개수 및 모터 속도를 실시간 연산 조정하는 스마트 판넬입니다. 과부하 보호 릴레이, 상결상 감지기, 원격 알림 IoT 칩셋 모듈을 통합 구성하여 최상의 편의성을 확보했습니다.",
        specs: [
            { key: "제어 용량", val: "0.75 kW ~ 110 kW (다중 동시 제어)" },
            { key: "입력 전압", val: "3상 380V, 60Hz 표준" },
            { key: "인터페이스", val: "7인치 풀 컬러 터치 스크린 HMI 탑재" },
            { key: "통신 방식", val: "RS485 Modbus, Ethernet, LTE 원격 무선 모뎀 연동" },
            { key: "보호 기능", val: "모터 과부하, 저전압, 과전압, 단선, 이상 공회전 건식 방지 보호" }
        ]
    }
};

/* ==========================================================================
   Product Actions & Dynamic Rendering
   ========================================================================== */
function renderProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = '';
    productsData.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1';
        card.setAttribute('data-category', p.category);
        card.innerHTML = `
            <div class="relative block w-full h-64 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-water-900 group text-left">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(2,132,199,0.26),transparent_38%)]"></div>
                <div class="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,transparent_45%,rgba(255,255,255,0.05)_100%)]"></div>
                <div class="absolute inset-x-0 top-0 h-1.5 ${p.badgeColor}"></div>
                <div class="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-black border border-white/15 backdrop-blur">
                    <i class="${p.icon} text-cyan-300"></i> 비에이텍 솔루션
                </div>
                <div class="absolute top-4 right-4 ${p.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">${p.badge}</div>
                <div class="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center text-white">
                    <div class="w-24 h-24 rounded-3xl bg-white/10 border border-white/15 shadow-2xl shadow-water-950/30 flex items-center justify-center backdrop-blur-sm">
                        <i class="${p.icon} ${p.iconColor} text-4xl"></i>
                    </div>
                    <div class="space-y-2 max-w-[16rem]">
                        <p class="text-[11px] uppercase tracking-[0.28em] text-cyan-200/80 font-bold">Product Concept</p>
                        <h4 class="text-xl font-extrabold leading-tight">${p.title}</h4>
                        <p class="text-sm text-slate-200/90 leading-relaxed">${p.tag}</p>
                    </div>
                </div>
            </div>
            <div class="p-6">
                <h4 class="text-xl font-bold text-slate-800">${p.title}</h4>
                <p class="text-slate-500 text-sm mt-2 leading-relaxed">${p.desc}</p>
                <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span class="text-xs font-bold text-slate-400">${p.tag}</span>
                    <button onclick="openProductDetail('${p.id}')" class="text-sm font-bold text-water-600 hover:text-water-700 flex items-center gap-1 group shrink-0">
                        제품 정보 <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function openProductDetail(prodId) {
    const data = productDetails[prodId];
    if (!data) return;

    const modal = document.getElementById('product-modal');
    const title = document.getElementById('modal-title');
    const subtitle = document.getElementById('modal-subtitle');
    const desc = document.getElementById('modal-desc');
    const specTable = document.getElementById('modal-spec-tbody');
    const inquiryLink = document.getElementById('modal-inquiry-btn');

    if (!modal || !title || !subtitle || !desc || !specTable || !inquiryLink) return;

    // Populate data
    title.innerText = data.title;
    subtitle.innerText = data.subtitle;
    desc.innerText = data.desc;

    // Spec table generation
    specTable.innerHTML = '';
    data.specs.forEach(spec => {
        const row = document.createElement('tr');
        row.className = 'border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition';
        row.innerHTML = `
            <td class="px-4 py-3 text-sm font-bold text-slate-700 w-1/3">${spec.key}</td>
            <td class="px-4 py-3 text-sm text-slate-600">${spec.val}</td>
        `;
        specTable.appendChild(row);
    });

    // Set inquiry navigation action
    inquiryLink.onclick = () => {
        closeProductDetail();
        setTimeout(() => {
            navigateTo('inquiry');
            // Select the inquiry type based on product if possible
            const inquirySelect = document.getElementById('inquiry-type');
            if (inquirySelect) {
                if (prodId === 'booster' || prodId === 'panel') {
                    inquirySelect.value = '제작';
                } else if (prodId === 'centrifugal' || prodId === 'volute') {
                    inquirySelect.value = '시공';
                } else {
                    inquirySelect.value = '수리';
                }
            }
        }, 100);
    };

    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeProductDetail() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
    document.body.style.overflow = '';
}

/* ==========================================================================
   History Table Rendering & Filtering
   ========================================================================== */
function renderHistoryTable(type = 'all') {
    const tbody = document.getElementById('history-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    const filtered = historyProjects.filter(p => type === 'all' || p.type === type);

    filtered.forEach(p => {
        const row = document.createElement('tr');
        row.className = 'border-b border-slate-100 last:border-0 hover:bg-slate-50 transition duration-200';
        
        let badgeColor = '';
        if (p.type === 'public') {
            badgeColor = 'bg-blue-50 text-blue-600 border-blue-200';
        } else if (p.type === 'private') {
            badgeColor = 'bg-emerald-50 text-emerald-600 border-emerald-200';
        } else {
            badgeColor = 'bg-orange-50 text-orange-600 border-orange-200';
        }

        row.innerHTML = `
            <td class="px-4 py-3 font-mono font-bold text-slate-500">${p.year}</td>
            <td class="px-4 py-3 font-bold text-slate-800">${p.client}</td>
            <td class="px-4 py-3 text-slate-600">${p.project}</td>
            <td class="px-4 py-3 text-center">
                <span class="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}">${p.typeKo}</span>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterHistory(type) {
    renderHistoryTable(type);

    const btns = document.querySelectorAll('.hist-filter-btn');
    btns.forEach(btn => {
        const onClickAttr = btn.getAttribute('onclick');
        if (onClickAttr && onClickAttr.includes(`'${type}'`)) {
            btn.classList.add('active', 'bg-white', 'text-slate-800', 'shadow-sm');
            btn.classList.remove('text-slate-600', 'hover:text-slate-900');
        } else {
            btn.classList.remove('active', 'bg-white', 'text-slate-800', 'shadow-sm');
            btn.classList.add('text-slate-600', 'hover:text-slate-900');
        }
    });
}

/* ==========================================================================
   Manufacturing Gallery Modal popup
   ========================================================================== */
function openGalleryModal(imgSrc, title, desc) {
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('gallery-modal-img');
    const modalFrame = document.getElementById('gallery-modal-frame');
    const modalTitle = document.getElementById('gallery-modal-title');
    const modalDesc = document.getElementById('gallery-modal-desc');
    const modalOpenBtn = document.getElementById('gallery-modal-open-btn');

    if (!modal || !modalImg || !modalFrame || !modalTitle || !modalDesc || !modalOpenBtn) return;

    const isPdf = /\.pdf($|\?)/i.test(imgSrc);

    if (isPdf) {
        modalImg.classList.add('hidden');
        modalImg.removeAttribute('src');
        modalFrame.classList.remove('hidden');
        modalFrame.src = imgSrc;
        modalOpenBtn.href = imgSrc;
        modalOpenBtn.textContent = '문서 새 창으로 열기';
    } else {
        modalFrame.classList.add('hidden');
        modalFrame.removeAttribute('src');
        modalImg.classList.remove('hidden');
        modalImg.src = imgSrc;
        modalImg.alt = title;
        modalOpenBtn.href = imgSrc;
        modalOpenBtn.textContent = '원본 새 창으로 열기';
    }
    modalTitle.innerText = title;
    modalDesc.innerText = desc;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('gallery-modal-img');
    const modalFrame = document.getElementById('gallery-modal-frame');
    if (modal) {
        modal.classList.add('hidden');
    }
    if (modalImg) {
        modalImg.removeAttribute('src');
    }
    if (modalFrame) {
        modalFrame.removeAttribute('src');
        modalFrame.classList.add('hidden');
    }
    document.body.style.overflow = '';
}

/* ==========================================================================
   Leaflet.js Map Initialization
   ========================================================================== */
function initLeafletMap() {
    const mapContainer = document.getElementById('leaflet-map');
    if (!mapContainer) return;

    // Coordinates of Toegye Gongdan 2-gil 64, Chuncheon, Gangwon-do
    const lat = 37.8488;
    const lng = 127.7196;

    // Initialize Map object (centered at coordinate, zoom level 16)
    const map = L.map('leaflet-map', {
        scrollWheelZoom: false // Prevent scroll wheel capture
    }).setView([lat, lng], 16);

    window.batechMap = map;

    // Add Tile Layer (OpenStreetMap with clean aesthetic styling)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Create marker
    const marker = L.marker([lat, lng]).addTo(map);
    
    // Create rich popup info
    const popupContent = `
        <div style="font-family: 'Noto Sans KR', sans-serif; padding: 5px; min-width: 180px;">
            <h4 style="margin: 0 0 5px 0; color: #0284c7; font-weight: bold; font-size: 14px;">(주)비에이텍 본사 및 공장</h4>
            <p style="margin: 0 0 5px 0; font-size: 11px; color: #64748b;">강원특별자치도 춘천시 퇴계공단2길 64</p>
            <p style="margin: 0; font-size: 11px; font-weight: bold; color: #0f172a;">대표전화: 033-264-9243</p>
        </div>
    `;

    marker.bindPopup(popupContent).openPopup();

    // Enable scroll wheel zoom on double click or manual click
    map.on('click', () => {
        map.scrollWheelZoom.enable();
    });

    map.on('mouseout', () => {
        map.scrollWheelZoom.disable();
    });
}

function openOfficeMap(service) {
    const address = '강원특별자치도 춘천시 퇴계공단2길 64';
    const encodedAddress = encodeURIComponent(address);
    const urls = {
        naver: `https://map.naver.com/p/search/${encodedAddress}`,
        kakao: `https://map.kakao.com/link/search/${encodedAddress}`
    };

    const url = urls[service] || urls.naver;
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (!opened) {
        window.location.href = url;
    }
}

/* ==========================================================================
   Interactive Sine Waves Canvas Animation (Fluid Look)
   ========================================================================== */
function initHeroWaves() {
    const canvas = document.getElementById('hero-waves-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId;

    // Adjust canvas resolution dynamically
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Waves definition
    const waves = [
        {
            amplitude: 28,      // Wave height
            length: 0.003,      // Wave wavelength frequency
            speed: 0.015,       // Wave speed
            color: 'rgba(56, 189, 248, 0.15)', // Light cyan-blue (Sky 400)
            phase: 0            // Starting phase offset
        },
        {
            amplitude: 20,
            length: 0.005,
            speed: 0.025,
            color: 'rgba(14, 165, 233, 0.12)', // Medium sky-blue (Water 500)
            phase: 2
        },
        {
            amplitude: 15,
            length: 0.007,
            speed: 0.01,
            color: 'rgba(2, 132, 199, 0.08)',  // Dark water-blue (Water 600)
            phase: 4
        }
    ];

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        waves.forEach(wave => {
            ctx.beginPath();
            ctx.fillStyle = wave.color;

            // Draw fluid curve line
            const midY = canvas.height * 0.85; // Float waves near lower area
            
            ctx.moveTo(0, canvas.height);
            for (let x = 0; x < canvas.width; x++) {
                // Sine equation: y = sin(x * frequency + phase) * amplitude + offset
                const y = Math.sin(x * wave.length + wave.phase) * wave.amplitude + midY;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(canvas.width, canvas.height);
            ctx.closePath();
            ctx.fill();

            // Advance phase based on speed
            wave.phase += wave.speed;
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   Inquiry Form Submit Validation & Processing
   ========================================================================== */
function initInquiryForm() {
    const form = document.getElementById('inquiry-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Retrieve field values
        const nameInput = document.getElementById('inquiry-name');
        const phoneInput = document.getElementById('inquiry-phone');
        const emailInput = document.getElementById('inquiry-email');
        const typeSelect = document.getElementById('inquiry-type');
        const messageTextarea = document.getElementById('inquiry-message');
        const agreeCheckbox = document.getElementById('inquiry-agree');

        if (!nameInput || !phoneInput || !emailInput || !typeSelect || !messageTextarea || !agreeCheckbox) return;

        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const email = emailInput.value.trim();
        const type = typeSelect.value;
        const message = messageTextarea.value.trim();
        const agree = agreeCheckbox.checked;

        // Validations
        if (!name) {
            alert('성함 또는 업체명을 입력해 주세요.');
            nameInput.focus();
            return;
        }

        if (!phone) {
            alert('연락처를 입력해 주세요.');
            phoneInput.focus();
            return;
        }

        // Phone pattern test (digits, hyphens allowed)
        const phonePattern = /^[0-9\-]{9,15}$/;
        if (!phonePattern.test(phone.replace(/\s/g, ''))) {
            alert('올바른 연락처 형식을 입력해 주세요 (숫자 및 하이픈만 가능).');
            phoneInput.focus();
            return;
        }

        if (!email) {
            alert('이메일 주소를 입력해 주세요.');
            emailInput.focus();
            return;
        }

        // Simple Email pattern test
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('올바른 이메일 주소 형식을 입력해 주세요.');
            emailInput.focus();
            return;
        }

        if (!type) {
            alert('문의 유형을 선택해 주세요.');
            typeSelect.focus();
            return;
        }

        if (!message) {
            alert('문의 내용을 상세히 작성해 주세요.');
            messageTextarea.focus();
            return;
        }

        if (!agree) {
            alert('개인정보 수집 및 이용에 동의하셔야 문의 접수가 가능합니다.');
            return;
        }

        const subject = encodeURIComponent(`[비에이텍 문의] ${type} - ${name}`);
        const body = encodeURIComponent([
            '비에이텍 홈페이지 문의가 도착했습니다.',
            '',
            `성함 / 업체명: ${name}`,
            `연락처: ${phone}`,
            `고객 이메일: ${email}`,
            `문의 유형: ${type}`,
            '',
            '문의 내용:',
            message
        ].join('\n'));

        alert('메일 작성 창을 열었습니다. 전송 버튼을 누르면 tjwjddn1130@gmail.com으로 문의가 전달됩니다.');

        window.location.href = `mailto:tjwjddn1130@gmail.com?subject=${subject}&body=${body}`;

        form.reset();
    });
}

/* ==========================================================================
   Simple Chatbot for FAQ-style answers
   ========================================================================== */
function initChatbot() {
    const toggleBtn = document.getElementById('chatbot-toggle-btn');
    const panel = document.getElementById('chatbot-panel');
    const form = document.getElementById('chatbot-form');
    const input = document.getElementById('chatbot-input');

    if (!toggleBtn || !panel || !form || !input) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const question = input.value.trim();
        if (!question) return;

        addChatbotMessage('user', question);
        input.value = '';

        const answer = generateChatbotAnswer(question);
        setTimeout(() => addChatbotMessage('bot', answer), 300);
    });
}

function toggleChatbot() {
    const panel = document.getElementById('chatbot-panel');
    const input = document.getElementById('chatbot-input');
    if (!panel) return;

    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden') && input) {
        input.focus();
    }
}

function addChatbotMessage(role, text) {
    const messages = document.getElementById('chatbot-messages');
    if (!messages) return;

    const bubble = document.createElement('div');
    bubble.className = `chatbot-message ${role === 'user' ? 'chatbot-message-user' : 'chatbot-message-bot'}`;
    bubble.innerHTML = text.replace(/\n/g, '<br>');
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
}

function generateChatbotAnswer(question) {
    const normalized = question.toLowerCase();

    const answers = [
        {
            test: /(가격|견적|비용|단가)/,
            reply: '제품별 가격은 문의해 주시면 정확한 사양, 규격, 수량에 따라 안내해 드립니다. 간단한 견적 상담을 원하시면 설치 위치와 사용 목적을 함께 알려주세요.'
        },
        {
            test: /(설치|시공|공사|배관|현장)/,
            reply: '설치 및 시공은 현장 여건과 배관 형태에 따라 다릅니다. 방문 상담 후 정확한 설치 계획과 일정을 안내해 드립니다.'
        },
        {
            test: /(수리|고장|정비|점검)/,
            reply: '긴급 수리 및 정비는 고장 증상과 사용 중인 펌프 모델을 확인해야 합니다. 전화 또는 이메일로 상세 증상을 알려주시면 빠르게 대응하겠습니다.'
        },
        {
            test: /(제품|펌프|라인업|모델)/,
            reply: '저희는 맞춤형 워터펌프, 압력탱크, 자동 급수 시스템 등 다양한 유체 엔지니어링 제품을 제공합니다. 필요하신 용도나 설치 환경을 알려주세요.'
        },
        {
            test: /(연락처|전화|전화번호|문의 방법)/,
            reply: '대표전화는 033-264-9243이며, 이메일은 gwf0123@hanmail.net입니다. 언제든 연락 주시면 친절히 안내해 드리겠습니다.'
        },
        {
            test: /(주소|위치|찾아오|오시는 길)/,
            reply: '저희 본사는 강원특별자치도 춘천시 퇴계공단2길 64에 위치해 있습니다. 방문 전 연락 주시면 더욱 정확한 안내를 도와드릴게요.'
        },
        {
            test: /(영업|운영|시간|근무)/,
            reply: '영업일은 월요일부터 금요일까지이며, 주요 상담 시간은 오전 9시부터 오후 6시까지입니다. 주말 상담이 필요하시면 사전 예약을 부탁드립니다.'
        },
        {
            test: /(안녕|안녕하세요|hi|hello|반갑)/,
            reply: '안녕하세요! 무엇을 도와드릴까요? 궁금하신 내용을 입력해 주세요.'
        }
    ];

    for (const answer of answers) {
        if (answer.test.test(normalized)) {
            return answer.reply;
        }
    }

    return '죄송합니다. 현재는 간단한 문의만 안내해 드릴 수 있습니다. 제품, 가격, 설치, 수리, 연락처, 위치 관련 질문을 부탁드립니다.';
}

/* ==========================================================================
   Digital Brochure Magnifier, Panning and Zooming Controls
   ========================================================================== */
let brochureZoom = 1.0;
let brochureTranslateX = 0;
let brochureTranslateY = 0;
let isBrochureDragging = false;
let brochureStartX = 0;
let brochureStartY = 0;

function initBrochureControls() {
    const img = document.getElementById('brochure-viewport-img');
    const container = document.getElementById('brochure-viewport-container');
    const slider = document.getElementById('brochure-zoom-slider');
    const badge = document.getElementById('brochure-zoom-badge');

    if (!img || !container) return;

    // Apply transform style
    function updateBrochureTransform() {
        img.style.transform = `translate(${brochureTranslateX}px, ${brochureTranslateY}px) scale(${brochureZoom})`;
        if (badge) {
            badge.innerText = `ZOOM: ${Math.round(brochureZoom * 100)}% (${brochureZoom === 1 ? '전체 비율' : '확대 보기'})`;
        }
        if (slider) {
            slider.value = brochureZoom;
        }
    }

    // Slider listener
    if (slider) {
        slider.addEventListener('input', (e) => {
            brochureZoom = parseFloat(e.target.value);
            // If zoom is reset to 1.0, reset translate offsets as well
            if (brochureZoom === 1.0) {
                brochureTranslateX = 0;
                brochureTranslateY = 0;
            }
            updateBrochureTransform();
        });
    }

    // Mouse events for dragging
    img.addEventListener('mousedown', (e) => {
        if (brochureZoom <= 1.0) return; // Disable drag if not zoomed in
        e.preventDefault();
        isBrochureDragging = true;
        brochureStartX = e.clientX - brochureTranslateX;
        brochureStartY = e.clientY - brochureTranslateY;
        img.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isBrochureDragging) return;
        brochureTranslateX = e.clientX - brochureStartX;
        brochureTranslateY = e.clientY - brochureStartY;
        
        // Limit dragging bounds based on zoom level to keep image visible
        const cW = container.offsetWidth;
        const cH = container.offsetHeight;
        const maxTranslateX = (cW * (brochureZoom - 1)) / 2;
        const maxTranslateY = (cH * (brochureZoom - 1)) / 2;
        
        if (brochureTranslateX > maxTranslateX) brochureTranslateX = maxTranslateX;
        if (brochureTranslateX < -maxTranslateX) brochureTranslateX = -maxTranslateX;
        if (brochureTranslateY > maxTranslateY) brochureTranslateY = maxTranslateY;
        if (brochureTranslateY < -maxTranslateY) brochureTranslateY = -maxTranslateY;

        updateBrochureTransform();
    });

    window.addEventListener('mouseup', () => {
        if (isBrochureDragging) {
            isBrochureDragging = false;
            img.style.cursor = 'grab';
        }
    });

    // Touch events for mobile dragging
    img.addEventListener('touchstart', (e) => {
        if (brochureZoom <= 1.0) return;
        isBrochureDragging = true;
        const touch = e.touches[0];
        brochureStartX = touch.clientX - brochureTranslateX;
        brochureStartY = touch.clientY - brochureTranslateY;
    });

    img.addEventListener('touchmove', (e) => {
        if (!isBrochureDragging) return;
        const touch = e.touches[0];
        brochureTranslateX = touch.clientX - brochureStartX;
        brochureTranslateY = touch.clientY - brochureStartY;

        const cW = container.offsetWidth;
        const cH = container.offsetHeight;
        const maxTranslateX = (cW * (brochureZoom - 1)) / 2;
        const maxTranslateY = (cH * (brochureZoom - 1)) / 2;
        
        if (brochureTranslateX > maxTranslateX) brochureTranslateX = maxTranslateX;
        if (brochureTranslateX < -maxTranslateX) brochureTranslateX = -maxTranslateX;
        if (brochureTranslateY > maxTranslateY) brochureTranslateY = maxTranslateY;
        if (brochureTranslateY < -maxTranslateY) brochureTranslateY = -maxTranslateY;

        updateBrochureTransform();
    });

    img.addEventListener('touchend', () => {
        isBrochureDragging = false;
    });

    // Expose update function globally or save state
    window.updateBrochureTransform = updateBrochureTransform;
}

/* ==========================================================================
   Simple Client-side Search
   ========================================================================== */
function initSearch() {
    const overlay = document.getElementById('search-overlay');
    const input = document.getElementById('search-input');
    const btn = document.getElementById('search-btn');
    const closeBtn = document.getElementById('search-close-btn');
    const mobileToggle = document.getElementById('search-toggle-btn-mobile');

    if (!overlay || !input || !btn || !closeBtn) return;

    // Build searchable index
    window._siteSearchIndex = buildSearchIndex();

    function openSearch() {
        overlay.classList.remove('hidden');
        input.focus();
        input.select();
    }

    function closeSearch() {
        overlay.classList.add('hidden');
        const results = document.getElementById('search-results');
        if (results) results.innerHTML = '';
        input.value = '';
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openSearch);
    closeBtn.addEventListener('click', closeSearch);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeSearch();
    });

    btn.addEventListener('click', () => performSearch(input.value));
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(input.value);
        } else if (e.key === 'Escape') {
            closeSearch();
        }
    });
}

function buildSearchIndex() {
    const index = [];

    // Sections: use id and heading text
    document.querySelectorAll('section[id]').forEach(sec => {
        const titleEl = sec.querySelector('h2, h3, h1');
        const title = titleEl ? titleEl.innerText.trim() : sec.id;
        const text = sec.innerText.replace(/\s+/g, ' ').trim();
        index.push({ type: 'section', id: sec.id, title, text });
    });

    // Products
    if (window.productsData) {
        window.productsData.forEach(p => {
            index.push({ type: 'product', id: p.id, title: p.title, text: (p.desc || '') + ' ' + (p.tag || '') });
        });
    }

    // History entries
    if (window.historyProjects) {
        window.historyProjects.forEach((h, i) => {
            index.push({ type: 'history', id: `history-${i}`, title: `${h.client} (${h.year})`, text: h.project });
        });
    }

    return index;
}

function performSearch(query) {
    const q = (query || '').trim();
    const resultsEl = document.getElementById('search-results');
    if (!resultsEl) return;
    resultsEl.innerHTML = '';

    if (!q) {
        resultsEl.innerHTML = '<p class="text-slate-500">검색어를 입력해 주세요.</p>';
        return;
    }

    const index = window._siteSearchIndex || buildSearchIndex();
    const normalized = q.toLowerCase();

    const results = index.filter(item => {
        return (item.title && item.title.toLowerCase().includes(normalized)) || (item.text && item.text.toLowerCase().includes(normalized));
    }).slice(0, 30);

    if (results.length === 0) {
        resultsEl.innerHTML = `<p class="text-slate-500">'${q}'(으)로 검색된 결과가 없습니다.</p>`;
        return;
    }

    const ul = document.createElement('div');
    ul.className = 'space-y-2';

    results.forEach(r => {
        const btn = document.createElement('button');
        btn.className = 'w-full text-left p-3 rounded-xl hover:bg-slate-50 transition flex items-start gap-3';

        const kind = document.createElement('div');
        kind.className = 'w-10 h-10 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm';
        kind.innerText = r.type === 'product' ? '제품' : r.type === 'section' ? '섹션' : '실적';

        const meta = document.createElement('div');
        meta.className = 'flex-1';
        const title = document.createElement('div');
        title.className = 'font-bold text-slate-800';
        title.innerHTML = highlight(r.title, query);
        const snippet = document.createElement('div');
        snippet.className = 'text-slate-500 text-sm mt-1';
        const previewText = (r.text || '').slice(0, 160);
        snippet.innerHTML = highlight(previewText, query) + (r.text && r.text.length > 160 ? '...' : '');

        meta.appendChild(title);
        meta.appendChild(snippet);

        btn.appendChild(kind);
        btn.appendChild(meta);

        btn.addEventListener('click', () => {
            // Close overlay
            const overlay = document.getElementById('search-overlay');
            if (overlay) overlay.classList.add('hidden');

            // Navigate based on type
            if (r.type === 'product') {
                // open product modal
                openProductDetail(r.id);
            } else if (r.type === 'section') {
                navigateTo(r.id);
            } else if (r.type === 'history') {
                navigateTo('history');
            }
        });

        ul.appendChild(btn);
    });

    resultsEl.appendChild(ul);
}

function highlight(text, term) {
    if (!term) return escapeHtml(text);
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escapedTerm, 'ig');
    return escapeHtml(text).replace(re, match => `<mark class="bg-yellow-200 rounded">${match}</mark>`);
}

function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, function (c) {
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c];
    });
}

function adjustBrochureZoom(delta) {
    const slider = document.getElementById('brochure-zoom-slider');
    if (!slider) return;
    
    let newZoom = brochureZoom + delta;
    if (newZoom < 1.0) newZoom = 1.0;
    if (newZoom > 3.0) newZoom = 3.0;
    
    brochureZoom = newZoom;
    if (brochureZoom === 1.0) {
        brochureTranslateX = 0;
        brochureTranslateY = 0;
    }
    
    if (window.updateBrochureTransform) {
        window.updateBrochureTransform();
    }
}

function focusBrochureQuadrant(quad) {
    const container = document.getElementById('brochure-viewport-container');
    if (!container) return;
    
    const W = container.offsetWidth;
    const H = container.offsetHeight;
    
    // De-activate all preset buttons
    const presetBtns = document.querySelectorAll('.quad-btn, #quad-btn-full');
    presetBtns.forEach(btn => {
        btn.classList.remove('bg-water-600', 'text-white', 'shadow-md', 'font-bold');
        btn.classList.add('bg-slate-50', 'text-slate-700', 'border-slate-200', 'font-semibold');
    });
    
    // Activate clicked preset button
    const activeBtn = document.getElementById(`quad-btn-${quad}`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-slate-50', 'text-slate-700', 'border-slate-200', 'font-semibold');
        activeBtn.classList.add('bg-water-600', 'text-white', 'shadow-md', 'font-bold');
    }
    
    if (quad === 'full') {
        brochureZoom = 1.0;
        brochureTranslateX = 0;
        brochureTranslateY = 0;
    } else {
        brochureZoom = 2.0; // 200% zoom
        if (quad === 'q1') {
            brochureTranslateX = W * 0.25;
            brochureTranslateY = H * 0.25;
        } else if (quad === 'q2') {
            brochureTranslateX = -W * 0.25;
            brochureTranslateY = H * 0.25;
        } else if (quad === 'q3') {
            brochureTranslateX = W * 0.25;
            brochureTranslateY = -H * 0.25;
        } else if (quad === 'q4') {
            brochureTranslateX = -W * 0.25;
            brochureTranslateY = -H * 0.25;
        }
    }
    
    if (window.updateBrochureTransform) {
        window.updateBrochureTransform();
    }
}

function triggerBrochurePrint() {
    window.print();
}

/* ==========================================================================
   Campaign Card News Carousel
   ========================================================================== */
const cardNewsData = [
    {
        title: "깨끗한 물, 우리의 미래",
        subtitle: "수자원 보호 캠페인",
        text: "물은 생명의 근원입니다. 비에이텍은 친환경 수처리 솔루션을 통해 수자원 오염을 방지하고 에너지를 절감하여 미래 세대에게 맑고 깨끗한 환경을 전합니다.",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800"
    },
    {
        title: "지능형 인버터로 에너지 세이빙",
        subtitle: "탄소 배출 저감 캠페인",
        text: "비에이텍의 특허 기술인 스마트 인버터 부스터 펌프는 급수량이 적을 때는 모터 회전수를 줄여 전력 소비를 최대 40% 절감합니다. 저탄소 녹색 성장에 기여하는 친환경 기술입니다.",
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800"
    },
    {
        title: "KC 위생안전인증으로 안심 급수",
        subtitle: "깨끗한 수질 지킴이",
        text: "가정이나 빌딩으로 공급되는 음용수는 배관과 펌프의 소재가 매우 중요합니다. 비에이텍은 물이 닿는 모든 부위에 위생안전인증(KC)을 득한 무독성 친환경 소재를 사용하여 안심하고 마실 수 있습니다.",
        image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800"
    },
    {
        title: "24시간 신속 스마트 원격 관제",
        subtitle: "수자원 낭비 제로화",
        text: "IoT 센서 기반의 모니터링 시스템을 통해 미세한 누수나 이상 압력을 실시간 감지합니다. 고장이 커지기 전에 예방 정비를 지원하여 소중한 수자원 누수를 막고 시설물을 안전하게 보호합니다.",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800"
    },
    {
        title: "지역사회 상생과 사회적 가치 실현",
        subtitle: "함께 만드는 맑은 세상",
        text: "비에이텍은 강원 지역 거점 기업으로서 맑은 물 공급을 위해 사회 복지 시설의 노후 펌프 점검 및 무상 기술 지원 활동을 펼치고 있습니다. 물을 통한 따뜻한 나눔을 이어갑니다.",
        image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800"
    }
];

let currentCardNewsIndex = 0;
let cardNewsTimer = null;

function renderCardNewsSlide(index) {
    const container = document.getElementById('card-news-container');
    if (!container) return;

    const slide = cardNewsData[index];

    // Transition effect
    container.style.opacity = '0';
    container.style.transform = 'translateY(8px)';

    setTimeout(() => {
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left card-slide">
                <div class="md:col-span-5 relative rounded-2xl overflow-hidden shadow-md aspect-video md:aspect-[4/3] bg-slate-200">
                    <img src="${slide.image}" alt="${slide.title}" class="w-full h-full object-cover" onerror="this.src='https://placehold.co/600x450/0284c7/ffffff?text=${encodeURIComponent(slide.title)}';">
                </div>
                <div class="md:col-span-7 space-y-4">
                    <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-water-50 rounded-full text-water-600 text-xs font-bold">
                        <span class="w-1.5 h-1.5 rounded-full bg-water-500 animate-pulse"></span>
                        ${slide.subtitle}
                    </div>
                    <h3 class="text-2xl font-black text-slate-800 leading-tight">${slide.title}</h3>
                    <p class="text-slate-500 text-sm leading-relaxed">${slide.text}</p>
                </div>
            </div>
        `;
        
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 150);

    // Update dots indicators
    renderCardNewsIndicators(index);
}

function renderCardNewsIndicators(activeIndex) {
    const indicatorsContainer = document.getElementById('card-news-indicators');
    if (!indicatorsContainer) return;

    indicatorsContainer.innerHTML = '';
    cardNewsData.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'bg-water-600 w-6' : 'bg-slate-300 hover:bg-slate-400'}`;
        dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        dot.onclick = () => {
            currentCardNewsIndex = idx;
            renderCardNewsSlide(currentCardNewsIndex);
            resetCardNewsTimer();
        };
        indicatorsContainer.appendChild(dot);
    });
}

function prevCardNewsSlide() {
    currentCardNewsIndex = (currentCardNewsIndex - 1 + cardNewsData.length) % cardNewsData.length;
    renderCardNewsSlide(currentCardNewsIndex);
    resetCardNewsTimer();
}

function nextCardNewsSlide() {
    currentCardNewsIndex = (currentCardNewsIndex + 1) % cardNewsData.length;
    renderCardNewsSlide(currentCardNewsIndex);
    resetCardNewsTimer();
}

function startCardNewsTimer() {
    cardNewsTimer = setInterval(() => {
        nextCardNewsSlide();
    }, 5000);
}

function resetCardNewsTimer() {
    if (cardNewsTimer) {
        clearInterval(cardNewsTimer);
        startCardNewsTimer();
    }
}
