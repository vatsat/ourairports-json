const fs = require('node:fs');

fs.readFile('airports.json', async function(err, data) {
    if (err) {
        return console.error(err)
    }
    const airports = await JSON.parse(data);
    await matrix(airports)

});

async function matrix(airports){
    const activeAirports = {};
    const vatsimPilots = await fetch(
        "https://vatsat.pages.dev/api/main?source=vatsimPilots",
    ).then((response) => response.json());
    await vatsimPilots.source.data.features.forEach((pilot) => {
        if (pilot.properties.flightPlan) {
          const flightPlan = JSON.parse(pilot.properties.flightPlan);
          if (activeAirports[flightPlan.departure]) {
            activeAirports[flightPlan.departure].departures.push(pilot.properties);
          } else if (!activeAirports[flightPlan.departure]){
            activeAirports[flightPlan.departure] = {
              departures: [pilot.properties],
              arrivals: [],
            };
          }
  
          if (activeAirports[flightPlan.arrival]) {
            activeAirports[flightPlan.arrival].arrivals.push(pilot.properties);
          } else if (!activeAirports[flightPlan.arrival]){
            activeAirports[flightPlan.arrival] = {
              arrivals: [pilot.properties],
              departures: [],
            };
          }
        }
      });
      /*Object.keys(activeAirports).forEach(icao => {
        if(activeAirports[icao].departures === 0 && activeAirports[icao].arrivals === 0) {
            delete activeAirports[icao];
        }
      })*/
      await airports.forEach((airport) => {
        if (
          Object.keys(activeAirports).filter(
            (airportICAO) => airportICAO === airport.gps_code,
          )[0]
        ) {
          Object.assign(activeAirports[airport.gps_code], airport);
        }
      });

      await writeFile('./activeAirports.json', JSON.stringify(activeAirports))
}

async function writeFile(path, data){
    fs.writeFile(path, data, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}