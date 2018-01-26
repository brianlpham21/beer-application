const API_URL = '/beers';

//functions

function retrieveAllBeerJSON(callback) {
  $.getJSON(API_URL, callback);
}

function retrieveSelectBeerJSON(beerSearchName, callback) {
  $.getJSON(API_URL + `/beername/${beerSearchName}`, callback);
}

function retrieveSelectIdJSON(beerId, callback) {
  $.getJSON(API_URL + `/${beerId}`, callback);
}

function retrieveSelectBeerTypeJSON(beerType, callback) {
  $.getJSON(API_URL + `/beertype/${beerType}`, callback);
}

function retrieveSelectBreweryNameJSON(breweryName, callback) {
  $.getJSON(API_URL + `/breweryname/${breweryName}`, callback);
}

function displayMainPageBeer(data) {
  $('.error').html('');
  if ($('.cards').is(':empty')) {
    $('.search-result').html('');

    for (index in data.beers) {
      if (data.beers[index].beerURL === undefined || data.beers[index].beerURL === "") {
        data.beers[index].beerURL = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
      };

      $('.cards').append(
        `<article class="card beer-selection-result-name">
          <a href="#">
            <figure class="thumbnail">
            <img src="${data.beers[index].beerURL}" alt="beer-photo" class="beer-photo">
            </figure>
            <div class="card-content">
              <h2 class="card-content-beer-name">${data.beers[index].beerName}</h2>
              <p>${data.beers[index].beerType}</p>
              <p>${data.beers[index].breweryName}</p>
              <p>${data.beers[index].breweryLocation}</p>
            </div>
          </a>
        </article>`
      );
    }
  }
  else if ($('.search-result').html() !== "") {
    $('.search-result').html('');
    $('.cards').html('');

    for (index in data.beers) {
      if (data.beers[index].beerURL === undefined || data.beers[index].beerURL === "") {
        data.beers[index].beerURL = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
      };

      $('.cards').append(
        `<article class="card beer-selection-result-name">
          <a href="#">
            <figure class="thumbnail">
            <img src="${data.beers[index].beerURL}" alt="beer-photo" class="beer-photo">
            </figure>
            <div class="card-content">
              <h2 class="card-content-beer-name">${data.beers[index].beerName}</h2>
              <p>${data.beers[index].beerType}</p>
              <p>${data.beers[index].breweryName}</p>
              <p>${data.beers[index].breweryLocation}</p>
            </div>
          </a>
        </article>`
      )
    }
  }
}

function displayLikeBeers(data) {
  for (index in data.beers) {
    $('.cards').append(
      `<div class="beer-selection-result">
        <h2 class="beer-additional-selection-result-name">${data.beers[index].beerName}</h2>
        <p>${data.beers[index].beerType}</p>
        <p>${data.beers[index].breweryName}</p>
        <p>${data.beers[index].breweryLocation}</p>
      </div>`
    );
  }
}

function displayBreweryBeers(data) {
  for (index in data.beers) {
    $('.cards').append(
      `<div class="beer-selection-result">
        <h2 class="beer-additional-selection-result-name">${data.beers[index].beerName}</h2>
        <p>${data.beers[index].beerType}</p>
        <p>${data.beers[index].breweryName}</p>
        <p>${data.beers[index].breweryLocation}</p>
      </div>`
    );
  }
}

function watchAdditionalSelects() {
  $('.cards').on('click', '.beer-additional-selection-result-name', function(event) {
    const beerName = $(event.currentTarget).html();

    retrieveSelectBeerJSON(beerName, displaySearchedBeerInformation);
  })
}

