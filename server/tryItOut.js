'use strict';

var form = require('./form.js');

var request = {
    body: {
        payment: 1200,
        frequency: 'bi-weekly',
        yearlyIncome: null,
        taxableInterest: 0,
        unemploymentBenefits: 0,
        filingStatus: {
            primary: 'single',
            secondary: null,
            tertiary: null
        },
        dependent: false,
        exemptions: 1,
        taxWithheld: 7800,
        earnedIncome: null,
        agi: null,
        taxableIncome: null,
        paymentsAndCredits: null,
        amount: null,
        refund: null
    }
};

console.log(request);

form.calculateForm(request, function (err, data) {
    console.log(err ? err: data);
});


   // let payment = request.body.payment;
    // let frequency = request.body.frequency;
    // let taxableInterest = request.body.taxableInterest;
    // let unemploymentBenefits = request.body.unemploymentBenefits;
    // let filingStatus = request.body.filingStatus;
    // let dependent = request.body.dependent;
    // let exemptions = request.body.exemptions;
    // let taxWithheld = request.body.taxWithheld;
    // let earnedIncome = request.body.earnedIncome;