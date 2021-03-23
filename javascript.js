var sectionTitre = document.querySelector("#titre");
var sectionResultat = document.querySelector("#resultat");

function getJsonResponse(requestURL, callback) {
  var request = new XMLHttpRequest();
  request.open("GET", requestURL);
  request.responseType = "json";
  request.send();
  request.onload = function () {
    if (request.status == 200) {
      callback(request.response);
    } else {
      setTitle(request.response.message);
      sectionResultat.innerHTML = "";
    }
  };
}

function loadContent(jsonResponse) {
  setTitle("COVID-19", "Statistiques par pays");
  showResults(jsonResponse);
}

getJsonResponse("https://disease.sh/v3/covid-19/countries", loadContent);

function setTitle(titre, description) {
  sectionTitre.innerHTML = "";

  var myH1 = document.createElement("h1");
  myH1.textContent = titre;
  sectionTitre.appendChild(myH1);

  var myPara = document.createElement("p");
  myPara.textContent = description;
  sectionTitre.appendChild(myPara);
}

function showResults(jsonObj) {
  var heroes = jsonObj;

  for (var i = 0; i < heroes.length; i++) {
    var myArticle = document.createElement("article");
    var myH2 = document.createElement("h2");
    var myPara1 = document.createElement("p");
    var myPara2 = document.createElement("p");
    var myPara3 = document.createElement("p");
    var myList = document.createElement("ul");

    myH2.textContent = heroes[i].country;
    myPara1.textContent = "Cas: " + heroes[i].cases;
    myPara2.textContent = "Mort: " + heroes[i].deaths;
    myPara3.textContent = "Tests:";
    +heroes[i].tests;

    var superPowers = heroes[i].tests;
    for (var j = 0; j < superPowers.length; j++) {
      var listItem = document.createElement("li");
      listItem.textContent = superPowers[j];
      myList.appendChild(listItem);
    }

    myArticle.appendChild(myH2);
    myArticle.appendChild(myPara1);
    myArticle.appendChild(myPara2);
    myArticle.appendChild(myPara3);
    myArticle.appendChild(myList);

    sectionResultat.appendChild(myArticle);
  }
}

function countryHTML(country) {
  var myArticle = document.createElement("article");
  var myH2 = document.createElement("h2");
  var nbCas = document.createElement("p");
  var nbMorts = document.createElement("p");
  var nbTests = document.createElement("p");
  var flag = document.createElement("img");

  myH2.textContent = country.country;
  nbCas.textContent = "Cas: " + country.cases;
  nbMorts.textContent = "Mort: " + country.deaths;
  nbTests.textContent = "Tests: " + country.tests;
  flag.src = country.countryInfo.flag;

  myArticle.appendChild(myH2);
  myArticle.appendChild(flag);
  myArticle.appendChild(nbCas);
  myArticle.appendChild(nbMorts);
  myArticle.appendChild(nbTests);

  sectionResultat.appendChild(myArticle);
}

function continentHTML(continent) {
  var myArticle = document.createElement("article");
  var myH2 = document.createElement("h2");
  var nbCas = document.createElement("p");
  var nbMorts = document.createElement("p");
  var nbTests = document.createElement("p");

  myH2.textContent = continent.continent;
  nbCas.textContent = "Cas: " + continent.cases;
  nbMorts.textContent = "Mort: " + continent.deaths;
  nbTests.textContent = "Tests: " + continent.tests;

  myArticle.appendChild(myH2);
  myArticle.appendChild(nbCas);
  myArticle.appendChild(nbMorts);
  myArticle.appendChild(nbTests);

  sectionResultat.appendChild(myArticle);
}

function showSearch() {
  let searchInput = document.getElementById("search-input");
  let searchText = searchInput.value;

  let selectedRadio = document.querySelector("input[name=searchType]:checked");
  let searchType = selectedRadio.value;

  callback = function (jsonResponse) {
    // efface le contenu des sections
    sectionTitre.innerHTML = "";
    sectionResultat.innerHTML = "";

    setTitle("Résultat de recherche", "Terme recherché : " + searchText);

    console.log(jsonResponse);

    if (Array.isArray(jsonResponse)) {
      if (searchType == "countries") {
        for (i = 0; i < jsonResponse.length; i++) {
          countryHTML(jsonResponse[i]);
        }
      } else if (searchType == "continents") {
        for (i = 0; i < jsonResponse.length; i++) {
          continentHTML(jsonResponse[i]);
        }
      }
    } else {
      if (searchType == "countries") {
        countryHTML(jsonResponse);
      } else if (searchType == "continents") {
        continentHTML(jsonResponse);
      }
    }
  };

  getJsonResponse(
    "https://disease.sh/v3/covid-19/" +
      searchType +
      "/" +
      searchText +
      "?strict=true",
    callback
  );
}

var searchButton = document.getElementById("search-btn");

searchButton.onclick = showSearch;
