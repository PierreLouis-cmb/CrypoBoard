$(document).ready(function () {
	//Déclaration des variable
	let page = 0;
	let perPage = 0;

	//Variable pour récuperer des éléments HTML
	$next = $('#next');
	$back = $('#back');
	$selectPage = $('#perPage');
	$back.hide();
	perPage = $selectPage.val();
//console.log(perPage)

//Sélécteur nombre de résultat par page
	$selectPage.on('click', function(){
		perPage = $selectPage.val();
		getCoins(page, perPage)
		})
	$selectPage.val();
	console.log($selectPage.val());


//Page suivante
	$next.on('click', function () {
		console.log("Page suivante");
		page += 10;
		getCoins(page, perPage);
		$back.show();
	});

//Revenir sur la page d'avant
	$back.on('click', function () {
		console.log("Page précendente");
		page -= 10;
		getCoins(page, perPage);
		if (page === 0) {
			$back.hide();
		}
	});

//Appel de l'api
	getCoins(page, perPage);
});

function getCoins(page,perPage) {
	// Construction de l'URL, en utilisant le nombre de page si défini
	let url = "https://api.coinstats.app/public/v1/coins";
	url += "?skip=" + page + "&limit="+ perPage + "&currency=EUR";
	console.log(url);

	// Définition de l'appel Ajax
	$.ajax({
		//L'URL de la requête
		url: url,
		//La méthode d'envoi
		method: "GET",
		//Le format de réponse attendu
		dataType: "json",
	})
		//Ce code sera exécuté en cas de succès - La réponse du serveur est passée à done()
		.done(function (response) {

			let coins = response.coins;
			let cryptoCoins = "";
			for (let i = 0; i < coins.length; i++) {

				//Var pour voir si .priceChange1h est négatif ou positif, retourne -1 si negatif
				let price1h = Math.sign(coins[i].priceChange1h);
				let price = Math.round(coins[i].price * 200) / 100
				console.log(price);

				//Variable de l'api
				let id = coins[i].id;
				let rank = coins[i].rank;
				let name = coins[i].name;
				let icon = coins[i].icon;
				//let price = coins[i].price;
				let volume = coins[i].volume;
				let priceChange1h = coins[i].priceChange1h;
				let priceChange1d = coins[i].priceChange1d;
				let priceChange1w = coins[i].priceChange1w;
				let twitterUrl = coins[i].twitterUrl;
				let exp = coins[i].exp;
				//Changement de couleur
				let back = "";
				if (price1h === -1 ){
					back = "red";
				}else if (price1h === 1){
					back = "green"
				}else{
					back = "black"
				}
				//Construction tableau
				cryptoCoins += '<tr>';
				cryptoCoins += `<td> ${rank} </td>`;
				cryptoCoins += `<td> <img src="${icon}"> </img> ${name} </td>`;
				cryptoCoins += `<td> ${price} </td>`;
				cryptoCoins += `<td> ${volume} </td>`;
				//Poser la variable back dans la classe pour changer la couleur
				cryptoCoins += `<td id="price1h_${id}" class="pos neg ${" "+back}"> ${priceChange1h} %  </td>`;
				cryptoCoins += `<td id="price1d_${id}" class="pos neg ${" "+back}"> ${priceChange1d} %  </td>`;
				cryptoCoins += `<td id="price1w_${id}" class="pos neg ${" "+back}"> ${priceChange1w} %  </td>`;
				cryptoCoins += `<td>  <a href="${twitterUrl}" class="fa fa-twitter"></a> </td>`;
				//Peut etre le mettre dans une popup ?
				if (exp){
					for(let i = 0; i < exp.length; i++) {
						cryptoCoins += `<td>  <a href="${exp[i]}">lien ${i}</a> </td>`;
						console.log(exp[i])
					}
				}


				cryptoCoins += '</tr>';
				document.getElementById("data").innerHTML = cryptoCoins;
				
				//AJOUTER LA PAGINATION


				// let myTd = document.querySelector("#price1h_" + id);
				// myTd.style.backgroundColor = "#d93600";
				// $test = $("#price1h_" + id);
				//myTd.style.backgroundColor = "#d93600";
				// if (price1h === -1 ){
				// 	console.log(myTd);
				// 	myTd.style.backgroundColor = "#d93600";
				// 	//let test = $test.css('color', 'red')
				// 	$("#price1h_" + id).addClass('left');
				//
				// }
				// else {
				// 	console.log(myTd);
				// }

			}



			// Affichage des boutons de changement de page
			// afficheCacheBoutons(response);

		})
		//Ce code sera exécuté en cas d'échec - L'erreur est passée à fail()
		.fail(function (error) {
			alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
		})
}

