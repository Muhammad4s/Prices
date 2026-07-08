const SUPABASE_URL = "https://qopgmhkhnooyijbxmqop.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvcGdtaGtobm9veWlqYnhtcW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NjEwNTksImV4cCI6MjA5OTAzNzA1OX0.mVW5gUCqrqVQiwan3Uz3zHyV5HrGnAkUCoDIKZmPBKs";

let products = [];
let selectedCategory = "الكل";

const search = document.getElementById("search");
const results = document.getElementById("results");
const categories = document.getElementById("categories");
const suggestions = document.getElementById("suggestions");
const clearSearch = document.getElementById("clearSearch");


async function loadProducts(){

const response = await fetch(
`${SUPABASE_URL}/rest/v1/products?select=*`,
{
headers:{
apikey:SUPABASE_KEY,
Authorization:`Bearer ${SUPABASE_KEY}`
}
}
);


products = await response.json();


createCategories();

showProducts("");

}



function createCategories(){

let cats=["الكل"];

products.forEach(product=>{

if(product.category && !cats.includes(product.category)){
cats.push(product.category);
}

});


categories.innerHTML="";


cats.forEach(cat=>{

categories.innerHTML += `

<button class="category ${cat==="الكل"?"active":""}"
onclick="filterCategory('${cat}',this)">
${cat}
</button>

`;

});


}



function filterCategory(category,button){

selectedCategory=category;


document.querySelectorAll(".category")
.forEach(btn=>btn.classList.remove("active"));


button.classList.add("active");


showProducts(search.value);

}



function showProducts(text){


results.innerHTML="";


let filtered=products.filter(product=>{


let nameMatch =
product.name.includes(text);


let categoryMatch =
selectedCategory==="الكل" ||
product.category===selectedCategory;


return nameMatch && categoryMatch;


});



if(filtered.length===0){

results.innerHTML=
`<div class="empty">لا يوجد صنف</div>`;

return;

}



filtered.forEach(product=>{


results.innerHTML += `

<div class="item">

<div class="item-name">
${product.name}
</div>

<div class="item-price">
${product.price} جنيه
</div>

</div>

`;

});


}



search.addEventListener("input",()=>{


let text=search.value;


suggestions.innerHTML="";


if(text){

products
.filter(p=>p.name.includes(text))
.slice(0,5)
.forEach(product=>{


suggestions.innerHTML += `

<div class="suggestion"
onclick="chooseProduct('${product.name}')">

${product.name}

</div>

`;

});


}


showProducts(text);


});



function chooseProduct(name){

search.value=name;

suggestions.innerHTML="";

showProducts(name);

}



clearSearch.addEventListener("click",()=>{

search.value="";

suggestions.innerHTML="";

showProducts("");

});



loadProducts();
