const API_URL = '/beers';

function retrieveAllBeerJSON(callback) {
  $.getJSON(API_URL, callback);
}

function retrieveSelectBeerJSON(beerSearchName, callback) {
  $.getJSON(API_URL + `/beername/${beerSearchName}`, callback)
    .fail(
      $('.search-result').html(`
        <h2 class="error">Sorry, we couldn't find that beer.</h2>
      `)
    );
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
  $('header').addClass('hidden');
  $('.about').html('');
  $('.main-area').removeClass('hidden');

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

    $('.cards').append(`
      <footer class="beers-footer">
        <div class="beers-footer-text">
          <a href="add.html"><button id="add-beer-button">Add Beer</button></a>
        </div>
      </footer>
    `);
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
      );
    }

    $('.cards').append(`
      <footer class="beers-footer">
        <div class="footer-text">
          <a href="add.html"><button id="add-beer-button">Add Beer</button></a>
        </div>
      </footer>
      `);
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
        <p><strong>ABV:</strong> <span class='search-beer-abv'>${allVariables[4]}%</span></p>
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
  $('.browse-beers-button, .enter-button').on('click', function(event) {
    $('.home-button').removeClass('current');
    $('.browse-beers-button').addClass('current');
    $('.about-button').removeClass('current');
    $('.main-footer').addClass('hidden');

    retrieveAllBeerJSON(displayMainPageBeer);
  });
}

function watchSearchSubmit() {
  $('.search').on('submit', function(event) {
    event.preventDefault();

    const searchTarget = $(event.currentTarget).find('input');
    const searchTerm = (searchTarget.val());

    $('.search-result').html('');
    $('.main-area').removeClass('hidden');
    $('.cards').html('');
    $('.error').html('');
    $('.about').html('');
    $('header').addClass('hidden');

    $('.home-button').removeClass('current');
    $('.browse-beers-button').removeClass('current');
    $('.about-button').removeClass('current');
    $('.main-footer').removeClass('hidden');

    if (searchTerm === "") {
      $('.error').html(`
        <h2>Please enter a beer name into the search bar.</h2>
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
    $('.home-button').removeClass('current');
    $('.browse-beers-button').removeClass('current');
    $('.about-button').removeClass('current');
    $('.main-footer').removeClass('hidden');

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
    $('.home-button').removeClass('current');
    $('header').addClass('hidden');

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

    $('.browse-beers-button, .enter-button').on('click', function(event) {
      $('.home-button').removeClass('current');
      $('.browse-beers-button').addClass('current');
      $('.about-button').removeClass('current');

      retrieveAllBeerJSON(displayMainPageBeer);
    });
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
    const searchToEditBeerABV = $('.search-beer-abv').html().slice(0, -1);
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
          <input type="text" id="edit-beer-name" placeholder="Beer Name" value="${allVariables[0]}" size="50" required><br>
          <input type="text" id="edit-beer-type" placeholder="Beer Type" value="${allVariables[1]}" size="50" required><br>
          <input type="text" id="edit-brewery-name" placeholder="Brewery Name" value="${allVariables[2]}" size="50" required><br>
          <input type="text" id="edit-brewery-city" placeholder="Brewery Location - City" value="${allVariables[3]}" size="50" required><br>
          <input type="text" id="edit-brewery-state" placeholder="Brewery Location - State" value="${allVariables[4]}" size="50" required><br>
          <input type="text" id="edit-beer-abv" placeholder="Beer ABV (Number Only)" value="${allVariables[5]}" size="23"><br>
          <input type="text" id="edit-beer-ibu" placeholder="Beer IBU" value="${allVariables[6]}"><br>
          <input type="text" id="edit-beer-availability" placeholder="Beer Availability" value="${allVariables[7]}" size="50"><br>
          <textarea placeholder="Beer Notes" id="edit-beer-notes" rows="10" cols="50">${allVariables[8]}</textarea><br>
          <input type="text" id="edit-beer-url" placeholder="Beer Image URL" value="${allVariables[10]}" size="50"><br>
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
  $('.search-result').html(`<h2>${beerName} has been deleted!</h2>`)
}

function watchLogoAndHome() {
  $('#logo, .home-button').on('click', function() {
    $('.home-button').addClass('current');
    $('header').removeClass('hidden');
    $('.about-button').removeClass('current');
    $('.browse-beers-button').removeClass('current');
    $('.error').html('');
    $('.cards').html('');
    $('.search-result').html('');
    $('.about').html('');
    $('.main-footer').removeClass('hidden');
    $('.main-area').addClass('hidden');
  });
}

function watchAboutButtonClick() {
  $('.about-button').on('click', function() {
    $('.about-button').addClass('current');
    $('.home-button').removeClass('current');
    $('.browse-beers-button').removeClass('current');
    $('header').addClass('hidden');
    $('.error').html('');
    $('.cards').html('');
    $('.search-result').html('');
    $('.main-footer').removeClass('hidden');
    $('.main-area').removeClass('hidden');

    $('.about').html(`
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
          <img src="http://yardsbrewing.com/assets/img/cheers-sketch.png">
        </div>
      </div>
    `);
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
  watchLogoAndHome();
  watchAboutButtonClick();
}

$(addEventListeners);
