let city=""; 
let url="";
let APIkey="";
let queryUrl ="";
let currentUrl = "";
let citiesDiv = document.getElementById("searched-cities-container");
let cities = []; 
initial(); 
listClicker(); 
searchClicker(); 

function initial(){
    let savedCities = JSON.parse(localStorage.getItem("cities"));

    if (saveCities !== null){
        cities = savedCities
    }   
    renderButtons(); 
}

function renderButtons(){
    citiesDiv.innerHTML = ""; 
    if(cities == null){
        return;
    }
    let uniqueCities = [...new Set(cities)];
    for(let i=0; i < uniqueCities.length; i++){
        let cityName = uniqueCities[i]; 

        let buttonEl = document.createElement("button");
        buttonEl.textContent = cityName; 
        buttonEl.setAttribute("class", "listButton"); 

        citiesDiv.appendChild(buttonEl);
        listClicker();
      }
    }

function storeCities(){
    localStorage.setItem("cities", JSON.stringify(cities)); 
}


function listClicker(){
$(".listButton").on("click", function(event){
    event.preventDefault();
    city = $(this).text().trim();
    APIcalls(); 
})
}


function searchClicker() {
$("#searchButton").on("click", function(event){
    event.preventDefault();
    city = $(this).prev().val().trim()
    
    
    cities.push(city);
    if(cities.length > 8){
        cities.shift()
    }
    if (city == ""){
        return; 
    }
    APIcalls();
    storeCities(); 
    renderButtons();
})
}

function APIcalls(){
    
    url = "https://api.openweathermap.org/data/2.5/forecast?q=";    
    currentUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
    APIkey = "&appid=7df238c4ef760a31797f63b196af2539";
    queryUrl = url + city + APIkey;
    currentWeatherUrl = currentUrl + city + APIkey; 
    
    $("#name-of-city").text("Current Weather in " + city);
    $.ajax({
        url: queryUrl,
        method: "GET",
        
    }).then(function(response){
        let dayNumber = 0; 
        

        for(let i=0; i< response.list.length; i++){
            if(response.list[i].dt_txt.split(" ")[1] == "15:00:00")
            {
                let day = response.list[i].dt_txt.split("-")[2].split(" ")[0];
                let month = response.list[i].dt_txt.split("-")[1];
                let year = response.list[i].dt_txt.split("-")[0];
                $("#" + dayNumber + "date").text(month + "/" + day + "/" + year); 
                let temp = Math.round(((response.list[i].main.temp - 273.15) *9/5+32));
                $("#" + dayNumber + "five-day-temp").text("Temp: " + temp + String.fromCharCode(176)+"F");
                $("#" + dayNumber + "five-day-humidity").text("Humidity: " + response.list[i].main.humidity);
                $("#" + dayNumber + "five-day-icon").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                dayNumber++; 
                        }   
        }
    });

     $.ajax({
         url:currentWeatherUrl,
         method: "GET", 
     }).then(function(currentData){
         let temp = Math.round(((currentData.main.temp - 273.15) * 9/5 + 32))
         $("#today-temp").text("Temperature: " + temp + String.fromCharCode(176)+"F");
         $("#today-humidity").text("Humidity: " + currentData.main.humidity);
         $("#today-wind-speed").text("Wind Speed: " + currentData.wind.speed);
         $("#today-icon-div").attr({"src": "http://openweathermap.org/img/w/" + currentData.weather[0].icon + ".png",
          "height": "100px", "width":"100px"});
     })
}