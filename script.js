////////////////////////////////////////////// AFFICHER CARTE DEBUT ////////////////////////////////////////////////////////////////////////

function démarrage(){ 
    const cards = document/*=élément HTML*/.querySelectorAll /*Selectionne les éléments contenant 'card'*/('.card');
  
    // Afficher toutes les faces avant au début // Pour chaque carte, l'élément avec la classe .front est affiché tandis que l'élément avec la class .back est masqué
    cards.forEach(card => {
      card.querySelector('.front').style.display = 'block'; /*Element affiché*/
      card.querySelector('.back').style.display = 'none';//Elément masqué
    });
  
    // Cacher les cartes après delais
    setTimeout/*Fonction native permettant de déclencher une liste d'ordre après un temps donnée*/(() => {
      cards.forEach/*Parcours les éléments du tableau*/(card => {
        card.querySelector('.front').style.display = 'none'; /*Selectionne le front*/ /*Element masqué*/
        card.querySelector('.back').style.display = 'block';/*Selectionne le back*/ /*Element affiché*/
      });
    }, 2000); // délais millisecondes
  };
////////////////////////////////////////////// RANDOM CARTE /////////////////////////////////////

 // Mélanger les cartes
 function shuffleArray /*Fonction non native permettant de mélanger un tableau*/ (array) {
    for (let i = array.length - 1; i > 0; i--) /*Commence par la fin du tableau*/ {
        const j = Math.floor(Math.random() * (i + 1)); //Génère nombre aléatoire
        [array[i], array[j]] = [array[j], array[i]]; // Échange les éléments
    }
    return array; // Retourne le tableau mélangé
}

// Mélanger les cartes du tableau
function shuffleCards() {

    const cards = Array.from(document.querySelectorAll('.card')); // Selectionne le HTML avec les élément ".card"
    
    const shuffledCards = shuffleArray(cards); // Mélange l'ordre du tableau [card] obtenu précédemment grâce à la fonction shuffleArray

    const table = document.getElementById('game-table'); 
    const cells = Array.from(table.querySelectorAll('td'));

    shuffledCards.forEach((card, index) => {
        cells[index].innerHTML = ''; //vide l'index des cellules du html pour les remplir après(ligne suivante) avec notre tableau mélangé
        cells[index].appendChild(card);
        ;
    });
}

// Mélanger les cartes
shuffleCards();

//////////////////////////////////////////////CARTE CLICK/////////////////////////////////////
// Initie les variables pour la gestion des cartes retournées et des tentatives, permet que ces variables est une portée globale
let record = 50;
let firstCard = null; 
let secondCard = null;
let lockBoard = false;
let decompte = null;
let tentative = 0;
updateTentativeDisplay();

// Ajouter les écouteurs d'événements qui se déclenche lorsque l'on clique pour activer flipCard 
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', flipCard);
});

// Fonction pour retourner une carte
function flipCard() {
    if (lockBoard) return; // Empêche de retourner les cartes pendant la vérification (lockboard devient vrai au moment de la vérif et repasse false une fois que les cartes se retournent)


    this.querySelector('.front').style.display = 'block'; 
    this.querySelector('.back').style.display = 'none'; //les deux lignes permettent de changer l'affichage pour retourner la carte

    if (!firstCard){ // on vérifie si c'est la première carte retournée, si non on stock la valeur;
        firstCard = this;
        firstCard.removeEventListener('click', flipCard);//impossible de reselectionner la première carte
        return;
    }

    secondCard = this;
    checkForMatch(); // déclenche la fonction pour vérifier si les cartes sont identique
}

////////////////////////////////////////////// CARTE IDENTIQUE /////////////////////////////////////
// Vérifier si les deux cartes retournées sont identiques
function checkForMatch() {
    const isMatch = firstCard.querySelector ('.front').src === secondCard.querySelector('.front').src;//compare l'adresse de la carte 1 et carte 2 pour voir si elles sont identiques
    tentative= tentative+1; //incrémente le nombre de tentative de 1
    if (isMatch) {
        disableCards(); //si ça correspond on déclenche la fonction disableCards qui enlève l'EventListener qui rend la carte inerte.
    } else {
        //alert('Les deux cartes ne sont pas identiques')<-- Code demandé dans le brief mais nuis à la fluidité du jeu
        firstCard.addEventListener('click', flipCard); //ractve la 1er carte
        unflipCards();//sinon active la fonction unflipCards qui retourne les cartes après 3 secondes
    }
    updateTentativeDisplay();//déclenche la fonction pour mettre à jour le compteur
    victoire()//vérifie si toutes les cartes ont été trouvée
    };


