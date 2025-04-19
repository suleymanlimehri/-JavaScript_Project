document.addEventListener("DOMContentLoaded", async () => {
    let products = (await axios("http://localhost:3000/products")).data;
    function createUsercard() {
        let userCard = document.querySelector(".cards");
     
        products.forEach((product,index) => { 
            let card = document.createElement("div");
            card.classList.add("card");
            let topcard=document.querySelector("badge")
            if ([0, 3].includes(index)) {
                topcard = `<div class="badge new">New</div>`;
            } else if ([1, 4, 5].includes(index)) {
                topcard = `<div class="badge sale">30%</div>`;
            }
    
            let heartClass = (index== 1 || index == 4) ? "fa-solid fa-heart" : "fa-regular fa-heart";
    
            card.innerHTML = `
                <div class="card-top">
                <div class="top">
                <span class="badge">${topcard}</span>
                </div>
                    <i class="${heartClass} heart-icon" style="position:absolute;top:10px;right:10px;color:#DF4244;"></i>
                </div>
                <img  src="${product.image}" alt="">
                <img class="star" src="${product.star}" alt=""> 
                <h3 class="title">${product.title}</h3> 
                <div class="price-area">
                    <p class="price">$${product.price}</p>
                    <span class="desc">${product.description}</span>
                </div>
                <button class="add-to-cart" id="${product.id}">Add to Cart</button>
            `;
    
            userCard.appendChild(card);
        });
    }
    createUsercard()
})