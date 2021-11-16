$(document).ready(function() {
  
  $trombi = $('div#trombinoscope');
  $forward = $('#forward');
  $back = $('#back');

  let page = 1;
  
  // Bouton forward/page suivante
  $forward.on('click', function() {
    console.log("Page suivante");
    page++;
    getUsers(page);
  });

  // Bouton back/page précédente
  $back.on('click', function() {
    console.log("Page précédente");
    page--;
    getUsers(page);
  });

  // Appel Ajax initial
  getUsers(page);
});

function getUsers(page) {
  // Construction de l'URL, en utilisant le nombre de page si défini
  let url = "https://reqres.in/api/users";
  if(page) url += "/?page=" + page;

  // Reset trombinoscope (sinon la liste s'ajoute au fur et à mesure)
  $trombi.empty();

  // Définition de l'appel Ajax
  $.ajax({
    url: url,
    method: "GET",
    dataType : "json",
  }).then(function(response) {

    // Liste des utilisateurs
    let users = response.data;
    for(let user of users) {
      $trombi.append(createDivUser(user));
    }

    // Affichage des boutons de changement de page
    afficheCacheBoutons(response);
  });
}

// Création <div> pour chaque user
function createDivUser(user) {
  if(!user) return "";
  return "<div id=" + user.id + "><img src="+ user.avatar + "></img><p>" + user.first_name + " " + user.last_name + "</p></div>";
}

// Permet de gérer l'affichage ou le masquage des boutons (si première ou dernière page)
function afficheCacheBoutons(response) {
  if(response.page < response.total_pages) {
    $('#forward').show();
  } else {
    $('#forward').hide();
  }
  if(response.page > 1) {
    $('#back').show();
  } else {
    $('#back').hide();
  }
}