const threshold = require('../models/threshold.model');
const formula = require('../models/formula.model');
const value = require('../models/value.model');
const notif = require('../models/notif.model');
const math = require('mathjs');

exports.show = async (req) => {
    const { id } = req;
    const allFormula = await formula.find({ sensor: id });
    const formulas = math.evaluate(`${allFormula.formula}`);
    const allFeatures = await value.find({ active: true }).lean().exec();
    
    const thresholds = await threshold.find({ sensor: id });

    for(i in allFeatures){
        for(k in thresholds) {
            if(i.functionName === k.target) { 
                for(j in i.value){
                    if(k.min > j || k.max < j) {
                        await notif.create({ name: 'Threshold value exceeded', parameter: k.msg , isDisplay: true });
                    }
                }
            }
            if(i.functionName === allFormula.target) {
                for(j in i.value) {
                    let tmp = math.compare(formulas, j);
                    if(tmp == 1 && allFormula.operator == ">" || allFormula.operator == ">=") {
                        await notif.create({ name: 'Formula value exceeded', parameter: formula.msg , isDisplay: true });
                    }
                    if(tmp == -1 && allFormula.operator == "<" || allFormula.operator == "<=") {
                        await notif.create({ name: 'Formula value exceeded', parameter: formula.msg , isDisplay: true });
                    }
                    if(tmp == 0 && allFormula.operator == "=" || allFormula.operator == "<=" || allFormula.operator == ">=") {
                        await notif.create({ name: 'Formula value exceeded', parameter: formula.msg , isDisplay: true });
                    }
                }
            }
        }
    }
}