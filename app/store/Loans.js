Ext.define('CredoApp.store.Loans', {
    extend: 'Ext.data.Store',
    alias: 'store.loans',

    fields: [
        { name: 'id', type: 'int' },
        { name: 'loanType', type: 'string' },
        { name: 'amount', type: 'number' },
        { name: 'currency', type: 'string' },
        { name: 'periodMonths', type: 'int' },
        { name: 'status', type: 'string' }
    ],

    proxy: {
        type: 'ajax',
        url: 'https://localhost:7280/api/loans',
        headers: {
            'Authorization': 'Bearer ' + (localStorage.getItem('jwtToken') || '')
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    },
    autoLoad: false
});