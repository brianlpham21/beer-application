const API_URL = '/beers';

function retrieveSelectBeerJSON(beerSearchObject, callback) {
  let requestURL = API_URL;

  if (beerSearchObject.beerName) {
    requestURL = requestURL + `?beerName=${beerSearchObject.beerName}`
  }

  $.getJSON(requestURL, callback)
}

function watchBrowseBeersButtonClick() {
  $('.browse-button, .enter-button').on('click', function(event) {
    $('.home-button, .about-button').removeClass('current');
    $('.browse-button').addClass('current');
    $('.main-footer').addClass('hidden');

    retrieveSelectBeerJSON({}, displayMainPageBeer);
  });
}

function displayMainPageBeer(data) {
  $('header').addClass('hidden');
  $('.beers-header').removeClass('hidden');

  if ($('.cards').is(':empty')) {
    $('.search-result').html('');

    displayHtmlForMainPageBeer(data);
  }
  else if ($('.search-result').html() !== "") {
    $('.search-result').html('');
    $('.cards').html('');

    displayHtmlForMainPageBeer(data)
  }
}

function displayHtmlForMainPageBeer(data) {
  for (index in data.beers) {
    const Beer = {
      beerName: data.beers[index].beerName || '',
      beerType: data.beers[index].beerType || '',
      breweryName: data.beers[index].breweryName || '',
      breweryLocation: data.beers[index].breweryLocation || '',
      beerABV: data.beers[index].beerABV || '',
      beerIBU: data.beers[index].beerIBU || '',
      beerAvailability: data.beers[index].beerAvailability || '',
      beerNotes: data.beers[index].beerNotes || '',
      id: data.beers[index].id || '',
      beerURL: data.beers[index].beerURL || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
    }

    $('.cards').append(
      `<article class="card beer-selection-result-name">
        <a href="#">
          <figure class="thumbnail">
          <img src="${Beer.beerURL}" alt="beer-photo" class="beer-photo">
          </figure>
          <div class="card-content">
            <h2 class="card-content-beer-name">${Beer.beerName}</h2>
            <p>${Beer.beerType}</p>
            <p>${Beer.breweryName}</p>
            <p>${Beer.breweryLocation}</p>
          </div>
        </a>
      </article>`
    );
  }
}

function watchSearchSubmit() {
  $('.search').on('submit', function(event) {
    event.preventDefault();

    const searchTarget = $(event.currentTarget).find('input');
    const searchTerm = (searchTarget.val());

    $('.main-footer').removeClass('hidden');
    $('.search-result, .cards').html('');
    $('header, .beers-header').addClass('hidden');
    $('.home-button, .browse-button, .about-button').removeClass('current');

    if (searchTerm === '') {
      $('.search-result').html(`
        <h2 class='empty-error'>Please enter a beer name into the search bar.</h2>
        `);
      return;
    }

    const searchTermFinal = searchTerm.trim().split(' ').map(word => word[0].toUpperCase() + word.substr(1).toLowerCase()).join(' ');
    const searchObject = {beerName: searchTermFinal};
    retrieveSelectBeerJSON(searchObject, displaySearchedBeerInformation);

    searchTarget.val('');
  });
}

function watchSelectionSelect() {
  $('.cards').on('click', '.beer-selection-result-name', function(event) {
    $('.home-button, .browse-button, .about-button').removeClass('current');
    $('.main-footer').removeClass('hidden');
    $('.beers-header').addClass('hidden');

    const selectedBeerName = $(event.currentTarget).find('.card-content-beer-name').html();
    const searchObject = {beerName: selectedBeerName};
    retrieveSelectBeerJSON(searchObject, displaySearchedBeerInformation);
  })
}

