
const ipAdress = "192.168.0.23";
const APIport = "3000";
let Products = [];

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

  function AddProductInHTML(productContainer, product) {
    
    let productLi = document.createElement('li');
    productLi.innerHTML = `<img class ="music_img" src="${product.image}">
                          <h3>${product.name}</h3>
                          <p>${product.description}</p>
                          <p>Prix : ${product.price} €</p>`;

    productContainer.appendChild(productLi);

  }