{#
Description: Complete order page
#}

{% extends 'base.tpl' %}

{% block content %}

	<ul class="breadcrumb">
		<li><a href="{{ site_url() }}">Home</a><span class="divider">›</span></li>
		<li class="active">Encomenda registada</li>
	</ul>

	<h1>Encomenda registada</h1>
	<br>

	<p><strong>Obrigado {{ user.delivery.name }},</strong></p>
	<p>A sua encomenda foi registada com sucesso com o número: <strong>{{ order.id }}</strong></p>

	<ul class="list-group">
		<li class="list-group-item text-h5">
			<span class="badge text-h6">{{ order.id }}</span>
			Nr. de encomenda:
		</li>
		<li class="list-group-item text-h5">
			<span class="badge price text-h6">{{ order.total | money_with_sign }}</span>
			Total:
		</li>
		<li class="list-group-item text-h5">
			<span class="badge text-h6">{{ order.payment.title }}</span>
			Método de pagamento:

			<div>

				{% if order.payment.type == 'bank_transfer' and order.payment.data %}
					<div class="margin-top-sm">
						<strong>IBAN:</strong> {{ order.payment.data }}
					</div>

				{% elseif order.payment.type == 'multibanco' %}
					{% if order.payment.data and order.payment.data.reference %}
						<div class="margin-top-sm text-nowrap">
							<strong>Entidade:</strong> <span>{{ order.payment.data.entity }}</span>
							<br>
							<strong>Referência:</strong>
							<span style="padding: 0 2px">{{ order.payment.data.reference|slice(0, 3) }}</span>
							<span style="padding: 0 2px">{{ order.payment.data.reference|slice(3, 3) }}</span>
							<span style="padding: 0 2px">{{ order.payment.data.reference|slice(6, 3) }}</span>
							<br>
							<strong>Montante:</strong> <span class="text-muted price">{{ order.payment.data.value | money_with_sign }}</span>
						</div>
					{% else %}
						<div class="margin-top-sm text-danger">
							<strong>Erro:</strong> Ocorreu um erro ao gerar a referência Multibanco
						</div>
					{% endif %}

				{% elseif order.payment.type == 'paypal' and order.payment.data.url %}
					<div class="paypal-data margin-top-sm">
						<a href="{{ order.payment.data.url }}" target="_blank" class="btn btn-info btn-lg"><i class="fa fa-fw fa-paypal" aria-hidden="true"></i> Pagar via Paypal</a>
					</div>

				{% elseif order.payment.type == 'wallets' %}
					<div class="wallets-data margin-top-sm">
						<div id="payment-request-button"></div>
					</div>

				{% elseif order.payment.type == 'pick_up' and order.payment.data %}
					<div class="pick_up-data margin-top-sm text-h6">
						<strong>Morada de levantamento</strong><br>
						{{ order.payment.data.name }}<br>
						{{ order.payment.data.address }} {{ order.payment.data.address_extra }}<br>
						{{ order.payment.data.zip_code }} {{ order.payment.data.city }}<br>
						{{ order.payment.data.country }}
					</div>
				{% endif %}
			</div>
		</li>
	</ul>

	{% if order.payment.message %}
		<div class="well payment-msg">
			<p>{{ order.payment.message }}</p>
		</div>
	{% endif %}

{% endblock %}
