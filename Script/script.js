let options = { /* paramètres pour générer la date au format français */
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
};

/* ♦ Listes sous forme de tableaux ♦ */
let booksList = new Array();
let authorsList = new Array();
let categoryList = new Array();
// let categorieslist = new Array();

/* ♦ Liste filtres en variables ♦ */
let listAuthors = document.getElementById("listAuthors");
let listCategories = document.getElementById("listCategories");
let listBooks = document.getElementById("booksList");


/* • event sur le changement d'auteur • */
listAuthors.addEventListener("change", chargeByAuthor);
listCategories.addEventListener("change", chargeByCategories); // Ajouté

/* • event sur le loading • */
window.addEventListener("DOMContentLoaded", jsonOnLoad);

/* ♠ Appel du json ♠ */
function jsonOnLoad() {
    fetch("./Data/books.json")
        .then((response) => { /*Réponse*/
            return response.json(); /*en json*/
        })
        .then((data) => {
            createBooks(data);
            //  console.log(data); /* contrôle de data arrivant ou non */
        });
}

/* ♠ afficher les livres ♠ */
function createBooks(_books) {

    /* ◘ utile pour autre fonction ◘ */
    for (let book of _books) {
        booksList.push(book);

        for (let x = 0; x < book.authors.length; x++) {
            let authors = book.authors[x];

            /* vérif que l'auteur n'est pas dans ma liste, éviter les doublons*/
            if (authorsList.indexOf(authors) == -1) {
                authorsList.push(authors);
            }
        }
        for (let w = 0; w < book.categories.length; w++) {
            let categories = book.categories[w];

            /* ◘ On doit faire similaire pour les categories ◘ */

            if (categoryList.indexOf(categories) == -1) {/* vérifier que la catégorie n'est pas déjà dans ma liste */
                categoryList.push(categories);
            }
        }

    }
    booksList.sort();
    authorsList.sort(); //alphabétique ►
    categoryList.sort();

    for (let i = 0; i < authorsList.length; i++) { /* Création des authors dans la liste déroulante */
        let option = document.createElement("option");
        option.value = authorsList[i];
        option.innerText = authorsList[i];
        listAuthors.appendChild(option);
    }

    for (let h = 0; h < categoryList.length; h++) { /* Création des categories dans la liste déroulante */
        let option = document.createElement('option');
        option.value = categoryList[h];
        option.innerText = categoryList[h];
        listCategories.appendChild(option);
    }

    
    showBooks(booksList); /* ♠ */
}
// console.log(authorsList); categories also

// ♠ creer liste déroulante ♠
function showBooks(_books) {
    /* ♥ Initialisation d'un HTML VIDE ♥ */
    listBooks.innerHTML = "";
    /* ♣ La bouboucle des enfers ♣ */
    for (let y = 0; y < _books.length; y++) {
        let book = document.createElement("div"); /* ♦ indépendante de l'autre ♦ */
        book.setAttribute("class", "card"); /* attribut de la card */

        if (_books[y].thumbnailUrl == undefined /* prévoir vide ou non défini */ || _books[y].thumbnailUrl == null) {
            _books[y].thumbnailUrl = "";
        }

        let titre;
        if (_books[y].title.length > 20) {
            titre = _books[y].title.substring(0, 20) + "(...)"; /* Si + que 20 carac on les affiches ac pts de suspension */
        }
        else {
            titre = _books[y].title;
        }

        /* ◘ Afficher les images ◘ */
        book.innerHTML = '<img src="' + _books[y].thumbnailUrl + '" >' + '<h1 class="bookstitle"><span class="Infobulle" title="' + _books[y].title + '">' + titre + '</span></h1>';

        let description;
        let shortDescription;

        if (_books[y].shortDescription == undefined || _books[y].shortDescription == null) { /* Si le livre y n'a pas de shortDescription */
            if (_books[y].longDescription == undefined || _books[y].longDescription == null) {
                shortDescription = "Pas de description";
            }
            else {
                shortDescription = _books[y].longDescription.substring(0, 100);
            }
        }
        else {
            shortDescription = _books[y].shortDescription;
        }

        if (_books[y].longDescription == undefined || _books[y].longDescription == null) { /* Si le livre y n'a pas de longDescription */
            description = "Pas de description";
        }
        else {
            description = _books[y].longDescription;
        }

        if (_books[y].longDescription > 100) {
            shortDescription = shortDescription.substring(0, 100) + " (...)"; /* • afficher uniquement les 100 premiers caractères avec des pts de suspension • */
        }

        let nb_Isbn =_books[y].isbn;
        let nbPages = _books[y].pageCount;
        let datePubli;
        try { /* • test qui agit qd meme, un if qui gere les erreurs • */
            datePubli = new Date(_books[y].publishedDate.dt_txt).toLocaleDateString("fr-FR", options);
        }
        catch (error) {
            datePubli = "Pas de date de publication ";
        }
        if (nbPages == null || nbPages == undefined || nbPages === 0) {
            nbPages = "Non renseigné";
        } 

        book.innerHTML = '<img src="' + _books[y].thumbnailUrl + '" />' + '<h1 class = "booktitle"><span class="infobulle" title="' + _books[y].title + '">' + titre + '</span></h1>'+ datePubli + '<p>ISBN: ' + nb_Isbn + '</p>' + '<p>Nombre de pages : ' + nbPages + '</p>' + '<h6> <span class="infobulle" title="'+ description + '">' + shortDescription + '</span></h6>' /* ◘ Création dand le HTML ◘ */

        listBooks.appendChild(book);
    }
}

/* ♦ Filtre par auteur ♦ */
function chargeByAuthor() {
    // let e = document. enft non ♥
    let strAuthor = listAuthors.options[listAuthors.selectedIndex].text;
    console.log(strAuthor);

    let bookByAuthor = new Array();
    if (strAuthor == null || strAuthor == undefined) { /* Dans la liste, il y a une case blanche */
        return showBooks(booksList); /* ♦ Liste des livres ♦ */
    }
    else {
        for (let x = 0; x < booksList.length; x++) { /* donc si qq chose */
            let book = booksList[x]; /* ◘ on sort le livre ◘ */

            if (book.authors.indexOf(strAuthor) != -1) { /* • qui correspond à l'auteur souhaité • */
                bookByAuthor.push(book); /* Dans la variable */
            }

        }
    }

    bookByAuthor.sort();
    showBooks(bookByAuthor); /* ♦ Envoie la liste triée ♦ */

}

/* ♦ changement de catégorie ds liste ♦ */
function chargeByCategories() { /* meme fonctionnement que pour les auteurs */
    let strCategories = listCategories.options[listCategories.selectedIndex].text;
    console.log(strCategories);

    let bookByCategories = new Array();

    if (strCategories === "" || strCategories == undefined /* ||strCategories == null */) { /* vide */
        return showBooks(booksList); /* liste des livres */
    }
    else {
        for (let x = 0; x < booksList.length; x++) { /* donc si qq chose */
            let book = booksList[x]; /* on sort le livre */

            if (book.categories.indexOf(strCategories) != -1) { /* ◘ qui correspond à la catégorie souhaitée ◘ */
                bookByCategories.push(book); /* Dans la variable */
            }

        }
    }

    bookByCategories.sort();
    showBooks(bookByCategories); /* ○ Envoie la liste triée ○ */
}