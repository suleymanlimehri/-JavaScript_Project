document.addEventListener("DOMContentLoaded", async () => {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let currentUser = users.find((user) => user.isLogined == true); 
    let products = (await axios("http://localhost:3000/products")).data;
    function createUsercard() {
        let productCard = document.querySelector(".cards");

        products.forEach((product,index) => {
            let card = document.createElement("div");
            card.classList.add("card");
             card.innerHTML = `
          <div class="bags">
            <img class="bag" src="${product.image}" alt="">
          </div>
          <img class="star" src="${product.star}">
          <h5>${product.title.slice(0, 40)}...</h5>
          <div class="price-area">
            <p class="price">$${product.price}.00</p>
            <span class="desc">${product.description}</span>
          </div>
          <button class="add-to-cart" id="${product.id}">Add to Cart</button>
        `;
          let cardheart = document.createElement("div");
            cardheart.classList.add("card-heart");
            let heartIcon = document.createElement("i");
            heartIcon.classList.add("fa-regular","fa-heart","heart-icon");
        cardheart.appendChild(heartIcon);
        card.appendChild(cardheart) 
    heartIcon.addEventListener("click",(e) => {
      e.stopPropagation(),
     toggleuserwishlist(product.id, heartIcon)
 })

        let top=document.createElement("div")
        top.classList.add("top-area")
        if(index==0 || index==3){
            top.textContent="new"
            top.style.backgroundColor="green"
            top.style.color="white"
            top.style.borderRadius="8px"
            top.style.height="32px"
            top.style.width="79px"
            top.style.top="8px"
            top.style.left="10px"
            top.style.textAlign="center"
            
        }else if(index==1|| index==4|| index==5){
            top.textContent="30%"
            top.style.color="red"
            top.style.top="8px"
            top.style.left="10px"
            top.style.fontWeight="500"
            top.style.fontSize="17px"
        }
        card.appendChild(top)
        productCard.appendChild(card);  
        }); 
       
    }

 function toggleuserwishlist(productId, heartIcon) {
  if (!currentUser) {
      toast("please login to add wishlisst")
      setTimeout(() => {
          window.location.href = "login.html"
      }, 3000);
  }
  let userIndex = users.findIndex((user) => user.id == currentUser.id)

  let currentProduct = currentUser.wishlist.some((item) => item.id == productId)
  if (currentProduct) {
      let currentProductIndex = currentUser.wishlist.findIndex((product) => product.id == productId)
      currentUser.wishlist.splice(currentProductIndex, 1)
      toast("product removed wishlist")

      heartIcon.classList.add("fa-regular")
      heartIcon.classList.remove("fa-solid")

  } else {
      let addProduct = products.find((product) => product.id == productId)
      currentUser.wishlist.push(addProduct)
      users[userIndex] = currentUser
      localStorage.setItem("users", JSON.stringify(users))
      toast("product add wishlist")
      heartIcon.classList.remove("fa-regular")
      heartIcon.classList.add("fa-solid")
  }
  users[userIndex].wishlist = currentUser.wishlist
  localStorage.setItem("users", JSON.stringify(users))
}
    createUsercard()
    let toast = (text) => {
      Toastify({
          text: `${text}`,
          duration: 3000,
          position: "right",
          stopOnFocus: true,
          style: {
              background: "linear-gradient(to right,rgb(83, 253, 233),rgb(162, 255, 1))",
          },
          onClick: function () { }
      }).showToast();
  }
})
// document.addEventListener("DOMContentLoaded", async () => {
//     let products = (await axios("http://localhost:3000/products")).data;
  
//     function createUsercard() {
//       let userCard = document.querySelector(".cards");
  
//       products.forEach((product, index) => {
//         let card = document.createElement("div");
//         card.classList.add("card");
  
//         card.innerHTML = `
//           <div class="bags">
//             <img class="bag" src="${product.image}" alt="">
//           </div>
//           <img class="star" src="${product.star}">
//           <h5>${product.title.slice(0, 40)}...</h5>
//           <div class="price">
//             <p>$${product.price}.00</p>
//             <span>${product.description}</span>
//           </div>
//           <button class="add-to-cart" id="${product.id}">Add to Cart</button>
//         `;
  

//       
//         let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
//         if (favorites.includes(product.id)) {
//           heart.classList.add("fa-solid", "active");
//           heart.classList.remove("fa-regular");
//         }
//         heart.addEventListener("click", function () {
//           heart.classList.toggle("fa-solid");
//           heart.classList.toggle("fa-regular");
//           heart.classList.toggle("active");
  
//           let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  
//           if (heart.classList.contains("active")) {
//             favorites.push(product.id);
//             localStorage.setItem("favorites", JSON.stringify(favorites));
//           } else {
//             favorites = favorites.filter((itemId) => itemId != product.id);
//             localStorage.setItem("favorites", JSON.stringify(favorites));
//           }
//         });
  
//         userCard.appendChild(card);
//       });
//     }
  
//     createUsercard();
//   });