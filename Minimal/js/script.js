$(document).ready(function() {

	$('.navbar-nav .dropdown-menu li.active').parents('li.dropdown').addClass('active');

	//Run only on non-touch devices
	if (!Modernizr.touch) {
		$('[data-animation]').waypoint({
			triggerOnce: true,
			offset: '85%',
			handler: function() {

				var ele = $(this);
				var fx = ele.data('animation');
				var delay = ele.data('delay');

				setTimeout(function() {
					ele.addClass('animated ' + fx);
				}, delay * 1000);
			}
		});
	}

	$('.store-notice .navbar-form .btn-search').on('click', function() {
		if ($('.store-notice .navbar-form .search-form').hasClass('hidden')) {
			$('.store-notice .navbar-form .search-form').removeClass('hidden');
			$('.store-notice .user-auth').addClass('opacity-0');
			return false;
		} else {
			if (!$('.store-notice .navbar-form .search-form input').val()) {
				$('.store-notice .navbar-form .search-form').addClass('hidden');
				$('.store-notice .user-auth').removeClass('opacity-0');
			}
		}

		if (!$('.store-notice .navbar-form .search-form').hasClass('hidden') && $('.store-notice .navbar-form .search-form input').val()) {
			$('.store-notice .navbar-form').submit();
		}
	});

	$(window).resize(function() {

		if ($('.navbar-nav').height() > 40) {
			$('.navbar-nav').addClass('is-big-nav');
			$('.navbar-nav').removeClass('is-small-nav');
		} else {
			$('.navbar-nav').removeClass('is-big-nav');
			$('.navbar-nav').addClass('is-small-nav');
		}

		if (!Modernizr.mq('(min-width: 1024px)')) {
			$('.facebook-comments:not(.have-moved)').detach().appendTo('.description').addClass('have-moved');
		}

		if ($('.table-responsive').length) {
			if ($('.table-responsive').hasScrollBar()) {
				$('.table-responsive').addClass('has-mask');
			} else {
				$('.table-responsive').removeClass('has-mask');
			}
		}

	}).resize();

	$('.table-responsive.has-mask').scroll(function() {
		var _this = $(this);
		var scroll_position = _this.scrollLeft();

		if (scroll_position > 0) {
			_this.addClass('mask-hidden');
		} else {
			_this.removeClass('mask-hidden');
		}
	});

	if (!Modernizr.input.placeholder) {
		$('input, textarea').placeholder();
	}

	$('[data-toggle=tooltip]').tooltip();
	//$('[data-toggle=modal]').modal();

	$('[data-toggle="toggle"]').on('click', function(event) {
		var _this = $(this);
		var target = _this.data('target');
		$(target).toggleClass('show hidden');
	});

	//Lightwindow

	$('.slideshow-product .slide a').on('click', function() {

		if (Modernizr.mq('(min-width: 1024px)')) {
			var _this = $(this);
			var img = _this.attr('href');

			$('.big-image-holder').addClass('shown');
			$('.big-image-holder img').prop('src', img).addClass('shown');
		}

		return false;
	});

	$('.big-image-holder .btn-close, .big-image-holder img').on('click', function() {

		$('.big-image-holder img').removeClass('shown').prop('src', '');
		$('.big-image-holder').removeClass('shown');

		return false;
	});

	$('.shipping-methods .radio-block').on('click', function() {
		var _this = $(this);
		$('.shipping-methods .radio-block').removeClass('active').find('input').prop('checked', false);
		_this.addClass('active').find('input').prop('checked', true).trigger('change');
	});

	$('.payment-methods .radio-block').on('click', function() {
		var _this = $(this);
		$('.payment-methods .radio-block').removeClass('active').find('input').prop('checked', false);
		_this.addClass('active').find('input').prop('checked', true).trigger('change');
	});

	//Cart / Shopkit functions

	check_shipping($('input[name="pagamento"]:checked'));

	$(document).on('change', 'input[name="pagamento"]', function() {
		check_shipping($(this));
	});

	$('form').submit(function() {
		$('body').css({ 'cursor': 'wait' });
		$(this).find('input[type=submit], button').prop('disabled', true);
	});

	//Event on change
	$(document).on('change', '.select-product-options', function() {
		product_options(product);
	});

	//price on request button
	$('a.price-on-request').on('click', function() {

		var options = " - ";

		$('select.select-product-options').each(function(index, el) {
			options = options + $(this).children('option:selected').data('title') + " / ";
		});

		$(this).prop('href', $(this).prop('href') + options.slice(0, -3) + '#contact-form');
	});

	//Billing / Delivery data
	$(document).on('change', '#billing_info_same_delivery', function(event) {
		var _this = $(this);
		var target = _this.data('target');
		$(target).toggleClass('hidden');
	});

	$.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDrsZsLYT4ntjtQ4DFgtw0ZG-WfMMn4z28&libraries=places", function() {
		$('#delivery_address').geocomplete().bind('geocode:result', function(event, result) {
			$.each(data_places(result.address_components), function(index, value) {
				$('.delivery-info input[data-places="' + index + '"]').prop('value', value);
				if (index == 'country') {
					$('.delivery-info #delivery_country').val(countries_alpha_2[value]);
				}
			});
		});

		$('#billing_address').geocomplete().bind('geocode:result', function(event, result) {
			$.each(data_places(result.address_components), function(index, value) {
				$('.billing-info input[data-places="' + index + '"]').prop('value', value);
				if (index == 'country') {
					$('.billing-info #billing_country').val(countries_alpha_2[value]);
				}
			});
		});
	});

});

