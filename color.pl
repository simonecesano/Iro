#!/usr/bin/env perl
use Mojolicious::Lite;
use Color::Library;

helper library => sub {
    return 'Color::Library'
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

get '/:library' => sub {
    my $c = shift;
    $c->render(json => [ map { { name => $_->name, title => $_->title, rgb => $_->svg } } app->library->dictionary($c->param('library'))->colors  ]);
};


app->start;
