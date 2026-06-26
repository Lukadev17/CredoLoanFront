Ext.define('CredoApp.view.main.RegisterWindow', {
    extend: 'Ext.window.Window',
    xtype: 'registerwindow',
    title: 'Register New User',
    width: 400,
    modal: true,
    layout: 'fit',
    resizable: false,
    autoShow: true,

    items: [{
        xtype: 'form',
        bodyPadding: 15,
        defaults: {
            xtype: 'textfield',
            anchor: '100%',
            allowBlank: false,
            labelWidth: 120
        },
        items: [
            { fieldLabel: 'Username', name: 'username' },
            { fieldLabel: 'Password', name: 'password', inputType: 'password' },
            { fieldLabel: 'First Name', name: 'firstName' },
            { fieldLabel: 'Last Name', name: 'lastName' },
            { fieldLabel: 'Personal Number', name: 'personalNumber', minLength: 11, maxLength: 11 },
            { fieldLabel: 'Birth Date', name: 'birthDate', xtype: 'datefield', format: 'Y-m-d', submitFormat: 'Y-m-d' },
            {
                fieldLabel: 'Role',
                name: 'role',
                xtype: 'combobox',
                store: ['User', 'Verifier'], 
                editable: false,
                value: 'User'
            }
        ],
        buttons: [{
            text: 'Register',
            formBind: true,
            handler: function (btn) {
                var win = btn.up('window');
                var form = win.down('form').getForm();

                if (form.isValid()) {
                    Ext.Ajax.request({
                        url: 'https://localhost:7280/api/auth/register', 
                        method: 'POST',
                        jsonData: form.getValues(),
                        success: function () {
                            Ext.Msg.alert('Success', 'Registration successful! You can now log in.');
                            win.close();
                        },
                        failure: function (response) {
                            var obj = Ext.decode(response.responseText || '{}');
                            Ext.Msg.alert('Error', obj.message || 'Registration failed.');
                        }
                    });
                }
            }
        }, {
            text: 'Cancel',
            handler: function (btn) { btn.up('window').close(); }
        }]
    }]
});