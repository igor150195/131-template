{if $step == 'delivery'}

	{assign var="h1" value="SHOP2_DELIVERY2"}
	{include file="global:shop2.v2-order-errors.tpl"}
	{include file="global:shop2.v2-order-delivery.tpl"}
	<div class="gr-back-btn"><a href="{$shop2.uri}?mode=cart" class="shop2-btn shop2-btn-back"><span>
            {#SITE_BACK#}
            <svg class="gr-svg-icon">
                <use xlink:href="#icon_shop_return"></use>
            </svg>
            <svg class="gr-svg-icon gr_small_icon">
                <use xlink:href="#icon_shop_return_small"></use>
            </svg>
        </span></a></div>

{elseif $step == 'order'}

	{assign var="h1" value="SHOP2_RESERVATION"}
	{include file="global:shop2.v2-order-errors.tpl"}
	{include file="global:shop2.v2-order-order.tpl"}
	<div class="gr-back-btn"><a href="{if !empty($pre_order.delivery)}{$shop2.uri}?mode=order&amp;step=delivery&amp;action=edit{else}{$shop2.uri}?mode=cart{/if}" class="shop2-btn shop2-btn-back"><span>
            {#SITE_BACK#}
            <svg class="gr-svg-icon">
                <use xlink:href="#icon_shop_return"></use>
            </svg>
            <svg class="gr-svg-icon gr_small_icon">
                <use xlink:href="#icon_shop_return_small"></use>
            </svg>
        </span></a></div>


{elseif $step == 'payment'}

	{assign var="h1" value="SHOP2_ORDER_THANK"}
	{include file="global:shop2.v2-order-payment.tpl"}

{elseif $step == 'payments'}

	{assign var="h1" value="SHOP2_PAYMENTS"}
	{include file="global:shop2.v2-order-errors.tpl"}
	{include file="global:shop2.v2-order-payments.tpl"}
	<div class="gr-back-btn"><a href="{$shop2.uri}?mode=order&amp;step=order&amp;action=edit" class="shop2-btn shop2-btn-back"><span>
            {#SITE_BACK#}
            <svg class="gr-svg-icon">
                <use xlink:href="#icon_shop_return"></use>
            </svg>
            <svg class="gr-svg-icon gr_small_icon">
                <use xlink:href="#icon_shop_return_small"></use>
            </svg>
        </span></a></div>

{/if}