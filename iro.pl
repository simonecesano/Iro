#!/usr/bin/env perl
use Mojolicious::Lite;
# 8331ADD5A0B2

hook(before_routes => sub {
	 my $c = shift;
	 $c->stash('partial' => 0);
	 app->log->info($c->stash('format'));
	 app->log->info($c->stash('format') =~ /html/i);
	 $c->stash('partial' => $c->stash('format') =~ /html/i);
     });


get '/c' => sub {
    my $c = shift;
    app->log->info($c->stash('format'));
    $c->render(template => 'index' );
};

get '/c/:goop' => sub {
    my $c = shift;
    app->log->info($c->stash('format'));
    app->log->info($c->param('goop'));
    $c->stash('partial' => $c->stash('format') =~ /html/i);
    app->log->info($c->stash('partial'));
    $c->render(template => $c->param('goop') );
};

# get '/c/four' => sub {
#     my $c = shift;
#     $c->render(template => 'four' );
# };

# get '/c/three' => sub {
#     my $c = shift;
#     $c->render(template => 'one_and_three' );
# };

# get '/c/lots' => sub {
#     my $c = shift;
#     $c->render(template => 'lots' );
# };

# get '/c/trace' => sub {
#     my $c = shift;
#     $c->render(template => 'trace' );
# };

app->start;
__DATA__
