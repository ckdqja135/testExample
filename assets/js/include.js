// HTML 파일 포함하기 위한 함수
document.addEventListener('DOMContentLoaded', function() {
  // 모바일 CSS 추가 함수
  function addMobileCSSIfNeeded() {
    // 이미 mobile-fixes.css가 있는지 확인
    const existingLink = document.querySelector('link[href="assets/css/mobile-fixes.css"]');
    
    // 없으면 추가
    if (!existingLink) {
      const mobileCssLink = document.createElement('link');
      mobileCssLink.rel = 'stylesheet';
      mobileCssLink.href = 'assets/css/mobile-fixes.css';
      document.head.appendChild(mobileCssLink);
    }
  }
  
  // 모바일 CSS 추가
  addMobileCSSIfNeeded();
  
  // 헤더 포함
  const headerElements = document.querySelectorAll('.header-include');
  
  // 헤더가 로드되기 전에 전역 모달 함수 설정
  window.openPopup = function() {
    const modalOverlay = document.querySelector(".modal-overlay");
    if (modalOverlay) {
      modalOverlay.style.display = "block";
    }
  };

  window.closePopup = function() {
    const modalOverlay = document.querySelector(".modal-overlay");
    if (modalOverlay) {
      modalOverlay.style.display = "none";
    }
  };
  
  // 각 요소에 헤더 콘텐츠 로드
  headerElements.forEach(function(element) {
    fetch('header.html')
      .then(response => response.text())
      .then(data => {
        element.innerHTML = data;
        
        // 헤더가 로드된 후 QnA 모달 기능 초기화
        initModalFunctions();
        
        // 드롭다운 메뉴 초기화 (jquery.dropotron 플러그인 사용)
        setTimeout(function() {
          if (typeof(jQuery) !== 'undefined' && typeof(jQuery.fn.dropotron) !== 'undefined') {
            $('#nav > ul').dropotron({
              mode: 'fade',
              noOpenerFade: true,
              alignment: 'center',
              detach: false
            });
            
            // 드롭다운 메뉴 hover 이벤트 제거 (모바일에서 충돌 방지)
            if (window.innerWidth <= 1080) {
              // dropotron 호버 이벤트를 무력화
              $('#nav > ul > li').off('mouseenter mouseleave');
              $('.dropotron li').off('mouseenter mouseleave');
            }
          }
          
          // 모바일/태블릿 환경에서 상위 메뉴 클릭 처리 (하위메뉴 토글)
          initMobileMenus();
        }, 100); // 헤더 DOM이 완전히 로드되도록 약간의 지연 추가
      })
      .catch(error => {
        console.error('헤더를 로드하는 중 오류가 발생했습니다:', error);
      });
  });
  
  // 푸터 포함
  const footerElements = document.querySelectorAll('.footer-include');
  
  // 각 요소에 푸터 콘텐츠 로드
  footerElements.forEach(function(element) {
    fetch('footer.html')
      .then(response => response.text())
      .then(data => {
        element.innerHTML = data;
      })
      .catch(error => {
        console.error('푸터를 로드하는 중 오류가 발생했습니다:', error);
      });
  });
});

// 모달 기능 초기화 함수
function initModalFunctions() {
  const modalOverlay = document.querySelector(".modal-overlay");
  const closeModalBtn = document.querySelector(".close-btn");
  
  if (!modalOverlay || !closeModalBtn) return;

  // 닫기 버튼 클릭 시 모달 닫기
  closeModalBtn.addEventListener('click', function() {
    closePopup();
  });

  // 모달 닫기 (배경 클릭)
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) {
      closePopup();
    }
  });

  // QnA 버튼 클릭 이벤트
  const qnaLinks = document.querySelectorAll("a[href='#']");
  qnaLinks.forEach(function(link) {
    if (link.textContent.trim() === "QnA" || link.parentElement.textContent.trim() === "QnA") {
      // 기존 이벤트 리스너 제거 (중복 방지)
      link.removeEventListener('click', handleQnAClick);
      // 새 이벤트 리스너 등록
      link.addEventListener("click", handleQnAClick);
    }
  });
}

// QnA 클릭 이벤트 핸들러 함수 (외부로 분리)
function handleQnAClick(e) {
  e.preventDefault();
  e.stopPropagation(); // 이벤트 전파 중지
  
  // 약간의 지연을 두고 모달 열기 (모바일에서 더블 클릭 방지)
  setTimeout(function() {
    openPopup();
  }, 10);
}

