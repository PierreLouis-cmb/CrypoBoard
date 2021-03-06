$(document).ready(function () {
	//Déclaration des variable
	let page = 0;
	let perPage = 0;
	let val_recherche = "";
	let type_fiat="EUR"

	//Variable pour récuperer des éléments HTML
	$next = $('#next');
	$back = $('#back');
	$selectPage = $('#perPage');
	$recherche = $('#search');
	$renit = $('#renit');
	$back.hide();
	$input_serarch = $("#valsearch").val();
	$type_fiat=$('#type_fiat');
	perPage = $selectPage.val();


	//Sélécteur nombre de résultat par page
	$selectPage.change(function () {
		perPage = $selectPage.val();
		type_fiat = $type_fiat.val();
		console.log(type_fiat);
		getCoins(page, perPage,type_fiat);
	})

	$selectPage.val();

	//Page suivante
	$next.on('click', function () {
		console.log("Page suivante");
		page += 10; //si je veux adapter le nombre ne page à passer par rapport on nombre de résulat par page, metre la variable perPage
		getCoins(page, perPage,type_fiat);
		//Vérif si le btn color est déja en mode hide
		if($('#back').is(":visible")) {

		}
		else{
			$back.show();
		}
	});

	//Revenir sur la page d'avant
	$back.on('click', function () {
		console.log("Page précendente");
		page -= perPage;
		getCoins(page, perPage,type_fiat);
		if (page === 0) {
			$back.hide();
		}
	});

	//Recherche Crypto
	$recherche.on('click', function () {
		type_fiat = $type_fiat.val();
		let val_recherche = $("#valsearch").val()
		//Cacher btn suivant
		$next.hide();
		//Cacher btn select
		$('#perPage').hide();
		getCoin(val_recherche,type_fiat);
	});

	//Rénitialiser le filtre
	$renit.on('click', function () {
		getCoins(page, perPage,type_fiat)
		$("#valsearch").val("")
		$('#perPage').show();
	})


	//Activation de l'autocompletion recherche crypto (jqueryUI)
	$("#valsearch").focus(function () {
		getAllCoins()
	});

	//Changement de EUR à USD
	$type_fiat.change(function () {
		type_fiat = $type_fiat.val();
		getCoins(page, perPage,type_fiat);

	})

	//Appels des api
	getCoins(page, perPage,type_fiat);
	getFiats();
});


function getCoins(page, perPage,type_fiat) {
	// Construction de l'URL, en utilisant le nombre d'élement par page à afficher,la pagination et si eur ou USD
	let url = "https://api.coinstats.app/public/v1/coins";
	url += "?skip=" + page + "&limit=" + perPage + "&currency=" + type_fiat ;
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
			//Initialisation du tableau
			let tabCoins = "";
			for (let i = 0; i < coins.length; i++) {

				//Var pour voir si .priceChange1h est négatif ou positif, retourne -1 si negatif, 1 si positif et 0 si =0
				let price1h = Math.sign(coins[i].priceChange1h);
				//let price = Math.round(coins[i].price * 200) / 100
				//console.log(price);

				//Variable de l'api
				let id = coins[i].id;
				let price = coins[i].price.toFixed(4);
				let rank = coins[i].rank;
				let name = coins[i].name;
				let icon = coins[i].icon;
				let volume = coins[i].volume;
				let priceChange1h = coins[i].priceChange1h;
				let priceChange1d = coins[i].priceChange1d;
				let priceChange1w = coins[i].priceChange1w;
				let twitterUrl = coins[i].twitterUrl;
				let exp = coins[i].exp;
				let websiteUrl = coins[i].websiteUrl;

				//Changement de couleur (Si négatif,positif ou neutre)
				//init couleur
				let color = "";
				//Si Math.sign return ; -1 alors price négatif,1 price positif,0 price est neutre
				if (price1h === -1) {
					color = "red";
				} else if (price1h === 1) {
					color = "green"
				} else {
					color = "black"
				}

				//Construction tableau
				tabCoins += '<tr>';
				tabCoins += `<td> ${rank} </td>`;
				tabCoins += `<td> <a href ="${websiteUrl}" title="Site officiel"><img src="${icon}" class="logo">${name}</a></td>`;
				tabCoins += `<td> ${price} </td>`;
				tabCoins += `<td> ${volume} </td>`;
				//Poser la variable color dans la classe pour changer la couleur
				tabCoins += `<td id="price1h_${id}" class="pos neg ${" " + color}"> ${priceChange1h} %  </td>`;
				tabCoins += `<td id="price1d_${id}" class="pos neg ${" " + color}"> ${priceChange1d} %  </td>`;
				tabCoins += `<td id="price1w_${id}" class="pos neg ${" " + color}"> ${priceChange1w} %  </td>`;
				tabCoins += `<td class="img_td">  <a href="${twitterUrl}"> <img src="img/twitter.png"> </a></td>`;

				//Affichage des liens exp
				if (exp) {
					for (let i = 0; i < exp.length; i++) {
						tabCoins += `<td> <a href="${exp[i]}"><img src="img/link.png"></a> </td>`;
					}
					// cryptoCoins += `</div> <button type="button" id="btn_${id}"> VOIR</button></td>`
				}
				// $('#btn'+ id).on('click', function(){
				// 	alert("tes bo")
				// 	$('.exp'+ id ).show();
				// })
				tabCoins += '</tr>';
				document.getElementById("data").innerHTML = tabCoins;

			}

			// Affichage des boutons de changement de page
			// afficheCacheBoutons(response);

		})
		//Ce code sera exécuté en cas d'échec - L'erreur est passée à fail()
		.fail(function (error) {
			alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
		})
}

