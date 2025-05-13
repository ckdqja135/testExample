/*
	Telephasic by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			normal:    [ '1081px',  '1280px'  ],
			narrow:    [ '821px',   '1080px'  ],
			narrower:  [ '737px',   '820px'   ],
			mobile:    [ '481px',   '736px'   ],
			mobilep:   [ null,      '480px'   ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Dropdowns.
		$('#nav > ul').dropotron({
			mode: 'fade',
			speed: 300,
			alignment: 'center',
			noOpenerFade: true
		});

	// Nav.
		// 모바일 메뉴 생성 비활성화 (PC 메뉴 그대로 사용)
		// PC 환경과 동일한 메뉴 표시
		/*
		// Button.
			$(
				'<div id="navButton">' +
					'<a href="#navPanel" class="toggle"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Panel.
			// 직접 모바일 메뉴 내용 생성
			var mobileMenuContent = '<nav>';
			mobileMenuContent += '<a href="index.html" class="link depth-0">Home</a>';
			
			// 모든 상위 메뉴 항목 추가
			$('#nav > ul > li > a').each(function() {
				var $this = $(this);
				var text = $this.text();
				var href = $this.attr('href') || '#';
				
				mobileMenuContent += '<a href="' + href + '" class="link depth-0">' + text + '</a>';
				
				// 서브메뉴가 있는 경우 추가
				var $subItems = $this.parent().find('ul > li > a');
				$subItems.each(function() {
					var $subItem = $(this);
					var subText = $subItem.text();
					var subHref = $subItem.attr('href') || '#';
					
					mobileMenuContent += '<a href="' + subHref + '" class="link depth-1">' + subText + '</a>';
				});
			});
			
			mobileMenuContent += '</nav>';
			
			$(
				'<div id="navPanel">' +
					mobileMenuContent +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					resetScroll: true,
					resetForms: true,
					side: 'top',
					target: $body,
					visibleClass: 'navPanel-visible'
				});

			// Make sure nav panel is displayed in mobile view
			if (breakpoints.active('<=mobile')) {
				$('#navPanel').css('display', 'block');
				$('#navButton').css('display', 'block');
			}
		*/

})(jQuery);