const modal = document.getElementById('modal');
const btnInscription = document.getElementById('inscription-btn');
const span = document.getElementsByClassName('close')[0];
const btnConfirmInscription = document.getElementById('btn-confirm-inscription');
const inscriptionInputName = document.getElementById('username');
const inscriptionInputEmail = document.getElementById('email');
const inscriptionInputPasswd = document.getElementById('password');

let inscriptionErrorText = document.getElementById('inscription-error-message');

const ipAdress = "192.168.0.23";
const APIport = "3000";
let Products = [];

function AddProductInHTML(productContainer, product) {
    
  let productLi = document.createElement('li');
  productLi.innerHTML = `<img class ="music_img" src="${product.image}">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>Prix : ${product.price} €</p>`;
  productContainer.appendChild(productLi);
}

btnInscription.onclick = function() {
  modal.style.display = 'block';
};
//Si on clique sur la croix
span.onclick = function() {
  modal.style.display = 'none';
  inscriptionErrorText.innerHTML = "";
};
//Si
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
    inscriptionErrorText.innerHTML = "";
  }
};

fetch("http://" + ipAdress + ":" + APIport + "/api/getTableProduct", {method : 'GET'})
.then(response => {
  if(response.status != 403) {
    response.json().then((json) => {
      Products = json;
      const productContainer = document.getElementById('listproducts');
      Products.forEach(product => {
        AddProductInHTML(productContainer, product);
      });
    })
  }
})

btnConfirmInscription.addEventListener('click', () => {
  
  //Vérifiez si l'utilisateur a bien renseigner tout les champs
  if (inscriptionInputName.value.trim() === "" || inscriptionInputEmail.value.trim() === "" || inscriptionInputPasswd.value.trim() === "") {
    event.preventDefault();
    let errorMessage = "Veuillez remplir le champ : ";
    if(inscriptionInputName.value.trim() === "") errorMessage += "Nom d'utilisateur, ";
    if(inscriptionInputEmail.value.trim() === "") errorMessage += "Adresse Email, ";
    if(inscriptionInputPasswd.value.trim() === "") errorMessage += "Mot de passe, ";
    errorMessage = errorMessage.slice(0, -2); // pour enlever la virgule et l'espace en fin de chaine
    inscriptionErrorText.innerHTML = "<p>" + errorMessage + "</p>";
  }else {
    fetch("http://" + ipAdress + ":" + APIport + "/api/newRegistration", {
      method : 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        "name": inscriptionInputName.value.trim(),
        "email": inscriptionInputEmail.value.trim(),
        "passwd": inscriptionInputPasswd.value.trim(),
      })
    })
    .then(response => {
      if(response.status == 200) { // Réponse du serveur
        response.json().then(data => {
          console.log(data);
          if(data.sameName == true) { //Name
            inscriptionErrorText.innerHTML = "<p> Nom d'utilisateur déjà existant veuillez en rentrez un nouveau.</p>";
          }else if(data.sameEmail == true){ //Email
            inscriptionErrorText.innerHTML = "<p> Adresse Email déjà existante veuillez en rentrez une nouvelle.</p>";
          }else {
            console.log(data);
          }
        })
      }else if(response.status == 403){ //Erreur
        //event.preventDefault();
        response.json().then(data => {
          inscriptionErrorText.innerHTML = "<p>Erreur: " + data.error + "</p>";   
        });
      }
    })
  }
})