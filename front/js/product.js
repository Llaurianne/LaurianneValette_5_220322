//----- 1. Afficher les détails du produit -----

//On récupère l'id du produit depuis l'URL
const idNumber = new URLSearchParams(document.location.search).get("id")

//Accès aux éléments HTML
const imageContainer = document.querySelector(".item__img")
const title = document.getElementById("title")
const price = document.getElementById("price")
const description = document.getElementById("description")
const colors = document.getElementById("colors")
const quantity = document.getElementById("quantity")

//Déclaration des variables globales
let selectedProduct

//Création et positionnement d'une nouvelle balise <img> (photo du produit) dans imageContainer
//Définition des attributs "src" et "alt" avec les valeurs contenues dans l'objet "product"
function createImg(product) {
    let newImg = document.createElement("img")
    imageContainer.appendChild(newImg)
    newImg.setAttribute("src",product.imageUrl)
    newImg.setAttribute("alt",product.altTxt)
}

//Création et positionnement pour chaque option possible d'une nouvelle balise <option> (couleur du produit) dans colors
//Définition des attributs "value" avec les valeurs contenues dans l'objet "product"
function createColors(product) {
    for  (let i in product.colors) {
        let newColor = document.createElement("option")
        colors.appendChild(newColor)
        newColor.setAttribute("value", product.colors[i])
        newColor.textContent = product.colors[i]
    }
}

//Envoi d'une requête à l'API contenant les informations sur l'ensemble des produits
fetch("http://localhost:3000/api/products/")
    //Si la requête aboutie, parser les données .json contenues dans le body de la réponse en objet JS
    .then(function(response) {
        if (response.ok) {
            return response.json()
        }
    })
    //Recherche du produit correspondant à l'id contenu dans l'URL
    //Création du code HTML permettant d'afficher les informations relatives au produit
    .then(function(data) {
        let index = data.findIndex(objet => objet._id == idNumber)
        selectedProduct = data[index]
        createImg(selectedProduct)
        title.textContent = selectedProduct.name
        price.textContent = selectedProduct.price
        description.textContent = selectedProduct.description
        createColors(selectedProduct)
    })
    //En cas d'erreur, affichage du message correspondant dans la console
    .catch(function(err){
        console.log(err.message)
    })


//----- 2. Ajouter les articles au panier -----

//Accès aux éléments HTML
const btnAddToCart = document.getElementById("addToCart")

//Déclaration des variables globales
let selectedColor
let selectedQuantity
let selectedParameters
let cartArray = []
let foundIndex

//Vérifier si un produit identique a déjà été ajouté au panier
function productInCart () {
    cartArray = JSON.parse(localStorage.cart)
    foundIndex = cartArray.findIndex(element => element._id == idNumber && element.color == selectedColor)
    return (foundIndex >= 0)
}

//Ajouter le produit au panier
function addToCart() {
    //Récupérer la couleur et la quantité sélectionnées
    selectedColor = colors.value
    selectedQuantity = parseInt(quantity.value)
    //Si le panier est vide : ajouter le 1er objet
    if (localStorage.length == 0) {
        selectedParameters = {_id : idNumber, color : selectedColor, quantity : selectedQuantity}
        cartArray.push(selectedParameters)
    }
    //Sinon, si le panier n'est pas vide et contient déjà un produit similaire : implémenter seulement la quantité
    else if (localStorage.length != 0 && productInCart()) {
        cartArray[foundIndex].quantity += selectedQuantity
    }
    //Sinon, si le panier n'est pas vide mais ne contient pas de produit similaire : récupérer le panier existant et ajouter un objet
    else {
        cartArray = JSON.parse(localStorage.cart)
        selectedParameters = { _id : idNumber, color : selectedColor, quantity : selectedQuantity }
        cartArray.push(selectedParameters)
    }
    //Mettre à jour le localStorage avec les nouvelles informations
    localStorage.cart = JSON.stringify(cartArray)
    console.log(localStorage)
    alert("Vos articles ont bien été ajoutés au panier.")
}


//Au clic sur le boutton "Ajouter au panier" on vérifie que les options sont choisies puis on appelle la fonction addToCart
btnAddToCart.addEventListener("click", function() {
    if (colors.value == "" ) {
        if (quantity.value == 0 ) {
            alert("Veuillez sélectionner une couleur et un nombre d'article(s)")
        } else {
            alert("Veuillez sélectionner une couleur")
        }
    } else {
        if (quantity.value == 0 ) {
            alert("Veuillez sélectionner un nombre d'article(s)")
        } else {
            addToCart()
        }
    }
})