// Fonction pour désactiver les cartes qui correspondent
function disableCards() {
    secondCard.removeEventListener('click', flipCard);//enleve l'eventlistener des cartes, cela veut dire qu'on ne peut plus cliquer dessus, cela évite de reselectionner une carte déjà trouvée
    resetBoard();// réinitialise les variables pour comparer à l'état d'origine (null ou false)
}

// Fonction pour retourner les cartes qui ne correspondent pas
function unflipCards() {
    lockBoard = true; //permet de bloquer le click de l'utilisateur le temps de retourner les cartes
    setTimeout(() => {
        firstCard.querySelector('.front').style.display = 'none';
        firstCard.querySelector('.back').style.display = 'block'; //retourne la première carte
        secondCard.querySelector('.front').style.display = 'none';
        secondCard.querySelector('.back').style.display = 'block'; //retourne la deuxième carte

        resetBoard();//réinitialise les variables qui permettent de vérifier les paires à leur valeur d'origine
    }, 1000); // Délai pour retourner les cartes
}

// Fonction pour réinitialiser les variables de gestion des cartes
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

////////////////////////////////////////////// TENTATIVES /////////////////////////////////////
// Affiche le nombre de tentatives sur la page

function updateTentativeDisplay() { //comme la variable change à chaque essai raté, il faut actualiser également l'affichage de cette variable, c'est ce que fait la fonction.
    let affichage = document.getElementById('tentative'); // Récupère l'élément HTML où les tentatives sont affichées
    affichage.innerText = `Tentatives: ${tentative} 
    Record: ${record}`;// Affiche le texte après le = et la valeur de la variable tentative à l'instant où on lance la fonction
};

////////////////////////////////////////////// VICTOIRE ///////////////////////////////////
function victoire() {
    const dos = document.querySelectorAll('.back'); //récupère toutes les dos de cartes dans un tableau
    let fini = true; // cette condition va permettre de déclencher la fin de partie en cas de victoire

    dos.forEach((e) => { // pour chaque élément du tableau dos (les dos de nos cartes) on regarde si le dos est caché
        if (e.style.display !== 'none') { //tant qu'il reste des cartes face cachée
            fini = false; // la variable fini passe fausse quand tous les dos seront cachées (donc toutes les paires trouvées) fini restera vrai et déclenche la condition suivante
        }
    });

    if (fini) { //la condition se déclenche quand toutes les paires sont trouvées
        document.getElementById("jeu").style.display = "none"; // cache le block de jeu
        document.getElementById("victoire").style.display = "block"; // affiche le block de texte pour la victoire
        stopTimer(); // Arrête le chronomètre en cas de victoire
        
        if(tentative < record){ //normalement ça devrait être l'inverse mais ça marche que dans ce sens chelou
            let affichage = document.getElementById('score'); // Récupère l'élément HTML où les tentatives sont affichées
            affichage.innerText = `Tu as battu ton record de ${record-tentative} coups !! Tu auras eu besoin que de ${tentative} coups pour réussir`;
            record = tentative
        }else{
        let affichage = document.getElementById('score'); // Récupère l'élément HTML où les tentatives sont affichées
        affichage.innerText = `Bien joué tu as eu besoin de ${tentative} coups pour réussir.`; // Affiche le texte après le = et la valeur de la variable tentative à l'instant où on lance la fonction
        }}
};

