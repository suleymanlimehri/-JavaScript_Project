document.addEventListener("DOMContentLoaded", () => {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let currentUser = users.find((user) => user.isLogined == true);
  let basket = currentUser?.basket || [];
  let basketContainer = document.querySelector("#cart-items");
  let subtotalElem = document.getElementById("subtotal");
  let totalElem = document.getElementById("total");
  let confirmBtn = document.getElementById("confirmBtn");
  let clearAllBtn = document.getElementById("clearAllBtn");

  function displayBasketProducts() {
    basketContainer.innerHTML = "";
    let subtotal = 0;

    basket.forEach((product) => {
      subtotal += product.price * product.count;

      let productCard = document.createElement("div");
      productCard.classList.add("product-card");

      let productImg = document.createElement("img");
      productImg.setAttribute("src", product.image);
      productImg.setAttribute("alt", product.title);
      productImg.classList.add("product-image");

      let productInfo = document.createElement("div");
      productInfo.classList.add("product-info");

      let title = document.createElement("h5");
      title.textContent = product.title;

      let sizeColor = document.createElement("p");
      sizeColor.textContent = `Size: XS  Color: Grey`;

      let delivery = document.createElement("p");
      delivery.textContent = `Delivery: 25-32 Days`;

      let quantityLabel = document.createElement("p");
      quantityLabel.textContent = "Quantity";

      let quantitySelect = document.createElement("div");
      quantitySelect.classList.add("quantity-selector");

      let decreaseBtn = document.createElement("button");
      decreaseBtn.textContent = "-";
      decreaseBtn.classList.add("quantity-btn");
      decreaseBtn.addEventListener("click", () => {
        if (product.count > 1) {
          product.count--;
          updateBasketInLocalStorage();
        }
      });

      let quantityDisplay = document.createElement("span");
      quantityDisplay.textContent = product.count;
      quantityDisplay.classList.add("quantity-display");

      let increaseBtn = document.createElement("button");
      increaseBtn.textContent = "+";
      increaseBtn.classList.add("quantity-btn");
      increaseBtn.addEventListener("click", () => {
        product.count++;
        updateBasketInLocalStorage();
      });

      quantitySelect.appendChild(decreaseBtn);
      quantitySelect.appendChild(quantityDisplay);
      quantitySelect.appendChild(increaseBtn);

      productInfo.appendChild(title);
      productInfo.appendChild(sizeColor);
      productInfo.appendChild(delivery);
      productInfo.appendChild(quantityLabel);
      productInfo.appendChild(quantitySelect);

      let productActions = document.createElement("div");
      productActions.classList.add("product-actions");

      let price = document.createElement("p");
      price.classList.add("product-price");
      price.textContent = `US $${product.price.toFixed(2)}`;

      let favoriteBtn = document.createElement("button");
      favoriteBtn.classList.add("fa-solid", "fa-heart", "favorite-btn");

      let removeBtn = document.createElement("button");
      removeBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
      removeBtn.classList.add("remove-btn");
      removeBtn.addEventListener("click", () => {
        removeProductFromBasket(product.id);
      });

      productActions.appendChild(price);
      productActions.appendChild(favoriteBtn);
      productActions.appendChild(removeBtn);

      productCard.appendChild(productImg);
      productCard.appendChild(productInfo);
      productCard.appendChild(productActions);

      basketContainer.appendChild(productCard);
    });

    subtotalElem.textContent = `US $${subtotal.toFixed(2)}`;
    totalElem.textContent = `US $${subtotal.toFixed(2)}`;
  }

  function updateBasketInLocalStorage() {
    let userIndex = users.findIndex((user) => user.id === currentUser.id);
    users[userIndex].basket = basket;
    localStorage.setItem("users", JSON.stringify(users));
    displayBasketProducts();
  }

  function removeProductFromBasket(productId) {
    basket = basket.filter((item) => item.id !== productId);
    updateBasketInLocalStorage();
  }

  confirmBtn.addEventListener("click", () => {
    if (basket.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Your basket is empty!",
        text: "Add some products before checking out 😊",
        confirmButtonText: "OK",
      });
    } else {
      console.log("Məhsullar:", basket);
    }
  });

  clearAllBtn.addEventListener("click", () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will remove all products from your basket.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, clear all",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        basket = [];
        updateBasketInLocalStorage();
       toast("basket bosdu")
      }
    });
  });

  displayBasketProducts();
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

  