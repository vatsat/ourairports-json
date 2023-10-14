const csvToJson = require('convert-csv-to-json');
const fs = require('fs');

const fileInputName = 'airports.csv'; 
const fileOutputName = 'airports.json';
let jsonString = '';

convertCSVtoJSON().then(saveJSON);

async function convertCSVtoJSON(){
    let json = await csvToJson.fieldDelimiter(',').supportQuotedField(true).getJsonFromCsv(fileInputName);
    let updatedJson = []
    await json.forEach((airport, index) => {
        let tempJson = {};
        Object.keys(airport).forEach(key => {
            let name = key.substring(1, key.length - 1)
            tempJson[name] = airport[key]
            delete json[key];
        })
        updatedJson.push(tempJson)
    })
    console.log(updatedJson)
    jsonString = JSON.stringify(updatedJson)
}

function saveJSON(){
    fs.writeFile(`${fileOutputName}`, jsonString, err => {
        if (err) {
            console.error(err);
        } else {
            console.log(`Successfully wrote file: ${fileOutputName}`)
        }
    });
}