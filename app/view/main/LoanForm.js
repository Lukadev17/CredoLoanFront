Ext.define('CredoApp.view.main.LoanForm', {
    extend: 'Ext.window.Window',
    xtype: 'loanformwindow',

    title: 'Loan Application',
    modal: true,
    width: 400,
    closeAction: 'hide',
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
            { xtype: 'hiddenfield', name: 'id' },
            { 
                xtype: 'combobox', 
                name: 'loanType', 
                fieldLabel: 'Loan Type', 
                store: ['Fast Loan', 'Auto Loan', 'Installment'], 
                editable: false 
            },
            { xtype: 'numberfield', name: 'amount', fieldLabel: 'Amount', minValue: 1 },
            { 
                xtype: 'combobox', 
                name: 'currency', 
                fieldLabel: 'Currency', 
                store: ['GEL', 'USD', 'EUR'], 
                editable: false 
            },
            { xtype: 'numberfield', name: 'periodMonths', fieldLabel: 'Period (Months)', minValue: 1 }
        ],
        buttons: [{
            text: 'Submit',
            formBind: true,
            handler: function (btn) {
    var win = btn.up('window');
    var formPanel = win.down('form');
    var form = formPanel.getForm();

    if (form.isValid()) {
        var values = form.getValues();
        
        var isEdit = !!formPanel.loanId; 
        var url = isEdit ? 'https://localhost:7280/api/loans/' + formPanel.loanId : 'https://localhost:7280/api/loans';
        var method = isEdit ? 'PUT' : 'POST'; 

        Ext.Ajax.request({
            url: url,
            method: method,
            jsonData: values,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
            success: function (response) {
                Ext.Msg.alert('Success', isEdit ? 'Draft updated successfully!' : 'Draft created successfully!');
                win.close();
                
                formPanel.loanId = null; 

                var grid = Ext.ComponentQuery.query('loansgrid')[0];
                if (grid) {
                    grid.getStore().load();
                }
            },
            failure: function (response) {
                var obj = Ext.decode(response.responseText || '{}');
                Ext.Msg.alert('Error', obj.message || 'Failed to save loan application.');
            }
        });
    }
}
        }, {
            text: 'Cancel',
            handler: function (btn) { btn.up('window').hide(); }
        }]
    }]
});