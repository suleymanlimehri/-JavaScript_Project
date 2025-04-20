document.addEventListener("DOMContentLoaded", async () => {
    let productId = new URLSearchParams(window.location.search).get("id");
  
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let currentUser = users.find(user => user.isLogined);
    let basket = currentUser?.basket || [];
  
    let product = await fetch(`http://localhost:3000/products/${productId}`)
      .then(res => res.json());
  
    document.getElementById("productTitle").textContent = product.title;
    document.getElementById("productDesc").textContent = product.description;
    document.getElementById("productPrice").innerHTML = `Price: $${product.price}`;
  
    let mainImage = document.getElementById("mainImage");
    mainImage.src = product.image;
  
    let thumbnailsDiv = document.querySelector(".thumbnails");
    product.images?.forEach(img => {
      let thumb = document.createElement("img");
      thumb.src = img;
      thumb.addEventListener("click", () => {
        mainImage.src = img;
      });
      thumbnailsDiv.appendChild(thumb);
    });
  
    document.getElementById("addToCart").addEventListener("click", () => {
      if (!currentUser) return alert("Login first!");
  
      let exist = basket.find(p => p.id == product.id);
      if (exist) {
        exist.count++;
      } else {
        basket.push({ ...product, count: 1 });
      }
  
      let userIndex = users.findIndex(user => user.id == currentUser.id);
      users[userIndex].basket = basket;
      localStorage.setItem("users", JSON.stringify(users));
      alert("Added to basket!");
    });
  
    document.getElementById("addToFavorite").addEventListener("click", (e) => {
      if (!currentUser) return alert("Login first!");
  
      let icon = e.currentTarget.querySelector("i");
      let wishlist = currentUser.wishlist || [];
  
      let exist = wishlist.find(p => p.id == product.id);
      if (exist) {
        wishlist = wishlist.filter(p => p.id != product.id);
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
      } else {
        wishlist.push(product);
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
      }
  
      let userIndex = users.findIndex(user => user.id == currentUser.id);
      users[userIndex].wishlist = wishlist;
      currentUser.wishlist = wishlist;
      localStorage.setItem("users", JSON.stringify(users));
    });
  });
  