function displaySearchedBeerInformation(data) {
  if (data.beers.length > 0) {
    const Beer = {
      beerName: data.beers[0].beerName || '',
      beerType: data.beers[0].beerType || '',
      breweryName: data.beers[0].breweryName || '',
      breweryLocation: data.beers[0].breweryLocation || '',
      beerABV: data.beers[0].beerABV || '',
      beerIBU: data.beers[0].beerIBU || '',
      beerAvailability: data.beers[0].beerAvailability || '',
      beerNotes: data.beers[0].beerNotes || '',
      id: data.beers[0].id || '',
      beerURL: data.beers[0].beerURL || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
    }

    $('.cards').html('');
    $('.search-result').html(
      `<div class="beer-search-result">
        <img src="${Beer.beerURL}"" alt="beer-photo" class='search-beer-url'>
        <div class="beer-search-result-text">
          <h2 class='search-beer-name'>${Beer.beerName}</h2>
          <p class='search-beer-type'>${Beer.beerType}</p>
          <p><span class='search-brewery-name'>${Beer.breweryName}</span> - <span class='search-brewery-location'>${Beer.breweryLocation}</span></p>
          <p><strong>ABV:</strong> <span class='search-beer-abv'>${Beer.beerABV}</span></p>
          <p><strong>IBU:</strong> <span class='search-beer-ibu'>${Beer.beerIBU}</span></p>
          <p><strong>Availability:</strong> <span class='search-beer-availability'>${Beer.beerAvailability}</span></p>
          <p><strong>Notes:</strong> <span class='search-beer-notes'>${Beer.beerNotes}</span></p>
          <p hidden>ID: <span class='search-beer-id'>${Beer.id}</span></p>
          <button class="delete-button">Delete</button>
          <button class="edit-button">Edit</button>
        </div>
      </div>`
    );
  }
  else {
    $('.search-result').html(`
      <h2 class="error">Sorry, we couldn't find that beer.</h2>
    `)
  }
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
        alert('Error! Beer Not Added!')
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
    $('header').addClass('hidden');
    $('.home-button').removeClass('current');

    displayAddedBeer(window.location.hash.substr(1));
    history.pushState("", document.title, window.location.pathname);
  }
}

