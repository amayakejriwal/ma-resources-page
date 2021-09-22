/**
 * MangoApps Resources Page
 */
"use strict";

//const { disconnect } = require("process");

(function() {

  window.addEventListener("load", init);

  function init() {
    pullAllResources();
    id("filter-by").addEventListener("change", showFilters);
    qs(".category-options").addEventListener("change", function() {
        var markedCheckbox = document.querySelectorAll('input[type="checkbox"]:checked');
        for (var checkbox of markedCheckbox) {
          id("results").innerHTML = "";
          console.log(checkbox.value);
          pullFilteredResources("category", checkbox.value);
        }
     });
    qs(".product-options").addEventListener("change", function() {
      var markedCheckbox = document.querySelectorAll('input[type="checkbox"]:checked');
      for (var checkbox of markedCheckbox) {
        id("results").innerHTML = "";
        console.log(checkbox.value);
        pullFilteredResources("product", checkbox.value);
      }
    });
    qs(".industry-options").addEventListener("change", function() {
      var markedCheckbox = document.querySelectorAll('input[type="checkbox"]:checked');
      for (var checkbox of markedCheckbox) {
        id("results").innerHTML = "";
        console.log(checkbox.value);
        pullFilteredResources("industry", checkbox.value);
      }
    });
    qs(".usecase-options").addEventListener("change", function() {
      var markedCheckbox = document.querySelectorAll('input[type="checkbox"]:checked');
      for (var checkbox of markedCheckbox) {
        id("results").innerHTML = "";
        console.log(checkbox.value);
        pullFilteredResources("use_case", checkbox.value);
      }
    });
    qs(".size-options").addEventListener("change", function() {
      var markedCheckbox = document.querySelectorAll('input[type="checkbox"]:checked');
      for (var checkbox of markedCheckbox) {
        id("results").innerHTML = "";
        console.log(checkbox.value);
        pullFilteredResources("num_employees", checkbox.value);
      }
    });
  }

  function pullFilteredResources(row, value) {
  // SELECT * FROM resourcs WHERE row = value
  let params = new FormData();
  params.append("row", row);
  params.append("value", value)
  fetch("/filtered-resources", {method: "POST", body: params})
    .then(statusCheck)
    .then(resp => resp.json())
    .then(showResources)
    .catch(handleError);
  }

  function showFilters() {
    hideOldFilters();
    pullAllResources();
    //find what filter is currently selected
    let filters = id("filter-by");
    let result = filters.options[filters.selectedIndex].value;
    console.log(result);
    qs("." + result).classList.remove("hidden");
  }

  function hideOldFilters() {
    qs(".category").classList.add("hidden");
    qs(".product").classList.add("hidden");
    qs(".industry").classList.add("hidden");
    qs(".usecase").classList.add("hidden");
    qs(".size").classList.add("hidden");
  }

  function pullAllResources() {
    id("results").innerHTML = "";
    fetch("/all-resources")
      .then(statusCheck)
      .then(resp => resp.json())
      .then(showResources)
      .catch(handleError);
  }

  function showResources(data) {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      let div = document.createElement("div");
      id("results").append(div);
      div.classList.add("link-type-box");

      let img = document.createElement("img");
      img.src = "img/" + data[i].img;
      img.alt = data[i].name + " image";
      div.append(img);

      let name = document.createElement("p");
      name.textContent = data[i].name + " " + data[i].category;
      div.append(name);

      let industry = document.createElement("p");
      industry.textContent = "Industry: " + data[i].industry;
      div.append(industry);

      let numEmployees = document.createElement("p");
      numEmployees.textContent = "Emoloyees: <" + data[i].num_employees;
      div.append(numEmployees);

      let button = document.createElement("button");
      button.innerHTML = "DOWNLOAD NOW";
      button.addEventListener("click", function(){
        location = data[i].download_link;
      })
      div.append(button);
    }
  }

  /**
   * The statusCheck function checks the current status of the API and takes
   * action if there are problems or errors.
   * @param {response} response - the response from the API about the status
   * @returns {response} - the response based on the "ok" state of the response
   * @returns {error} - throws an error based on the "ok" state of the response
   */
  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }

  function handleError(error) {
    console.log("oops! this error occured: " + error);
  }

  /**
  * Returns the element that has the ID attribute with the specified value.
  * @param {string} idName - element ID
  * @returns {object} DOM object associated with id.
  */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
  * Returns the first element that matches the given CSS selector.
  * @param {string} selector - CSS query selector.
  * @returns {object} The first DOM object matching the query.
  */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
  * Returns the array of elements that match the given CSS selector.
  * @param {string} selector - CSS query selector
  * @returns {object[]} array of DOM objects matching the query.
  */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
  * Returns a new element with the given tag name.
  * @param {string} tagName - HTML tag name for new DOM element.
  * @returns {object} New DOM object for given HTML tag.
  */
  function gen(tagName) {
    return document.createElement(tagName);
  }

})();