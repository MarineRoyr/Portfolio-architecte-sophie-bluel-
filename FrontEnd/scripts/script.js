// token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxNTc1OTM4MSwiZXhwIjoxNzE1ODQ1NzgxfQ.hwbQimJF8XG-wjsLx98rS0JcVQf9mb1WZBrcxV_Qriw
// Déclaration des variables//
const baseUrl = "http://localhost:5678";
// On vient sélectionner et stocker la div par sa class CSS pour nos projets
const galleryElement = document.querySelector(".gallery");

//Déclaration d'une variable qui contiendra un objet de type tableau avec tous les projets
let allProjects;

//Récupération des projets depuis l'API //........................................................................................................................................

// Déclaration d'une fonction pour récupérer les projets depuis l'API
async function getWorks() {
  // Déclaration d'une variable
  let data;
  // Déclaration d'une variable qui contiendra le fetch
  let response = await fetch(baseUrl + "/api/works");
  // Si la réponse du fetch est différente, dans la promesse, de la valeur ok, on retourne une erreur
  if (!response.ok) {
    throw new Error("Problème avec le serveur");
  } // sinon on stocke la réponse dans notre variable data en la convertissant en json
  else {
    data = await response.json();
    //puis on stocke cette réponse json dans la varioble allProject sous la forme d'un tableau et on récupère ce tableau dans notre console
    allProjects = Array.from(data);
  }
  console.log(data);
}

// on appelle la fonction afin qu'elle se réalise à chaque actualisation de la page
getWorks();

//Affichage des projets dans le DOM //........................................................................................................................................

// On appelle une fonction pour générer les projets dans le DOM, avec deuc paramètres, qui tons automatiquement déclarés comme variables qu'on pourra appeler ensuite
function displayWorks(data) {
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
    });
    // on crée une variable contenant une balise figure, puis une balise image
  }
}

//Création des catégories et filtres //........................................................................................................................................

//on déclare des variables qui seront paramètres de la fonction ou utilisées à l'intérieur
let responseCategories;
let projectCategories;
let filterButton;
// on lance la fonction de manière asynchrone avec le paramètre responseCategories
async function getCategoriesApi(responseCategories) {
  // on lance la fonction fetch stockée dans une variable
  let response = await fetch(baseUrl + "/api/categories");
  // si la valeur n'est pas ok dans le paramètre response de la promesse du fetch, on log un message d'erreur
  if (!response.ok) {
    throw new Error("Problème avec le serveur");
  }
  // sinon on stocke notre réponse en json dans une variable et dans une seconde variable en la convertit en tableau
  else {
    responseCategories = await response.json();
    projectCategories = Array.from(responseCategories);
    //on ajoute une nouvelle valeur au début de notre tableau généré depuis l'API, avec unshift, pour intégrer la catégorie "tous"
    projectCategories.unshift({ id: 0, name: "Tous" });
    console.log(projectCategories);
  }

  // on sélectionne une div prévue dans le html avec sa class CSS dans une variable et on génère les boutons dynamiquement
  const filters = document.querySelector(".filters");
  projectCategories.forEach((nameCategories) => {
    // on définit une variable contenant les catégories des projets selon leur valeur name ou id
    let nameFilters = nameCategories.name;
    let idFilters = nameCategories.id;
    // si la valeur nameCategorie est remplie
    if (nameFilters != null) {
      filterButton = document.createElement("button");
      //on génère le texte des boutons selon la valeur name
      filterButton.textContent = nameCategories.name;
      // on relie nos balises button à notre div
      filters.appendChild(filterButton);
      // on relie nos boutons à une class prevue pour eux dans le CSS
      filters.classList.add("filters-button");
    }

    // on crée une écoute sur l'évènement click des boutons générés dynamiquement et on récupère dans notre console, le bouton cliqué grâce aux valeurs name et id
    filterButton.addEventListener("click", () => {
      console.log(
        "Filter name :",
        nameCategories.name,
        ", category and id :",
        nameCategories.id
      );

      // on récupère dans une variable, par son id, le titre prévu pour les projets
      let projetsSection = document.getElementById("mes-projets-title");
      // on ajoute à cet titre une méthode js qui permet d'ancrer l'écran sur les projets lorsque la fonction est activée
      projetsSection.scrollIntoView();
      // on déclare un paramètre pour la fonction à venir, les id de notre tableau des catégories, contenues dans la variable nameCategories
      filterProjectsByCategory(nameCategories.id);
    });
  });
  // on lance une nouvelle fonction qui va filtrer l'affichage des projets sur la page avec le paramètre qui contiendra les différents id des projets
  function filterProjectsByCategory(categoryId) {
    // si le paramètre id des projets est égal à 0, on affiche tous les projets avec la fonction d'affichage utilisant en paramètre le tableau avec tous les projets
    if (categoryId === 0) {
      displayWorks(allProjects);
    } else {
      // sinon, on déclare une nouvelle variable qui contient le tableau de tous les projets filtré par le paramètre filter
      let filteredProjects = allProjects.filter(
        // dans cette fonction filter, on utilise un nouveau paramètre "project" représentant tous les projets dans le tableau "allProject"
        //  et on vient pointer la valeur "categoryId" correspondant à 1,2 ou 3 selon nos catégories de projets, et on déclare qu'elle doit être
        // identique à celle des éléments du tableau pour filtrer ces différents éléments
        (project) => project.categoryId === categoryId
      );
      // puis on utilise cette fonction filtrée comme paramètre de notre fonction d'affichage, selon l'écoute du click du bouton
      // et du paramètre nameCategories.id qui est appelé au click
      displayWorks(filteredProjects);
    }
    // on log à chaque clic le filtre des projets
    console.log("Projects filtered.");
  }
}
// on appelle la fonction pour obtenir le tri par catégorie dans notre page
getCategoriesApi(responseCategories);