function displayAddedBeer(addedBeerName) {
  const searchObject = {beerName: addedBeerName};
  retrieveSelectBeerJSON(searchObject, displaySearchedBeerInformation);
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
    $('.main-footer').addClass('hidden');

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

    const Beer = {
      beerName: searchToEditBeerName || '',
      beerType: searchToEditBeerType || '',
      breweryName: searchToEditBreweryName || '',
      breweryLocationCity: searchToEditBreweryCity || '',
      breweryLocationState: searchToEditBreweryState || '',
      beerABV: searchToEditBeerABV || '',
      beerIBU: searchToEditBeerIBU || '',
      beerAvailability: searchToEditBeerAvailability || '',
      beerNotes: searchToEditBeerNotes || '',
      id: searchToEditBeerId || '',
      beerURL: searchToEditBeerURL || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
    }

    $('.search-result').html(
      `<div>
        <h2>Beer Edit Form</h2>
        <form class="edit-form">
          <input type="text" id="edit-beer-name" placeholder="Beer Name" value="${Beer.beerName}" size="50" required><br>
          <input type="text" id="edit-beer-type" placeholder="Beer Type" value="${Beer.beerType}" size="50" required><br>
          <input type="text" id="edit-brewery-name" placeholder="Brewery Name" value="${Beer.breweryName}" size="50" required><br>
          <input type="text" id="edit-brewery-city" placeholder="Brewery Location - City" value="${Beer.breweryLocationCity}" size="50" required><br>
          <input type="text" id="edit-brewery-state" placeholder="Brewery Location - State/Province/Region" value="${Beer.breweryLocationState}" size="50" required><br>
          <input type="text" id="edit-beer-abv" placeholder="Beer ABV (Number Only)" value="${Beer.beerABV}" size="23"><br>
          <input type="text" id="edit-beer-ibu" placeholder="Beer IBU" value="${Beer.beerIBU}"><br>
          <input type="text" id="edit-beer-availability" placeholder="Beer Availability" value="${Beer.beerAvailability}" size="50"><br>
          <textarea placeholder="Beer Notes" id="edit-beer-notes" rows="10" cols="50">${Beer.beerNotes}</textarea><br>
          <input type="text" id="edit-beer-url" placeholder="Beer Image URL" value="${Beer.beerURL}" size="50"><br>
          <input type="text" id="edit-beer-id" value="${Beer.id}" hidden><br>
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
      type: 'PUT',
      url: API_URL + `/${editBeerIdValue}`,
      data: JSON.stringify(objectPost),
      error: function(e) {
        console.log(e);
        alert('Error! Beer Not Added!')
      },
      dataType: 'json',
      contentType: "application/json",
      success: function() {
        alert("Beer Update!");
        displayEditedBeer(editBeerNameValue);
      }
    });
  });
}

function displayEditedBeer(editedBeerName) {
  const searchObject = {beerName: editedBeerName};
  retrieveSelectBeerJSON(searchObject, displaySearchedBeerInformation);
}

function watchEditFormCancel() {
  $('.search-result').on('click', '.edit-form-cancel', function(event) {
    event.preventDefault();

    const editBeerNameValue = $('#edit-beer-name').val();
    const searchObject = {beerName: editBeerNameValue};
    retrieveSelectBeerJSON(searchObject, displaySearchedBeerInformation);
  });
}

function watchDeleteButtonClick() {
  $('.search-result').on('click', '.delete-button', function(event) {
    event.preventDefault();

    const deleteTargetBeerId = $('.search-beer-id').html();

    let status = confirm('Are you sure you would like to delete this beer?');

    if (status === true) {
      $.ajax({
        type: 'DELETE',
        url: API_URL + `/${deleteTargetBeerId}`,
      });

      displayDeletedBeer(deleteTargetBeerName);
    }
  });
}

function displayDeletedBeer(beerName) {
  $('.search-result').html(`<h2>${beerName} has been deleted!</h2>`)
}

function watchLogoAndHome() {
  $('#logo, .home-button').on('click', function() {
    $('.home-button').addClass('current');
    $('header, .main-footer').removeClass('hidden');
    $('.about-button, .browse-button').removeClass('current');
    $('.cards, .search-result').html('');
    $('.beers-header').addClass('hidden');
  });
}

function watchAboutButtonClick() {
  $('.about-button').on('click', function() {
    $('.about-button').addClass('current');
    $('.home-button, .browse-button').removeClass('current');

    $('.search-result, .cards').html('');

    $('header, .main-footer, .beers-header').addClass('hidden');

    $('.search-result').html(`
      <div class="about-container">
        <div class="about-text">
          <h2>About</h2>
          <p>The Beer Index Application was first developed in early 2018 by Brian Pham through the use of the listed technologies.</p>
          <ul>
            <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript & jQuery</li>
            <li>Node & Express</li>
            <li>MongoDB/Mongoose</li>
            <li>Mocha & Chai Testing</li>
          </ul>
          <br>
          <p>The mission of Beer Index is to provide a reliable resource for those looking for information about their favorite beers. We all love ourselves a cold beer from time to time, so we created an application to make it easier for those looking to narrow down their search for the perfect brew.</p>
        </div>
        <div class="about-image">
          <img src="beer-cheers.png">
        </div>
      </div>
    `);
  });
}

function addEventListeners() {
  watchBrowseBeersButtonClick();
  watchSearchSubmit();
  watchSelectionSelect();
  watchAddFormSubmit();
  watchAddFormCancel();
  watchAddedBeer();
  watchEditButtonClick();
  watchEditFormSubmit();
  watchEditFormCancel();
  watchDeleteButtonClick();
  watchLogoAndHome();
  watchAboutButtonClick();
}

$(addEventListeners);
