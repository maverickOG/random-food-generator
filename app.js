window.onload = function () {
  // Fetch random meal details when the page loads
  fetchRandomMeal();
  window.closePopup = closePopup;

  // Function to fetch random meal details from the API
  function fetchRandomMeal() {
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
      .then((response) => response.json())
      .then((data) => {
        displayMeal(data.meals[0], "randomGen-item", true);
      })
      .catch((error) => console.error("Error fetching random meal:", error));
  }

  // Function to fetch meal details from the search API
  function fetchSearchResults(searchTerm) {
    var apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchTerm}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        displaySearchResults(data.meals, "searchResult", searchTerm);
      })
      .catch((error) => console.error("Error fetching search results:", error));
  }

  // Function to display meal details in a container
  function displayMeal(meal, containerId, includeButton) {
    if (meal) {
      var imgElement = createImageWithButton(meal, includeButton);
      var container = document.getElementById(containerId);
      container.innerHTML = ""; // Clear existing content
      container.appendChild(imgElement);
    } else {
      // Handle case when no meal is found
      document.getElementById(containerId).innerHTML =
        "<p>No results found</p>";
    }
  }

  // Function to display search results in a container with smooth scroll animation
  function displaySearchResults(meals, containerId, searchTerm) {
    var container = document.getElementById(containerId);
    container.innerHTML = ""; // Clear existing content

    if (meals && meals.length > 0) {
      // Display the search result heading
      displaySearchHeading(searchTerm);

      meals.forEach((meal) => {
        var resultElement = createImageWithButton(meal, false); // Pass false to exclude the button
        container.appendChild(resultElement);
      });

      // Custom smooth scroll to the container
      smoothScrollTo(container);
    } else {
      // Handle case when no search results are found
      hideSearchHeading();
      container.innerHTML = "<p>No results found</p>";
    }
  }

  // Function for custom smooth scroll animation
  function smoothScrollTo(targetElement) {
    const startPosition = window.scrollY || window.pageYOffset;
    const targetPosition =
      targetElement.getBoundingClientRect().top + startPosition;
    const distance = targetPosition - startPosition;
    const duration = 500; // Adjust the duration as needed
    const startTime = performance.now();

    function scrollAnimation(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeInOutQuad =
        progress < 0.5
          ? 2 * progress ** 2
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      window.scrollTo(0, startPosition + distance * easeInOutQuad);

      if (progress < 1) {
        requestAnimationFrame(scrollAnimation);
      }
    }

    requestAnimationFrame(scrollAnimation);
  }

  // Function to create an image without the recipe name and button
  function createImageWithButton(meal, includeButton) {
    var resultElement = document.createElement("div");
    resultElement.classList.add("searchResult-item");

    var imgElement = document.createElement("img");
    imgElement.src = meal.strMealThumb;
    imgElement.alt = meal.strMeal;

    var nameElement = document.createElement("div");
    nameElement.classList.add("recipe-name");
    nameElement.innerText = meal.strMeal;

    resultElement.appendChild(imgElement);

    if (includeButton) {
      var btnElement = document.createElement("button");
      btnElement.innerText = "Show Recipe";
      btnElement.addEventListener("click", function () {
        showRecipe(meal);
      });

      resultElement.appendChild(nameElement); // Include recipe name
      resultElement.appendChild(btnElement);
    } else {
      resultElement.appendChild(nameElement); // Include recipe name
    }

    return resultElement;
  }

  // Function to show the recipe details in a popup
  function showRecipe(meal) {
    var popupTitle = document.getElementById("popupTitle");
    var popupContent = document.getElementById("popupContent");

    popupTitle.innerText = meal.strMeal;

    var ingredientsList = "<h4>Ingredients:</h4><ul>";
    for (var i = 1; i <= 20; i++) {
      var ingredient = meal["strIngredient" + i];
      var measure = meal["strMeasure" + i];

      if (ingredient && measure) {
        ingredientsList += "<li>" + measure + " " + ingredient + "</li>";
      }
    }
    ingredientsList += "</ul>";

    // Display area and category in the ingredients popup
    var areaAndCategory = `<p><strong>Area:</strong> ${meal.strArea}</p><p><strong>Category:</strong> ${meal.strCategory}</p>`;

    var instructions =
      "<h4>Instructions:</h4><p>" + meal.strInstructions + "</p>";

    popupContent.innerHTML = ingredientsList + areaAndCategory + instructions;

    // Display the modal
    document.getElementById("recipePopup").style.display = "block";
  }

  // Function to close the popup
  function closePopup() {
    console.log("Closing popup"); // Add this line
    document.getElementById("recipePopup").style.display = "none";
  }

  // Function to handle search on Enter key press
  function searchMeal(event) {
    if (event.key === "Enter") {
      var searchTerm = document.getElementById("searchBar").value;
      fetchSearchResults(searchTerm);
    }
  }

  // Function to display the search result heading
  function displaySearchHeading(searchTerm) {
    var searchHeading = document.getElementById("searchHeading");
    searchHeading.innerText = `Search Results for "${searchTerm}"`;
    searchHeading.style.display = "block";
  }

  // Function to hide the search result heading
  function hideSearchHeading() {
    var searchHeading = document.getElementById("searchHeading");
    searchHeading.style.display = "none";
  }

  // Attach the searchMeal function to the input element's onkeydown event
  document.getElementById("searchBar").addEventListener("keydown", searchMeal);
};