$(window).load(function() {

	$('.slideshow-home').flexslider({
		slideshowSpeed: 7000,
		animationSpeed: 1500,
		controlNav: true,
		directionNav: false,
		selector: ".slides > .slide",
		start: function() {
			$('.slideshow').addClass('loaded');
		}
	});

	$('.slideshow-product').flexslider({
		slideshow: false,
		slideshowSpeed: 7000,
		animationSpeed: 500,
		controlNav: true,
		directionNav: true,
		selector: ".slides > .slide",
		prevText: "<i class='fa fa-angle-left'></i>",
		nextText: "<i class='fa fa-angle-right'></i>",
		smoothHeight: true,
		start: function() {
			$('.slideshow').addClass('loaded');
			$('.slideshow .flex-direction-nav li a.flex-disabled').parent('li').addClass('disabled');

			//Force first option to be triggered
			if (typeof product !== 'undefined' && product.option_groups.length > 0) {
				product_options(product, true);
			}
		}
	});

	$('.fb-page, .fb-comments').each(function() {
		$(this).attr('data-width', $(this).parent().width());
	});

});

function enable_shipping() {
	$('.shipping-methods').removeClass('disabled').find('input').prop('disabled', false);
}

function disable_shipping() {
	$('.shipping-methods').addClass('disabled').find('input').prop('disabled', true);
}

function check_shipping(el) {
	if (el.prop('value') == 'Levantamento nas instalações') {
		disable_shipping();
	} else {
		enable_shipping();
	}
}

function product_options(product, onload) {
	onload = typeof onload !== 'undefined' ? onload : false;

	if ($('.select-product-options').length) {
		$('.add-cart').fadeTo('fast', 0.25);

		var default_option = product_default_option(product);

		$('.select-product-options').each(function(i) {
			if (onload == true) {
				$('option[value="' + default_option[i] + '"]', this).prop('selected', true);
			}
			var option = $('option:selected', this);
			window['id_variant_' + (i + 1)] = option.attr('value');
		});

		var data_product_options = { id_variant_1: window.id_variant_1, id_variant_2: window.id_variant_2, id_variant_3: window.id_variant_3 }
		var product_handle = product.handle;
		var disable_form_product;

		$.post('/product-options/' + product_handle, data_product_options, function(response) {

			var price_txt;
			var stock_qty;

			$('.add-cart').fadeTo('fast', 1);

			if (response) {
				if (response.price_on_request === true) {
					$('body').addClass('price-on-request');

					price_txt = 'Preço sob consulta';
					disable_form_product = true;
				} else {
					$('body').removeClass('price-on-request');

					if (product_is_vendible(product, response)) {
						if (response.promo === true) {
							$('.promo-price').text(response.price_formatted);
							price_txt = response.price_promo_formatted;

						if (response.price_promo_percentage) {
								$('.data-promo-percentage').text('Desconto de '+response.price_promo_percentage+'%');
							}
						} else {
							$('.promo-price').text('');
							price_txt = response.price_formatted;
							$('.data-promo-percentage').text('');
						}

						disable_form_product = false;
					} else {
						price_txt = 'Não disponível';
						disable_form_product = true;
					}

					stock_qty = response.stock_qty;
				}

				if (response.image) {
					var image_index = $('.slideshow-product .flexslider .slides li a').find('img[src="' + response.image.full + '"]').parents('li').index();
					$('.slideshow-product').flexslider(image_index);
				}

				if (response.wishlist) {
					if (response.wishlist.status) {
						wishlist_html = '<i class="fa fa-heart-o fa-fw"></i> Remover da wishlist';
						wishlist_url = response.wishlist.remove_url;
					} else {
						wishlist_html = '<i class="fa fa-heart fa-fw"></i> Adicionar à wishlist';
						wishlist_url = response.wishlist.add_url;
					}
					$('.wishlist a').html(wishlist_html).attr('href', wishlist_url);
				}

				reference = response.reference;
			} else {
				price_txt = 'Não disponível';
				stock_qty = 0;
				disable_form_product = true;
				reference = '';
			}

			if (disable_form_product === true) {
				$('.promo-price').text('');
				$('.data-promo-percentage').text('');
			}

			animate_updated_value('.data-product-price', price_txt, 'flash');
			animate_updated_value('.data-product-stock_qty', stock_qty, 'flash');
			animate_updated_value('span[itemprop="sku"]', reference, 'flash');

			$('.add-cart input[name="qtd"], .add-cart button[type="submit"]').prop('disabled', disable_form_product);

			product_options_url();

		}, 'json');
	}
}

