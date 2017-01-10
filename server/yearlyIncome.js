'use strict';
var frequencyMultiplier = require('./data-for-calculations/frequencyMultipliers.json');
var logger = require('../logger.js');

exports.calculateAnnual = function calculateAnnual(request, done) {
    try {
        let pay = request.payment;
        let frequency = request.frequency;
        if (pay != null && pay != '' && frequency != null && frequency != '') {
            let multiplier = 0;
            for (let i = 0; i < frequencyMultiplier.length; i++) {
                if (frequencyMultiplier[i].frequency == frequency) {
                    multiplier = frequencyMultiplier[i].multiplier;
                    break;
                }
            }
            if (multiplier != 0) {
                request.yearlyIncome = multiplier * pay;
            }
            return done(null, request);
        }
    } catch (error) {
        logger.log(error);
        return done(error, null);
    }
}


// let test = {
//     payment: 1250,
//     frequency: 'bi-weekly',
//     yearlyIncome: null,
//     taxableInterest: null,
//     unemploymentBenefits: null,
//     filingStatus: {
//         primary: 'single',
//         secondary: null,
//         tertiary: null
//     },
//     dependent: false,
//     exemptions: 1,
//     taxWithheld: null,
//     earnedIncome: null,
//     agi: null,
//     taxableIncome: null,
//     paymentsAndCredits: null,
//     amount: null,
//     refund: null
// };
// this.calculateAnnual(test, function (err, data) {
//     console.log(err ? err : data);
// })



// exports.calculateAnnual = function calculateAnnual(paystubAmount, done) {
//     try {
//         if (paystubAmount == null || paystubAmount == '') {
//             return done(nullOrEmptyError(paystubAmount), null);
//         } else {
//             let pay = paystubAmount.payment;
//             let frequency = paystubAmount.timespan;
//             let multiplier = 0;
//             for (var i = 0; i < (frequencyMultiplier).length; i++) {
//                 if (frequencyMultiplier[i].frequency == frequency) {
//                     multiplier = frequencyMultiplier[i].multiplier;
//                 }
//             }
//             if (multiplier != 0) {
//                 return done(null, (multiplier * pay));
//             }
//         }
//         function nullOrEmptyError(errorTest) {
//             let error = null;
//             switch (errorTest) {
//                 case null: error = 'Paystub amount cannot be null';
//                     break;
//                 case '': error = 'Paystub amount cannot be empty';
//                     break;
//                 default: error = 'Something is wrong with your paystub amount';
//                     break;
//             }
//             return error;
//         }
//     } catch (Error) {
//         logger.log(Error);
//         return done(Error, null);
//     }
// }
// this.calculateAnnual({ 'payment': 250, 'timespan': 'weekly' }, function (err, data) {
//     console.log(data);
// })