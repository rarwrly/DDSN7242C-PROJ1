const getResturants = async()=>{
    const response = await fetch(
        'http://localhost:3000/restaurants'
    );
    const resturants = await response.json();
    return resturants;
};

const displayResturants = (resturants)=>{
    const result = document.querySelector(".results");
    const resturantPost = resturants.map(resturant=>{
        
         return `<div class ="resturant"><div class ="name"><h1>${resturant.name}</h1></div><div class ="address"> Address: ${resturant.address}</div><div class ="img"><img src ="${resturant.imgUrl}"></div></div>`;
    });
    result.innerHTML += resturantPost.join("");
    
};

const showReviews = async ()=>{
    try{
        const resturants = await getResturants();
        displayResturants(resturants);
    }catch(error){
        document.body.innerHTML =`HerpDerp apologies, a snake got in the server room and caused an error:${error}`;
    }
};

showReviews();