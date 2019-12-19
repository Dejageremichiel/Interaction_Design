function timeConvertor(time) {
    var PM = time.match('PM') ? true : false
    
    time = time.split(':')
    var min = time[1]
    
    if (PM) {
		var hour = 12 + parseInt(time[0],10)
		hour ++
        var sec = time[2].replace('PM', '')
    } else {
		var hour = time[0]
		hour++
        var sec = time[2].replace('AM', '')       
    }
    
    return ({
		hour: hour.toString(),
		minute: min
	});
}

//Locatie uit de browser halen
//indien geen locatie beschikbaar show kortrijk
function getLocation() {

	if (navigator.geolocation) {
		  navigator.geolocation.getCurrentPosition(showPosition, showError);
	} else {
		}
	} 

function showPosition(position){
	getAPI(position.coords.latitude, position.coords.longitude);
	getsunsetsunriseAPItoday(position.coords.latitude, position.coords.longitude);

}

function showError(error) {
	switch(error.code) {
	  case error.PERMISSION_DENIED:
		showstaticcoordinats();
		break;
	  case error.POSITION_UNAVAILABLE:
		showstaticcoordinats();
		break;
	  case error.TIMEOUT:
		showstaticcoordinats();
		break;
	  case error.UNKNOWN_ERROR:
		showstaticcoordinats();
		break;
	}
  }

function showstaticcoordinats (){
	let long = 3.26;
	let lat = 50.83;

	getAPI(lat, long);
	getsunsetsunriseAPItoday(lat, long);
}

function timeObjectToString(timeObject) {
	return `${timeObject.hour}:${timeObject.minute}`;
}

let showResult = queryResponse => {
	document.querySelector('.js-location').innerHTML = `${queryResponse.city.name}, ${queryResponse.city.country}`;
	document.querySelector('.js-currentTemp').innerHTML = `${Math.round((queryResponse.list[0].main.temp)*10)/10}°`
	document.querySelector('.js-description').innerHTML = `${queryResponse.list[0].weather[0].description}`
	document.querySelector('.js-humidity').innerHTML = `${queryResponse.list[0].main.humidity}%`
	document.querySelector('.js-wind').innerHTML = `${Math.round((queryResponse.list[0].wind.speed * 3.6)*100)/100} km/u`
	document.querySelector('.js-clouds').innerHTML = `${queryResponse.list[0].clouds.all} %`

}

