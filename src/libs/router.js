/**
 * router module
 * -------------
 *
 * Creates the routes based on the contents of `app.views` module
 * at `src/app/views.js`
 *
 * The `app.views` module has to define 2 **constants**:
 *
 * *   **defaultView:** a string with the name of the default view
 *     (without the initial slash)
 *
 * *   **views:** an array of view names. The view names must match the
 *     html view file names and will match the URLs
 *
 *     As special case you can specify a view definition object instead of
 *     a string, with the following format:
 *
 *     ```js
 *     {
 *       name: <view name>,
 *       url: <view url> (optional. defaults to view name),
 *       templateUrl: <view partial> (optional. defaults to view name)
 *     }
 *     ```
 *
 *     *   `view.url` will be prefixed with a slash
 *     *   `view.templateUrl` will be prefixed with `views/` and postfixed
 *         with `.html`
 *
 *     Here is an example mixing both view names and view definitions:
 *
 *     ```js
 *     angular.module('app.views', [])
 *     .constant('defaultView', 'home')
 *     .constant('views', [
 *       'home',
 *       'items',
 *       { name: 'items.detail', url: 'items/:id' }
 *     ]);
 *     ```
 *
 *     In the previous example, when the user goes to `/items/123`, the
 *     `items` and `items.detail` states are loaded (because of the dot)
 *     and the partial `/views/items.detail.html` is used
 *
 * Is important to declare them as angular constants because they will
 * be injected into a provider
 *
 * Controllers are declared in the HTML. That way, a single view can use
 * multiple controllers in sereral parts
 *
 * `app.views` is declared as a `router` dependency so it is not required
 * to be declared here as a root dependency
 */

angular.module('router', [
    'ui.router',
    'app.views'
])
.config(function ($urlRouterProvider, $stateProvider, $windowProvider, views, defaultView) {
    'use strict';

    // default layout templates

    $stateProvider
    .state('body', {
        abstract: true,
        templateUrl: 'layout/body.html'
    })
    .state('body.layout', {
        abstract: true,
        views: {
            'header@body': { templateUrl: 'layout/header.html' },
            'footer@body': { templateUrl: 'layout/footer.html' }
        }
    });

    // views factory

    var _ = $windowProvider.$get()._;

    var addView = function (view) {
        if (typeof view === 'string') { view = { name: view }; }
        if (!view.url) { view.url = view.name; }
        if (!view.templateUrl) { view.templateUrl = view.name; }

        $stateProvider.state(view.name, {
            parent: 'body.layout',
            url: '/' + view.url,
            views: {
                'view@body': { templateUrl: 'views/' + view.templateUrl + '.html' }
            }
        });
    };

    var addViews = function (views) {
        _.each(views, addView);
    };

    // load app views and default view

    $urlRouterProvider.otherwise('/' + defaultView);
    addViews(views);
});
