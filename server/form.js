'use strict';

var logger = require('../logger.js');
var paymentsCredits = require('./paymentsCredits.js');
var refundOwed = require('./refundOwed.js');
var taxableIncome = require('./taxableIncome.js');
var yearlyIncome = require('./yearlyIncome.js');

exports.calculateForm = function calculateForm(request, done) {
    var body = request.body;
    var data = {
        payment: body.payment,
        frequency: body.frequency,
        yearlyIncome: body.yearlyIncome,
        taxableInterest: body.taxableInterest,
        unemploymentBenefits: body.unemploymentBenefits,
        filingStatus: {
            primary: body.filingStatus.primary,
            secondary: body.filingStatus.secondary,
            tertiary: null
        },
        dependent: body.dependent,
        exemptions: body.exemptions,
        taxWithheld: body.taxWithheld,
        earnedIncome: body.earnedIncome,
        agi: body.agi,
        taxableIncome: body.taxableIncome,
        paymentsAndCredits: body.paymentsAndCredits,
        amount: null,
        refund: null
    };
    do {
        switch (true) {
            case (data.yearlyIncome == null || data.yearlyIncome == ''):
                yearlyIncome.calculateAnnual(data, function (err, response) {
                    if (err) {
                        logger.log(err);
                    } else {
                        data = response;
                    }
                });
                break;
            case (data.taxableIncome == null || data.taxableIncome == ''):
                taxableIncome.calculateTaxable(data, function (err, response) {
                    if (err) {
                        logger.log(err);
                    } else {
                        data = response;
                    }
                });
                break;
            case (data.paymentsAndCredits == null || data.paymentsAndCredits == ''):
                paymentsCredits.calculatePaymentCredit(data, function (err, response) {
                    if (err) {
                        logger.log(err);
                    } else {
                        data = response;
                    }
                });
                break;
            case (data.amount == null || data.amount == ''):
                refundOwed.calculateRefundPayment(data, function (err, response) {
                    if (err) {
                        logger.log(err);
                    } else {
                        data = response;
                    }
                });
                break;
        }

    } while (data.amount == null || data.amount == '');
    return done(null, data);
}

// var test = {
//     body: {
//         payment: 1200,
//         frequency: 'bi-weekly',
//         yearlyIncome: null,
//         taxableInterest: 0,
//         unemploymentBenefits: 0,
//         filingStatus: {
//             primary: 'single',
//             secondary: null,
//             tertiary: null
//         },
//         dependent: false,
//         exemptions: 1,
//         taxWithheld: 7800,
//         earnedIncome: null,
//         agi: null,
//         taxableIncome: null,
//         paymentsAndCredits: null,
//         amount: null,
//         refund: null
//     }
// };
// var test2 = {
//     body: {
//         payment: 1200,
//         frequency: 'bi-weekly',
//         yearlyIncome: null,
//         taxableInterest: 0,
//         unemploymentBenefits: 0,
//         filingStatus: {
//             primary: 'single',
//             secondary: 'elderly/blind',
//             tertiary: null
//         },
//         dependent: false,
//         exemptions: 1,
//         taxWithheld: 7800,
//         earnedIncome: null,
//         agi: null,
//         taxableIncome: null,
//         paymentsAndCredits: null,
//         amount: null,
//         refund: null
//     }
// };
// this.calculateForm(test, function (err, data) {
//     logger.log(err ? err : data);
// });
// this.calculateForm(test2, function (err, data) {
//     logger.log(err ? err : data);
// })





// exports.calculateForm = function calculateForm (request, done){
//     logger.log(request);
//     logger.log(request.body.payment);
//     let yearly = {
//         'payment': request.body.payment,
//         'frequency': request.body.frequency
//     };
//     console.log('yearly: ', yearly);
//     yearlyIncome.calculateAnnual(yearly, function(err, annual){
//         logger.log('yearlyIncome.calculateAnnual');
//         if(err){
//             logger.log(err);
//         } else {
//             let taxableData = {
//                 'yearlyIncome': annual,
//                 'taxableInterest': request.body.taxableInterest,
//                 'unemploymentBenefits': request.body.unemploymentBenefits,
//                 'filingStatus': request.body.filingStatus, 
//                 'dependent': request.body.dependent,
//                 'exemptions': request.body.exemptions
//             };
//             logger.log(taxableData);
//             logger.log(annual);


//             taxableIncome.calculateTaxable(taxableData, function(error, taxable){
//                 if(error){
//                     logger.log(error);
//                 } else {
//                     let paymentData = {
//                         'taxWithheld': request.body.taxWithheld, 
//                         'earnedIncome': annual,
//                         'agi': taxable.adjustedGrossIncome, 
//                         'taxableIncome': taxable.taxableIncome, 
//                         'filingStatus': request.body.filingStatus
//                     };
//                     logger.log(taxable);
//                     paymentsCredits.calculatePaymentCredit(paymentData, function( error2, payment){
//                         if(error2){
//                             logger.log(error2);
//                         } else {
//                             let refundData = {
//                                 'paymentsAndCredits': payment, 
//                                 'taxableIncome': taxable.taxableIncome, 
//                                 'filingStatus': request.body.filingStatus
//                             };
//                             logger.log(payment);
//                             refundOwed.calculateRefundPayment(refundData, function(finalError, taxOwedOrDue){
//                                 if(finalError){
//                                     logger.log(finalError);
//                                 } else {
//                                     done(null, taxOwedOrDue)
//                                 }
//                             });
//                         }
//                     });
//                 }
//             });
//         }
//     });    
// }