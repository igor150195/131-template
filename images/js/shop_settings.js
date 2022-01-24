shop2.facets.search.wrapper = "";
shop2.options.msgTime = 2000;

shop2.queue.product = function () {

    shop2.product._reload = function (node) {
        var $node = $(node);
        var kinds = shop2.product.getNodeData(node, 'kinds', true);
        var paramName = shop2.product.getNodeData(node, 'name');
        var paramValue = shop2.product.getNodeData(node, 'value');
        var $form = $node.closest('form');
        var form = $form.get(0);
        var meta;
        var kind_id;
        var product_id;
        var keys = {};
        var params = {};
        var is_param_select = false;
        
        window.gr_reloaded_product_node = $node.parents('.shop2-product-item');
        window.gr_reloaded_product_index = $node.parents('.shop2-product-item').index();
        
        if (kinds && $.type(paramName) !== 'undefined' && $.type(paramValue) !== 'undefined' && form) {
            meta = $form.find('input[name=meta]').val();
            product_id = $form.find('input[name=product_id]').val();
            $form.find('[name=submit]').prop('disabled', true);
            $form.find('select.shop2-cf>option, li.shop2-cf, li.shop2-color-ext-selected, ul.shop2-color-ext-list>li').each(function () {
                var name = $(this).data('name');
                if (name) {
                    keys[name] = true;
                }
            });
            kind_id = shop2.product.findKindId(product_id, kinds, paramName, paramValue, meta, keys);
            if (!kind_id) {
                kind_id = $form.find('[name=kind_id]').val();
                is_param_select = true;
            }
            // select
            $form.find('.js-calc-custom-fields.additional-cart-params').each(function () {
                var ref_code = $(this).attr('name');
                params[ref_code] = $(this).find('option:selected').data('item-id');
            });
            // colore ref
            $form.find('.js-calc-custom-fields.shop2-color-ext-selected').each(function () {
                var ref_code = $(this).data('name');
                params[ref_code] = $(this).data('item-id');
            });
            // Selected params
            if (is_param_select) {
                shop2.product.getProductListItem(product_id, kind_id, function (d, status) {
                    if (status === 'success') {
                        var body = $.trim(d.data.body);
                        var product_price = $(".product-price", body).html();
                        var product_actions = $(".shop2-product-actions", body).html();
                        $form.find('.product-price').html(product_price);
                        $form.find('.shop2-product-actions').html(product_actions);
                        shop2.trigger('afterProductReloaded');
                        shop2.queue.heights();
                    }
                }, params);
            } else {
                if (shop2.mode === 'product') {
                    if (shop2.uri) {
                        document.location = shop2.uri + '/product/' + kind_id;
                    } else {
                        document.location = document.location.href.replace(/\/product\/.+/, '/product/' + kind_id);
                    }
                } else {
                    shop2.product.getProductListItem(product_id, kind_id, function (d, status) {
                        var cont, newCont, body;
                        if (status === 'success') {
                            shop2.trigger('afterProductReloaded');
                            cont = $node.closest('.shop2-product-item');
                            cont.hide();
                            body = $.trim(d.data.body);
                            newCont = $(body).insertBefore(cont);
                            cont.remove();
                            shop2.queue.heights();
                        }
                    }, params);
                }
            }
        }
    };

    $.on('select.shop2-cf', {
        change: function () {
            shop2.product._reload(this);
        }
    });

    $.on('li.shop2-cf:not(.active-color, .active-texture)', {
        click: function () {
            shop2.product._reload(this);
        }
    });

    $.on('span.shop2-path-show-folders', {
        click: function (e) {
            e.preventDefault();
            $(this).next().show();
            $(this).hide();
        }
    });

};

shop2.msg = function(text, obj) {
    var selector = '#shop2-msg',
        msg = $(selector),
        offset = obj.offset(),
        width = obj.outerWidth(true),
        height = obj.outerHeight(true);

    if (!msg.get(0)) {
        msg = $('<div id="shop2-msg">');
        $(document.body).append(msg);
        msg = $(selector);
    }

    msg.html(text).fadeIn(150);

    var msgWidth = msg.outerWidth();
    var msgHeight = msg.outerHeight();
    var left = offset.left + width;
    var top = offset.top + height;

    if (left + msgWidth > $(window).width()) {
        left = offset.left - msgWidth;
    }

    msg.css({
        left: 50 + '%',
        top: 50 + '%',
        'position': 'fixed',
        'margin-left': msgWidth / 2 * -1,
        'margin-top': msgHeight / 2 * -1
    });
    
    $.s3throttle('msg', function() {
		msg.hide();
    }, shop2.options.msgTime);

    $(document).on('click', '#shop2-msg', function() {
        $(this).fadeOut(150);
    });
};

