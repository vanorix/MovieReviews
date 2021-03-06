var xmlhttp = new XMLHttpRequest();
var urlreview = "http://45.55.77.201/javier/review";
var url = "https://api.themoviedb.org/3/search/movie?";
var apiKey = "api_key=50c1cc8af5a5e07e52ed728d348a4919";
var query = "query=";
var cacheUrl = "http://45.55.77.201/javier/";

var movie_list = [];
var cache = [];
var input = document.getElementById("title");
var awesomplete = new Awesomplete(input);

input.oninput = function(evt){
  getMovies(evt.target.value);
};

var getMovies = function(title){
  if(title.length >= 2) {
    if(cache.indexOf(title.toLowerCase()) === -1) {
      cache.push(title.toLowerCase())
      movies = getMovieList(title);
      movies.then(function(result) {
        if(result.length > 0) {
          for(var i = 0; i < result.length; i++) {
            if(movie_list.indexOf(result[i].title) == -1) {
              movie_list.push(result[i].title);
            }
          }
          awesomplete.list = movie_list;
        }
      });
    }
  }
};

var getMovieList = function(title){
  return new Promise(function(resolve, reject){
    var data = "{}";
    
    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === this.DONE) {
        response = JSON.parse(this.responseText);
        resolve(response.results);
      }
      else if(this.status == 400){
        reject('No movies with this name');
      }
    });

    xhr.open("GET", url +"page=1" + "&" + query + encodeURI(title) +"&"+apiKey);
    xhr.send(data);
  });
};

var findMovie = function(name, page){
        var data = "{}";
    
        var xhr = new XMLHttpRequest();
        //xhr.withCredentials = true;
    
        xhr.addEventListener("readystatechange", function() {
          if (this.readyState === this.DONE) {
            response = JSON.parse(this.responseText);
            console.log(response);
            post(response.results[0].id);
            postToDb(response.results[0]);
            console.log(this.responseText);
          }
        });
    
        xhr.open("GET", url +"page="+ page + "&" + query + encodeURI(name) +"&"+apiKey);
        xhr.send(data);
};

var postToDb = function (oData) {
  var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
  
  xmlhttp.open("POST", cacheUrl, true);
  xmlhttp.setRequestHeader("content-type", "application/json");
  xmlhttp.setRequestHeader("cache-control", "no-cache");
  xmlhttp.send(JSON.stringify(oData));
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
    }
    if(this.status == 400){
      console.log(this.responseText);
    }
  };
};

var post = function (movieid) {
  var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
  xmlhttp.open("POST", urlreview, true);
  //***********************************
  var data = new FormData();
  var title = document.getElementById('title');
  var name = document.getElementById('username');
  var review = document.getElementById('review');
  var rating = document.getElementById('rating');
  data.append('movie_name', title.value);
  data.append('user', name.value);
  data.append('description', review.value);
  data.append('rating', rating.value);
  data.append('movie_id', movieid);

  cleanForm();
  //***********************************
  //xmlhttp.setRequestHeader("Content-Type", "multipart/form-data");
  xmlhttp.send(data);
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
    }
  };
};

function cleanForm(){
  var title = document.getElementById('title');
  var name = document.getElementById('username');
  var review = document.getElementById('review');
  var rating = document.getElementById('rating');

  title.value = "";
  name.value = "";
  review.value = "";
  rating.value = "Choose a Rating";
}

var validateForm = function(){
  var title = document.getElementById('title');
  var name = document.getElementById('username');
  var review = document.getElementById('review');
  var rating = document.getElementById('rating');
  if(title.value == ""){
    alert("All fields are required.");
    return false;
  }
  if(name.value == ""){
    alert("All fields are required.");
    return false;
  }
  if(review.value == ""){
    alert("All fields are required.");
    return false;
  }
  if(rating.value == "Choose a Rating"){
    alert("All fields are required.");
    return false;
  }
  return true;
};

var form = document.getElementById('upload');
form.onsubmit = function(evt) {
  evt.preventDefault();
  
  if(validateForm()){
    var title = document.getElementById('title');
    var movie = findMovie(title.value, 1);
  }
  
};