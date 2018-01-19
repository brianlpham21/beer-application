const DATABASE = 'https://stark-woodland-22950.herokuapp.com/beers';

function getAllBeer(callback) {
  $.getJSON(DATABASE, callback);
}

function displayBeerInformation(data) {
  console.log(data);
  for(index in data.beers) {
    if(data.beers[index].beerName === "Sculpin") {
      console.log('yes!');
    };
    $('body').append(
      `
      <div>
        <h2>${data.beers[index].beerName}</h2>
        <p>${data.beers[index].beerType}</p>
        <p>${data.beers[index].breweryName} - ${data.beers[index].breweryLocation}</p>
      </div>
      `
    );
  }
}

function getAndDisplayBeerInformation(searchTerm) {
  getAllBeer(displayBeerInformation);
}

$('.search').on('submit', function(event) {
  event.preventDefault();

  const queryTarget = $(event.currentTarget).find('input');
  const queryTerm = (queryTarget.val());
  console.log(queryTerm);

  getAndDisplayBeerInformation();

  queryTarget.val("");
});

$('.add-beer-form').on('submit', function(event) {
  event.preventDefault();

  const queryTargetBeerName = $(event.currentTarget).find('#beer-name');
  const queryTargetBeerType = $(event.currentTarget).find('#beer-type');
  const queryTargetBreweryName = $(event.currentTarget).find('#brewery-name');
  const queryTargetBreweryCity = $(event.currentTarget).find('#brewery-city');
  const queryTargetBreweryState = $(event.currentTarget).find('#brewery-state');

  const queryTermBeerName = (queryTargetBeerName.val());
  const queryTermBeerType = (queryTargetBeerType.val());
  const queryTermBreweryName = (queryTargetBreweryName.val());
  const queryTermBreweryCity = (queryTargetBreweryCity.val());
  const queryTermBreweryState = (queryTargetBreweryState.val());

  const objectPost = {
    "beerName": queryTermBeerName,
    "beerType": queryTermBeerType,
    "breweryName": queryTermBreweryName,
    "breweryLocation": {
      "city": queryTermBreweryCity,
      "state": queryTermBreweryState
    }
  };
  console.log(objectPost);

  $.ajax({
    type: "POST",
    url: DATABASE,
    data: JSON.stringify(objectPost),
    error: function(e) {
      console.log(e);
    },
    dataType: "json",
    contentType: "application/json"
  });

  // $.post(DATABASE, JSON.stringify(objectPost), function(e) {console.log(e);}, "json");

  queryTargetBeerName.val("");
  queryTargetBeerType.val("");
  queryTargetBreweryName.val("");
  queryTargetBreweryCity.val("");
  queryTargetBreweryState.val("");
});
