/* (주)비에이텍 Main Javascript - main.js */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Header scroll visual state change
    const mainHeader = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.remove('water-glass');
            mainHeader.classList.add('bg-white/95', 'shadow-md', 'backdrop-blur-md');
        } else {
            mainHeader.classList.remove('bg-white/95', 'shadow-md', 'backdrop-blur-md');
            mainHeader.classList.add('water-glass');
        }
    });

    // 2. Mobile navigation menu drawer controls
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-xmark');
            } else {
                mobileMenu.classList.add('hidden');
                menuIcon.classList.remove('fa-xmark');
                menuIcon.classList.add('fa-bars');
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
});

/* ==========================================================================
   SPA Navigation & Routing Logic
   ========================================================================== */
function filterView(viewId) {
    const sections = document.querySelectorAll('.spa-view-section');
    const tabs = document.querySelectorAll('.spa-tab');
    
    // Manage tab buttons visual states
    tabs.forEach(tab => {
        if (tab.id === `tab-${viewId}`) {
            tab.classList.add('active', 'bg-white', 'text-water-600', 'shadow-sm');
            tab.classList.remove('text-slate-600', 'hover:text-slate-900');
        } else {
            tab.classList.remove('active', 'bg-white', 'text-water-600', 'shadow-sm');
            tab.classList.add('text-slate-600', 'hover:text-slate-900');
        }
    });

    // Show/hide sections based on active tab view
    sections.forEach(section => {
        if (viewId === 'all') {
            section.classList.remove('hidden');
            section.style.opacity = '1';
        } else if (section.id === viewId) {
            section.classList.remove('hidden');
            section.style.opacity = '1';
        } else {
            section.classList.add('hidden');
            section.style.opacity = '0';
        }
    });

    // Reset Leaflet Map size when showing map tab to fix display issues
    if (viewId === 'map' || viewId === 'all') {
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

    // Scroll to section smoothly
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
   Product Detailed Specifications Modal
   ========================================================================== */
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

function openProductDetail(prodId) {
    const data = productDetails[prodId];
    if (!data) return;

    const modal = document.getElementById('product-modal');
    const title = document.getElementById('modal-title');
    const subtitle = document.getElementById('modal-subtitle');
    const desc = document.getElementById('modal-desc');
    const specTable = document.getElementById('modal-spec-tbody');
    const inquiryLink = document.getElementById('modal-inquiry-btn');

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
    modal.classList.add('hidden');
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
        const name = document.getElementById('inquiry-name').value.trim();
        const phone = document.getElementById('inquiry-phone').value.trim();
        const email = document.getElementById('inquiry-email').value.trim();
        const type = document.getElementById('inquiry-type').value;
        const message = document.getElementById('inquiry-message').value.trim();
        const agree = document.getElementById('inquiry-agree').checked;

        // Validations
        if (!name) {
            alert('성함 또는 업체명을 입력해 주세요.');
            document.getElementById('inquiry-name').focus();
            return;
        }

        if (!phone) {
            alert('연락처를 입력해 주세요.');
            document.getElementById('inquiry-phone').focus();
            return;
        }

        // Phone pattern test (digits, hyphens allowed)
        const phonePattern = /^[0-9\-]{9,15}$/;
        if (!phonePattern.test(phone.replace(/\s/g, ''))) {
            alert('올바른 연락처 형식을 입력해 주세요 (숫자 및 하이픈만 가능).');
            document.getElementById('inquiry-phone').focus();
            return;
        }

        if (!email) {
            alert('이메일 주소를 입력해 주세요.');
            document.getElementById('inquiry-email').focus();
            return;
        }

        // Simple Email pattern test
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('올바른 이메일 주소 형식을 입력해 주세요.');
            document.getElementById('inquiry-email').focus();
            return;
        }

        if (!type) {
            alert('문의 유형을 선택해 주세요.');
            document.getElementById('inquiry-type').focus();
            return;
        }

        if (!message) {
            alert('문의 내용을 상세히 작성해 주세요.');
            document.getElementById('inquiry-message').focus();
            return;
        }

        if (!agree) {
            alert('개인정보 수집 및 이용에 동의하셔야 문의 접수가 가능합니다.');
            return;
        }

        // Simulating success submit behavior
        alert(`온라인 문의가 정상적으로 성공적으로 접수되었습니다.\n\n업체/성함: ${name}\n문의유형: ${type}\n\n등록해 주신 이메일(${email}) 및 전화번호(${phone})로 신속히 연락해 기술 지도를 지원하겠습니다.`);
        
        // Reset form
        form.reset();
    });
}
