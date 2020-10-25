const getResturants = async()=>{
    const response = await fetch(
        'http://localhost:3000/restaurants'
    );
    const resturants = await response.json();
    return resturants;
};

const getReviews = async()=>{
    const response = await fetch(
        'http://localhost:3000/reviews'
    );
    const reviews = await response.json();
    return reviews;
};


const displayResturants = (resturants,reviews)=>{
    
    const result = document.querySelector(".results");

    
    const resturantPosts = resturants.map(resturant=>{
        
            const resturantReviews = reviews.filter(review => {
                return review.restaurantId == resturant.id
            });
            const reviewDivs = resturantReviews.map((review)=>{
                    return `<div class ="review"><div class ="rating">Stars:${review.stars}</div><div class="reviewText">Review:${review.text}</div></div>`
                });

         return `<div class ="resturant">
<div class ="name"><h1>${resturant.name}</h1></div>
<div class ="rating">Avg Stars:${resturant.avgRating}</div
div class ="address"> Address: ${resturant.address}</div>
<div class ="img"><img src ="${resturant.imgUrl}"></div>
<div class ="reviewsContainer">${reviewDivs.join("")}</div>
</div>`;
    });
    
    result.innerHTML += resturantPosts.join("");

};

const showReviews = async ()=>{
    try{
        const resturants = await getResturants();
        const reviews = await getReviews();
        
        resturants.forEach((resturant)=>{
            const resturantReviews = reviews.filter(review => {
                return review.restaurantId == resturant.id
            });
            const ratings = resturantReviews.map(review => review.stars);
            const avgRating = ratings.reduce((a,b) => a + b, 0) / ratings.length;
            //two lines above could be condensesd?
            resturant.avgRating = avgRating.toFixed(1)
        });
        resturants.sort((a,b)=>b.avgRating -a.avgRating)
        
        displayResturants(resturants,reviews);
    }catch(error){
        document.body.innerHTML =`HerpDerp apologies, a snake got in the server room and caused an error:${error}`;
    }
};

showReviews();



        /*
        resturants.forEach((resturant)=>{
            const resturantReviews = reviews.filter(review => {
                return review.restaurantId == resturant.id
            });
            console.log(resturantReviews)
            const ratings = resturantReviews.map(review => review.stars);
            const avgRating = ratings.reduce((a,b) => a + b, 0) / ratings.length;
            //two lines above could be condensesd?
            resturant.avgRating = avgRating
        });
        */