function timeFallsInTimeline (currentTime, firstTime, endTime) {
	if (firstTime.hour <= currentTime.hour && endTime.hour >= currentTime.hour) {
		if (firstTime.hour == currentTime.hour) {
			return firstTime.minute < currentTime.minute;
		} else if (endTime.hour == currentTime.hour) {
			return endTime.minute > currentTime.minute;
		} else if (firstTime.hour < currentTime.hour && endTime.hour > currentTime.hour) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

let showdescription = queryResponse => {
	const today = new Date();
	const timeNow = {hour: today.getHours(), minute: today.getMinutes()};
	const astroTwilightBegin = timeConvertor(queryResponse.results.astronomical_twilight_begin);
	const nauticalTwilightBegin = timeConvertor(queryResponse.results.nautical_twilight_begin);
	const civilTwilightBegin = timeConvertor(queryResponse.results.civil_twilight_begin);
	const sunrise = timeConvertor(queryResponse.results.sunrise);

	const solarNoon = timeConvertor(queryResponse.results.solar_noon);

	const sunset = timeConvertor(queryResponse.results.sunset);
	const civilTwilightEnd = timeConvertor(queryResponse.results.civil_twilight_end);
	const nauticalTwilightEnd = timeConvertor(queryResponse.results.nautical_twilight_end);
	const astroTwilightEnd = timeConvertor(queryResponse.results.astronomical_twilight_end);

	if (timeFallsInTimeline(timeNow, astroTwilightBegin,nauticalTwilightBegin)) {
		document.querySelector('.js-light-description').innerHTML = `It's now astro twilight`
		console.log("astro begin time");
		document.querySelector('.bg').style.backgroundImage = "url('images/astronomical_twilight.jpg')";

	} else if (timeFallsInTimeline(timeNow, nauticalTwilightBegin, civilTwilightBegin)) {
		document.querySelector('.js-light-description').innerHTML = `It's now nautical twilight`
		//natuical begin time
		document.querySelector('.bg').style.backgroundImage = "url('images/nautical.jpg')";
		console.log("nautical begin time");
	} else if (timeFallsInTimeline(timeNow, civilTwilightBegin, sunrise)) {
		document.querySelector('.js-light-description').innerHTML = `It's now civil twilight`
		//civil begin time
		document.querySelector('.bg').style.backgroundImage = "url('images/civiltwilight.jpg')";
		console.log("civil begin time");
	} else if (timeFallsInTimeline(timeNow, sunrise, solarNoon)) {
		document.querySelector('.js-light-description').innerHTML = `It's now sunrise`
		//sunrise time
		document.querySelector('.bg').style.backgroundImage = "url('images/Iceland_447.JPG')";
		console.log("sunrise time");
	} else if (timeFallsInTimeline(timeNow, solarNoon, sunset)) {
		document.querySelector('.js-light-description').innerHTML = `It's now solar noon`
		document.querySelector('.bg').style.backgroundImage = "url('images/Iceland_229.JPG')";
		//solar noon time
		console.log("solar noon time");
	} else if (timeFallsInTimeline(timeNow, sunset, civilTwilightEnd)) {
		document.querySelector('.js-light-description').innerHTML = `It's now sunset`
		document.querySelector('.bg').style.backgroundImage = "url('../images/sunset.jpg')";
		//sunset time
		console.log("sunset time");
	} else if (timeFallsInTimeline(timeNow, civilTwilightEnd, nauticalTwilightEnd)) {
		document.querySelector('.js-light-description').innerHTML = `It's now civil twilight`
		//civil end time
		document.querySelector('.bg').style.backgroundImage = "url('../images/civiltwilight.jpg')";
		console.log("civil end time");
	} else if (timeFallsInTimeline(timeNow, nauticalTwilightEnd, astroTwilightEnd)) {
		document.querySelector('.js-light-description').innerHTML = `It's now nautical twilight`
		//natuical end time
		document.querySelector('.bg').style.backgroundImage = "url('../images/nautical.jpg')";

		console.log("natuical end time");
	} else {
		document.querySelector('.js-light-description').innerHTML = `It's now night`
		document.querySelector('.bg').style.backgroundImage = "url('../images/night.jpg')";
		//astro end time
		console.log("astro end time");
	}


	//blue time 
	if (timeFallsInTimeline(timeNow, civilTwilightBegin, civilTwilightEnd)){
		//end
		document.querySelector('.js-sunrise').innerHTML = `Blue hour: ${timeObjectToString(civilTwilightEnd)}`
	} else {
		//begin
		document.querySelector('.js-civil_twilight_begin').innerHTML = `Blue hour: ${timeObjectToString(civilTwilightBegin)}`
	}
	

	//sunrise / sunset time
	if (timeFallsInTimeline(timeNow, sunrise, sunset)) {
		//sunset 
		document.querySelector('.js-civil_twilight_begin').innerHTML = `Sunset: ${timeObjectToString(sunset)}`
	} else {
		document.querySelector('.js-sunrise').innerHTML = `Sunrise: ${timeObjectToString(sunrise)}`
	}

	//daylight / night left
	const sunsetMoment = moment.duration(sunset, "HH:mm");
	const sunriseMoment = moment.duration(sunrise, "HH:mm");
	const timeNowMoment = moment.duration(timeNow, "HH:mm");
	const midNightPM = moment.duration("23:59", "HH:mm");

	if (timeFallsInTimeline(timeNow, sunrise, sunset)) {
		//daytimeleft
		let dayLightLeft = sunsetMoment.subtract(timeNowMoment);
		document.querySelector('.js-day_length').innerHTML = `Daylight left: ${dayLightLeft.hours()+ ":"+ dayLightLeft.minutes()}`;
	} else {
		//night time left
		let nightTimeLeft = '';
		if (timeNowMoment.hours() > sunrise.hour) {
			//voor 12 uur 's nachts
			let timeLeftBeforeMidnight = midNightPM.subtract(timeNowMoment).add(1, 'minutes');
			nightTimeLeft = sunriseMoment.add(timeLeftBeforeMidnight.hours(), 'hours').add(timeLeftBeforeMidnight.minutes(), 'minutes');
		} else {
			//na 12 uur 's nachts
			nightTimeLeft = sunriseMoment.subtract(timeNowMoment);
		}
		document.querySelector('.js-day_length').innerHTML = `Night time left: ${nightTimeLeft.hours()+ ":"+ nightTimeLeft.minutes()}`;
	}
}

let getAPI = (lat, lon) => {
	const appid = '9ee8bb5a26f084c68730eff7ace7887e';
	const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appid}&units=metric&lang=nl&cnt=1`;
	fetch(url)
		.then(req => {
			if (!req.ok) {
				console.error('Error with fetch');
			} else {
				return req.json();
			}
		})
		.then(json => {
			showResult(json);
		});
};

let getsunsetsunriseAPItoday = (lat, lon) => {
	const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&date=today`;
	fetch(url)
		.then(req => {
			if (!req.ok) {
				console.error('Error with fetch');
			} else {
				return req.json();
			}
		})
		.then(json => {
			showdescription(json);
		});
};

document.addEventListener('DOMContentLoaded', function() {
    getLocation();
});

document.onreadystatechange = function () {
	var state = document.readyState
	if (state == 'interactive') {
		 document.getElementById('contents').style.visibility="hidden";
	} else if (state == 'complete') {
		setTimeout(function(){
		   document.getElementById('interactive');
		   document.getElementById('load').style.visibility="hidden";
		   document.getElementById('contents').style.visibility="visible";
		},2700);
	}
  }
