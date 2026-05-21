/* (주)비에이텍 Main Javascript - main.js */

document.addEventListener('DOMContentLoaded', () => {
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
            <div class="relative h-60 bg-gradient-to-br from-slate-100 to-water-50 flex items-center justify-center p-6">
                <i class="${p.icon} ${p.iconColor} text-7xl opacity-80"></i>
                <span class="absolute top-4 right-4 ${p.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">${p.badge}</span>
            </div>
            <div class="p-6">
                <h4 class="text-xl font-bold text-slate-800">${p.title}</h4>
                <p class="text-slate-500 text-sm mt-2 line-clamp-2">${p.desc}</p>
                <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-400">${p.tag}</span>
                    <button onclick="openProductDetail('${p.id}')" class="text-sm font-bold text-water-600 hover:text-water-700 flex items-center gap-1 group">
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
    const modalTitle = document.getElementById('gallery-modal-title');
    const modalDesc = document.getElementById('gallery-modal-desc');

    if (!modal || !modalImg || !modalTitle || !modalDesc) return;

    modalImg.src = imgSrc;
    modalImg.alt = title;
    modalTitle.innerText = title;
    modalDesc.innerText = desc;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    if (modal) {
        modal.classList.add('hidden');
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

        // Simulating success submit behavior
        alert(`온라인 문의가 정상적으로 접수되었습니다.\n\n업체/성함: ${name}\n문의유형: ${type}\n\n등록해 주신 이메일(${email}) 및 전화번호(${phone})로 신속히 연락해 안내해 드리겠습니다.`);
        
        // Reset form
        form.reset();
    });
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
