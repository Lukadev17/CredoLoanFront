Ext.define('CredoApp.Application', {
    extend: 'Ext.app.Application',
    
    name: 'CredoApp',

    stores: [
        'Loans'
    ],
    
    mainView: 'CredoApp.view.main.Main'
});