shop2.queue.question = function() {
    var cls = '.price-old.question, .cart-total .question';
    
    $(document)
        .on("mouseenter", cls, function () {
            var $this = $(this),
                win = $this.next().show(),
                position = $this.position(),
                height = win.outerHeight(true);

            win.css({
                top: position.top - height - 5,
                left: position.left,
            });

            if (win.offset().left + win.outerWidth() > $(window).width()) {
                win.css({
                    left: (win.outerWidth() - win.offset().left) * -1,
                });
            };
        })
        .on("mouseleave", cls, function () {
            var $this = $(this),
                win = $this.next();

            win.hide();
        });
};

shop2.queue.compare = function() {
	var popup_data;
	var compare_arrow = '<i><svg class="gr-svg-icon"><use xlink:href="#icon_shop_notify_arr"></use></svg></i>';
	if (shop2.my.gr_popup_compare) {
		popup_data = ' data-remodal-target="compare-preview-popup"';
	};
	
	let $document = $(document);
	if ($('html').attr('lang') == 'ru') {
		var compareBtn = '<a href="' + shop2.uri + '/compare" class="go-to-compare-btn"'+popup_data+' target="_blank">к сравнению'+compare_arrow+'</a>';
		var compareBtn2 = '<a href="' + shop2.uri + '/compare" class="go-to-compare-btn"'+popup_data+' target="_blank">Перейти к сравнению'+compare_arrow+'</a>';
	} else {
		var compareBtn = '<a href="' + shop2.uri + '/compare" class="go-to-compare-btn"'+popup_data+' target="_blank">сompare'+compare_arrow+'</a>';
		var compareBtn2 = '<a href="' + shop2.uri + '/compare" class="go-to-compare-btn"'+popup_data+' target="_blank">Compare'+compare_arrow+'</a>';
	};

	function update(el, res) {

		$('input[type=checkbox][value=' + el.val() + ']').closest('.product-compare').replaceWith(res.data);
		$('.product-compare-added a span').html(res.count);
		$('.gr-compare-btn .gr-compare-btn-amount').html(res.count);
		
		if (+$('.gr-compare-btn .gr-compare-btn-amount').text() == '0') {
		    $('.gr-compare-btn').removeClass('active');
		} else {
		    $('.gr-compare-btn').addClass('active');
		};
		
		if (!$('.compare-remodal').hasClass('remodal-is-opened')) {
			if ($('html').attr('lang') == 'ru') {
				shop2.msg('<span class="go-to-compare-count">'+res.count+'</span>' + 'Товар добавлен ' + compareBtn, $('body'));
			} else {
				shop2.msg('<span class="go-to-compare-count">'+res.count+'</span>' + 'Added to ' + compareBtn, $('body'));
			};
		};

		if (res.panel) {
			$('#shop2-panel').replaceWith(res.panel);
		};

	}

	$document.on('click', '.product-compare input:checkbox', function() {
		let $this = $(this),
			action = $this.attr('checked') ? 'del' : 'add';
			
		shop2.compare.action(action, $this.val(), function(res, status) {
			if (status == 'success') {
				

				if (res.errstr) {
					if (!$('.compare-remodal').hasClass('remodal-is-opened')) {
						shop2.msg(res.errstr + '<div class="go-to-compare-error">'+compareBtn2+'</div>', $('body'));
					}
					$this.prop('checked', false);
				} else {
					update($this, res);
					
					if (action == 'del' && !$('.compare-remodal').hasClass('remodal-is-opened')) {
						if ($('html').attr('lang') == 'ru') {
							shop2.msg('Товар удален из сравнения', $('body'));
						} else {
							shop2.msg('Product removed from comparison', $('body'));
						};
					}
				}
				
			}
		});
	});
};

shop2.product.getProductListItem = function(product_id, kind_id, func) {
    var gr_images_size = $('.product-list').data('images-size');
    var gr_images_view = $(".product-list").data("images-view");
    var gr_mode_catalog = $(".product-list").data("mode-catalog");
	var url = "/my/s3/api/shop2/?cmd=getProductListItem&hash=" + shop2.apiHash.getProductListItem + "&ver_id=" + shop2.verId + "&gr_images_view=" + gr_images_view + "&gr_images_size=" + gr_images_size + "&gr_mode_catalog=" + gr_mode_catalog;
	
    shop2.trigger('beforeGetProductListItem');

    $.post(
        url, {
            product_id: product_id,
            kind_id: kind_id
        },
        function(d, status) {
            shop2.fire('afterGetProductListItem', func, d, status);
            shop2.trigger('afterGetProductListItem', d, status);
        }
    );
};

