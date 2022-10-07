(function($) {
    "use strict";


	    /*====================================
			Mobile Menu
		======================================*/ 	
		$('.menu').slicknav({
			prependTo:".mobile-nav",
			duration:300,
			animateIn: 'fadeIn',
			animateOut: 'fadeOut',
			closeOnClick:true,
			closedSymbol: '<span class="ti ti-angle-right"></span>',
            openedSymbol: '<span class="ti ti-angle-down"></span>',
		});
		
		/*====================================
	      Sticky Header JS
		======================================*/ 
		jQuery(window).on('scroll', function() {
			if ($(this).scrollTop() > 200) {
				$('.header').addClass("sticky");
			} else {
				$('.header').removeClass("sticky");
			}
		});
		
		/*=======================
		  Search JS JS
		=========================*/ 
		$('.top-search a').on( "click", function(){
			$('.search-top').toggleClass('active');
		});


		/*=======================
		 Hero Slider
		=========================*/ 
		$('.main-hero-slider').owlCarousel({
			items:1,
			loop:true,
			margin:10,
			autoplay:true,
			autoplayTimeout:5000,
			smartSpeed: 400,
			nav:true,
			autoplayHoverPause:true,
			dots:true,
			navText: ['<i class="fal fa-long-arrow-alt-left"></i>', '<i class="fal fa-long-arrow-alt-right"></i>'],
			responsive:{
				0:{
					items:1
				},
				600:{
					items:1
				},
				1000:{
					items:1
				}
			}
		})

		/*=======================
		 Product Slider
		=========================*/ 
		$('.product-slider').owlCarousel({
			items:4,
			loop:true,
			margin:20,
			smartSpeed: 400,
			nav:true,
			autoplayHoverPause:true,
			dots:false,
			navText: ['<i class="far fa-arrow-left"></i>', '<i class="far fa-arrow-right"></i>'],
			responsive:{
				0:{
					items:1
				},
				600:{
					items:2
				},
				1000:{
					items:4
				}
			}
		})

		/*=======================
		  Home Slider JS
		=========================*/ 
		$('.home-slider').owlCarousel({
			items:1,
			autoplay:true,
			autoplayTimeout:5000,
			smartSpeed: 400,
			animateIn: 'fadeIn',
			animateOut: 'fadeOut',
			autoplayHoverPause:true,
			loop:true,
			nav:true,
			merge:true,
			dots:false,
			navText: ['<i class="ti-angle-left"></i>', '<i class="ti-angle-right"></i>'],
			responsive:{
				0: {
					items:1,
				},
				300: {
					items:1,
				},
				480: {
					items:2,
				},
				768: {
					items:3,
				},
				1170: {
					items:4,
				},
			}
		});


		/*====================================
		CountDown
		======================================*/ 
		$('[data-countdown]').each(function() {
			var $this = $(this),
				finalDate = $(this).data('countdown');
			$this.countdown(finalDate, function(event) {
				$this.html(event.strftime(
					'<div class="cdown"><span class="days"><strong>%-D</strong><p>Days.</p></span></div><div class="cdown"><span class="hour"><strong> %-H</strong><p>Hours.</p></span></div> <div class="cdown"><span class="minutes"><strong>%M</strong> <p>MINUTES.</p></span></div><div class="cdown"><span class="second"><strong> %S</strong><p>SECONDS.</p></span></div>'
				));
			});
		});



		/*====================================
		Flex Slider JS
		======================================*/
		(function($) {
			'use strict';	
				$('.flexslider-thumbnails').flexslider({
					animation: "slide",
					controlNav: "thumbnails",
				});
		})(jQuery);



		/*=====================================
	      Video Popup JS
		======================================*/ 
		$('.video-popup').magnificPopup({
			type: 'iframe',
			removalDelay: 300,
			mainClass: 'mfp-fade'
		});


	    /*=======================
		  Slider Range JS
		=========================*/ 
		$( function() {
			$( "#slider-range" ).slider({
			  range: true,
			  min: 0,
			  max: 500,
			  values: [ 120, 250 ],
			  slide: function( event, ui ) {
				$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
			  }
			});
			$( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
			  " - $" + $( "#slider-range" ).slider( "values", 1 ) );

		} );


		/*==================================
		 Product page Quantity Counter
		 ===================================*/
		 $('.plus').on('click', function () {
			var $qty = $('.input-number');
			var currentVal = parseInt($qty.val(), 10);
			if (!isNaN(currentVal)) {
				$qty.val(currentVal + 1);
			}
		});
		$('.minus').on('click', function () {
			var $qty = $('.input-number');
			var currentVal = parseInt($qty.val(), 10);
			if (!isNaN(currentVal) && currentVal > 1) {
				$qty.val(currentVal - 1);
			}
		});


		/*=======================
		  Extra Scroll JS
		=========================*/
		$('.scroll').on("click", function (e) {
			var anchor = $(this);
				$('html, body').stop().animate({
					scrollTop: $(anchor.attr('href')).offset().top - 0
				}, 900);
			e.preventDefault();
		});


		/*===============================
		  Checkbox JS
		=================================*/  
		$('input[type="checkbox"]').change(function(){
			if($(this).is(':checked')){
				$(this).parent("label").addClass("checked");
			} else {
				$(this).parent("label").removeClass("checked");
			}
		});



	    /*====================================
			Scroll Up JS
		======================================*/
		$.scrollUp({
			scrollText: '<span><i class="fal fa-long-arrow-alt-up"></i></span>',
			easingType: 'easeInOutExpo',
			scrollSpeed: 900,
			animation: 'fade'
		}); 


		/*====================================
		Nice Select JS
		======================================*/	
		$('select').niceSelect();
			


		/*=====================================
		Others JS
		======================================*/ 	
		$( function() {
			$( "#slider-range" ).slider({
				range: true,
				min: 0,
				max: 500,
				values: [ 0, 500 ],
				slide: function( event, ui ) {
					$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
				}
			});
			$( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
			" - $" + $( "#slider-range" ).slider( "values", 1 ) );
		} );


	
		/*=====================================
		Preloader JS
		======================================*/ 	
		$('.preloader').delay(2000).fadeOut('slow');
		setTimeout(function() {
		$('body').removeClass('no-scroll');
		}, 2000);

	 
})(jQuery);
