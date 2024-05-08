// token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4

// Déclaration des variables//
const baseUrl = "http://localhost:5678";
// On vient sélectionner et stocker la div par sa class CSS pour nos projets
const galleryElement = document.querySelector(".gallery");

//Déclaration d'une variable qui contiendra un objet de type tableau avec tous les projets
let allProjects;
//Récupération des projets depuis l'API //........................................................................................................................................

// Déclaration d'une fonction pour récupérer les projets depuis l'API
async function getWorks() {
  let data;
  let response = await fetch(baseUrl + "/api/works");
  if (!response.ok) {
    throw new Error("Problème avec le serveur");
  } else {
    data = await response.json();
    allProjects = Array.from(data);
    console.log(allProjects);
  }
}

// on appelle la fonction afin qu'elle se réalise à chaque actualisation de la page
getWorks();

//Affichage des projets dans le DOM //........................................................................................................................................

// On appelle une fonction pour générer les projets dans le DOM
function displayWorks(data, workId = null) {
  //Si la valeur de la variable est null on log un message d'erreur
  if (!galleryElement) {
    console.log("Aucun projet chargé");
    return;
    //sinon on sélectionne les données html de la div .gallery, on supprime le html
  } else {
    galleryElement.innerHTML = "";
    // On utilise la boucle forEach pour parcourir tous les éléments du tableau dans le but de récupérer les valeurs
    data.forEach((project) => {
      // on définit une variable contenant les catégories des projets et on émet la condition que celle ci ait une valeur définie
      workId = project.categoryId;
      if (workId != null) {
        const baliseFigure = document.createElement("figure");
        const baliseImg = document.createElement("img");
        //on vient pointer les attributs de notre balise Img tout en les déclarant comme variables, et on leur assigne les éléments visés de notre ARRAY apiProjects
        baliseImg.src = project.imageUrl;
        baliseImg.alt = project.title;
        // on déclare une variable dans laquelle on crée une balise p, qui contiendra ensuite l'élément title de notre ARRAY
        const baliseTitle = document.createElement("p");
        baliseTitle.textContent = project.title;
        // on relie nos balises image et titre chacune à une section puis on relie ces sections à la div gallery et on log le chargement ok
        baliseFigure.appendChild(baliseImg);
        baliseFigure.appendChild(baliseTitle);
        galleryElement.appendChild(baliseFigure);
      }
      // on crée une variable contenant une balise figure, puis une balise image
    });
  }
}

//Création des catégories et filtres //........................................................................................................................................

//on déclare des variables qui seront paramètres de la fonction qui va réaliser le fetch afin de récupérer nos catégories de projets
let responseCategories;
let projectCategories;
let filterButton;
async function getCategoriesApi(responseCategories) {
  let response = await fetch(baseUrl + "/api/categories");
  if (!response.ok) {
    throw new Error("Problème avec le serveur");
  } else {
    responseCategories = await response.json();
    projectCategories = Array.from(responseCategories);
    //on ajoute une nouvelle valeur au début de notre tableau généré depuis l'API, avec unshift
    projectCategories.unshift({ id: 0, name: "Tous" });
    console.log(projectCategories);
  }

  // on sélectionne une div avec sa class CSS dans une variable et on génère les boutons dynamiquement
  const filters = document.querySelector(".filters");
  projectCategories.forEach((nameCategories, categoryId) => {
    // on définit une variable contenant les catégories des projets et on émet la condition que celle ci ait une valeur définie
    nameFilters = nameCategories.name;
    idFilters = nameCategories.id;

    if (nameFilters != null) {
      filterButton = document.createElement("button");
      //on génère le texte des boutons
      filterButton.textContent = nameCategories.name;
      // on relie nos balises button à notre div
      filters.appendChild(filterButton);
      filters.classList.add("filters-button");
    }
    filterButton.addEventListener("click", () => {
      console.log(
        "Filter name :",
        nameCategories.name,
        ", category and id :",
        nameCategories.id
      );
      let projetsSection = document.getElementById("mes-projets-title");
      projetsSection.scrollIntoView();
      filterProjectsByCategory(nameCategories.id);
    });
  });

  function filterProjectsByCategory(categoryId) {
    if (categoryId === 0) {
      displayWorks(allProjects);
    } else {
      let filteredProjects = allProjects.filter(
        (project) => project.categoryId === categoryId
      );
      displayWorks(filteredProjects);
    }
    console.log("Projects filtered.");
  }
}
// on appelle la fonction pour récupérer le tableau des catégories
getCategoriesApi(responseCategories);
