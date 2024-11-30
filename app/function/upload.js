const multer = require('multer');
const { parse } = require('csv-parse')
const fs = require('fs');
const xlsx = require('xlsx');

const opencsv = (req, res) => {
    const data = []
    fs.createReadStream(req)
    .pipe(parse({ delimiter: ',' }))
    .on('data', (r) => {
        data.push(r);        
    })
    .on('end', () => {
        for (let i = 0; i < data.length; i++) {
            console.log(data[i][0]);
            console.log(data[i]);
        }
  })
}

const openxlsx = (req, res) => {
    const workbook = xlsx.readFile(req);
    const sheet_name_list = workbook.SheetNames;
    sheet_name_list.forEach(function(y) {
        const worksheet = workbook.Sheets[y];
        for (z in worksheet) {
            if(z[0] === '!') continue;
            console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
        }
    });
}

const chooice = (req) => {
    const reqs = req.split('%');
    if(reqs[0] == "csv"){
        opencsv(reqs[1]);   
    } else {
        openxlsx(reqs[1]);
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './app/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
        if(file) {
            const dir =__dirname.split('\\');
            const dirResult = dir.slice(0, dir.length-1).join('\\');
            chooice(file.mimetype.split('/')[1]+"%" + dirResult+ "\\uploads\\"+file.originalname);
        }
    }
});

const upload = multer({ storage: storage });

module.exports = upload;