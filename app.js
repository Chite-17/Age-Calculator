// app.js

document.getElementById('age-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const birthdate = document.getElementById('birthdate').value;
    if (!birthdate) {
        document.getElementById('result').textContent = "Please enter your birthdate.";
        return;
    }

    try {
        const age = getAge(birthdate);
        const exactAge = getExactAge(birthdate);
        document.getElementById('result').textContent = `You are ${age.years} years, ${age.months} months, and ${age.days} days old.`;
        document.getElementById('zodiac').textContent = `Your Zodiac sign is ${getZodiacSign(birthdate)}.`;
        document.getElementById('countdown').textContent = `There are ${getDaysUntilNextBirthday(birthdate)} days until your next birthday.`;
        document.getElementById('day-of-week').textContent = `You were born on a ${getDayOfWeek(birthdate)}.`;
        document.getElementById('exact-age').textContent = `Exact age: ${exactAge.days} days, ${exactAge.hours} hours, ${exactAge.minutes} minutes, and ${exactAge.seconds} seconds`;

        document.getElementById('age-in-weeks').textContent = `You are approximately ${exactAge.weeks} weeks old.`;
        document.getElementById('leap-year').textContent = `You were born in a ${isLeapYear(birthdate) ? 'leap' : 'common'} year.`;
        document.getElementById('total-hours').textContent = `Total hours since birth: ${exactAge.totalHours} hours.`;
        document.getElementById('total-seconds').textContent = `Total seconds since birth: ${exactAge.totalSeconds} seconds.`;
    } catch (error) {
        document.getElementById('result').textContent = error.message;
    }
});

function getAge(birthdate) {
    const birthDate = new Date(birthdate);
    const today = new Date();
    
    if (birthDate > today) {
        throw new Error("Birthdate cannot be in the future.");
    }

    if (birthDate.getFullYear() < 1900) {
        throw new Error("Please enter a valid birthdate.");
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    return { years, months, days };
}

function getExactAge(birthdate) {
    const birthDate = new Date(birthdate); // Convert birthdate string to Date object
    const now = new Date(); // Get the current date and time

    let diff = now - birthDate; // Calculate the difference in milliseconds

    let totalSeconds = Math.floor(diff / 1000); // Convert milliseconds to total seconds
    let totalMinutes = Math.floor(totalSeconds / 60); // Convert total seconds to total minutes
    let totalHours = Math.floor(totalMinutes / 60); // Convert total minutes to total hours
    let totalDays = Math.floor(totalHours / 24); // Convert total hours to total days
    let totalWeeks = Math.floor(totalDays / 7); // Convert total days to total weeks

    let seconds = totalSeconds % 60; // Get remaining seconds
    let minutes = totalMinutes % 60; // Get remaining minutes
    let hours = totalHours % 24; // Get remaining hours

    return { days: totalDays, hours, minutes, seconds, weeks: totalWeeks, totalHours, totalSeconds };
}

function isLeapYear(birthdate) {
    const year = new Date(birthdate).getFullYear();
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDayOfWeek(birthdate) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const birthDate = new Date(birthdate);
    return daysOfWeek[birthDate.getDay()];
}

function getZodiacSign(birthdate) {
    const birthDate = new Date(birthdate);
    const day = birthDate.getDate();
    const month = birthDate.getMonth() + 1;

    const zodiacSigns = {
        'capricorn': (month == 1 && day <= 19) || (month == 12 && day >= 22),
        'aquarius': (month == 1 && day >= 20) || (month == 2 && day <= 18),
        'pisces': (month == 2 && day >= 19) || (month == 3 && day <= 20),
        'aries': (month == 3 && day >= 21) || (month == 4 && day <= 19),
        'taurus': (month == 4 && day >= 20) || (month == 5 && day <= 20),
        'gemini': (month == 5 && day >= 21) || (month == 6 && day <= 20),
        'cancer': (month == 6 && day >= 21) || (month == 7 && day <= 22),
        'leo': (month == 7 && day >= 23) || (month == 8 && day <= 22),
        'virgo': (month == 8 && day >= 23) || (month == 9 && day <= 22),
        'libra': (month == 9 && day >= 23) || (month == 10 && day <= 22),
        'scorpio': (month == 10 && day >= 23) || (month == 11 && day <= 21),
        'sagittarius': (month == 11 && day >= 22) || (month == 12 && day <= 21),
    };

    for (const sign in zodiacSigns) {
        if (zodiacSigns[sign]) return sign.charAt(0).toUpperCase() + sign.slice(1);
    }

    return "Unknown";
}

function getDaysUntilNextBirthday(birthdate) {
    const birthDate = new Date(birthdate);
    const today = new Date();
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

    if (today > nextBirthday) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    const diffTime = Math.abs(nextBirthday - today);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