function getCoin(val_recherche,type_fiat) {
	// Construction de l'URL, en utilisant le nombre de page si défini
	let url = "https://api.coinstats.app/public/v1/coins/";
	url += val_recherche + "?currency=" + type_fiat
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

			let coin = response.coin;
			let tabCoin = "";
			console.log(coin)
			try {
				//Var pour voir si .priceChange1h est négatif ou positif, retourne -1 si negatif
				let price1h = Math.sign(coin.priceChange1h);
				let price = coin.price.toFixed(4)
				console.log(price);

				//Variable de l'api
				let id = coin.id;
				let rank = coin.rank;
				let name = coin.name;
				let icon = coin.icon;
				//let price = coins[i].price;
				let volume = coin.volume;
				let priceChange1h = coin.priceChange1h;
				let priceChange1d = coin.priceChange1d;
				let priceChange1w = coin.priceChange1w;
				let twitterUrl = coin.twitterUrl;
				let exp = coin.exp;
				//Changement de couleur
				let color = "";
				if (price1h === -1) {
					color = "red";
				} else if (price1h === 1) {
					color = "green"
				} else {
					color = "black"
				}
				//Construction tableau
				tabCoin += '<tr>';
				tabCoin += `<td> ${rank} </td>`;
				tabCoin += `<td> <img src="${icon}" class="logo">${name} </td>`;
				tabCoin += `<td> ${price} </td>`;
				tabCoin += `<td> ${volume} </td>`;
				//Poser la variable color dans la classe pour changer la couleur
				tabCoin += `<td id="price1h_${id}" class="pos neg ${" " + color}"> ${priceChange1h} %  </td>`;
				tabCoin += `<td id="price1d_${id}" class="pos neg ${" " + color}"> ${priceChange1d} %  </td>`;
				tabCoin += `<td id="price1w_${id}" class="pos neg ${" " + color}"> ${priceChange1w} %  </td>`;
				tabCoin += `<td>  <a href="${twitterUrl}"><img src="img/twitter.png"></a> </td>`;

				//lister les liens si il y en a
				if (exp) {
					for (let i = 0; i < exp.length; i++) {
						tabCoin += `<td>  <a href="${exp}">lien ${i}</a> </td>`;
					}
				}
				tabCoin += '</tr>';
				document.getElementById("data").innerHTML = tabCoin;
			} catch (e) {

				alert("Aucun résultat(s) trouvé(s) pour cette saisie")
			}

		})
		//Ce code sera exécuté en cas d'échec de la req - L'erreur est passée à fail()
		.fail(function (error) {
			alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
		})
}


function getFiats() {
	// Construction de l'URL, en utilisant le nombre de page si défini
	let url = "https://api.coinstats.app/public/v1/fiats";
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
			let fiats = response;
			let tabfiats = "";
			for (let i = 0; i < fiats.length; i++) {
				//Var pour voir si .priceChange1h est négatif ou positif, retourne -1 si negatif
				//let price1h = Math.sign(coins[i].priceChange1h);

				//Variable de l'api
				let name = fiats[i].name;
				let rate = fiats[i].rate.toFixed(4);
				let symbol = fiats[i].symbol;
				let imageUrl = fiats[i].imageUrl;

				//Construction tableau
				tabfiats += '<tr>';
				tabfiats += `<td> <img src="${imageUrl}" class="logo">${name}</td>`;
				tabfiats += `<td> ${rate} </td>`;
				tabfiats += `<td> ${symbol} </td>`;
				tabfiats += '</tr>';
				document.getElementById("data_fiats").innerHTML = tabfiats;
			}
		})
		//Ce code sera exécuté en cas d'échec - L'erreur est passée à fail()
		.fail(function (error) {
			alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
		})
}


function getAllCoins() {
	// Construction de l'URL, en utilisant le nombre de page si défini
	let url = "https://api.coinstats.app/public/v1/coins";
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
			let allCoins = response.coins;
			let autocompleteArray = new Array();
			for (let i = 0; i < allCoins.length; i++) {

				//Variable de l'api
				let id = allCoins[i].id;

				//Construction array pour autocompletion
				autocompleteArray[i] = id;

			}
			//Injection de l'array dans la liste du input
			$("#valsearch").autocomplete({

				source: autocompleteArray
			});

			console.log(autocompleteArray)
		})
		//Ce code sera exécuté en cas d'échec - L'erreur est passée à fail()
		.fail(function (error) {
			alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
		})
}

