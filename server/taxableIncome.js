'use strict';

var logger = require('../logger.js');
var standardDeduction = require('./data-for-calculations/standard-deduction.json')
var standardExemption = require('./data-for-calculations/exemptions.json')

exports.calculateTaxable = function calculateTaxable(incomeDetails, done) {
    let taxable = 0;
    try {
        if (incomeDetails != null && incomeDetails != '') {
            if (incomeDetails != null && incomeDetails != '') {
                if (incomeDetails.yearlyIncome != null && incomeDetails.taxableInterest != null
                    && incomeDetails.unemploymentBenefits != null && incomeDetails.exemptions != null) {
                    let adjustedGrossIncome = incomeDetails.yearlyIncome + incomeDetails.taxableInterest + incomeDetails.unemploymentBenefits;
                    let dependent = incomeDetails.dependent;
                    let primaryStatus = incomeDetails.filingStatus.primary;
                    let secondaryStatus = incomeDetails.filingStatus.secondary;
                    let tertiaryStatus = incomeDetails.filingStatus.tertiary;
                    let deduction = 0;
                    if (secondaryStatus == 'elderly/blind' && !dependent) {
                        tertiaryStatus == 'additional-standard-increase';
                        incomeDetails.filingStatus.tertiary = 'additional-standard-increase';
                    }
                    for (let j = 0; j < standardDeduction.length; j++) {
                        let checkingStatus = standardDeduction[j].status;
                        if (checkingStatus == primaryStatus
                            || checkingStatus == secondaryStatus
                            || checkingStatus == tertiaryStatus) {
                            deduction += standardDeduction[j].deduction;
                        }
                    }
                    let phaseout = standardExemption['personal-exemption-phaseout'];
                    let exemption = (standardExemption['personal-exemption']) * incomeDetails.exemptions;
                    for (let i = 0; i < phaseout.length; i++) {
                        if (phaseout[i]['filing-status'] == primaryStatus) {
                            if (adjustedGrossIncome < phaseout[i].maximum && adjustedGrossIncome > phaseout[i].minimum) {
                                exemption = ((primaryStatus == 'married-filing-separately')
                                    ? ((1 - (Math.ceil((adjustedGrossIncome - phaseout[i].minimum) / 1250)) * 0.02) * exemption)
                                    : ((1 - (Math.ceil((adjustedGrossIncome - phaseout[i].minimum) / 2500)) * 0.02) * exemption));
                            } else if (adjustedGrossIncome > phaseout[i].maximum) {
                                exemption = 0;
                            }
                            break;
                        }
                    }
                    //{ 'taxableIncome': ((adjustedGrossIncome > (exemption + deduction)) ? (adjustedGrossIncome - deduction - exemption) : 0), 'adjustedGrossIncome': adjustedGrossIncome }
                    incomeDetails.taxableIncome = ((adjustedGrossIncome > (exemption + deduction)) ? (adjustedGrossIncome - deduction - exemption) : 0);
                    incomeDetails.agi = adjustedGrossIncome;
                    return done(null, incomeDetails);

                }

            }
        } else {
            return (nullOrEmptyError(incomeDetails), null);
        }
        function nullOrEmptyError(data) {
            if (data == '') {
                return 'Data cannot be empty';
            } else if (data == null) {
                return 'Data cannot be null';
            } else {
                return 'Error encountered in data';
            }
        }
    } catch (Error) {
        return done(Error, null);
    }
}






