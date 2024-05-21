// Déclaration d'une variable qui contiendra l'écoute du clic sur le bouton Login, ainsi qu'une ligne (9) pour éviter le rechargement de la page

// On séléctionne notre balise html et on lui ajoute un écouteur d'évènement de type submit
const loginForm = document.querySelector(".loginForm");
loginForm.addEventListener("submit", function (event) {
  // on lui applique une méthode pour éviter rechargement de page et on joue la fonction q'on paramétra ensuite à chaque submit
  event.preventDefault();
  loginUsers();
  console.log("Submit POST");
});

// on initie la fonction pour l'authentification, en asynchrone
async function loginUsers() {
  // on stocke les futures valeurs tapées dans les input du formulaire, dans des variables
  const mail = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  // on stocke dans une variable, la charge utile du body, en la traduisant au format Json
  let bodyContent = JSON.stringify({
    email: mail,
    password: password,
  });

  // on utilise un try catch pour effectuer le fetch dans un premier temps et retourner erreur si une exception survient dans le try
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyContent,
    });

    // on crée une variable qui stocke la réponse du fetch en la convertissant au format Json
    let data = await response.json();
    // si la valeur de la réponse est ok, on log un message de validation
    if (response.ok) {
      console.log("Login API Response OK");
      // et on stocke dans un objet qui formatera l'ancienne valeur de data, les valeurs obtenues dans notre response
      let { userId, token } = data;

      // on stocke les valeurs obtenues dans un local storage, persistant après fermeture de session navigateur
      // On y stocke la chaine de caractère nommant l'élément et les valeurs stockées dans la variable data
      localStorage.setItem("userId", userId);
      localStorage.setItem("token", token);
      localStorage.setItem("loginSuccess", "true");
      // on redirige vers la page index.html
      window.location.href = "../index.html";
    }
    // sinon, si authentification échoue, on ajoute du texte à la div correspondante pour signifier l'erreur à l'utilisateur
    else {
      document.getElementById("error").innerText =
        "Erreur dans l’identifiant ou le mot de passe !";
    }
  } catch (error) {
    // si exception survient dans le try, on renvoie un message d'erreur dans la console
    console.error(error);
  }
}
