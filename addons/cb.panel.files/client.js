define([
    "views/panel"
], function(PanelFilesView) {
    var Command = codebox.require("models/command");
    var commands = codebox.require("core/commands/toolbar");
    var app = codebox.require("core/app");
    var panels = codebox.require("core/panels");
    var files = codebox.require("core/files");
    var menu = codebox.require("core/commands/menu");
    var box = codebox.require("core/box");

    // Add files panels
    var panel = panels.register("files", PanelFilesView, {
        title: "Carpetas"
    });
    
    // Open files panel
    panel.connectCommand(commands.register("files.tree.open", {
        category: "Panels",
        title: "Archivos",
        description: "Open Files Panel",
        icons: {
            'default': "folder-o",
        },
        position: 2,
        shortcuts: [
            "alt+f"
        ]
    }));

    // Recents files
    var recentFiles = Command.register({
        'type': "menu",
        'title': "Abrir Reciente"
    });
    files.recent.on("add remove reset", function() {
        recentFiles.menu.reset(files.recent.map(function(file) {
            var path = file.path();
            return {
                'title': file.get("name"),
                'action': function() {
                    files.open(path);
                }
            };
        }).reverse());
    });


    // Command new file
    menu.getById("file").menuSection([
        {
            'id': "files.file.new",
            'category': "Files",
            'title': "Nuevos Archivos",
            'shortcuts': ["alt+shift+n"],
            'action': function() {
                files.openNew()
            }
        }, {
            'id': "files.folder.create",
            'category': "Files",
            'title': "Nueva Carpeta",
            'shortcuts': ["alt+shift+f"],
            'action': function() {
                box.root.actionMkdir();
            }
        },
        recentFiles
    ], {
        position: 0
    }).menuSection([
        {
            'id': "workspace.save.zip",
            'category': "Files",
            'title': "Guardar proyecto como TAR.GZ",
            'offline': false,
            'action': function() {
                window.open("/export/targz");
            }
        }
    ]);

    // Open panel
    panel.open();
});