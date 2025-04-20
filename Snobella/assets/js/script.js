document.addEventListener("DOMContentLoaded", async () => {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let currentUser = users.find((user) => user.isLogined == true);
  let products = (await axios("http://localhost:3000/products")).data;
  let searchInput = document.querySelector(".searchitem");
  let searchBtn = document.querySelector(".searchicon");
  let basket = currentUser?.basket || [];
  let login = document.querySelector(".login");
  let register = document.querySelector(".register");
  let logout = document.querySelector(".logout");
  let userBtn = document.querySelector(".sign");
  let sortSelect = document.getElementById("sortSelect");

  basket.forEach((item) => {
    if (!item.count) {
      item.count = 1;
    }
  });

  let logoutUserFunction = () => {
    currentUser.isLogined = false;
    localStorage.setItem("users", JSON.stringify(users));
    userBtn.textContent = "username";
    updateStatus();
  };

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

  updateStatus();
  logout.addEventListener("click", logoutUserFunction);

  searchInput.addEventListener("input", () => {
    let query = searchInput.value.toLowerCase().trim();
    let filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(query)
    );
    createUsercard(filteredProducts);
  });

  searchBtn.addEventListener("click", () => {
    let searchValue = searchInput.value.trim().toLowerCase();
    let filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchValue)
    );
    createUsercard(filteredProducts);
  });

  sortSelect.addEventListener("change", () => {
    let sortValue = sortSelect.value;
    let sortedProducts = [...products];
    if (sortValue === "asc") {
      sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortValue === "desc") {
      sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortValue === "priceLowHigh") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === "priceHighLow") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }

    createUsercard(sortedProducts);
  });

  function createUsercard(productList = products) {
    let productCard = document.querySelector(".cards");
    productCard.innerHTML = "";

    productList.forEach((product, index) => {
      let card = document.createElement("div");
      card.classList.add("card");

      let bagsDiv = document.createElement("div");
      bagsDiv.classList.add("bags");

      let bagImg = document.createElement("img");
      bagImg.classList.add("bag");
      bagImg.setAttribute("src", product.image);
      bagImg.setAttribute("alt", "");
      bagsDiv.appendChild(bagImg);

      let starImg = document.createElement("img");
      starImg.classList.add("star");
      starImg.setAttribute("src", product.star);

      let title = document.createElement("h5");
      title.textContent = product.title.slice(0, 40) + "...";

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

      let addToCartBtn = document.createElement("button");
      addToCartBtn.classList.add("add-to-cart");
      addToCartBtn.textContent = "Add to Cart";
      addToCartBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        addBasket(product.id);
      });

      let cardheart = document.createElement("div");
      cardheart.classList.add("card-heart");
      let heartIcon = document.createElement("i");

      if (
        currentUser &&
        currentUser.wishlist.some((item) => item.id === product.id)
      ) {
        heartIcon.classList.add("fa-solid");
      } else {
        heartIcon.classList.add("fa-regular");
      }

      heartIcon.classList.add("fa-heart", "heart-icon");
      cardheart.appendChild(heartIcon);

      heartIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleuserwishlist(product.id, heartIcon);
      });

      let top = document.createElement("div");
      top.classList.add("top-area");
      if (index == 0 || index == 3) {
        top.textContent = "new";
        top.style.backgroundColor = "green";
        top.style.color = "white";
        top.style.borderRadius = "8px";
        top.style.height = "32px";
        top.style.width = "79px";
        top.style.top = "8px";
        top.style.left = "10px";
        top.style.textAlign = "center";
      } else if (index == 1 || index == 4 || index == 5) {
        top.textContent = "30%";
        top.style.color = "red";
        top.style.top = "8px";
        top.style.left = "10px";
        top.style.fontWeight = "500";
        top.style.fontSize = "17px";
      }

      card.appendChild(bagsDiv);
      card.appendChild(starImg);
      card.appendChild(title);
      card.appendChild(priceArea);
      card.appendChild(addToCartBtn);
      card.appendChild(cardheart);
      card.appendChild(top);
      productCard.appendChild(card);
    });

    function toggleuserwishlist(productId, heartIcon) {
      if (!currentUser) {
        toast("please login to add wishlist");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 3000);
        return;
      }

      let userIndex = users.findIndex((user) => user.id == currentUser.id);
      let currentProduct = currentUser.wishlist.some((item) => item.id == productId);

      if (currentProduct) {
        let currentProductIndex = currentUser.wishlist.findIndex(
          (product) => product.id == productId
        );
        currentUser.wishlist.splice(currentProductIndex, 1);
        toast("product removed from wishlist");
        heartIcon.classList.remove("fa-solid");
        heartIcon.classList.add("fa-regular");
      } else {
        let addProduct = products.find((product) => product.id == productId);
        currentUser.wishlist.push(addProduct);
        toast("product added to wishlist");
        heartIcon.classList.remove("fa-regular");
        heartIcon.classList.add("fa-solid");
      }

      users[userIndex].wishlist = currentUser.wishlist;
      localStorage.setItem("users", JSON.stringify(users));
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
      let product = products.find((item) => item.id == productId);
      basket.push({ ...product, count: 1 });
      toast("product added successfully");
    } else {
      existProduct.count++;
      toast("product quantity increased");
    }

    users[userIndex].basket = basket;
    localStorage.setItem("users", JSON.stringify(users));
    basketCount();
  }

  function basketCount() {
    let result = basket.reduce((acc, product) => acc + (product.count || 0), 0);
    let countIcon = document.querySelector(".basket-count");
    countIcon.textContent = result;
  }


  basketCount();
  updateStatus();
  createUsercard();
});

let toast = (text) => {
  Toastify({
    text: `${text}`,
    duration: 3000,
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, rgb(83, 253, 233), rgb(162, 255, 1))",
    },
    onClick: function () {},
  }).showToast();
};

