define([
    'hr/promise',
    'hr/utils',
    'hr/hr',
    'models/command',
    'core/commands/menu',
    'core/backends/rpc',
    'core/search',
    'core/files',
    'utils/dialogs'
], function(Q, _, hr, Command, menu, rpc, search, files, dialogs) {
    var logging = hr.Logger.addNamespace("codeSearch");
    var OPTIONS = [
        'query', 'path', 'casesensitive', 'replacement', 'pattern', 'maxresults',
        'wholeword', 'regexp', 'replaceAll'
    ];


    // Normalize results as a buffer
    var normResults = function(results) {
        // Header
        var buffer = 'Searching 1 file for "'+results.options.query+'"';
        if (results.options.casesensitive) buffer += " (Caso exacto)"
        buffer += '\n\n';

        _.each(results.files, function(lines, path) {
            buffer += path+"\n";
            _.each(lines, function(line) {
                buffer += line.line+"  "+line.content+"\n";
            });
            buffer += '\n\n';
        });

        // Footer
        buffer += results.matches+" matches across "+_.size(results.files)+" files";

        return buffer;
    };

    // Do a basic search
    var searchCode = function(options) {
        options =  _.extend({}, options || {});
        return rpc.execute("search/code", _.pick(options, OPTIONS));
    };

    

    var searchCommandHandler = function(title, fields, forceOptions) {
        return function(args) {
            if (_.isString(args)) args = {'query': args};
            args = _.defaults(args || {}, {});

            var doSearch = function(_args) {
                return searchCode(_.extend(_args, forceOptions || {}))
                .then(function(results) {
                    return normResults(results);
                }, function(err) {
                    logging.error("error", err);
                    return "Error during search: "+(err.message || err);
                })
                .then(function(buffer) {
                    return files.openNew("Buscar Resultados", buffer);
                });
            };

            if (!args.query) {
                return dialogs.fields(title, fields, args)
                .then(doSearch);
            }

            return doSearch(args);
        }
    };


    // Command search code
    var commandSearch = Command.register("code.search", {
        title: "Buscar en Archivos",
        category: "Buscar",
        shortcuts: [
            "mod+shift+f"
        ],
        action: searchCommandHandler("Buscar en Archivos", {
            'query': {
                'label': "Buscar",
                'type': "text"
            },
            'path': {
                'label': "Cuando",
                'type': "text"
            },
            'regexp': {
                'label': "Expersiones regulares",
                'type': "checkbox"
            },
            'casesensitive': {
                'label': "Caso exacto",
                'type': "checkbox"
            },
            'wholeword': {
                'label': "Whole word",
                'type': "checkbox"
            }
        })
    });

    // Command replace code
    var commandReplace = Command.register("code.replace", {
        title: "Reemplazar en archivos",
        category: "Buscar",
        shortcuts: [],
        action: searchCommandHandler("Buscar and Replace in Files", {
            'query': {
                'label': "Buscar",
                'type': "text"
            },
            'path': {
                'label': "Cuando",
                'type': "text"
            },
            'replacement': {
                'label': "Reemplazar",
                'type': "text"
            },
            'regexp': {
                'label': "Expersiones regulares",
                'type': "checkbox"
            },
            'casesensitive': {
                'label': "Caso exacto",
                'type': "checkbox"
            },
            'wholeword': {
                'label': "Whole word",
                'type': "checkbox"
            }
        }, {
            replaceAll: true
        })
    })


    // Create Buscar menu
    menu.register("Buscar", {
        title: "Buscar",
        position: 5
    }).menuSection([
        commandSearch,
        commandReplace
    ]);

    return {
        search: searchCode
    };
});