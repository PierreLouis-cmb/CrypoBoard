$(document).ready(function() {

})



    function getCoins() {
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
                let cryptofiats = "";
                for (let i = 0; i < fiats.length; i++) {
                    //Var pour voir si .priceChange1h est négatif ou positif, retourne -1 si negatif
                    //let price1h = Math.sign(coins[i].priceChange1h);

                    //Variable de l'api
                    let name = fiats[i].name;
                    let rate = fiats[i].rate;
                    let symbol = fiats[i].symbol;
                    let imageUrl = fiats[i].imageUrl;

                    //Construction tableau
                    cryptofiats += '<tr>';
                    cryptofiats += `<td> <img src="${imageUrl}">${name}</td>`;
                    cryptofiats += `<td> ${symbol} </td>`;
                    cryptofiats += `<td> ${imageUrl} </td>`;
                    cryptofiats += '</tr>';
                    document.getElementById("data_fiats").innerHTML = cryptofiats;
                }
            })
            //Ce code sera exécuté en cas d'échec - L'erreur est passée à fail()
            .fail(function (error) {
                alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
            })
    }










