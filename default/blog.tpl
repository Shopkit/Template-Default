{#
Description: Blog page
#}

{% extends 'base.tpl' %}

{% block content %}

	<ul class="breadcrumb">
		<li><a href="{{ site_url() }}">Home</a><span class="divider">›</span></li>
		<li class="active">Blog</li>
	</ul>

	<h1>Blog</h1>
	<br>

	{% for post in blog_posts("limit:9") %}

		<h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
		<p><small class="muted"><em>Escrito em <strong>{{ post.date|date("d \\d\\e F \\d\\e Y") }}</strong></em></small></p>

		<div class="row">

			<div class="span7">
				{{ word_limiter(post.excerpt, 100, ' ... <a href="' ~ post.url ~ '">Ler mais</a>') }}
			</div>

			{% if post.image %}
				<p class="span2"><a href="{{ post.url }}" class="box-medium"><img src="{{ assets_url('assets/store/img/no-img.png') }}" data-src="{{ post.image.thumb }}" class="lazy"></a></p>
			{% endif %}

		</div>

		<hr>

	{% else %}

		<h5>Não existem entradas no blog.</h5>

	{% endfor %}


	{{ pagination("limit:9") }}

{% endblock %}