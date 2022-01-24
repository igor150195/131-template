(function($, myObject) {
		
	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		
	const gr_shop_main = {
		queue: {},
		methods : {},
		init: function() {
			(function() {
				let queue = gr_shop_main.queue;

				if (isMobile) $(document.documentElement).addClass('mobile');

				for (key in queue) {
					let f = queue[key];
					if (typeof f === 'function') {
						f();
					};
				}
			})();
		}
	};
	
	gr_shop_main.queue = {
		ajaxRequestsComplete: function() {
			shop2.on('afterProductReloaded', function(){
				setTimeout(function(){
					if (!isMobile) {
						$('.quick-view-trigger').elemToolTip({
					    	text: 'Быстрый просмотр',
					    	margin: 12
					    });
					};

					$('.product-list.thumbs .product-price').matchHeight('remove');
					$('.product-list.thumbs .product-price').matchHeight();
				});
			});

			shop2.on('afterProductsLazyLoaded', function(){
				
				if (!isMobile) {
					$('.quick-view-trigger').elemToolTip({
						text: 'Быстрый просмотр',
						margin: 12
					});
				};

				$('.product-list.thumbs .product-item__bottom-right').matchHeight('remove');
				$('.product-list.thumbs .product-additional__top-right').matchHeight('remove');
				$('.product-list.thumbs .product-price').matchHeight('remove');
				
				$('.product-list.thumbs .product-item__bottom-right').matchHeight();
				$('.product-list.thumbs .product-additional__top-right').matchHeight();
				$('.product-list.thumbs .product-price').matchHeight();
			});

		}, /*Обновление скриптов при аякс-запросах*/
		headerBlock: function() {
			
			console.log('Header!');
			
		}, /*Шапка*/
		footerBlock: function() {

			console.log('Footer!');

		}, /*Подвал*/
		recentBlock: function() {
			var sliderAutoplay = $('.recent-block__items').data("autoplay");
			var respSettings = {
				320: {controls: false,items: 1,gutter: 0},
				768: {controls: false,items: 2,gutter: 20},
				1024: {controls: false,items: 2,gutter: 20},
				1261: {controls: false,items: 3,gutter: 20},
				1341: {controls: true,items: 3,gutter: 20}
			};
	
			if ($('.recent-block__items').length>0) {
				var recentSlider = tns({
			        loop: true,
			        container: '.recent-block__items',
			        slideBy: 1,
			        autoplayHoverPause: true,
			        mode: "carousel",
			        axis: "horizontal",
			        autoplay: sliderAutoplay,
			        autoplayButtonOutput: false,
			        mouseDrag: true,
			        center: false,
			        autoWidth: false,
			        nav: true,
			        navPosition: "bottom",
			        controlsText: gr_shop_main.settings.sliderControls,
			        preventActionWhenRunning: true,
			        responsive: respSettings
			    });
			};
			
			gr_shop_main.methods.arrowsPosition('.recent-block__items', '.gr-recent-image');
		}, /*Недавно просмотренные товары*/
		alignElements : function() {
			window.addEventListener('orientationchange', function() {
				setTimeout(function(){
					$.fn.matchHeight._update();
				}, 300);
			}, false);
				    
			var lazyFuncTime, lazyFuncScroll = false;
			
			if ($(window).scrollTop()>0) {
				if (lazyFuncTime) {
					clearTimeout(lazyFuncTime);
		        };

		        lazyFuncTime = setTimeout(function() {
					if (!lazyFuncScroll) {
						gr_shop_main.methods.grLazyFunc({selector:'.product-list.thumbs'}, function(){
							if (!$('.main-blocks').length) {
								$('.product-list.thumbs .product-item__bottom-right').matchHeight('remove');
						    	$('.product-list.thumbs .product-additional__top-right').matchHeight('remove');
						    	$('.product-list.thumbs .product-price').matchHeight('remove');
								$('.product-list.thumbs .product-item__bottom-right').matchHeight();
								$('.product-list.thumbs .product-additional__top-right').matchHeight();
								$('.product-list.thumbs .product-price').matchHeight();
							};
					    });
		        	};
		        	
		        	return lazyFuncScroll = true;
		        }, 50);
			};
			
			$(window).on('scroll', function() {
		        if (lazyFuncTime) {
		            clearTimeout(lazyFuncTime);
		        };

		        lazyFuncTime = setTimeout(function() {
		        	if (!lazyFuncScroll) {
						gr_shop_main.methods.grLazyFunc({selector:'.product-list.thumbs'}, function(){
							if (!$('.main-blocks').length) {
								$('.product-list.thumbs .product-item__bottom-right').matchHeight('remove');
						    	$('.product-list.thumbs .product-additional__top-right').matchHeight('remove');
						    	$('.product-list.thumbs .product-price').matchHeight('remove');
								$('.product-list.thumbs .product-item__bottom-right').matchHeight();
								$('.product-list.thumbs .product-additional__top-right').matchHeight();
								$('.product-list.thumbs .product-price').matchHeight();
							};
					    });
		        	};
		        	
		        	return lazyFuncScroll = true;
		        }, 50);
		        
		        return lazyFuncScroll;
		    });

		    
		    gr_shop_main.methods.grLazyFunc({selector:'.mods_block'}, function(){
				$('.mods_block .kinds-block__items .kind-item__top').matchHeight();
				$('.mods_block .kinds-block__items .kind-additional').matchHeight();
				$('.mods_block .kinds-block__items .kind-price').matchHeight();
		    });
		}, /*Выравнивание блоков по высоте*/
		init : function() {
			if ($('table').length) {
				$('table').wrap('<div class="table-wrapper"></div>');
			};
			
			$('body').removeClass('gr_hide_onload');

			$(document).on('keyup.esc_keyup2', function(keyUp){
				if (keyUp.keyCode 
					== 27) {
						$('html').removeClass('overflowHidden');
						console.log('Нажатие на клавишу Esc')
					return false;
				};
			}); // Нажатие на клавишу Esc

			$(document).on('click', function(e){
				console.log('Клик по документу')
			}); // Клик по документу

		    gr_shop_main.methods.grLazyLoad();
		    
		    if (readCookie('rootMarginCookie')) {
		    	gr_shop_main.methods.grLazyLoad({
			    	selector: 'gr_lazy_load_block',
			    	margin: '10px'
			    });
		    } else {
			    gr_shop_main.methods.grLazyLoad({
			    	selector: 'gr_lazy_load_block'
			    });
		    };
		    if (!readCookie('rootMarginCookie')) {
		    	createCookie('rootMarginCookie', 1, 1); // Создаем куку, чтобы увеличить расстояние, при котором появляются блоки
		    }; 
		    
		    jQuery.event.special.touchstart = {
		        setup: function( _, ns, handle ){
		            this.addEventListener("touchstart", handle, { passive: true });
		        }
		    };
		    
		    jQuery.event.special.touchend = {
		        setup: function( _, ns, handle ){
		            this.addEventListener("touchend", handle, { passive: true });
		        }
		    };
		    
		    jQuery.event.special.touchmove = {
		        setup: function( _, ns, handle ){
		            this.addEventListener("touchmove", handle, { passive: true });
		        }
		    };
		} /*Разное*/
	};
	gr_shop_main.settings = {
		imageObserver: null,
		searchIcon: '<i class="search-block__icon"><svg class="gr-svg-icon"><use xlink:href="#icon_shop_search"></use></svg></i>',
		sliderControls: ['<svg class="gr-svg-icon"><use xlink:href="#icon_shop_slider_prev"></use></svg><svg class="gr-svg-icon gr_small_icon"><use xlink:href="#icon_shop_slider_prev_small"></use></svg>', '<svg class="gr-svg-icon"><use xlink:href="#icon_shop_slider_next"></use></svg><svg class="gr-svg-icon gr_small_icon"><use xlink:href="#icon_shop_slider_next_small"></use></svg>']
	};
	gr_shop_main.methods = {
		grLazyFunc: function(params, callback) {
			return shop2_gr.methods.grLazyFunc(params, callback);
		}, /*Отложенная загрузка скрипта*/
		grLazyLoad: function(params) {
			return shop2_gr.methods.grLazyLoad(params);
		}, /*Отложенная загрузка*/
		forEach: function(array, callback, scope) {
			for (var i = 0; i < array.length; i++) {
		        callback.call(scope, i, array[i]);
		    };
		}, /*Для тини слайдера*/
		viewLots: function(elem){
			return shop2_gr.methods.viewLots(elem);
		}, /*Преключение видов отображения товаров в категории*/
		amountInit: function(elem) {
			return shop2_gr.methods.amountInit(elem);
		}, /*Количество*/
		arrowsPosition: function(slider, item) {
			return shop2_gr.methods.arrowsPosition(slider, item);
		}, /*Позиционирование навигации слайдера относительно блоков*/
	}

	gr_shop_main.init();
	myObject.gr_shop_main = gr_shop_main;

})(jQuery, window);
