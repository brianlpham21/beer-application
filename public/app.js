const DATABASE = 'https://stark-woodland-22950.herokuapp.com/beers';

// retrieves beer information for home page

function retrieveMainPageBeer(callback) {
  $.getJSON(DATABASE, callback)
}

function displayMainPageBeer(data) {
  for (index in data.beers) {
    $('.selections').append(
      `<div>
        <h2>${data.beers[index].beerName}</h2>
        <p>${data.beers[index].beerType}</p>
        <p>${data.beers[index].breweryName} - ${data.beers[index].breweryLocation}</p>
      </div>`
    )
  }
}

$(retrieveMainPageBeer(displayMainPageBeer));

// event listener for beer name find submit

$('.search').on('submit', function(event) {
  event.preventDefault();

  const queryTarget = $(event.currentTarget).find('input');
  const queryTerm = (queryTarget.val());

  retrieveJSON(queryTerm, displayBeerInformation);

  queryTarget.val("");
});

function retrieveJSON(searchTerm, callback) {
  $.getJSON(DATABASE + `/${searchTerm}`, callback);
}

function displayBeerInformation(data) {
  $('.result').html(
    `<div>
      <h2>${data.beerName}</h2>
      <p>${data.beerType}</p>
      <p>${data.breweryName} - ${data.breweryLocation}</p>
      <button>Edit</button>
      <button>Delete</button>
    </div>`
  )
}

// event listener for adding beer submit

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

  queryTargetBeerName.val("");
  queryTargetBeerType.val("");
  queryTargetBreweryName.val("");
  queryTargetBreweryCity.val("");
  queryTargetBreweryState.val("");
});