function product_options_url() {
	$('.select-product-options').on('change', function() {
		var pathname = window.location.pathname;
		var origin = window.location.origin;
		var selected_option = { 0: null, 1: null, 2: null };
		var k = 0;

		$('.select-product-options').each(function(index, el) {
			selected_option[k] = $('option:selected', this).prop('value');
			++k;
		});

		for (var i = 0; i < product.options.length; i++) {
			if (product.options[i].id_variant_1 == selected_option[0] && product.options[i].id_variant_2 == selected_option[1] && product.options[i].id_variant_3 == selected_option[2]) {
				var option = product.options[i].id;
			}
		}

		if (option) {
			var query = '?option=' + option;
		}

		if (query) {
			if (window.history.replaceState) {
				window.history.replaceState(null, null, origin + pathname + query);
			}
		}
	});

	return false;
}

function product_is_vendible(product, response) {
	//Check if there object is not null
	if (response) {
		//Check product stock
		if (product.stock.stock_enabled) {
			if (response.stock_qty > 0) {
				return true;
			} else {
				if (product.stock.stock_backorder) {
					return true;
				} else {
					return false;
				}
			}
		} else {
			return true;
		}
	} else {
		return false;
	}
}

//check product default option
function product_default_option(product) {
	var option = 'false';
	var query = window.location.search.substring(1);

	//get query string value
	if (query) {
		var option_id = query.split('option=')[1];
		option_id = option_id.split('&')[0];
	}

	//set default option from query string
	if (typeof option_id !== 'undefined' && product.option_groups.length > 0) {
		for (var i = 0; i < product.options.length; i++) {
			if (product.options[i].id == option_id) {
				option = i;
			}
		}
	} else {
		//get default option
		for (var i = 0; i < product.options.length; i++) {
			if (product.options[i].active === true) {
				if (product.options[i].price_on_request === true) {
					option = i;
				} else {
					if (product.stock.stock_enabled) {
						if (product.stock.stock_backorder || product.options[i].stock > 0) {
							option = i;
						}
					} else {
						option = i;
					}
				}

				if ($.isNumeric(option)) {
					i = product.options.length;
				}
			}
		}
	}

	if (isNaN(option)) {
		option = 0;
	}

	return option = {
		0: product.options[option].id_variant_1,
		1: product.options[option].id_variant_2,
		2: product.options[option].id_variant_3
	};
}

function animate_updated_value(selector, value, fx) {
	$(selector).text(value);
	$(selector).removeClass(fx + ' animated').addClass('flash animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
		$(this).removeClass(fx + ' animated');
	});
}

(function($) {
	$.fn.hasScrollBar = function() {
		return this.get(0).scrollWidth > this.get(0).clientWidth;
	}
})(jQuery);

function data_places(address_components) {
	var places_data = {};
	var componentForm = {
		street_number: 'short_name',
		route: 'long_name',
		locality: 'long_name',
		administrative_area_level_1: 'short_name',
		country: 'short_name',
		postal_code: 'short_name',
		postal_code_prefix: 'short_name'
	};

	for (var i = 0; i < address_components.length; i++) {
		var addressType = address_components[i].types[0];
		if (componentForm[addressType]) {
			places_data[addressType] = address_components[i][componentForm[addressType]];
		}
	}

	if (places_data['postal_code_prefix']) {
		places_data['postal_code'] = places_data['postal_code_prefix'];
	}

	return places_data;
}

