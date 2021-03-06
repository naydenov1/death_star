#!/usr/bin/env node
// Program that adapts a database from space-track to a desired format
// since some of the orbital elements are missing, they are randomly generated
var parse = require('csv-parse');
const fs = require('fs');
const _ = require('lodash');

fs.readFile('./space-track-db.csv', (err, data) => {
	parse(data, {columns: true}, (err, output) => {
		let json = {};
		json = _.filter(output,(obj) => {
			return obj.INCLINATION != '';
		})
		_.forEach(json, o => {
			let randomElements = {
				RAAN: Math.random()*360,
				epoch: 6205,
				ARGP: Math.random()*360,
				M: Math.random()*360,
				e: (parseInt(o.APOGEE)-parseInt(o.PERIGEE))/(parseInt(o.APOGEE)+parseInt(o.PERIGEE)),
				b: (parseInt(o.APOGEE) + parseInt(o.PERIGEE))/2
			}
			_.assign(o, randomElements)

		})
		json = _.map(json, o => _.omit(o,["APOGEE","PERIGEE","PERIOD","RCSVALUE","COMMENT","RCS_SIZE","COUNTRY","LAUNCH","NORAD_CAT_ID","OBJECT_ID",]));
		// json = JSON.stringify(json);
		// fs.writeFile('objects_in_orbit.json', json, 'utf8');
		let csv = "";
		_.forEach(json, o => {
			csv = csv + o.OBJECT_NAME.split(' ').join('_') +" "+o.b+" "+o.e+" "+o.INCLINATION+" "+o.ARGP+" "+o.RAAN+" "+o.M+" "+o.epoch+"\n";
		})
		fs.appendFile('database.csv', csv, function (err) {
			if (err) {
				throw new Error('Error with writing to file');
			}
		})

	});
})

