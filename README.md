Tasks overview
==============

clean
-----

*   build: `<%= prj.build %>`
*   release: `<%= prj.release %>`
*   dist: `<%= prj.dist %>`

jshint
------

*   scripts: `<%= prj.src %>/**/*.js`
*   tests: `<%= prj.test %>/**/*.js`

less
----

*   oocss: `<%= prj.src %>/less/oocss.less` to `<%= prj.build %>/css/oocss.css`
*   theme: `<%= prj.src %>/less/theme.less` to `<%= prj.build %>/css/theme.css`

html2js
-------

*   partials:
    -   src: `<%= prj.src %>/**/*.html`
    -   dst: `<%= prj.build %>/<%= prj.src %>/partials.js`

cssmin
------

*   styles:
    -   src: `<%= less.oocss.dest %>, <%= less.theme.dest %>`
    -   dst: `<%= prj.release %>/<%= pkg.name %>-<%= pkg.version %>.css`

concat
------

*   scripts:
    -   src: `<%= prj.build %>/<%= prj.src %>/**/*.js`
    -   dst: `<%= prj.release %>/<%= pkg.name %>-<%= pkg.version %>.js`
*   all:
    -   src: `<%= prj.dependencies %>, <%= concat.scripts.dest %>`
    -   dst: `<%= concat.scripts.dest %>`

ngAnnotate
----------

*   sources: `<%= concat.scripts.dest %>` to `<%= concat.scripts.dest %>`

uglify
------

*   sources: `<%= concat.scripts.dest %>` to `<%= concat.scripts.dest %>`

compress
--------

*   release:
    -   src: `<%= prj.release %>/**`
    -   dst: `<%= prj.dist %>/<%= pkg.name %>-<%= pkg.version %>.zip`

index
-----

*   dev:
    -   src:
        +   `<%= prj.dependencies %>`
        +   `<%= concat.scripts.src %>`
        +   `<%= cssmin.styles.src %>`
    -   dst: `<%= prj.build %>`
*   ci:
    -   src: `<%= concat.all.dest %>, <%= cssmin.styles.dest %>`
    -   dst: `<%= prj.release %>`

copy
----

*   build_scripts: `<%= jshint.scripts.src %>` to `<%= prj.build %>/`
*   build_dependencies: `<%= prj.dependencies %>` to `<%= prj.build %>/`
*   build_assets: `<%= prj.src %>/assets/**` to `<%= prj.build %>/`
*   release_assets:
    -   src: `<%= prj.build %>/<%= prj.src %>/assets/**`
    -   dst: `<%= prj.release %>/assets/`

karma
-----

*   *(shared)*
    -   `<%= prj.dependencies %>`
    -   `<%= prj.devDependencies %>`
    -   `<%= jshint.scripts.src %>`
    -   `<%= jshint.tests.src %>`
*   dev: *(shared)*
*   ci:
    -   src: *(shared)*
    -   dst: `<%= prj.dist %>/test-results.xml, <%= prj.dist %>/coverage/`

freddie
-------

*   dev: `<%= prj.build %>, <%= prj.fixtures %>`

watch
-----

*   index: `<%= prj.src %>/index.html.tpl`
*   js: `<%= jshint.scripts.src %>`
*   assets: `<%= prj.src %>/assets/**`
*   partials: `<%= html2js.partials.src %>`
*   less_oocss: `<%= less.oocss.src %>`
*   less_theme: `<%= less.theme.src %>`
*   tests: `<%= jshint.tests.src %>`