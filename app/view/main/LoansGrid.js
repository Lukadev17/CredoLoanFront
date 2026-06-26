Ext.define('CredoApp.view.main.LoansGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'loansgrid',
    
    title: 'Credo Loan Management System',
    store: { type: 'loans' },
    
    tbar: [{
        text: 'New Application',
        iconCls: 'x-fa fa-plus',
        handler: function () {
            var win = Ext.ComponentQuery.query('loanformwindow')[0] || Ext.create('CredoApp.view.main.LoanForm');
            win.down('form').getForm().reset();
            win.show();
        }
    }, '->', {
        text: 'Logout',
        iconCls: 'x-fa fa-sign-out',
        handler: function () {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userRole');
            window.location.reload();
        }
    }],

    columns: [
        { text: 'ID', dataIndex: 'id', width: 70 },
        { text: 'Loan Type', dataIndex: 'loanType', flex: 1 },
        { text: 'Amount', dataIndex: 'amount', width: 130, formatter: 'number("0,000.00")' },
        { text: 'Currency', dataIndex: 'currency', width: 90 },
        { text: 'Period (Months)', dataIndex: 'periodMonths', width: 120 },
        { text: 'Status', dataIndex: 'status', width: 150 },
        {
            xtype: 'widgetcolumn',
            text: 'Review',
            width: 100,
            align: 'center',
            stopSelection: true,
            onWidgetAttach: function (col, widget, rec) {
                if (localStorage.getItem('userRole') === 'Verifier' && rec.get('status') === 'Submitted') {
                    widget.show();
                } else { widget.hide(); }
            },
            widget: {
                xtype: 'button',
                text: 'Review',
                ui: 'default',
                handler: function (btn) {
                    var record = btn.getWidgetRecord();
                    var loanId = record.get('id');

                    Ext.Msg.show({
                        title: 'Review Loan Application',
                        message: 'Do you want to Approve or Reject this loan?',
                        buttons: Ext.Msg.YESNOCANCEL,
                        buttonText: { yes: 'Approve', no: 'Reject', cancel: 'Cancel' },
                        fn: function(buttonId) {
                            var action = null;
                            if (buttonId === 'yes') action = 'approve';
                            if (buttonId === 'no') action = 'reject';
                            
                            if (action) {
                                Ext.Ajax.request({
                                    url: 'https://localhost:7280/api/loans/' + loanId + '/review?action=' + action,
                                    method: 'POST',
                                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwtToken') },
                                    success: function () { 
                                        Ext.ComponentQuery.query('loansgrid')[0].getStore().load(); 
                                    }
                                });
                            }
                        }
                    });
                }
            }
        },
        {
            xtype: 'widgetcolumn',
            text: 'Send',
            width: 90,
            align: 'center',
            stopSelection: true,
            onWidgetAttach: function (col, widget, rec) {
                if (localStorage.getItem('userRole') === 'User' && rec.get('status') === 'Draft') {
                    widget.show();
                } else { widget.hide(); }
            },
            widget: {
                xtype: 'button',
                text: 'Send',
                ui: 'default',
                handler: function (btn) {
                    var record = btn.getWidgetRecord();
                    
                    Ext.Ajax.request({
                        url: 'https://localhost:7280/api/loans/' + record.get('id') + '/send',
                        method: 'POST', // 👈 ჩვენი ახალი ბულიანის ენდფოინთი
                        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwtToken') },
                        success: function () { 
                            Ext.ComponentQuery.query('loansgrid')[0].getStore().load(); 
                            Ext.Msg.alert('Success', 'Loan application sent to RabbitMQ successfully!');
                        },
                        failure: function(response) {
                            var obj = Ext.decode(response.responseText || '{}');
                            Ext.Msg.alert('Error', obj.message || 'Failed to send loan.');
                        }
                    });
                }
            }
        },
        {
            xtype: 'widgetcolumn',
            text: 'Edit',
            width: 90,
            align: 'center',
            stopSelection: true,
            onWidgetAttach: function (col, widget, rec) {
                if (localStorage.getItem('userRole') === 'User' && rec.get('status') === 'Draft') {
                    widget.show();
                } else { widget.hide(); }
            },
            widget: {
                xtype: 'button',
                text: 'Edit',
                ui: 'default',
                handler: function (btn) {
                    var record = btn.getWidgetRecord();
                    
                    var win = Ext.ComponentQuery.query('loanformwindow')[0] || Ext.create('CredoApp.view.main.LoanForm');
                    var form = win.down('form');
                    
                    form.getForm().reset();
                    form.getForm().loadRecord(record); // ავტომატურად შეავსებს Amount, LoanType და ა.შ.
                    
                    form.loanId = record.get('id'); // ვინახავთ ID-ს ფორმის ობიექტში PUT-ისთვის
                    win.setTitle('Edit Draft Loan (ID: ' + record.get('id') + ')');
                    win.show();
                }
            }
        },
        {
            xtype: 'widgetcolumn',
            text: 'Delete',
            width: 90,
            align: 'center',
            stopSelection: true,
            onWidgetAttach: function (col, widget, rec) {
                if (localStorage.getItem('userRole') === 'User' && rec.get('status') === 'Draft') {
                    widget.show();
                } else { widget.hide(); }
            },
            widget: {
                xtype: 'button',
                text: 'Delete',
                ui: 'default',
                handler: function (btn) {
                    var record = btn.getWidgetRecord();
                    var loanId = record.get('id');

                    Ext.Msg.confirm('Confirm', 'Are you sure you want to delete this draft?', function (choice) {
                        if (choice === 'yes') {
                            Ext.Ajax.request({
                                url: 'https://localhost:7280/api/loans/' + loanId,
                                method: 'DELETE',
                                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwtToken') },
                                success: function () { 
                                    Ext.ComponentQuery.query('loansgrid')[0].getStore().load(); 
                                }
                            });
                        }
                    });
                }
            }
            
            
        }
    ],

    listeners: {
        render: function (grid) {
            grid.getStore().load();
        }
    }
});