//----- 1. Afficher les produits du panier et leurs caractéristiques, faire les totaux de prix et quantité, gérer les modifications et suppression -----

//Accès aux élements du DOM
const cartItems = document.getElementById("cart__items")

//Récupération des informations du panier contenues dans localStorage
let cartArray
if (localStorage.length !=0) { cartArray = JSON.parse(localStorage.cart)}

//Déclaration des variables globales
let newArticle
let nodeParent
let totalPrice = 0
let totalQuantity = 0

//Affichage d'un message d'alerte au chargement de la page si le panier est vide ou inexistant
document.onreadystatechange = function () {
    if (document.readyState == 'complete' && (cartArray == undefined || cartArray.length == 0)) {
        alert("Votre panier est vide!\nVeuillez sélectionner vos articles et les ajouter au panier avant de remplir le formulaire pour transmettre votre commande.")
    }
}

//Affichage du panier
for (let i in cartArray) {
    //Requête sur l'API pour récupérer les informations de chaque produit du panier
    fetch("http://localhost:3000/api/products/" + cartArray[i]._id)
        //Si la requête aboutie, parser les données .json contenues dans le body de la réponse en objet JS
        .then(function (response) {
            if (response.ok) {
                return response.json()
            }
        })
        .then(function (data) {
            cartArray[i].name = data.name
            cartArray[i].price = data.price
            cartArray[i].imageUrl = data.imageUrl
            cartArray[i].altTxt = data.altTxt
            viewCart(i)
            //Calcul des totaux après l'affichage du dernier produit du panier
            if (i == cartArray.length - 1) {
                updateTotalPriceAndQuantity()
            }
        })
        //En cas d'erreur, affichage du message correspondant dans la console
        .catch(function (err) {
            console.log(err.message)
        })
}

//Création et positionnement d'une balise <article> dans cartItems
//Ajout de la classe "cart__item et définition des attributs "data-id" et "data-color" avec les valeurs contenues dans cartArray
function createArticle(product) {
    newArticle = document.createElement("article")
    cartItems.appendChild(newArticle)
    newArticle.classList.add("cart__item")
    newArticle.setAttribute("data-id", cartArray[product]._id)
    newArticle.setAttribute("data-color", cartArray[product].color)
    nodeParent = newArticle
}

//Création et positionnement d'une balise <div> dans la balise parent nodeParent
//Ajout d'une classe définie d'après le nom de la classe de la balise parent et d'une fin donnée en argument
function createDiv(endOfClass) {
    let newDiv = document.createElement("div")
    nodeParent.appendChild(newDiv)
    newDiv.classList.add(nodeParent.className + endOfClass)
    nodeParent = newDiv
}

//Création et positionnement d'une balise <img> dans la balise parent nodeParent
//Ajout des attributs src et alt
function createImg(product) {
    let newImg = document.createElement("img")
    nodeParent.appendChild(newImg)
    newImg.setAttribute("src", product.imageUrl)
    newImg.setAttribute("alt", product.altTxt)
}

//Création et positionnement d'une balise <h2> dans la balise parent nodeParent
//Ajout du texte (nom du produit)
function createTitle(product) {
    let newTitle = document.createElement("h2")
    nodeParent.appendChild(newTitle)
    newTitle.textContent = product.name
}

//Création et positionnement d'une balise <p> dans la balise parent nodeParent
//Ajout du texte et d'une classe donnés en arguments
function createParagraph(index, text) {
    let newParagraph = document.createElement("p")
    nodeParent.appendChild(newParagraph)
    newParagraph.textContent = text
    //Lorsque on clique sur le paragraphe correspondant à "Supprimer" on supprime l'article du panier
    if (newParagraph.closest("div").className == "cart__item__content__settings__delete" ) {
        newParagraph.classList.add("deleteItem")
        newParagraph.onclick = function() {
            removeFromCart(index, this)
        }
    }
}

//Suppression de l'article situé à l'index i du panier, mise à jour du localStorage, de l'affichage et des totaux prix et quantiité
function removeFromCart(index, element) {
    if (cartArray.length == 1) {
        cartArray = []
    } else {
        cartArray.splice(index, 1)
    }
    localStorage.cart = JSON.stringify(cartArray)
    element.closest("article").remove()
    updateTotalPriceAndQuantity()
}

//Création et positionnement d'une balise <input> dans la balise parent nodeParent
//Ajout d'attributs, dont la quantité récupérée dans le panier cartArray
function createInput(product) {
    let newInput = document.createElement("input")
    nodeParent.appendChild(newInput)
    newInput.type = "number"
    newInput.className = "itemQuantity"
    newInput.setAttribute("name", "itemQuantity")
    newInput.setAttribute("min", 1)
    newInput.setAttribute("max", 100)
    newInput.value = product.quantity
    //A chaque modification de quantité, mettre à jour le panier cartArray, le localStorage, et les totaux prix et quantité
    newInput.onchange = function() {
        updateQuantity(product, this)
        updateTotalPriceAndQuantity()
    }
}

//Mise à jour des nouvelles quantités dans cartArray et localStorage selon la valeur de l'input
function updateQuantity(anyProduct, input) {
    anyProduct.quantity = parseInt(input.value)
    localStorage.cart = JSON.stringify(cartArray)
}