function displaySearchedBeerInformation(data) {
  const allVariables = [data.beerName, data.beerType, data.breweryName, data.breweryLocation, data.beerABV, data.beerIBU, data.beerAvailability, data.beerNotes, data.id, data.beerURL];

  for (index in allVariables) {
    if (allVariables[index] === null || allVariables[index] === undefined) {
      allVariables[index] = "";
    };
  };

  if (data.beerURL === undefined || data.beerURL === "") {
    allVariables[9] = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
  };

  $('.cards').html('');
  $('.search-result').html(
    `<div class="beer-search-result">
      <img src="${allVariables[9]}"" alt="beer-photo" class='search-beer-url'>
      <div class="beer-search-result-text">
        <h2 class='search-beer-name'>${allVariables[0]}</h2>
        <p class='search-beer-type'>${allVariables[1]}</p>
        <p><span class='search-brewery-name'>${allVariables[2]}</span> - <span class='search-brewery-location'>${allVariables[3]}</span></p>
        <p><strong>ABV:</strong> <span class='search-beer-abv'>${allVariables[4]}</span></p>
        <p><strong>IBU:</strong> <span class='search-beer-ibu'>${allVariables[5]}</span></p>
        <p><strong>Availability:</strong> <span class='search-beer-availability'>${allVariables[6]}</span></p>
        <p><strong>Notes:</strong> <span class='search-beer-notes'>${allVariables[7]}</span></p>
        <p hidden>ID: <span class='search-beer-id'>${allVariables[8]}</span></p>
        <button class="edit-button">Edit</button>
        <button class="delete-button">Delete</button>
      </div>
    </div>`
  );

  // retrieveSelectBeerTypeJSON(data.beerType, displayLikeBeers);
  // retrieveSelectBreweryNameJSON(data.breweryName, displayBreweryBeers);
}

function watchBrowseBeersButtonClick() {
  $('#browse-beers-button').on('click', function(event) {
    retrieveAllBeerJSON(displayMainPageBeer);
  });
}

function watchSearchSubmit() {
  $('.search').on('submit', function(event) {
    event.preventDefault();

    const searchTarget = $(event.currentTarget).find('input');
    const searchTerm = (searchTarget.val());

    $('.search-result').html('');
    $('.cards').html('');
    $('.error').html('');

    if (searchTerm === "") {
      $('.error').html(`
        <h1>Please Enter Something into the Field.</h1>
        `);
      return;
    }

    const searchTermFinal = searchTerm.split(' ').map(word => word[0].toUpperCase() + word.substr(1).toLowerCase()).join(' ');

    retrieveSelectBeerJSON(searchTermFinal, displaySearchedBeerInformation);

    searchTarget.val("");
  });
}

function watchSelectionSelect() {
  $('.cards').on('click', '.beer-selection-result-name', function(event) {
    const beerName = $(event.currentTarget).find('.card-content-beer-name').html();

    retrieveSelectBeerJSON(beerName, displaySearchedBeerInformation);
  })
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
    const addBeerURLValue = $(event.currentTarget).find('#beer-url').val();

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
      "beerNotes": addBeerNotesValue,
      "beerURL": addBeerURLValue
    };

    $.ajax({
      type: "POST",
      url: API_URL,
      data: JSON.stringify(objectPost),
      error: function(e) {
        console.log(e);
        alert('Beer Not Added! Beer Name Already in Database!')
      },
      dataType: "json",
      contentType: "application/json",
      success: function() {
        alert("Beer Added!");
        document.location.href = `/#${addBeerNameValue}`;
      }
    });

  });
}

function watchAddedBeer() {
  if (window.location.hash) {
    displayAddedBeer(window.location.hash.substr(1));
    history.pushState("", document.title, window.location.pathname);
  }
}

function displayAddedBeer(beerName) {
  retrieveSelectBeerJSON(beerName, displaySearchedBeerInformation);
}

function watchAddFormCancel() {
  $('.add-form').on('click', '.add-form-cancel', function(event) {
    event.preventDefault();

    document.location.href = '/';
  });
}

