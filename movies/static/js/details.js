var movie_path = "http://45.55.77.201/javier/find/movies/";
var reviews_path = "http://45.55.77.201/javier/find/reviews";
var review_path = "http://45.55.77.201/javier/find/review?"

var getMoviesData = function(movie_id){
    var data = "{}";

    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === this.DONE) {
        console.log(JSON.parse(this.responseText));
        loadPage(JSON.parse(this.responseText));
      }
    });

    xhr.open("GET", movie_path + movie_id);

    xhr.send(data);
};

var load = function(){
  var urlParams = new URLSearchParams(window.location.search);
  var movie_id;
  if(urlParams.has('id')) {
    movie_id = urlParams.get('id');
    console.log(movie_id);
    getMoviesData(movie_id);
  }
}();

var getReviews = function (data) {
    return new Promise(
        function(resolve, reject){
            var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 

            xmlhttp.open("GET", reviews_path + '/' + data.id, true);
            xmlhttp.send("{}");
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(JSON.parse(this.responseText));
                    resolve(JSON.parse(this.responseText));
                }
                if(this.status == 400){
                    console.log(this.responseText);
                    reject("No reviews found!");
                }
            };
        }
    );
};

var loadPage = function(data){
  var reviews = getReviews(data);
  reviews.then(function(result){
    var avg = 0;
    for(var j = 0; j < result.length; ++j){
      avg += result[j].rating;
    }
    avg = avg / result.length;
    loadData(data, avg);
    loadReviews(result);
  });
};

var loadData = function(data, avg_rating){
  var title = document.getElementById('title');
  var poster = document.getElementById('poster');
  var description = document.getElementById('description');
  var rating = document.getElementById('rating');

  title.innerHTML = data.name;
  poster.setAttribute('src', "images/" + data.id + ".jpg");
  description.innerHTML = data.description;
  rating.innerHTML = avg_rating.toFixed(1) + '/5 Stars';
};

var loadReviews = function(reviews){
  var container = document.getElementById("reviews");
  var h1 = document.createElement("h1");

  if(reviews.length > 0) {
    var ul = document.createElement('ul');
    ul.classList.add("list-group");
    
    for(var i = 0; i < reviews.length; i++) {
      var review = reviews[i];
      var liReview = document.createElement("li");
      var liSpan = document.createElement("span");
      
      liReview.classList.add("list-group-item");
      liSpan.classList.add("badge")
      liReview.innerHTML = review["description"].length > 150 ? 
        review["description"].substring(0, 90) + "..." : review["description"];
      liReview.onclick = function(event) {
        var id = this.getAttribute("id");
        var movie_id = this.getAttribute('movie_id');
        var review = getReview(id, movie_id);
        review.then(function(result) {
          var modalBody = document.getElementById("modal-body");
          var modalTitle = document.getElementById("modal-title");
          var modalRating = document.getElementById("modal-rating");
          modalBody.innerHTML = result["description"]
          modalTitle.innerHTML = "Review by " + result["user"]
          modalRating.innerHTML = "Rating: " + result["rating"]
          $('#myModal').modal('show')
        });
      }
      liSpan.innerHTML = review["rating"] + " out of 5";
      liReview.setAttribute("id", review["id"]);
      liReview.setAttribute("movie_id", review["movie_id"]);
      liReview.appendChild(liSpan);
      ul.appendChild(liReview)
    }
    
    h1.innerHTML = "Reviews (" + reviews.length + ")" 
    container.appendChild(h1);
    container.appendChild(ul);
  } 
  else {
    h1.innerHTML = "No reviews yet!"
    container.appendChild(h1);
  }
};

var getReview = function(review_id, movie_id){
  return new Promise(
    function(resolve, reject){
        var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
        xmlhttp.open("GET", review_path + 'reviewid=' + review_id + '&movieid=' + movie_id, true);
        xmlhttp.send("{}");
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(JSON.parse(this.responseText));
                resolve(JSON.parse(this.responseText));
            }
            if(this.status == 400){
                console.log(this.responseText);
                reject("No reviews found!");
            }
        };
    }
  );
};
