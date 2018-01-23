const API_URL = '/beers';

// retrieves beer information for home page

function retrieveMainPageBeer(callback) {
  $.getJSON(API_URL, callback)
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
  $.getJSON(API_URL + `/beer/${searchTerm}`, callback);
}

function displayBeerInformation(data) {
  $('.result').append(
    `<div>
      <h2 class='search-beer-name'>${data.beerName}</h2>
      <p class='search-beer-type'>${data.beerType}</p>
      <p><span class='search-brewery-name'>${data.breweryName}</span> - <span class='search-brewery-location'>${data.breweryLocation}</span></p>
      <p>ABV: <span class='search-beer-abv'>${data.beerABV}</span></p>
      <p>IBU: <span class='search-beer-ibu'>${data.beerIBU}</span></p>
      <p>Availability: <span class='search-beer-availability'>${data.beerAvailability}</span></p>
      <p>Notes: <span class='search-beer-notes'>${data.beerNotes}</span></p>
      <p hidden>ID: <span class='search-beer-id'>${data.id}</span></p>
      <button class="edit-button">Edit</button>
      <button class="delete-button">Delete</button>
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
  const queryTargetBeerABV = $(event.currentTarget).find('#beer-abv');
  const queryTargetBeerIBU = $(event.currentTarget).find('#beer-ibu');
  const queryTargetBeerAvailability = $(event.currentTarget).find('#beer-availability');
  const queryTargetBeerNotes = $(event.currentTarget).find('#beer-notes');

  const queryTermBeerName = (queryTargetBeerName.val());
  const queryTermBeerType = (queryTargetBeerType.val());
  const queryTermBreweryName = (queryTargetBreweryName.val());
  const queryTermBreweryCity = (queryTargetBreweryCity.val());
  const queryTermBreweryState = (queryTargetBreweryState.val());
  const queryTermBeerABV = (queryTargetBeerABV.val());
  const queryTermBeerIBU = (queryTargetBeerIBU.val());
  const queryTermBeerAvailability = (queryTargetBeerAvailability.val());
  const queryTermBeerNotes = (queryTargetBeerNotes.val());

  const objectPost = {
    "beerName": queryTermBeerName,
    "beerType": queryTermBeerType,
    "breweryName": queryTermBreweryName,
    "breweryLocation": {
      "city": queryTermBreweryCity,
      "state": queryTermBreweryState
    },
    "beerABV": queryTermBeerABV,
    "beerIBU": queryTermBeerIBU,
    "beerAvailability": queryTermBeerAvailability,
    "beerNotes": queryTermBeerNotes
  };

  $.ajax({
    type: "POST",
    url: API_URL,
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
  queryTargetBeerABV.val("");
  queryTargetBeerIBU.val("");
  queryTargetBeerAvailability.val("");
  queryTargetBeerNotes.val("");

  alert("Beer Added!")
});

// event listener to delete beer item

function retrieveJsonAndDelete(searchTerm, callback) {
  $.getJSON(API_URL + `/${searchTerm}`, callback);
}

function deleteBeer(data) {
  $.ajax({
    type: "DELETE",
    url: API_URL + `/${data.id}`,
  });
}

$('.result').on('click', '.delete-button', function(event) {
  event.preventDefault();

  const queryTargetBeerName = $('.search-beer-name').html();

  retrieveJsonAndDelete(queryTargetBeerName, deleteBeer);

  alert("Beer Deleted!")
});

// event listener to edit beer item

$('.result').on('click', '.edit-button', function(event) {
  event.preventDefault();

  const queryTargetBeerName = $('.search-beer-name').html();
  const queryTargetBeerType = $('.search-beer-type').html();
  const queryTargetBreweryName = $('.search-brewery-name').html();
  const queryTargetBreweryCity = $('.search-brewery-location').html().split(',')[0];
  const queryTargetBreweryState = $('.search-brewery-location').html().split(',')[1].trim();
  const queryTargetBeerABV = $('.search-beer-abv').html();
  const queryTargetBeerIBU = $('.search-beer-ibu').html();
  const queryTargetBeerAvailability = $('.search-beer-availability').html();
  const queryTargetBeerNotes = $('.search-beer-notes').html();
  const queryTargetBeerId = $('.search-beer-id').html();

  console.log(queryTargetBeerNotes);

  $('.result').html(
    `<div>
      <form class="edit-beer-form">
        <input type="text" id="edit-beer-name" value="${queryTargetBeerName}" required><br>
        <input type="text" id="edit-beer-type" value="${queryTargetBeerType}" required><br>
        <input type="text" id="edit-brewery-name" value="${queryTargetBreweryName}" required><br>
        <input type="text" id="edit-brewery-city" value="${queryTargetBreweryCity}" required><br>
        <input type="text" id="edit-brewery-state" value="${queryTargetBreweryState}" required><br>
        <input type="text" id="edit-beer-abv" value="${queryTargetBeerABV}"><br>
        <input type="text" id="edit-beer-ibu" value="${queryTargetBeerIBU}"><br>
        <input type="text" id="edit-beer-availability" value="${queryTargetBeerAvailability}"><br>
        <textarea id="edit-beer-notes">${queryTargetBeerNotes}</textarea><br>
        <input type="text" id="edit-beer-id" value="${queryTargetBeerId}" hidden><br>
        <button type="submit" class='edit-beer-form-submit'>Submit</button>
      </form>
    </div>`
  );
});

$('.result').on('click', '.edit-beer-form-submit', function(event) {
  event.preventDefault();

  const queryTargetBeerName = $('#edit-beer-name').val();

  const queryTermBeerName = $('#edit-beer-name').val();
  const queryTermBeerType = $('#edit-beer-type').val();
  const queryTermBreweryName = $('#edit-brewery-name').val();
  const queryTermBreweryCity = $('#edit-brewery-city').val();
  const queryTermBreweryState = $('#edit-brewery-state').val();
  const queryTermBeerABV = $('#edit-beer-abv').val();
  const queryTermBeerIBU = $('#edit-beer-ibu').val();
  const queryTermBeerAvailability = $('#edit-beer-availability').val();
  const queryTermBeerNotes = $('#edit-beer-notes').val();
  const queryTermBeerId = $('#edit-beer-id').val();

  const objectPost = {
    "id": queryTermBeerId,
    "beerName": queryTermBeerName,
    "beerType": queryTermBeerType,
    "breweryName": queryTermBreweryName,
    "breweryLocation": {
      "city": queryTermBreweryCity,
      "state": queryTermBreweryState
    },
    "beerABV": queryTermBeerABV,
    "beerIBU": queryTermBeerIBU,
    "beerAvailability": queryTermBeerAvailability,
    "beerNotes": queryTermBeerNotes
  };

  $.ajax({
    type: "PUT",
    url: API_URL + `/${queryTermBeerId}`,
    data: JSON.stringify(objectPost),
    error: function(e) {
      console.log(e);
    },
    dataType: "json",
    contentType: "application/json"
  });

  alert("Beer Updated!")
});
