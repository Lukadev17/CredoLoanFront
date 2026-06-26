Ext.define('CredoApp.view.main.Login', {
    extend: 'Ext.window.Window',
    xtype: 'loginwindow',

    title: 'Credo Bank - Auth',
    closable: false,
    autoShow: true,
    modal: true,
    width: 360,
    layout: 'fit',
    resizable: false,

    items: [{
        xtype: 'form',
        bodyPadding: 20,
        defaults: {
            xtype: 'textfield',
            anchor: '100%',
            allowBlank: false,
            labelAlign: 'top'
        },
        items: [
            { name: 'username', fieldLabel: 'User', emptyText: 'Enter username' },
            { name: 'password', fieldLabel: 'Password', inputType: 'password', emptyText: '******' }
        ],
        buttons: [{
            text: 'Login',
            formBind: true,
            scale: 'medium',
            handler: function (btn) {
                var form = btn.up('form').getForm();
                if (form.isValid()) {
                    Ext.Ajax.request({
                        url: 'https://localhost:7280/api/auth/login',
                        method: 'POST',
                        jsonData: form.getValues(),
                        success: function (response) {
                            var res = Ext.decode(response.responseText);
                            localStorage.setItem('jwtToken', res.token);
                            localStorage.setItem('userRole', res.role);
                            window.location.reload();
                        },
                        failure: function () {
                            Ext.Msg.alert('Error', 'Invalid username or password.');
                        }
                    });
                }
            }
        }]
    }]
});