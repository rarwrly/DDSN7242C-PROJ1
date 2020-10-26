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
    result.innerHTML =""
    
    const resturantPosts = resturants.map(resturant=>{
        
            const resturantReviews = reviews.filter(review => {
                return review.restaurantId == resturant.id
            });
            const reviewDivs = resturantReviews.map((review)=>{
                    return `<div class ="review"><div class ="rating">Stars:${review.stars}</div><div class="reviewText">Review:${review.text}</div>
                    <input type="button" onclick="deleteReview('${review.id}')" value="Delete">
                    </div>`
                });
           const form = document.createElement("div");
                form.classList.add("formContianer")
                form.innerHTML+=`
                <form id ="formId_${resturant.id}">
                <input type="hidden" name ="resturantId" value="${resturant.id}">
                Rating: <input type="text" name="rating"><br>
                Review: <input type="text" name="review"><br>
                <input type="button" onclick="createReviewFromForm('formId_${resturant.id}')" value="Submit">
                </form>`;
        
            const resturantContainer = document.createElement("div");
                resturantContainer.classList.add("resturantContainer");
                resturantContainer.innerHTML += `
                    <div class ="name"><h1>${resturant.name}</h1></div>
                    <div class ="rating">Avg Stars:${resturant.avgRating}</div>
                    <div class ="address"> Address: ${resturant.address}</div>
                    <div class ="img"><img src ="${resturant.imgUrl}"></div>
                    <div class ="reviewsContainer" id ="resturantId_${resturant.id}">${reviewDivs.join("")}</div>`;
                resturantContainer.append(form);
         return resturantContainer;
    });
    
resturantPosts.forEach (resturant=>{
    result.append(resturant);
});
};

/* delting a review
create delet button that has an onClick function that passses the Review ID
create a const deleteReview that asycn takes the reviewID  adn then usese it to delete it*/
function createReviewFromForm(formId){
    const formDetails= document.getElementById(formId)
    const formData= new FormData(formDetails)
    const restID = parseInt(formData.get ("resturantId"));
    const stars = parseInt(formData.get ("rating"));
    const text = formData.get ("review")
    console.log(restID)
    console.log (stars)
    console.log(text)
    

  const newReview = {
    restaurantId: restID,
    stars: stars,
    text: text,
  };

    createReview(newReview);
};
    
const createReview = async (newReview) => {
  // POST request - create a record in a database
  await fetch("http://localhost:3000/reviews", {
    method: "POST",
    body: JSON.stringify(newReview),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
      console.log("success - new review posted");
    showReviews();
};

const deleteReview = async (reviewId) => {
  // POST request - create a record in a database
  await fetch(`http://localhost:3000/reviews/${reviewId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
      console.log("success - review deleted");
    showReviews();
};



//displayReviews.addEventListener("click",()=>{
// check if active class is applied to any other review, if yes then set to inactice
// if the resturant_Id contains the resturantId 
// element.classList.remove("inactive");
//  element.classList.add("active");
//});

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