// 모바일/태블릿 메뉴 초기화 함수
function initMobileMenus() {
  // 모바일/태블릿 환경에서만 실행
  if (window.innerWidth <= 1080) {
    // 우선 기존 기능을 제거
    removeStandardMenuBehavior();
    
    // 모든 하위 메뉴 초기 상태로 숨김
    document.querySelectorAll('#nav ul ul').forEach(function(submenu) {
      submenu.style.display = 'none';
    });
    
    // 모든 상위 메뉴에서 clicked 클래스 제거
    document.querySelectorAll('#nav > ul > li').forEach(function(item) {
      item.classList.remove('clicked');
    });
    
    // 로고(홈 버튼) 터치/클릭 이벤트 개선
    const logoLink = document.querySelector('#logo a');
    if (logoLink) {
      // 기존 이벤트 리스너 제거 (중복 방지)
      logoLink.removeEventListener('click', navigateToHome);
      logoLink.removeEventListener('touchstart', navigateToHome);
      
      // 새 이벤트 리스너 등록
      if ('ontouchstart' in window) {
        logoLink.addEventListener('touchstart', navigateToHome, {passive: false});
      }
      // 클릭 이벤트는 터치 이벤트가 있어도 추가 (일부 디바이스에서 클릭만 감지되는 경우 대비)
      logoLink.addEventListener('click', navigateToHome);
      
      // 클릭 영역 확장을 위해 상위 요소인 #logo에도 이벤트 추가
      const logoContainer = document.querySelector('#logo');
      if (logoContainer) {
        logoContainer.removeEventListener('click', navigateToHome);
        logoContainer.removeEventListener('touchstart', navigateToHome);
        
        if ('ontouchstart' in window) {
          logoContainer.addEventListener('touchstart', navigateToHome, {passive: false});
        }
        logoContainer.addEventListener('click', navigateToHome);
      }
    }
    
    // 하위 메뉴가 있는 모든 상위 메뉴 항목에 클릭 이벤트 추가
    const parentMenus = document.querySelectorAll('#nav > ul > li > a');
    
    parentMenus.forEach(function(menuItem) {
      // 하위 메뉴가 있는지 확인
      const parentLi = menuItem.parentElement;
      const hasSubmenu = parentLi.querySelector('ul') !== null;
      
      // QnA 메뉴인지 확인
      const isQnAMenu = menuItem.textContent.trim() === "QnA";
      
      if (hasSubmenu) {
        // 기존 이벤트 리스너 제거 (중복 방지)
        menuItem.removeEventListener('click', toggleSubmenu);
        menuItem.removeEventListener('touchstart', toggleSubmenu);
        
        // 새 이벤트 리스너 등록 (클릭과 터치 모두 처리)
        menuItem.addEventListener('click', toggleSubmenu, {passive: false});
        
        // 모바일 환경에서는 터치 이벤트도 추가
        if ('ontouchstart' in window) {
          menuItem.addEventListener('touchstart', toggleSubmenu, {passive: false});
        }
        
        // 링크의 기본 동작 방지 (href="#"이 아닌 경우)
        // 메인 토글 함수로 통합되어 필요 없음
      } else if (isQnAMenu) {
        // QnA 링크가 모바일에서도 작동하도록 이벤트 처리
        menuItem.removeEventListener('click', handleQnAClick);
        
        // 모바일 환경에서는 터치 이벤트도 추가
        if ('ontouchstart' in window) {
          menuItem.removeEventListener('touchstart', handleQnAClick);
          menuItem.addEventListener('touchstart', handleQnAClick, {passive: false});
        } else {
          menuItem.addEventListener('click', handleQnAClick);
        }
      }
    });
    
    // QnA 메뉴 클릭 이벤트 추가 (모바일 대응)
    const qnaLinksMobile = document.querySelectorAll('#nav > ul > li > a[onclick*="openPopup"]');
    qnaLinksMobile.forEach(function(qnaLink) {
      qnaLink.removeEventListener('click', handleQnAClick);
      
      // 모바일 환경에서는 터치 이벤트도 추가
      if ('ontouchstart' in window) {
        qnaLink.removeEventListener('touchstart', handleQnAClick);
        qnaLink.addEventListener('touchstart', handleQnAClick, {passive: false});
      } else {
        qnaLink.addEventListener('click', handleQnAClick);
      }
    });
    
    // 메뉴 외부 클릭 시 모든 서브메뉴 닫기
    document.addEventListener('click', function(e) {
      if (!e.target.closest('#nav')) {
        closeAllMenus();
      }
    });
    
    // 모바일 환경에서는 터치 이벤트도 추가
    if ('ontouchstart' in window) {
      document.addEventListener('touchstart', function(e) {
        if (!e.target.closest('#nav')) {
          closeAllMenus();
        }
      }, {passive: true});
    }
  } else {
    // PC 환경에서는 원래 메뉴 동작 복원
    restoreStandardMenuBehavior();
  }
}

