// HTML 파일 포함하기 위한 함수
document.addEventListener('DOMContentLoaded', function() {
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
          }
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
      link.addEventListener("click", function(e) {
        e.preventDefault();
        openPopup();
      });
    }
  });
}