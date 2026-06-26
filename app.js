/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'CredoApp.Application',

    name: 'CredoApp',

    requires: [
        // This will automatically load all classes in the CredoApp namespace
        // so that application classes do not need to require each other.
        'CredoApp.*'
    ],

    // The name of the initial view to create.
    mainView: 'CredoApp.view.main.Main'
});