shop2.queue.lazyLoad = function() {
    var $document = $(document),
        blocked = false,
        products = $('.product-list');

    function path(url, param, value) {
        return url + (~url.indexOf("?") ? "&" : "?") + param + "=" + value;
    }
    
    if (shop2.my.lazy_load_subpages && products.get(0)) {
        $document.on('click', '.lazy-pagelist-btn', function(e){
        	
        	e.preventDefault();
        	
            var pagelist = $('.shop-pagelist');
            var next = pagelist.find('.active-num').next().find('a');

            if (!next.length) {
                return;
            }

            if (!blocked && next.get(0)) {
                blocked = true;
              
                $.get(path(next.attr('href'), 'products_only', 1), function(data) {
                	
                	var productsHtml = $(data).filter('.product-list').html();
                	var $lazyLoad = $(data).filter('.lazy-pagelist');

                    shop2.trigger('afterProductsLazyLoaded');
                	
                	$('.lazy-pagelist').remove();
                	
                	$('.product-list').append(productsHtml);
                	$('.product-list').after($lazyLoad);
				    
				    pagelist = $('.shop-pagelist');
				    
                    pagelist.find('a').each(function() {
                        var $this = $(this),
                            href = $this.attr('href');
                        $this.attr('href', href.replace(/[&|\?]*products_only=[^&]/, ""));
                    });

                    blocked = false;
                });
            }
        });
    }
};

shop2.queue.addToCart = function() {
	$(document).on('click', '.shop-product-btn', function(e) {

		var $this = $(this),
			$form = $this.closest('form'),
			form = $form.get(0),
			adds = $form.find('.additional-cart-params'),
			len = adds.length,
			i, el,
			a4 = form.amount.value,
			kind_id = form.kind_id.value;
	
		e.preventDefault();

		if (len) {
			a4 = {
				amount: a4
			};

			for (i = 0; i < len; i += 1) {
				el = adds[i];
				if (el.value) {
					a4[el.name] = el.value;
				}
			}
		}
		
		shop2.cart.add(kind_id, a4, function(d) {
			$('#shop2-cart-preview').replaceWith(d.data);
			
			var totalCartAmount = +$(d.data).find('.gr-cart-total-amount').text();
			var totalCartSum = $(d.data).find('.gr-cart-total-sum').data('total-price');
			
			if (totalCartAmount>0) {
				$('.gr-cart-popup-btn').removeClass('pointer_events_none');
				$('.gr-cart-total-amount').text(totalCartAmount);
				$('.gr-cart-total-sum ins').text(totalCartSum);
			} else{
				$('.gr-cart-popup-btn').addClass('pointer_events_none');
				$('.gr-cart-total-amount').text('0');
				$('.gr-cart-total-sum ins').text('0');
			};

			if (d.errstr) {
				shop2.msg(d.errstr, $this);
			} else {
				var $text = window._s3Lang.JS_SHOP2_ADD_CART_WITH_LINK;
				var $text = $text.replace("</a>", "<i><svg class='gr-svg-icon'><use xlink:href='#icon_shop_notify_arr'></use></svg></i></a>");
				
				shop2.msg($text.replace("%s", shop2.uri + "/cart"), $this);
			}

			if (d.panel) {
				$('#shop2-panel').replaceWith(d.panel);
			};
		});
	});
};

shop2.filter.sort = function(name, elem) {
    var re = new RegExp(this.escape('s[sort_by]') + '=([^&]*)'),
        params = this.str.match(re),
        desc = name + ' desc',
        asc = name + ' asc',
        isDesc = (elem.is('.sort-param-desc'));


    params = (params && params.length > 1) ? params[1] : "";
    
    params = (isDesc) ? desc : asc;

    this.remove('s[sort_by]');
    this.add('s[sort_by]', params);
    return this;
};

shop2.queue.sort = function() {
    var wrap = $('.sorting');

    wrap.find('.sort-param').on('click', function(e) {
        var $this = $(this),
            name = $this.data('name');

        e.preventDefault();
        shop2.filter.sort(name, $this);
        shop2.filter.go();
    });

    wrap.find('.sort-reset').on('click', function(e) {
        e.preventDefault();
        shop2.filter.remove('s[sort_by]');
        shop2.filter.go();
    });
};

