const csvToJson = require('convert-csv-to-json');
const fs = require('fs');

const fileInputName = 'airports.csv'; 
const fileOutputName = 'airports.json';

let json = csvToJson.fieldDelimiter(',').supportQuotedField(true).getJsonFromCsv(fileInputName);
let jsonString = JSON.stringify(json)

fs.writeFile(`${__dirname}/${fileOutputName}`, jsonString, err => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Successfully wrote file: ${fileOutputName}`)
    }
});