document.addEventListener("DOMContentLoaded", () => {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let currentUser = users.find((user) => user.isLogined == true);
  let userWishlist = currentUser.wishlist || [];
  let basket = currentUser?.basket || [];
  let HomeImageRight = document.querySelector(".homeImageRight");
  let login = document.querySelector(".login");
  let register = document.querySelector(".register");
  let logout = document.querySelector(".logout");
  let userBtn = document.querySelector(".sign");

  function logoutUserFunction() {
    currentUser.isLogined = false;
    localStorage.setItem("users", JSON.stringify(users));
    userBtn.textContent = "username";
    updateStatus();
  }

  function updateStatus() {
    if (currentUser) {
      login.classList.add("d-none");
      register.classList.add("d-none");
      logout.classList.remove("d-none");
      userBtn.textContent = currentUser.username;
    } else {
      login.classList.remove("d-none");
      register.classList.remove("d-none");
      logout.classList.add("d-none");
    }
  }

  logout.addEventListener("click", logoutUserFunction);
  updateStatus();

  function createWishlistItem() {
    HomeImageRight.innerHTML = "";

    userWishlist.forEach((product) => {
      let card = document.createElement("div");
      card.classList.add("card");
      card.style.position = "relative";

      let bagsDiv = document.createElement("div");
      bagsDiv.classList.add("bags");

      let bagImg = document.createElement("img");
      bagImg.classList.add("bag");
      bagImg.src = product.image;
      bagImg.alt = "";

      bagsDiv.appendChild(bagImg);
      card.appendChild(bagsDiv);

      let starImg = document.createElement("img");
      starImg.classList.add("star");
      starImg.src = product.star;
      card.appendChild(starImg);

      let title = document.createElement("h5");
      title.textContent = `${product.title.slice(0, 40)}...`;
      card.appendChild(title);

      let priceArea = document.createElement("div");
      priceArea.classList.add("price-area");

      let price = document.createElement("p");
      price.classList.add("price");
      price.textContent = `$${product.price}.00`;

      let desc = document.createElement("span");
      desc.classList.add("desc");
      desc.textContent = product.description;

      priceArea.appendChild(price);
      priceArea.appendChild(desc);
      card.appendChild(priceArea);

      let addToCartBtn = document.createElement("button");
      addToCartBtn.classList.add("add-to-cart");
      addToCartBtn.id = product.id;
      addToCartBtn.textContent = "Add to Cart";
      addToCartBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        addBasket(product.id);
      });
      card.appendChild(addToCartBtn);

      let xIcon = document.createElement("i");
      xIcon.classList.add("fa-solid", "fa-xmark");
      xIcon.style.position = "absolute";
      xIcon.style.top = "10px";
      xIcon.style.right = "10px";
      xIcon.style.cursor = "pointer";
      xIcon.style.fontSize = "20px";
      xIcon.style.color = "#333";

      xIcon.addEventListener("click", () => {
        remove(product.id);
      });

      card.appendChild(xIcon);
      HomeImageRight.appendChild(card);
    });

    let removeBtn = document.querySelector(".remove");
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        let userIndex = users.findIndex((user) => user.id === currentUser.id);
        currentUser.wishlist = [];
        users[userIndex].wishlist = [];
        localStorage.setItem("users", JSON.stringify(users));
        HomeImageRight.innerHTML = "";
      });
    }

    function remove(productId) {
      let productIndex = currentUser.wishlist.findIndex((item) => item.id === productId);
      if (productIndex !== -1) {
        let userIndex = users.findIndex((user) => user.id === currentUser.id);
        currentUser.wishlist.splice(productIndex, 1);
        users[userIndex].wishlist = currentUser.wishlist;
        localStorage.setItem("users", JSON.stringify(users));
        toast("Product removed from wishlist");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    }
  }
  function addBasket(productId) {
    if (!currentUser) {
      toast("please login to basket");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 3000);
      return;
    }

    let existProduct = basket.find((product) => product.id == productId);
    let userIndex = users.findIndex((user) => user.id == currentUser.id);

    if (!existProduct) {
      let product = userWishlist.find((item) => item.id == productId);
      basket.push({ ...product, count: 1 });
      toast("product added successfully");
    } else {
      existProduct.count++;
      toast("product quantity increased");
    }

    users[userIndex].basket = basket;
    localStorage.setItem("users", JSON.stringify(users));
  }
  createWishlistItem();

  function toast(text) {
    Toastify({
      text: `${text}`,
      duration: 3000,
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #00b09b,rgb(87, 132, 183))",
      },
      onClick: function () { }
    }).showToast();
  }
});





