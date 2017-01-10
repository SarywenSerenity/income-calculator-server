'use strict';

var logger = require('../logger.js');
var taxBrackets = require('./data-for-calculations/taxBrackets.json')

exports.calculateRefundPayment = function calculateRefundPayment(data, done) {
    var payment, taxAccrued = 0, refund, paymentsAndCredits;
    if (data != null && data != '') {
        paymentsAndCredits = data.paymentsAndCredits;
        let taxableIncome = data.taxableIncome;
        let primaryStatus = data.filingStatus.primaryStatus;
        for (let i = 0; i < taxBrackets.length; i++) {
            let bracketFound = false;
            if (taxBrackets[i]['filing-status'] == primaryStatus) {
                let tax = taxBrackets[i].tax;
                for (let j = 0; j < tax.length; j++) {
                    let minimum = tax[j].minimum;
                    let maximum = (tax[j].maximum == null ? Number.MAX_SAFE_INTEGER : tax[j].maximum);
                    let rate = tax[j].rate;
                    if (!bracketFound) {
                        let taxToAdd = ((taxableIncome >= minimum && taxableIncome < maximum)
                            ? ((taxableIncome - minimum) * rate)
                            : ((maximum - minimum) * rate));

                        taxAccrued += taxToAdd;
                        if (taxableIncome >= minimum && taxableIncome < maximum) {
                            bracketFound = true;
                        }
                    }
                }
                break;
            }
        }
        payment = ((paymentsAndCredits > taxAccrued) ? (paymentsAndCredits - taxAccrued) : (taxAccrued - paymentsAndCredits));
    }
    //{ 'amount': payment, 'refund': (paymentsAndCredits > taxAccrued) }
    data.amount = payment;
    data.refund = (paymentsAndCredits > taxAccrued);
    return done(null, data);
}


// let test = {
//     paymentsAndCredits: 33000,
//     taxableIncome: 190151,
//     filingStatus: {
//         primaryStatus: 'single'
//     }
// }

// this.calculateRefundPayment(test, function (err, data) {
//     console.log(err ? err : data);
// })

// let test2 = {
//     paymentsAndCredits: 33000,
//     taxableIncome: 120000,
//     filingStatus: {
//         primaryStatus: 'single'
//     }
// };

// this.calculateRefundPayment(test2, function (err, data) {
//     console.log(err ? err : data);
// })