require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery'
,
        bootstrap: 'vendor/bootstrap/bootstrap',
        text: 'vendor/text'
    },
    shim: {
        text: {
            exports: 'text'
        },

        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require(['app', 'jquery', 'bootstrap'], function (app, $) {
    'use strict';
    // use app here
    console.log(app);
    console.log('Running jQuery %s', $().jquery);
});