// Après authentification -------------------------------------------

function logUserOk() {
  document.addEventListener("DOMContentLoaded", function loginSuccess() {
    let logIn = document.querySelector(".login");
    if (localStorage.getItem("loginSuccess") === "true") {
      logIn.textContent = "logout";
      modalForProject();
      updateProjectModal();
      logIn.addEventListener("click", function logOutUser() {
        if (logIn.textContent === "logout") {
          localStorage.removeItem("loginSuccess");
          localStorage.removeItem("userId", userId);
          localStorage.removeItem("token", token);
          window.location.href = "login.html";
        }
      });
    } else {
      logIn.textContent = "login";
      logOutUser();
    }
  });
}

logUserOk();

function modalForProject() {
  let displayfilter = document.querySelector(".filters");
  displayfilter.style.display = "none";
  let modifyButton = document.querySelector(".modifyProject");
  modifyButton.innerHTML = ` <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5229 1.68576L13.8939 2.05679C14.1821 2.34503 14.1821 2.81113 13.8939 3.0963L13.0016 3.99169L11.5879 2.57808L12.4803 1.68576C12.7685 1.39751 13.2346 1.39751 13.5198 1.68576H13.5229ZM6.43332 7.73578L10.5484 3.61759L11.9621 5.03121L7.84387 9.14633C7.75494 9.23525 7.64455 9.29964 7.52496 9.33337L5.73111 9.84546L6.2432 8.05162C6.27693 7.93203 6.34133 7.82164 6.43025 7.73271L6.43332 7.73578ZM11.4408 0.646245L5.39074 6.6932C5.12397 6.95998 4.93078 7.28808 4.82959 7.64685L3.9526 10.7133C3.879 10.9708 3.94953 11.2468 4.13965 11.4369C4.32977 11.627 4.60574 11.6976 4.86332 11.624L7.92973 10.747C8.29156 10.6427 8.61967 10.4495 8.88338 10.1858L14.9334 4.13888C15.7951 3.27722 15.7951 1.87894 14.9334 1.01728L14.5624 0.646245C13.7007 -0.215415 12.3024 -0.215415 11.4408 0.646245ZM2.69844 1.84214C1.20816 1.84214 0 3.05031 0 4.54058V12.8812C0 14.3715 1.20816 15.5796 2.69844 15.5796H11.0391C12.5293 15.5796 13.7375 14.3715 13.7375 12.8812V9.44683C13.7375 9.039 13.4094 8.71089 13.0016 8.71089C12.5937 8.71089 12.2656 9.039 12.2656 9.44683V12.8812C12.2656 13.5589 11.7167 14.1078 11.0391 14.1078H2.69844C2.02076 14.1078 1.47188 13.5589 1.47188 12.8812V4.54058C1.47188 3.86291 2.02076 3.31402 2.69844 3.31402H6.13281C6.54065 3.31402 6.86875 2.98591 6.86875 2.57808C6.86875 2.17025 6.54065 1.84214 6.13281 1.84214H2.69844Z" fill="black"/>
    </svg><a href="#"> 
    modifier</a>`;
  let modalContainer = document.querySelector(".modalContainer");
  let modalTrigger = document.querySelectorAll(".modalTrigger");
  let editionBanner = document.querySelector(".editionBanner");
  modalTrigger.forEach((trigger) =>
    trigger.addEventListener("click", toggleModal)
  );
  function toggleModal() {
    modalContainer.classList.toggle("active");
  }
}

async function updateProjectModal() {
  let projectModal = document.querySelector(".projectModal");
  projectModal.innerHTML = "";
  if (!projectModal) {
    console.error("API Projets datas unfound.");
    return;
  } else {
    let data;
    let response = await fetch(baseUrl + "/api/works");
    if (!response.ok) {
      throw new Error("Problème avec le serveur");
    } else {
      data = await response.json();
      allProjects = Array.from(data);
    }
    data.forEach((item) => {
      projectModal.classList.add("projectModal");
      const imageElement = document.createElement("img");
      const deleteIcon = document.createElement("i");

      imageElement.src = item.imageUrl;
      imageElement.alt = item.title;
      projectModal.appendChild(imageElement);
      projectModal.appendChild(deleteIcon);
    });
    console.log("Modal 1 - Gallery updated");
  }
}