// exports.calculateTaxable = function calculateTaxable(incomeDetails, done) {
//     let taxable = 0;
//     if (incomeDetails != null && incomeDetails != '') {
//         if (incomeDetails.yearlyIncome != null && incomeDetails.taxableInterest != null && incomeDetails.unemploymentBenefits != null && incomeDetails.exemptions != null) {
//             let adjustedGrossIncome = incomeDetails.yearlyIncome + incomeDetails.taxableInterest + incomeDetails.unemploymentBenefits;
//             let statusList = incomeDetails.filingStatus;
//             let status = '';
//             let deduction = 0;
//             if (statusList != null && statusList != '') {
//                 for (let i = 0; i < statusList.length; i++) {
//                     if (statusList[i] == 'elderly/blind' && !incomeDetails.dependent) {
//                         statusList.push('additional-standard-increase');
//                     }
//                     for (let j = 0; j < standardDeduction.length; j++) {
//                         if (standardDeduction[j].status == statusList[i]) {
//                             deduction += standardDeduction[j].deduction;
//                         }
//                     }
//                 }
//                 let phaseout = standardExemption['personal-exemption-phaseout'];
//                 for (let i = 0; i < statusList.length; i++) {

//                     // if (statusList[i] == 'single' || statusList[i] == 'married-filing-separately' || statusList[i] == 'married-filing-jointly'
//                     //     || statusList[i] == 'head-of-household' || statusList[i] == 'qualifying-widow(er)') {
//                    if(statusList[i] != 'elderly/blind' && statusList[i] != 'additional-standard-increase'){
//                             //check against the !
//                         status = statusList[i];
//                         //break;
//                     }
//                 }
//                 let exemption = (standardExemption['personal-exemption'])*incomeDetails.exemptions;
//                 for (let i = 0; i < phaseout.length; i++) {
//                     if (phaseout[i]['filing-status'] == status) {
//                         if (adjustedGrossIncome < phaseout[i].maximum && adjustedGrossIncome > phaseout[i].minimum) {
//                             if (status == 'married-filing-separately') {
//                                 //2% for each 1250 or part thereof
//                                 let reduction = (Math.ceil((adjustedGrossIncome - phaseout[i].minimum) / 1250)) * 0.02;
//                                 exemption = (1 - reduction) * exemption;
//                             } else {
//                                 //2% for each 2500 or part thereof
//                                 let reduction = (Math.ceil((adjustedGrossIncome - phaseout[i].minimum) / 2500)) * 0.02;
//                                 exemption = (1 - reduction) * exemption;
//                             }
//                         } else if (adjustedGrossIncome > phaseout[i].maximum) {
//                             exemption = 0;
//                         }
//                     }
//                 }
//                 if(adjustedGrossIncome > (exemption+deduction)){
//                     taxable = adjustedGrossIncome - deduction - exemption;
//                 }
//             }
//             return done(null, {'taxableIncome': taxable, 'adjustedGrossIncome': adjustedGrossIncome});
//         }
//     }
// }

// var test = {
//     'yearlyIncome': 200500,
//     'taxableInterest': 0,
//     'unemploymentBenefits': 0,
//     'filingStatus': {
//         primary: 'married-filing-separately',
//         secondary: 'elderly/blind',
//         tertiary: null
//     },
//     'dependent': false,
//     'exemptions': 1
// };
// this.calculateTaxable(test, function (err, data) {
//     console.log(err ? err : data);
// });

// var test2 = {
//     'yearlyIncome': 400000,
//     'taxableInterest': 0,
//     'unemploymentBenefits': 0,
//     filingStatus: [
//         'married-filing-jointly'
//     ],
//     dependent: false, 
//     exemptions: 4
// };
// this.calculateTaxable(test2, function (err, data) {
//     if (err) {

//     } else {
//         console.log(data);
//     }
// });

// var test3 = {
//     'yearlyIncome': 25000,
//     'taxableInterest': 0,
//     'unemploymentBenefits': 0,
//     filingStatus: [
//         'single'
//     ],
//     dependent: false, 
//     exemptions: 2
// };
// this.calculateTaxable(test3, function (err, data) {
//     if (err) {

//     } else {
//         console.log(data);
//     }
// });


// var test4 = {
//     'yearlyIncome': 25000,
//     'taxableInterest': 0,
//     'unemploymentBenefits': 0,
//     filingStatus: [
//         'single'
//     ],
//     dependent: false, 
//     exemptions: 4
// };
// this.calculateTaxable(test4, function (err, data) {
//     if (err) {

//     } else {
//         console.log(data);
//     }
// });