////////////////////////////////////////////// REFRESH ///////////////////////////////////
function refresh(){
    démarrage(); // Réinitialise l'affichage des cartes
    shuffleCards(); // Mélange les cartes
    resetBoard(); // Réinitialise les variables du jeu
    tentative = 0; 
    updateTentativeDisplay(); // Met à jour l'affichage des tentatives
    document.querySelectorAll('.card').forEach(card => {// Ajoute les écouteurs d'événements aux cartes
        card.addEventListener('click', flipCard);
    });
    stopTimer(); // Arrête tout chronomètre existant
    document.getElementById('chrono').innerText = "Temps: 03:00"; // Réinitialise l'affichage du chronomètre
    chronoStart(); // Démarre un nouveau chronomètre
}


  document.getElementById('refresh') /*Attraper le refresh du HTML*/.addEventListener('click', function(){
    refresh();
  });

////////////////////////////////////////////// LANCEMENT DU JEU ///////////////////////////////////
document.getElementById("start").addEventListener("click", function() { // cache le premier écran et affiche le jeu
    document.getElementById("intro").style.display = "none";
    document.getElementById("jeu").style.display = "block";
    démarrage(); // reset
    shuffleCards(); // redistribue les cartes
    resetBoard(); // vide les conditions
    chronoStart(); // Démarre le chronomètre
});

////////////////////////////////////////////// REBOOT DU JEU SI DEFAITE ///////////////////////////////////
document.getElementById("game-over").addEventListener("click", function() {
    // Masquer l'écran de démarrage
    document.getElementById("game-over").style.display = "none";
    
    // Afficher le contenu du jeu
    document.getElementById("jeu").style.display = "block";
    refresh();
});

////////////////////////////////////////////// REBOOT DU JEU SI VICTOIRE ///////////////////////////////////
document.getElementById("victoire").addEventListener("click", function() {
    // Masquer l'écran de victoire
    document.getElementById("victoire").style.display = "none";
    
    // Afficher le contenu du jeu
    document.getElementById("jeu").style.display = "block";
    refresh();
});


////////////////////////////////////////////// CHRONOMETRE //////////////////////////////////////////////
const maxTime = 180000; // 3 minutes en millisecondes

function chronoStart() {
    stopTimer(); // Arrête tout chronomètre existant avant d'en démarrer un nouveau

    const startTime = Date.now(); // Capture le temps de départ

    decompte = setInterval(() => {
        const elapsedTime = Date.now() - startTime; // Temps écoulé depuis le démarrage
        const timeLeft = maxTime - elapsedTime; // Temps restant

        if (timeLeft <= 0) { // Si le temps est écoulé
            stopTimer(); // Arrête le chronomètre
            document.getElementById('chrono').innerText = chronoAffiche(0); // Affiche 00:00

            // Masque le jeu et affiche l'écran de défaite
            document.getElementById("jeu").style.display = "none";
            document.getElementById("game-over").style.display = "block";

            // Personnalise le message de défaite
            const gameOverMessage = document.getElementById("game-over");
            if (gameOverMessage) {
                gameOverMessage.innerHTML = `
                <h2>Partie terminée</h2>
                <p>Le temps est écoulé… La nature attendra encore un peu avant d’être rééquilibrée.</p>
                <button id="restart" class="start">Recommencer le Jeu</button>
                `;

                // Ajoute un écouteur d'événement au nouveau bouton "Recommencer le Jeu"
                document.getElementById("restart").addEventListener("click", function(){
                    document.getElementById("game-over").style.display = "none";
                    document.getElementById("jeu").style.display = "block";
                    refresh(); // Réinitialise le jeu
                });
            }
        } else {
            // Met à jour l'affichage du chronomètre
            document.getElementById('chrono').innerText = chronoAffiche(timeLeft);
        }
    }, 1000); // Mise à jour toutes les secondes
}


function chronoAffiche(temps) { // Fonction qui va afficher le temps au format Minutes : Secondes
    const minutes = Math.floor(temps / 60000); // Récupère les minutes
    const seconds = Math.floor((temps % 60000) / 1000); // Récupère les secondes
    return `Temps: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`; // Formate l'affichage
}

function stopTimer() {//stop le temps et vérifie qu'il n'y a pas plusieurs décompte simultané
    if (decompte) { // Vérifie si un intervalle existe
        clearInterval(decompte); // Arrête l'intervalle
        decompte = null; // Réinitialise la variable
    }
}