shop2.queue.colorPopup = function() {
	var handle;

	$(document).on('click', '.shop2-color-ext-list li', function() {
		var caption = $(this);
		var wrap = caption.closest('.shop2-color-ext-popup');
		var ul = wrap.find('.shop2-color-ext-list');
		var offset = caption.offset();
		var $this = $(this);
		var data = $this.data();
		var input = $this.parent().find('input.additional-cart-params');
		var isSelected = $this.is('.shop2-color-ext-selected');
		
		colors = ul.children('li');

		if (typeof data.kinds !== 'undefined' || input.length) {
			$this.addClass('shop2-color-ext-selected').siblings().removeClass('shop2-color-ext-selected');

			if (input.length) {
				input.val(data.value);
			} else {
				if (!isSelected) {
					shop2.product._reload(this);
				}
			}

		} else {
			var index = $this.index();
			
			colors.eq(index).toggleClass('shop2-color-ext-selected');
			shop2.filter.toggle(data.name, data.value);
			shop2.filter.count();

			var offsetTop = $(this).position().top;

			$('.result-popup').css({
				'top': offsetTop,
				'visibility': 'visible',
				'opacity': '1',
				'display': 'block'
			});

		}
		return false;
	});
};

shop2.queue.coupon = function () {
	shop2.on('afterCartAddCoupon, afterCartRemoveCoupon', function () {
		document.location.reload();
	});

	$('.coupon-btn').on('click', function (e) {
		var coupon = $('#coupon'),
			code = coupon.val();

		e.preventDefault();

		if (code) {
			shop2.cart.addCoupon(code);
		} else {
			shop2.msg('Введите код купона', $(this));
		}

	});


	$('.coupon-delete').on('click', function (e) {
		var $this = $(this),
			code = $this.data('code');

		e.preventDefault();

		if (code) {
			shop2.cart.removeCoupon(code);
		}
	});
};

shop2.cart.applyBonusPoint = function (bonus_points, func) {

	shop2.trigger('beforeCartApplyBonus');

	$.getJSON(
		'/my/s3/xapi/public/?method=cart/applyBonusPoints', {
			param: {
				hash: shop2.hash.cart,
				bonus_points: bonus_points
			}
		},
		function (d, status) {
			shop2.fire('afterCartApplyBonusPoints', func, d, status);
			shop2.trigger('afterCartApplyBonusPoints', d, status);
		}
	);

	return false;
};

shop2.cart.removeBonusPoint = function (func) {

	shop2.trigger('beforeCartRemoveCartBonusPoints');

	$.getJSON(
		'/my/s3/xapi/public/?method=cart/RemoveBonusPoints', {
			param: {
				hash: shop2.hash.cart
			}
		},
		function (d, status) {
			shop2.fire('afterCartRemoveCartBonusPoints', func, d, status);
			shop2.trigger('afterCartRemoveCartBonusPoints', d, status);
		}
	);
};

shop2.queue.bonus = function () {

	shop2.on('afterCartApplyBonusPoints, afterCartRemoveCartBonusPoints', function () {
		document.location.reload();
	});

	$('.bonus-apply').on('click', function (e) {
		var bonus = $('#bonus-points'),
			points = Number(bonus.val()),
			bonus_user = Number($('.bonus-amount').data('bonus-amount'));

		switch (true) {
			case points == "":

				e.preventDefault();
				
				shop2.msg('Введите значение', $(this));

				break;
				
			case points > bonus_user:
			
				shop2.msg('Вам доступно только '+bonus_user+' бонусов', $(this));
			
				break;
				
			case bonus_user >= points:

				shop2.cart.applyBonusPoint(points);

				break;
		};
	});

	$('.bonus-delete').on('click', function (e) {
		shop2.cart.removeBonusPoint();
	});
	
	$('.cart-bonuses__title label').on('click', function(e){
		e.preventDefault();
        var $check = $(':checkbox', this);
        $check.prop('checked', !$check.prop('checked'));
        
		$('.cart-bonuses__container').toggleClass('show_bonuses');
		
		if (!$check.prop('checked') && $('.cart-total__item.bonus_item').length) {
			shop2.cart.removeBonusPoint();
		};
	});

	$.fn.inputFilter = function (inputFilter) {
		return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
			if (inputFilter(this.value)) {
				this.oldValue = this.value;
				this.oldSelectionStart = this.selectionStart;
				this.oldSelectionEnd = this.selectionEnd;
			} else if (this.hasOwnProperty("oldValue")) {
				this.value = this.oldValue;
				this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
			}
		});
	};

	$("#bonus-points").inputFilter(function (value) {
		return /^\d*$/.test(value);
	});
};