//(Re)Calculer les totaux de prix et quantité puis les afficher
function updateTotalPriceAndQuantity() {
    totalPrice = 0
    totalQuantity = 0
    for (let i in cartArray) {
        totalPrice += cartArray[i].price * cartArray[i].quantity
        totalQuantity += cartArray[i].quantity
    }
    document.getElementById("totalPrice").innerText = new Intl.NumberFormat('fr-FR', {minimumFractionDigits: 2}).format(totalPrice)
    document.getElementById("totalQuantity").innerText = totalQuantity
    console.log("Panier : ")
    console.log(cartArray)
    console.log("Nombre total d'articles : " + totalQuantity)
    console.log("Prix total : " + totalPrice + ",00 €")
}

//(Re)Calculer les totaux de prix et quantité puis les afficher
function updateTotalPriceAndQuantity() {
    totalPrice = 0
    totalQuantity = 0
    for (let i in cartArray) {
        totalPrice += cartArray[i].price * cartArray[i].quantity
        totalQuantity += cartArray[i].quantity
    }
    document.getElementById("totalPrice").innerText = new Intl.NumberFormat('fr-FR', {minimumFractionDigits: 2}).format(totalPrice)
    document.getElementById("totalQuantity").innerText = totalQuantity
    console.log("Panier : ")
    console.log(cartArray)
    console.log("Nombre total d'articles : " + totalQuantity)
    console.log("Prix total : " + totalPrice + ",00 €")
}

//Parcourir la liste des produits du panier
//Créer les nouveaux éléments du DOM
function viewCart(i) {
    createArticle(i)
    createDiv("__img")
    createImg(cartArray[i])
    nodeParent = newArticle
    createDiv("__content")
    createDiv("__description")
    createTitle(cartArray[i])
    createParagraph(i, cartArray[i].color)
    createParagraph(i, new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(cartArray[i].price))
    nodeParent = document.getElementsByClassName("cart__item__content")[i]
    createDiv("__settings")
    createDiv("__quantity")
    createParagraph(i, "Qté : ")
    createInput(cartArray[i])
    nodeParent = document.getElementsByClassName("cart__item__content__settings")[i]
    createDiv("__delete")
    createParagraph(i, "Supprimer", "deleteItem")
}


//----- 2. Vérifier la validité des données renseignées dans le formulaire -----

//Initialisation d'un objet stockant la valeur true/false de la validité de tous les champs du formulaire
let results = {
    firstName : false,
    lastName : false,
    address : false,
    city : false,
    email : false
}

//Vérification de la validité des données renseignées par application de regex
function checkInput(element) {
    let regex
    element.onchange = function () {
        //Différenciation des cas rencontrés dans les différents champs : regex différentes
        switch (element) {
            case firstName :
            case lastName :
                regex = /[A-ZÀ-Ÿa-z- ']$/
                break
            case address :
            case city :
                regex = /[0-9A-ZÀ-Ÿa-z-, ']$/
                break
            case email :
                regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                break
        }
        //Stockage du résultat dans le tableau results
        results[element.name] = regex.test(element.value)
        //Affichage d'un message d'erreur si le test échoue
        if (!results[element.name]) {
            document.getElementById(element.id + "ErrorMsg").innerText = "Format invalide"
        } else {
            document.getElementById(element.id + "ErrorMsg").innerText = ""

        }
    }
}

//Application du test sur chacun des champs
checkInput(firstName)
checkInput(lastName)
checkInput(address)
checkInput(city)
checkInput(email)


//----- 3. Commander -----

//Créer un tableau avec les ids des produits commandés
let listOfIds = []
function createListOfIds() {
    for (let i in cartArray) {
        listOfIds.push(cartArray[i]._id)
    }
}

//Rassembler les données à transmettre à l'API
let orderInfos
function createOrderInfos() {
    orderInfos = {
        contact: {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value
        },
        products: listOfIds
    }
}

//Envoyer la commande à la soumission du formulaire
document.querySelector(".cart__order__form").addEventListener("submit", function (event) {
    event.preventDefault()
    createListOfIds()
    createOrderInfos()
    console.log(orderInfos)
    //Envoi des informations à l'API seulement si le panier n'est pas vide ET tous les champs du formulaire sont correctement renseignés
    if (listOfIds != 0 && Object.values(results).every(value => value == true)) {
        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderInfos),
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json()
                }
            })
            //Réinitialiser le localStorage et rediriger l'utilisateur vers la page de confirmation
            .then(function (data) {
                console.log(data.orderId)
                localStorage.clear()
                document.location.href = "confirmation.html?orderId=" + data.orderId
            })
            //En cas d'erreur, affichage du message correspondant dans la console
            .catch(function (err) {
                console.log(err.message)
            })
    //Message à afficher si un ou plusieurs champs du formulaire n'est pas correct
    } else if (!Object.values(results).every(value => value == true)) {
        alert("Veuillez compléter et/ou vérifier les données du formulaire.")
    //Message à afficher si le panier est toujours vide
    } else if (listOfIds == 0) {
        alert("Votre panier est vide!\nVeuillez sélectionner vos articles et les ajouter au panier avant de remplir le formulaire pour transmettre votre commande.")
    }
})