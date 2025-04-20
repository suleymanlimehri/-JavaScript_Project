async function loadProduct() {
  let response = await fetch("http://localhost:3000/products");
      let products = await response.json();
    try {
     
  
      let urlParams = new URLSearchParams(window.location.search);
      let productId = parseInt(urlParams.get('id'));
      let product = products.find(p => Number(p.id) === productId);
      
  
      if (!product) {
        document.querySelector('.product-container').innerText = "Product not found.";
        return;
      }

      let titleDesc = document.querySelector('.titleDesc');
    if (titleDesc) {
      titleDesc.textContent = product.title ;
    }
      renderProductDetail(product);
  
    } catch (error) {
      console.error("Error loading product:", error);
    }
  }
   
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let currentUser = users.find((user) => user.isLogined == true);
  function renderProductDetail(product) {
    let container = document.querySelector('.product-container');
  
    let card = document.createElement('div');
    card.classList.add('product-card'); 
  
    let imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    heartIcon=document.createElement("i")
    heartIcon.classList.add("fa-regular","fa-heart","heart-icon")
    heartIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleuserwishlist(product.id, heartIcon,product);
    });

    let img = document.createElement('img');
    img.src = product.image;
  
    let discountBadge = document.createElement('span');
    discountBadge.className = 'discount-badge';
    discountBadge.textContent = product.discount || "30%";
  
    imageDiv.appendChild(img);
    imageDiv.appendChild(heartIcon);
    imageDiv.appendChild(discountBadge);
  
    let textDiv = document.createElement('div');
    textDiv.classList.add('text');
  
    let topDiv = document.createElement('div');
    topDiv.classList.add('top');
  
    let h5 = document.createElement('h5');
    h5.textContent = product.name;
  
    let ratingDiv = document.createElement('div');
    ratingDiv.classList.add('rating');
    ratingDiv.innerHTML = `<i class="fa fa-star"></i><span>${product.rating || '5.0'} | ${product.reviews || '2 reviews'}</span>`;
  
    topDiv.appendChild(h5);
    topDiv.appendChild(ratingDiv);
  
    let centerDiv = document.createElement('div');
    centerDiv.classList.add('center');
  
    let leftDiv = document.createElement('div');
    leftDiv.classList.add('left');
  
    let priceOption1 = createPriceOption("2-9 pieces", product.price1 || "US $20.00");
    let priceOption2 = createPriceOption("10-49 pieces", product.price2 || "US $15.00");
    leftDiv.append(priceOption1, priceOption2);
  
    let rightDiv = document.createElement('div');
    rightDiv.classList.add('right');
  
    let priceOption3 = createPriceOption("50 pieces", product.price3 || "US $12.00", true);
    let priceOption4 = createPriceOption("2-9 pieces", product.price1 || "US $20.00");
    rightDiv.append(priceOption3, priceOption4);
  
    centerDiv.append(leftDiv, rightDiv);
  
    let bottomDiv = document.createElement('div');
    bottomDiv.classList.add('bottom');
  
    let sizeDiv = document.createElement('div');
    sizeDiv.classList.add('size');
    sizeDiv.innerHTML = `<h5>Size</h5>
      <button type="button">XS</button>
      <button type="button">S</button>
      <button type="button">M</button>`;
  
    let colorDiv = document.createElement('div');
    colorDiv.classList.add('color');
    colorDiv.innerHTML = `<h5>Color</h5>
      <button type="button" class="color-option orange"></button>
      <button type="button" class="color-option blue"></button>
      <button type="button" class="color-option green"></button>
      <button type="button" class="color-option pink"></button>`;
  
    bottomDiv.append(sizeDiv, colorDiv);
  
    let buttonGroup = document.createElement('div');
    buttonGroup.classList.add('button-group');
  
    let addToCartBtn = document.createElement('button');
    addToCartBtn.type = 'button';
    addToCartBtn.className = 'add-to-cart';
    addToCartBtn.textContent = 'Add to Cart';
    addToCartBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      addBasket(product.id);
    });
  
    let cashPaymentBtn = document.createElement('button');
    cashPaymentBtn.type = 'button';
    cashPaymentBtn.className = 'cash-payment';
    cashPaymentBtn.textContent = 'Cash Payment';
  
    buttonGroup.append(addToCartBtn, cashPaymentBtn);
  
    let whatsappLink = document.createElement('a');
    whatsappLink.href = '#';
    whatsappLink.className = 'whatsapp-order';
    whatsappLink.textContent = 'WhatsApp Order';
  
    textDiv.append(topDiv, centerDiv, bottomDiv, buttonGroup, whatsappLink);
    card.append(imageDiv, textDiv);
    container.appendChild(card);
  }
  function toggleuserwishlist(productId, heartIcon, product) {
    if (!product) {
      console.error("Product is undefined in wishlist toggle!");
      return;
    }
  
    if (!currentUser) {
      toast("please login to add wishlist");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 3000);
      return;
    }
  
    currentUser.wishlist = currentUser.wishlist || [];
  
    let userIndex = users.findIndex((user) => user.id == currentUser?.id);
    if (userIndex === -1) {
      console.error("Current user not found in users array!");
      return;
    }
  
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
      currentUser.wishlist.push(product);
      toast("product added to wishlist");
      heartIcon.classList.remove("fa-regular");
      heartIcon.classList.add("fa-solid");
    }
  
    users[userIndex].wishlist = currentUser.wishlist;
    localStorage.setItem("users", JSON.stringify(users));
  }
  
  
  function createPriceOption(label, price, highlight = false) {
    let option = document.createElement('div');
    option.classList.add('price-option');
    if (highlight) option.classList.add('highlight');
  
    let span = document.createElement('span');
    span.textContent = label;
  
    let h6 = document.createElement('h6');
    h6.textContent = price;
  
    option.append(span, h6);
    return option;
  }
  function addBasket(productId) {
    if (!currentUser) {
      toast("Please login to add to basket.");
      setTimeout(() => {
        window.location.href = "login.html"; 
      }, 3000);
      return;
    }
    let basket = currentUser ? currentUser.basket : [];
    let existProduct = basket.find((product) => product.id == productId);
    let userIndex = users.findIndex((user) => user.id == currentUser.id);

    if (!existProduct) {
      let product = product.find((item) => item.id == productId);
      basket.push({ ...product, count: 1 });
      toast("Product added to basket");
    } else {
      existProduct.count++;
      toast("Product quantity increased");
    }

    users[userIndex].basket = basket;
    localStorage.setItem("users", JSON.stringify(users));
  }
  
  loadProduct();
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
