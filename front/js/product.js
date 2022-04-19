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