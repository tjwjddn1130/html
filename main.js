document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Header Scroll Effect
  // ==========================================
  const header = document.querySelector('.header');
  
  function checkScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Initial check in case of page refresh while scrolled
  checkScroll();
  window.addEventListener('scroll', checkScroll);

  // ==========================================
  // 2. Mobile Menu Toggle
  // ==========================================
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 3. Active Navigation State
  // ==========================================
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
  
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href === pageName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // ==========================================
  // 4. Scroll Animation Observer (Fade In)
  // ==========================================
  const animateElements = document.querySelectorAll('.scroll-animate');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  animateElements.forEach(el => {
    animationObserver.observe(el);
  });

  // ==========================================
  // 5. Product Filter System (for product.html)
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (filterButtons.length > 0 && productCards.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons and add to clicked
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        productCards.forEach(card => {
          const categories = card.getAttribute('data-category').split(' ');
          if (filterValue === 'all' || categories.includes(filterValue)) {
            card.style.display = 'flex';
            // Slight delay to trigger CSS fade-in
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300); // match transition speed
          }
        });
      });
    });
  }

  // ==========================================
  // 6. Contact Form Validation (for inquiry.html)
  // ==========================================
  const inquiryForm = document.getElementById('inquiryForm');
  
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve form values
      const name = document.getElementById('inquiryName').value.trim();
      const phone = document.getElementById('inquiryPhone').value.trim();
      const email = document.getElementById('inquiryEmail').value.trim();
      const subject = document.getElementById('inquirySubject').value.trim();
      const message = document.getElementById('inquiryMessage').value.trim();
      const agree = document.getElementById('inquiryAgree').checked;

      // Basic Validation
      if (!name) {
        alert('성함 또는 회사명을 입력해주세요.');
        return;
      }
      if (!phone) {
        alert('연락처를 입력해주세요.');
        return;
      }
      if (!email) {
        alert('이메일 주소를 입력해주세요.');
        return;
      }
      if (!validateEmail(email)) {
        alert('올바른 이메일 주소를 입력해주세요.');
        return;
      }
      if (!subject) {
        alert('문의 제목을 입력해주세요.');
        return;
      }
      if (!message) {
        alert('문의 내용을 입력해주세요.');
        return;
      }
      if (!agree) {
        alert('개인정보 수집 및 이용에 동의해주셔야 문의 등록이 가능합니다.');
        return;
      }

      // If validation passes, simulate sending email (mock action)
      alert(`감사합니다, ${name}님!\n문의사항이 정상적으로 접수되었습니다. 담당자가 확인 후 빠른 시일 내에 이메일(${email}) 또는 연락처(${phone})로 회신 드리겠습니다.`);
      inquiryForm.reset();
    });
  }

  // Helper validation functions
  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }
});
