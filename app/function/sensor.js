const sensor = require('../models/sensor.model');
const value = require('../models/value.model');

export const getSensorValue = async (request) => {
    const { id } = request;
    const sensors = await sensor.findById({ id });
    if (!sensors) return null;
  
    const now = new Date();
  
    let start_time = request.start_time;
    let end_time = request.end_time;
  
    if (!end_time) {
      end_time = now;
    }
  
    if (!start_time) {
      startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 jam yang lalu
    }
  
    return value.where({
        sensor: id,
        active: true,
//        timestamp: {
//            $gt: start_time,
//            $lt: end_time,
//       },
    }).select('value').lean().exec();
  };
  
  