// 모든 메뉴 닫기 함수
function closeAllMenus() {
  document.querySelectorAll('#nav > ul > li.clicked').forEach(function(item) {
    item.classList.remove('clicked');
    // 서브메뉴도 명시적으로 숨김 처리
    const submenu = item.querySelector('ul');
    if (submenu) {
      submenu.style.display = 'none';
    }
  });
  
  // 추가로 모든 하위 메뉴 요소 숨김
  document.querySelectorAll('#nav ul ul').forEach(function(submenu) {
    submenu.style.display = 'none';
  });
}

// 서브메뉴 토글 함수
function toggleSubmenu(e) {
  e.preventDefault(); // 먼저 기본 이벤트 동작 방지
  e.stopPropagation(); // 이벤트 전파 중지
  
  const parentLi = this.parentElement;
  const submenu = parentLi.querySelector('ul');
  
  // 다른 메뉴의 clicked 클래스 제거 (다른 열린 메뉴 닫기)
  document.querySelectorAll('#nav > ul > li.clicked').forEach(function(item) {
    if (item !== parentLi) {
      item.classList.remove('clicked');
      // 다른 서브메뉴도 명시적으로 숨김 처리
      const otherSubmenu = item.querySelector('ul');
      if (otherSubmenu) {
        otherSubmenu.style.display = 'none';
      }
    }
  });
  
  // 현재 메뉴의 clicked 토글
  if (parentLi.classList.contains('clicked')) {
    parentLi.classList.remove('clicked');
    if (submenu) {
      submenu.style.display = 'none';
    }
  } else {
    parentLi.classList.add('clicked');
    if (submenu) {
      submenu.style.display = 'block';
    }
  }
}

// 기존 메뉴 동작 제거 (dropotron 호버 이벤트 제거)
function removeStandardMenuBehavior() {
  if (typeof(jQuery) !== 'undefined') {
    // 모든 메뉴 항목의 hover 이벤트 제거
    $('#nav > ul > li').off('mouseenter mouseleave');
    $('.dropotron li').off('mouseenter mouseleave');
    
    // dropotron 기본 동작 비활성화
    $('.dropotron').each(function() {
      $(this).css('display', 'none');
      $(this).removeClass('dropotron');
    });
  }
}

// 기존 메뉴 동작 복원 (PC 환경용)
function restoreStandardMenuBehavior() {
  if (typeof(jQuery) !== 'undefined' && typeof(jQuery.fn.dropotron) !== 'undefined') {
    // 클릭 이벤트 제거
    const parentMenus = document.querySelectorAll('#nav > ul > li > a');
    parentMenus.forEach(function(menuItem) {
      menuItem.removeEventListener('click', toggleSubmenu);
    });
    
    // clicked 클래스 제거
    document.querySelectorAll('#nav > ul > li.clicked').forEach(function(item) {
      item.classList.remove('clicked');
    });
    
    // dropotron 다시 초기화
    $('#nav > ul').dropotron({
      mode: 'fade',
      noOpenerFade: true,
      alignment: 'center',
      detach: false
    });
  }
}

// 창 크기가 변경될 때 모바일 메뉴 초기화
window.addEventListener('resize', function() {
  // 지연 시간을 두고 실행 (리사이즈 이벤트 최적화)
  clearTimeout(window.resizeTimer);
  window.resizeTimer = setTimeout(function() {
    initMobileMenus();
  }, 250);
});

// 홈 버튼 네비게이션 함수
function navigateToHome(e) {
  e.preventDefault();
  e.stopPropagation();
  
  // 약간의 지연을 두고 페이지 이동
  setTimeout(function() {
    window.location.href = 'index.html';
  }, 50);
}