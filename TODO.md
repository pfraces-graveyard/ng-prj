ng-prj - TODO
=============

*   test nested template properties (like in freddie task)
*   use decoupled task configurations and a plugin manager
*   add documentation
*   create several example apps
*   add docco/husky/jsdoc tasks
*   livereload dynamic port
*   gzip bundle.css, bundle.js in production
*   remove temporary directory after karma:build
*   html objects documentation
*   html template navigation
*   scaffolding tool
*   remove karma and use directly nodejs (try zombiejs)

angular module dependencies
---------------------------

*   define best practices
*   autogenerate file with dependencies
*   how to autoload controllers, factories, services, filters, directives
    into the main app module?
    *   creating a template based on file names?
    *   creating a template based on file contents?
    *   other?
    *   do not forget to exclude fixed ones: app.js, routes.js, partials.js...
    *   see how ngbp and others are managing this
    *   delegate to user manual action (ease the task with placeholders)?
    *   push the user to use real dependency trees?
