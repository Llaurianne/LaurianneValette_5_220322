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

document.onreadystatechange = function () {
    if (document.readyState == 'complete' && cartArray.length == 0) {
        alert("Votre panier est vide!\nVeuillez sélectionner vos articles et les ajouter au panier avant de remplir le formulaire pour transmettre votre commande.")
    }
}

for (let i in cartArray) {
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