function watchEditButtonClick() {
  $('.search-result').on('click', '.edit-button', function(event) {
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
    const searchToEditBeerURL = $('.search-beer-url').attr('src');

    const allVariables = [searchToEditBeerName, searchToEditBeerType, searchToEditBreweryName, searchToEditBreweryCity, searchToEditBreweryState, searchToEditBeerABV, searchToEditBeerIBU, searchToEditBeerAvailability, searchToEditBeerNotes, searchToEditBeerId, searchToEditBeerURL];

    for (index in allVariables) {
      if (allVariables[index] === "null" || allVariables[index] === "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg" || allVariables[index] === undefined) {
        allVariables[index] = "";
      };
    };

    $('.search-result').html(
      `<div>
        <h2>Beer Edit Form</h2>
        <form class="edit-form">
          <input type="text" id="edit-beer-name" placeholder="Beer Name" value="${allVariables[0]}" required><br>
          <input type="text" id="edit-beer-type" placeholder="Beer Type" value="${allVariables[1]}" required><br>
          <input type="text" id="edit-brewery-name" placeholder="Brewery Name" value="${allVariables[2]}" required><br>
          <input type="text" id="edit-brewery-city" placeholder="Brewery Location - City" value="${allVariables[3]}" required><br>
          <input type="text" id="edit-brewery-state" placeholder="Brewery Location - State" value="${allVariables[4]}" required><br>
          <input type="text" id="edit-beer-abv" placeholder="Beer ABV" value="${allVariables[5]}"><br>
          <input type="text" id="edit-beer-ibu" placeholder="Beer IBU" value="${allVariables[6]}"><br>
          <input type="text" id="edit-beer-availability" placeholder="Beer Availability" value="${allVariables[7]}"><br>
          <textarea placeholder="Beer Notes" id="edit-beer-notes" rows="5">${allVariables[8]}</textarea><br>
          <input type="text" id="edit-beer-url" placeholder="Beer Image URL" value="${allVariables[10]}"><br>
          <input type="text" id="edit-beer-id" value="${allVariables[9]}" hidden><br>
          <button type="submit" class='edit-form-submit'>Submit</button>
          <button class='edit-form-cancel'>Cancel</button>
        </form>
      </div>`
    );
  });
}

function watchEditFormSubmit() {
  $('.search-result').on('click', '.edit-form-submit', function(event) {
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
    const editBeerURLValue = $('#edit-beer-url').val();

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
      "beerNotes": editBeerNotesValue,
      "beerURL": editBeerURLValue
    };

    $.ajax({
      type: "PUT",
      url: API_URL + `/${editBeerIdValue}`,
      data: JSON.stringify(objectPost),
      error: function(e) {
        console.log(e);
        alert('Beer Not Added! Beer Name Already in Database!')
      },
      dataType: "json",
      contentType: "application/json",
      success: function() {
        alert("Beer Update!");
        displayEditedBeer(editBeerNameValue);
      }
    });

  });
}

function displayEditedBeer(beerName) {
  retrieveSelectBeerJSON(beerName, displaySearchedBeerInformation);
}

function watchEditFormCancel() {
  $('.search-result').on('click', '.edit-form-cancel', function(event) {
    event.preventDefault();

    const editBeerIdValue = $('#edit-beer-id').val();

    retrieveSelectIdJSON(editBeerIdValue, displaySearchedBeerInformation);
  });
}

function watchDeleteButtonClick() {
  $('.search-result').on('click', '.delete-button', function(event) {
    event.preventDefault();

    const deleteTargetBeerId = $('.search-beer-id').html();
    const deleteTargetBeerName = $('.search-beer-name').html()

    let status = confirm("Are you sure you would like to delete this beer?");

    if (status === true) {
      $.ajax({
        type: "DELETE",
        url: API_URL + `/${deleteTargetBeerId}`,
      });

      alert("Beer Deleted!")

      displayDeletedBeer(deleteTargetBeerName);
    }
  });
}

function displayDeletedBeer(beerName) {
  $('.search-result').html(`${beerName} has been deleted!`)
}

function watchLogo() {
  $('#logo').on('click', function() {
    location.reload();
  });
}

function addEventListeners() {
  watchBrowseBeersButtonClick();
  watchSearchSubmit();
  watchSelectionSelect();
  watchAdditionalSelects();
  watchAddFormSubmit();
  watchAddFormCancel();
  watchAddedBeer();
  watchEditButtonClick();
  watchEditFormSubmit();
  watchEditFormCancel();
  watchDeleteButtonClick();
  watchLogo();
}

$(addEventListeners);
