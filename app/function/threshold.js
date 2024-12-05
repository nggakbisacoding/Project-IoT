const threshold = require('../models/threshold.model');
const formula = require('../models/formula.model');
const value = require('../models/value.model');
const notif = require('../models/notif.model');
const math = require('mathjs');

exports.show = async (req) => {
    const allFormula = await formula.find({ sensor: req });
    const formulas = math.evaluate(`${allFormula[0].formula}`);
    const allFeatures = await value.find({ active: true }).lean().exec();
    const thresholds = await threshold.find({ sensor: req });

    if (allFeatures.length > 1) {
        allFeatures.forEach(async feature => {
            if (thresholds.length > 1) {
                thresholds.forEach(async thresholdx => {
                    if (feature.functionName === thresholdx.target) {
                        for (j in feature.value) {
                            if (thresholdx.min > j || thresholdx.max < j) {
                                await notif.create({ sensor: req, name: "Threshold exceeded", message: thresholdx.msg });
                            }
                        }
                    }
                });
            } else {
                if (feature.functionName === thresholds.target) {
                    for (j in feature.value) {
                        if (thresholds.min > j || thresholds.max < j) {
                            await notif.create({ sensor: req, name: "Threshold exceeded", message: thresholdx.msg });
                        }
                    }
                }
            }
            if (feature.functionName === allFormula[0].target) {
                for (j in feature.value) {
                    let tmp = math.compare(formulas, j);
                    console.log(tmp);
                    if (tmp == 1 && allFormula[0].operator == ">" || allFormula[0].operator == ">=") {
                        await notif.create({ sensor: req, name: "Threshold exceeded", message: allFormula[0].msg });
                    }
                    if (tmp == -1 && allFormula[0].operator == "<" || allFormula[0].operator == "<=") {
                        await notif.create({ sensor: req, name: "Threshold exceeded", message: allFormula[0].msg });
                    }
                    if (tmp == 0 && allFormula[0].operator == "=" || allFormula[0].operator == "<=" || allFormula[0].operator == ">=") {
                        await notif.create({ sensor: req, name: "Threshold exceeded", message: allFormula[0].msg });
                    }
                }
            }
        });
    } else {
        for (j in allFeatures[0].value) {
            thresholds.forEach(async thresholdx => {
                if (allFeatures[0].functionName === thresholdx.target) {
                    if (thresholdx.min > j || thresholdx.max < j) {
                        await notif.create({ sensor: req, name: "Threshold exceeded", message: thresholdx.msg });
                    }
                }
            });
            if (allFeatures[0].functionName === allFormula[0].target) {
                let tmp = math.compare(formulas, j);
                if (tmp == 1 && allFormula[0].operator == ">" || allFormula[0].operator == ">=") {
                    await notif.create({ sensor: req, name: "Threshold exceeded", message: allFormula[0].msg });
                }
                if (tmp == -1 && allFormula[0].operator == "<" || allFormula[0].operator == "<=") {
                    await notif.create({ sensor: req, name: "Threshold exceeded", message: allFormula[0].msg });
                }
                if (tmp == 0 && allFormula[0].operator == "=" || allFormula[0].operator == "<=" || allFormula[0].operator == ">=") {
                    await notif.create({ sensor: req, name: "Threshold exceeded", message: allFormula[0].msg });
                }
            }
        }
    }
}