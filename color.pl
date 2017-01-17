#!/usr/bin/env perl
use Mojolicious::Lite;
use Color::Library;
use Graphics::Color::RGB;
use List::Util qw/min/;

sub circle_distance {
    my ($a, $b, $t) = @_;
    $t ||= 360;
    return min((($a - $b) % $t), (($b - $a) % $t));
};

sub color_distance {
    my ($a, $b) = @_;
    return ((
	    circle_distance($a->h, $b->h) ** 2 +
	    (($a->s * 100) - ($b->s * 100)) ** 2 +
	    (($a->v * 100) - ($b->v * 100)) ** 2
	   ) ** 0.5)
};


helper library => sub { return 'Color::Library' };

helper all_colors => sub {
    state $all = [ 
		  map {
		      my $hsl = Graphics::Color::RGB->from_hex_string($_->{rgb})->to_hsl;
		      $_->{h} = $hsl->h; $_->{s} = $hsl->s; $_->{l} = $hsl->l;
		      $_
		  }
		  map {
		      map {
			  {
			      rgb => $_->svg,
				  id => $_->id,
				  dictionary => $_->dictionary->name,
				  title => $_->title
			  }
		      } $_->colors } Color::Library->dictionaries
		 ];
    return $all;
};

get '/' => sub {
    my $c = shift;
    $c->render(json => [ map {
	{
	    name => $_->name,
		colors => (scalar @{$_->names}),
		description => $_->description
    } } app->library->dictionaries ]);
};

get '/all' => sub {
    my $c = shift;
    my $all = app->all_colors;
    $c->render(json => $all);
};

get '/closest' => sub {
    my $c = shift;
    my $all = app->all_colors;

    $c->render(json => $all);
};


get '/:library' => sub {
    my $c = shift;
    $c->render(json => [ map { { name => $_->name, title => $_->title, rgb => $_->svg } } app->library->dictionary($c->param('library'))->colors  ]);
};


app->start;