var countries_alpha_2 = { "PT": "PRT", "AF": "AFG", "ZA": "ZAF", "AL": "ALB", "DE": "DEU", "AD": "AND", "AO": "AGO", "AI": "AIA", "AQ": "ATA", "AG": "ATG", "SA": "SAU", "DZ": "DZA", "AR": "ARG", "AM": "ARM", "AW": "ABW", "AU": "AUS", "AT": "AUT", "AZ": "AZE", "BS": "BHS", "BH": "BHR", "BD": "BGD", "BB": "BRB", "BE": "BEL", "BZ": "BLZ", "BJ": "BEN", "BM": "BMU", "BY": "BLR", "BO": "BOL", "BA": "BIH", "BW": "BWA", "BR": "BRA", "BN": "BRN", "BG": "BGR", "BF": "BFA", "BI": "BDI", "BT": "BTN", "CV": "CPV", "CM": "CMR", "KH": "KHM", "CA": "CAN", "QA": "QAT", "KZ": "KAZ", "TD": "TCD", "CL": "CHL", "CN": "CHN", "CY": "CYP", "CO": "COL", "KM": "COM", "KP": "PRK", "KR": "KOR", "CI": "CIV", "CR": "CRI", "HR": "HRV", "CU": "CUB", "CW": "CUW", "DK": "DNK", "DJ": "DJI", "DM": "DMA", "EG": "EGY", "SV": "SLV", "AE": "ARE", "EC": "ECU", "ER": "ERI", "SK": "SVK", "SI": "SVN", "ES": "ESP", "PS": "PSE", "FM": "FSM", "US": "USA", "EE": "EST", "ET": "ETH", "FJ": "FJI", "PH": "PHL", "FI": "FIN", "FR": "FRA", "GA": "GAB", "GM": "GMB", "GH": "GHA", "GE": "GEO", "GI": "GIB", "GD": "GRD", "GR": "GRC", "GL": "GRL", "GP": "GLP", "GU": "GUM", "GT": "GTM", "GG": "GGY", "GY": "GUY", "GF": "GUF", "GN": "GIN", "GQ": "GNQ", "GW": "GNB", "HT": "HTI", "HN": "HND", "HK": "HKG", "HU": "HUN", "YE": "YEM", "BV": "BVT", "IM": "IMN", "CX": "CXR", "HM": "HMD", "NF": "NFK", "KY": "CYM", "CC": "CCK", "CK": "COK", "FO": "FRO", "GS": "SGS", "FK": "FLK", "MP": "MNP", "MH": "MHL", "UM": "UMI", "PN": "PCN", "SB": "SLB", "TC": "TCA", "VI": "VIR", "VG": "VGB", "IN": "IND", "ID": "IDN", "IR": "IRN", "IQ": "IRQ", "IE": "IRL", "IS": "ISL", "IL": "ISR", "IT": "ITA", "JM": "JAM", "JP": "JPN", "JE": "JEY", "JO": "JOR", "KI": "KIR", "KW": "KWT", "LA": "LAO", "LS": "LSO", "LV": "LVA", "LB": "LBN", "LR": "LBR", "LY": "LBY", "LI": "LIE", "LT": "LTU", "LU": "LUX", "MO": "MAC", "MG": "MDG", "MY": "MYS", "MW": "MWI", "MV": "MDV", "ML": "MLI", "MT": "MLT", "MA": "MAR", "MQ": "MTQ", "MU": "MUS", "MR": "MRT", "YT": "MYT", "MX": "MEX", "MZ": "MOZ", "MD": "MDA", "MC": "MCO", "MN": "MNG", "ME": "MNE", "MS": "MSR", "MM": "MMR", "NA": "NAM", "NR": "NRU", "NP": "NPL", "NI": "NIC", "NE": "NER", "NG": "NGA", "NU": "NIU", "NO": "NOR", "NC": "NCL", "NZ": "NZL", "OM": "OMN", "NL": "NLD", "BQ": "BES", "PW": "PLW", "PA": "PAN", "PG": "PNG", "PK": "PAK", "PY": "PRY", "PE": "PER", "PF": "PYF", "PL": "POL", "PR": "PRI", "KE": "KEN", "KG": "KGZ", "GB": "GBR", "CF": "CAF", "CZ": "CZE", "MK": "MKD", "CD": "COD", "CG": "COG", "DO": "DOM", "RE": "REU", "RO": "ROU", "RW": "RWA", "RU": "RUS", "EH": "ESH", "WS": "WSM", "AS": "ASM", "SM": "SMR", "SH": "SHN", "LC": "LCA", "BL": "BLM", "KN": "KNA", "MF": "MAF", "SX": "SXM", "PM": "SPM", "ST": "STP", "VC": "VCT", "SC": "SYC", "SN": "SEN", "SL": "SLE", "RS": "SRB", "SG": "SGP", "SY": "SYR", "SO": "SOM", "LK": "LKA", "SZ": "SWZ", "SD": "SDN", "SS": "SSD", "SE": "SWE", "CH": "CHE", "SR": "SUR", "SJ": "SJM", "TH": "THA", "TW": "TWN", "TJ": "TJK", "TZ": "TZA", "TF": "ATF", "IO": "IOT", "TL": "TLS", "TG": "TGO", "TO": "TON", "TK": "TKL", "TT": "TTO", "TN": "TUN", "TM": "TKM", "TR": "TUR", "TV": "TUV", "UA": "UKR", "UG": "UGA", "UY": "URY", "UZ": "UZB", "VU": "VUT", "VA": "VAT", "VE": "VEN", "VN": "VNM", "WF": "WLF", "ZM": "ZMB", "ZW": "ZWE" };