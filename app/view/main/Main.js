Ext.define('CredoApp.view.main.Main', {
    extend: 'Ext.container.Viewport',
    xtype: 'app-main',

    requires: [
        'CredoApp.view.main.Login',
        'CredoApp.view.main.LoansGrid',
        'CredoApp.view.main.LoanForm'
    ],

    layout: 'fit',

    initComponent: function() {
        var me = this;
        var token = localStorage.getItem('jwtToken');

        if (!token) {
            me.items = [{ xtype: 'loginwindow' }];
        } else {
            me.items = [{ xtype: 'loansgrid' }];
        }

        me.callParent();
    }
});