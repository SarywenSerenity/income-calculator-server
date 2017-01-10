'use strict';

var logger = require('../logger.js');
var earnedIncome = require('./data-for-calculations/earnedIncomeCredit.json')

exports.calculatePaymentCredit = function calculatePaymentCredit(data, done) {
    var tax, totalPaymentsCredits;
    if (data != null && data != '') {
        let taxWithheld = data.taxWithheld;
        let status = data.filingStatus.primary;
        let exemptions = data.exemptions;
        let agi = data.agi;
        let earnedIncomeCredit = 0;
        // insert EIC calculation here
        if (status == 'married-filing-jointly') {
            //calculate number of children from exemptions, remove 2 for parents
            exemptions -= 2;
            if(exemptions > 2){
                exemptions = 3;
            }
            let jointlyTable = earnedIncome["married-filing-jointly"];
            for (let i = 0; i < jointlyTable.length; i++) {
                let minimum = jointlyTable[i].minimum;
                let maximum = jointlyTable[i].maximum;
                if(agi < maximum && agi >= minimum){
                    earnedIncomeCredit = jointlyTable[i][exemptions];
                    break;
                }
            }
        } else {
            exemptions -= 1;
            if(exemptions > 2){
                exemptions = 3;
            }
            let regularTable = earnedIncome.single;
            for (let i = 0; i < regularTable.length; i++) {
                let minimum = regularTable[i].minimum;
                let maximum = regularTable[i].maximum;
                if(agi < maximum && agi >= minimum){
                    earnedIncomeCredit = regularTable[i][exemptions];
                    break;
                }
            }

        }


        totalPaymentsCredits = taxWithheld + earnedIncomeCredit;   

        data.paymentsAndCredits = totalPaymentsCredits;
    }
    return done(null, data);
}

// let test = {
//     taxWithheld: 3500,
//     agi: 20000,
//     filingStatus: {
//         primary: 'single'
//     }, 
//     exemptions: 4
// }

// this.calculatePaymentCredit(test, function (err, data) {
//     console.log(err ? err : data);
// })