use strict;
use warnings;

use FindBin;
use Plack::Builder;
use Plack::App::File;
use Plack::App::Proxy;
use Mojo::Server::PSGI;

builder {
    mount '/public' => Plack::App::File->new(root => './public')->to_app;

    mount '/i' => builder {
    	my $server = Mojo::Server::PSGI->new;
    	$server->load_app('./iro.pl');
	$server->app->secrets([qw/uno due tre/]);
	$server->app->hook(before_dispatch => sub {
			       my $c = shift;
			       $c->req->url->base->path('/i');
			   });
	$server->to_psgi_app;
    };
    mount '/c' => builder {
    	my $server = Mojo::Server::PSGI->new;
    	$server->load_app('./color.pl');
	$server->app->secrets([qw/uno due tre/]);
	$server->app->hook(before_dispatch => sub {
			       my $c = shift;
			       $c->req->url->base->path('/c');
			   });
	$server->to_psgi_app;
    };
}
    
