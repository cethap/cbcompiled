define([
    'hr/utils',
    'hr/hr',
    'views/commands/menubar',
    'core/box',
    'core/panels',
    'core/tabs',
    'core/session',
    'core/localfs',
    'core/settings'
], function (_, hr, MenubarView, box, panels, tabs, session, localfs, settings) {
    // Collection for all menu commands
    var menu = new MenubarView();
    
    menu.register("view", {
        title: "Ver",
        position: 5
    }).menuSection({
        'id': "themes.settings",
        'category': "View",
        'title': "Propiedades",
        'description': "Abrir propiedades de tema y vista",
        'offline': false,
        'action': function() {
            settings.open("themes");
        }
    }).menuSection([
        panels.panelsCommand
    ]).menuSection([
        tabs.layoutCommand
    ]);

    menu.register("file", {
        title: "Archivo",
        position: 0
    }).menuSection([{
        'id': "quit",
        'category': "Application",
        'title': "Salir",
        'description': "Cerrar sesión actual",
        'shortcuts': [
            "alt+q"
        ],
        'action': session.exit
    }], {
        'position': 1000
    });

    return menu;
});