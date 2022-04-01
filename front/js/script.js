//Déclaration d'une constante items permettant d'accéder à l'élément HTML qui contiendra les produits
const items = document.getElementById("items")

//Déclaration des variables utilisées dans les fonctions
let newLink
let newArticle
let newImg
let newTitle
let newDescription

//Création et positionnement d'une balise <a> (correspondant à une carte produit) dans items
//Définition de l'attribut "href" incluant l'id contenu dans l'objet "product"
function createLink(product) {
    newLink = document.createElement("a")
    items.appendChild(newLink)
    newLink.setAttribute("href","./product.html?id="+product._id)
}

//Création et positionnement d'une nouvelle balise <article> dans newLink
function createArticle() {
    newArticle = document.createElement("article")
    newLink.appendChild(newArticle)
}

//Création et positionnement d'une nouvelle balise <img> (photo du produit) dans newArticle
//Définition des attributs "src" et "alt" avec les valeurs contenues dans l'objet "product"
function createImg(product) {
    newImg = document.createElement("img")
    newArticle.appendChild(newImg)
    newImg.setAttribute("src",product.imageUrl)
    newImg.setAttribute("alt",product.altTxt)
}

//Création et positionnement d'une nouvelle balise <h3> (nom du produit) dans newArticle
//Ajout de la classe "productName" à newTitle
//Définition du texte à afficher dans newTitle avec la valeur contenue dans l'objet "product"
function createTitle(product) {
    newTitle = document.createElement("h3")
    newArticle.appendChild(newTitle)
    newTitle.classList.add("productName")
    newTitle.textContent = product.name
}

//Création et positionnement d'une nouvelle balise <p> (description du produit) dans newArticle
//Ajout de la classe "productDescription" à newTitle
//Définition du texte à afficher dans newDescription avec la valeur contenue dans l'objet "product"
function createDescription(product) {
    newDescription = document.createElement("p")
    newArticle.appendChild(newDescription)
    newDescription.classList.add("productDescription")
    newDescription.textContent = product.description
}

//Envoi d'une requête à l'API contenant les informations sur l'ensemble des produits
fetch("http://localhost:3000/api/products/")
    //Si la requête aboutie, parser les données .json contenues dans le body de la réponse en objet JS
    .then(function(response) {
        if (response.ok) {
            return response.json()
        }
    })
    //Création du code HTML correspondant à chaque produit contenu dans le tableau data
    .then(function(data) {
        for (let i in data) {
            createLink(data[i])
            createArticle()
            createImg(data[i])
            createTitle(data[i])
            createDescription(data[i])
        }
    })
    //En cas d'erreur, affichage du message correspondant dans la console
    .catch(function(err){
        console.log(err.message)
    })
