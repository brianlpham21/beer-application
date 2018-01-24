const API_URL = '/beers';

function retrieveAllBeerJSON(callback) {
  $.getJSON(API_URL, callback);
}

function retrieveSelectBeerJSON(beerSearchName, callback) {
  $.getJSON(API_URL + `/beername/${beerSearchName}`, callback);
}

function retrieveSelectIdJSON(beerId, callback) {
  $.getJSON(API_URL + `/${beerId}`, callback);
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

function displaySearchedBeerInformation(data) {
  const allVariables = [data.beerName, data.beerType, data.breweryName, data.breweryLocation, data.beerABV, data.beerIBU, data.beerAvailability, data.beerNotes, data.id];

  for (index in allVariables) {
    if (allVariables[index] === null || allVariables[index] === undefined) {
      allVariables[index] = "";
    };
  };

  $('.result').html(
    `<div>
      <h2 class='search-beer-name'>${allVariables[0]}</h2>
      <p class='search-beer-type'>${allVariables[1]}</p>
      <p><span class='search-brewery-name'>${allVariables[2]}</span> - <span class='search-brewery-location'>${allVariables[3]}</span></p>
      <p>ABV: <span class='search-beer-abv'>${allVariables[4]}</span></p>
      <p>IBU: <span class='search-beer-ibu'>${allVariables[5]}</span></p>
      <p>Availability: <span class='search-beer-availability'>${allVariables[6]}</span></p>
      <p>Notes: <span class='search-beer-notes'>${allVariables[7]}</span></p>
      <p hidden>ID: <span class='search-beer-id'>${allVariables[8]}</span></p>
      <button class="edit-button">Edit</button>
      <button class="delete-button">Delete</button>
    </div>`
  )
}

$(retrieveAllBeerJSON(displayMainPageBeer));

function watchSearchSubmit() {
  $('.search').on('submit', function(event) {
    event.preventDefault();

    const searchTarget = $(event.currentTarget).find('input');
    const searchTerm = (searchTarget.val());

    if (searchTerm === "") {
      $('.result').html(`Please Enter Something into the Field.`);
      return;
    }

    const searchTermFinal = searchTerm.split(' ').map(word => word[0].toUpperCase() + word.substr(1).toLowerCase()).join(' ');

    retrieveSelectBeerJSON(searchTermFinal, displaySearchedBeerInformation);

    searchTarget.val("");
  });
}

function watchAddFormSubmit() {
  $('.add-form').on('submit', function(event) {
    event.preventDefault();

    const addBeerNameValue = $(event.currentTarget).find('#beer-name').val();
    const addBeerTypeValue = $(event.currentTarget).find('#beer-type').val();
    const addBreweryNameValue = $(event.currentTarget).find('#brewery-name').val();
    const addBreweryCityValue = $(event.currentTarget).find('#brewery-city').val();
    const addBreweryStateValue = $(event.currentTarget).find('#brewery-state').val();
    const addBeerABVValue = $(event.currentTarget).find('#beer-abv').val();
    const addBeerIBUValue = $(event.currentTarget).find('#beer-ibu').val();
    const addBeerAvailabilityValue = $(event.currentTarget).find('#beer-availability').val();
    const addBeerNotesValue = $(event.currentTarget).find('#beer-notes').val();

    const objectPost = {
      "beerName": addBeerNameValue,
      "beerType": addBeerTypeValue,
      "breweryName": addBreweryNameValue,
      "breweryLocation": {
        "city": addBreweryCityValue,
        "state": addBreweryStateValue
      },
      "beerABV": addBeerABVValue,
      "beerIBU": addBeerIBUValue,
      "beerAvailability": addBeerAvailabilityValue,
      "beerNotes": addBeerNotesValue
    };

    $.ajax({
      type: "POST",
      url: API_URL,
      data: JSON.stringify(objectPost),
      error: function(e) {
        console.log(e);
        alert('Beer Not Added!')
      },
      dataType: "json",
      contentType: "application/json",
      success: function() {
        alert("Beer Added!");
        document.location.href = '/'
      }
    });

  });
}

function watchAddFormCancel() {
  $('.add-form').on('click', '.add-form-cancel', function(event) {
    event.preventDefault();
    document.location.href = '/';
  });
}

function watchEditButtonClick() {
  $('.result').on('click', '.edit-button', function(event) {
    event.preventDefault();

    const searchToEditBeerName = $('.search-beer-name').html();
    const searchToEditBeerType = $('.search-beer-type').html();
    const searchToEditBreweryName = $('.search-brewery-name').html();
    const searchToEditBreweryCity = $('.search-brewery-location').html().split(',')[0];
    const searchToEditBreweryState = $('.search-brewery-location').html().split(',')[1].trim();
    const searchToEditBeerABV = $('.search-beer-abv').html();
    const searchToEditBeerIBU = $('.search-beer-ibu').html();
    const searchToEditBeerAvailability = $('.search-beer-availability').html();
    const searchToEditBeerNotes = $('.search-beer-notes').html();
    const searchToEditBeerId = $('.search-beer-id').html();

    const allVariables = [searchToEditBeerName, searchToEditBeerType, searchToEditBreweryName, searchToEditBreweryCity, searchToEditBreweryState, searchToEditBeerABV, searchToEditBeerIBU, searchToEditBeerAvailability, searchToEditBeerNotes, searchToEditBeerId];

    for (index in allVariables) {
      if (allVariables[index] === "null") {
        allVariables[index] = "";
      };
    };

    $('.result').html(
      `
        <form class="edit-form">
          <input type="text" id="edit-beer-name" placeholder="Beer Name" value="${allVariables[0]}" required><br>
          <input type="text" id="edit-beer-type" placeholder="Beer Type" value="${allVariables[1]}" required><br>
          <input type="text" id="edit-brewery-name" placeholder="Brewery Name" value="${allVariables[2]}" required><br>
          <input type="text" id="edit-brewery-city" placeholder="Brewery Location - City" value="${allVariables[3]}" required><br>
          <input type="text" id="edit-brewery-state" placeholder="Brewery Location - State" value="${allVariables[4]}" required><br>
          <input type="text" id="edit-beer-abv" placeholder="Beer ABV" value="${allVariables[5]}"><br>
          <input type="text" id="edit-beer-ibu" placeholder="Beer IBU" value="${allVariables[6]}"><br>
          <input type="text" id="edit-beer-availability" placeholder="Beer Availability" value="${allVariables[7]}"><br>
          <textarea placeholder="Beer Notes" id="edit-beer-notes">${allVariables[8]}</textarea><br>
          <input type="text" id="edit-beer-id" value="${allVariables[9]}" hidden><br>
          <button type="submit" class='edit-form-submit'>Submit</button>
          <button class='edit-form-cancel'>Cancel</button>
        </form>
      </div>`
    );
  });
}

function watchEditFormSubmit() {
  $('.result').on('click', '.edit-form-submit', function(event) {
    event.preventDefault();

    const editBeerNameValue = $('#edit-beer-name').val();
    const editBeerTypeValue = $('#edit-beer-type').val();
    const editBreweryNameValue = $('#edit-brewery-name').val();
    const editBreweryCityValue = $('#edit-brewery-city').val();
    const editBreweryStateValue = $('#edit-brewery-state').val();
    const editBeerABVValue = $('#edit-beer-abv').val();
    const editBeerIBUValue = $('#edit-beer-ibu').val();
    const editBeerAvailabilityValue = $('#edit-beer-availability').val();
    const editBeerNotesValue = $('#edit-beer-notes').val();
    const editBeerIdValue = $('#edit-beer-id').val();

    const objectPost = {
      "id": editBeerIdValue,
      "beerName": editBeerNameValue,
      "beerType": editBeerTypeValue,
      "breweryName": editBreweryNameValue,
      "breweryLocation": {
        "city": editBreweryCityValue,
        "state": editBreweryStateValue
      },
      "beerABV": editBeerABVValue,
      "beerIBU": editBeerIBUValue,
      "beerAvailability": editBeerAvailabilityValue,
      "beerNotes": editBeerNotesValue
    };

    $.ajax({
      type: "PUT",
      url: API_URL + `/${editBeerIdValue}`,
      data: JSON.stringify(objectPost),
      error: function(e) {
        console.log(e);
      },
      dataType: "json",
      contentType: "application/json"
    });

    alert("Beer Updated!")
    location.reload();
  });
}

function watchEditFormCancel() {
  $('.result').on('click', '.edit-form-cancel', function(event) {
    event.preventDefault();

    const editBeerIdValue = $('#edit-beer-id').val();

    retrieveSelectIdJSON(editBeerIdValue, displaySearchedBeerInformation);
  });
}

function watchDeleteButtonClick() {
  $('.result').on('click', '.delete-button', function(event) {
    event.preventDefault();

    const deleteTargetBeerId = $('.search-beer-id').html();

    $.ajax({
      type: "DELETE",
      url: API_URL + `/${deleteTargetBeerId}`,
    });

    alert("Beer Deleted!")
    location.reload();
  });
}

function addEventListeners() {
  watchSearchSubmit();
  watchAddFormSubmit();
  watchAddFormCancel();
  watchEditButtonClick();
  watchEditFormSubmit();
  watchEditFormCancel();
  watchDeleteButtonClick();
}

$(addEventListeners);
