document.addEventListener("DOMContentLoaded", async () => {
    let products = (await axios("http://localhost:3000/products")).data;
    function createUsercard() {
        let userCard = document.querySelector(".cards");
        products.forEach((product) => {
            let card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <img src="${product.image}" alt="">
                <img class="star" src="${product.star}" alt=""> 
                <h3>${product.title.slice(0,20)}...</h3> 
                <div class="price">
                <p class=""${product.price}</p>
                <span>${product.description}</span>
                </div>
                <button class="add-to-cart" id="${product.id}">Add to Cart</button>
            `; 
            userCard.appendChild(card);
        });
    }

    createUsercard()
})