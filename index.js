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

const getUsers = async() =>{
    const response = await fetch(
        'http://localhost:3000/users'
    );
    const users = await response.json();
    return users;
}



const displayResturants = (resturants,reviews,users)=>{
    
    const result = document.querySelector(".results");
    result.innerHTML =""

    const resturantPosts = resturants.map(resturant=>{
        
            const resturantReviews = reviews.filter(review => {
                return review.restaurantId == resturant.id
            });

            const reviewDivs = resturantReviews.map((review)=>{
                const user = users.find((user)=>
                        user.id === review.userId
                    );
                var username = "Guest";
                    if (user != undefined){
                        username = user.name;
                    }
                    return `<div class ="review">
                        <div class ="rating">Stars:${review.stars}</div>
                        <div class="reviewText">Review:${review.text}</div>
                        <div class="user"> Username:${username}</div>
                        <input type="button" onclick="deleteReview('${review.id}')" value="Delete">
                    </div>`
                });

           const form = document.createElement("div");
                form.classList.add("formContianer")
                form.innerHTML+=`
                <p> Add your own Review</p>
                <form id ="formId_${resturant.id}">
                <input type="hidden" name ="resturantId" value="${resturant.id}">
                Rating: <input type="text" name="rating"><br>
                Review: <input type="text" name="review"><br>
                <input type="button" onclick="createReviewFromForm('formId_${resturant.id}')" value="Submit">
                </form>`;

            const resturantContainer = document.createElement("div");
                resturantContainer.classList.add("resturantContainer");
                resturantContainer.innerHTML += `
                    <div class = "resturant" onclick="showReviews('resturantId_${resturant.id}','formId_${resturant.id}')">
                    <div class ="name"><h1>${resturant.name}</h1></div>
                    <div class ="rating">Avg Stars:${resturant.avgRating}</div>
                    <div class ="address"> Address: ${resturant.address}</div>
                    <div class ="img"><img src ="${resturant.imgUrl}"></div>
                    <div class ="reviewsContainer" id ="resturantId_${resturant.id}">${reviewDivs.join("")}</div>
                    </div>`;
                resturantContainer.appendChild(form);
         return resturantContainer;
    });
    
resturantPosts.forEach (resturant=>{
    result.append(resturant);
});
};

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


const showReviews = async ()=>{
    try{
        const resturants = await getResturants();
        const reviews = await getReviews();
        const users = await getUsers();
        
        resturants.forEach((resturant)=>{
            const resturantReviews = reviews.filter(review => {
                return review.restaurantId == resturant.id
            });
            const ratings = resturantReviews.map(review => review.stars);
            const avgRating = ratings.reduce((a,b) => a + b, 0) / ratings.length;

            resturant.avgRating = avgRating.toFixed(1)
        });
        resturants.sort((a,b)=>b.avgRating -a.avgRating)
        
        displayResturants(resturants,reviews,users);
    }catch(error){
        document.body.innerHTML =`HerpDerp apologies, a snake got in the server room and caused an error:${error}`;
        console.log(error)
    }
};

showReviews();
