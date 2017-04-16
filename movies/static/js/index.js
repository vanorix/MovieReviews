var ratingURL = "http://45.55.77.201/javier/find/reviews";
var reviewdUrl = "http://45.55.77.201/javier/find/reviewed";

//Paging
var resultPages;
var currentPage = 1;
var currentSearch;

var getMoviesReviewd = function(){
    var data = "{}";

    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === this.DONE) {
        console.log(JSON.parse(this.responseText));
        getRatings(JSON.parse(this.responseText));
      }
    });

    xhr.open("GET", reviewdUrl);

    xhr.send(data);
}();

var getRatingsFromDB = function (data) {
    return new Promise(
        function(resolve, reject){
            var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 

            xmlhttp.open("GET", ratingURL, true);
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

var getRatings = function(data){
    var reviews = getRatingsFromDB(data);
    reviews.then(function(result){
        var average_ratings = [];
        for(var i = 0; i < data.length; ++i){
            var count = 0;
            var avg = 0;
            for(var j = 0; j < result.length; ++j){
                if(data[i].id == result[j].movie_id){
                    avg += result[j].rating;
                    ++count;
                }
            }
            average_ratings[data[i].id] = avg / count;
        }
        listMovies(data, average_ratings);
    });
};

var getDetailsPage = function(evt){
    location.href="details" + "?id=" + evt.target.movie_id;
};

var listMovies = function(data, ratings){
    clearResults();
    var container = document.getElementById('container');
    var list = document.createElement('ul');
    list.classList.add('list-group');
    var listElement = document.createElement('li');
    listElement.classList.add('list-group-item');
    listElement.id = 'results';
    var gridContainer = document.createElement('div');
    gridContainer.id = 'grid';
    gridContainer.classList.add('container-fluid');
    //Listing Movies
    //****************************************************************** 
    var movieRow = document.createElement('div');
    movieRow.id = 'rowResult';
    movieRow.classList.add('row');
    var colIdx = 0;
    for(var idx = 0; idx < data.length; ++idx){
        var movieContainer = document.createElement('div');
        movieContainer.setAttribute('class', 'col-md-4');
        movieContainer.id = 'movie';
            
        var anchor = document.createElement('a');
        var poster = document.createElement('img');
        var vote_avg = document.createElement('h4');
        var description = document.createElement('span');
            
        anchor.id = 'details_page';
        poster.id = 'poster';
        vote_avg.id = 'vote_avg';
        description.id = 'description';

        anchor.innerHTML = '<h2 id="title">' + data[idx].name + '</h2>';
        anchor.setAttribute('href', 'details?id=' + data[idx].id);
        poster.setAttribute('src', "images/" + data[idx].id + ".jpg");
        vote_avg.innerHTML = 'Average rating ' + ratings[data[idx].id].toFixed(1) + ' Stars';
        description.innerHTML = data[idx].description.substring(0, 150) + '...';

        //****************************************************************** 
        var details = createBtnElm('btnDetails', 'DETAILS', getDetailsPage);
        details['movie_id'] = data[idx].id;
        //****************************************************************** 

        movieContainer.appendChild(anchor);
        movieContainer.appendChild(poster);
        movieContainer.appendChild(description);
        movieContainer.appendChild(vote_avg);
        movieContainer.appendChild(details);
            
        movieRow.appendChild(movieContainer);
        ++colIdx;

        if(colIdx == 3){
            gridContainer.appendChild(movieRow);
            colIdx = 0;
            var movieRow = document.createElement('div');
            movieRow.id = 'rowResult';
            movieRow.classList.add('row');
        }
      }
      
	if(movieRow.innerHTML != ""){
		gridContainer.appendChild(movieRow);
	}

      listElement.appendChild(gridContainer);
      list.appendChild(listElement);
      //****************************************************************** 

      //Paging
      //******************************************************************
    //   var btnNext = createBtnElm('btnNext', 'NEXT', nextClick);
    //   var btnPrevious = createBtnElm('btnPrevious', 'PREVIOUS', previousClick);
    //   var lePaging = document.createElement('li');
    //   lePaging.classList.add('list-group-item');
    //   lePaging.id = 'paging';
        
    //   resultPages = data.total_pages;
      
    //   if(currentPage == resultPages){
    //       btnNext.style.display = 'none';
    //   }
    //   else if(currentPage == 1){
    //       btnPrevious.style.display = 'none';
    //   }
    //   else {
    //       btnNext.style.display = 'inline';
    //       btnPrevious.style.display = 'inline';
    //   }
      
    //   lePaging.appendChild(btnPrevious);
    //   lePaging.appendChild(btnNext);
      
    //   list.appendChild(lePaging);
      
      //******************************************************************
      container.appendChild(list);
      
};

var saveToCache = function(moviesData){
    post(moviesData, cacheUrl);
    console.log(moviesData);
};

var createBtnElm = function(id, text, onClickCallback){
    var btn = document.createElement('button');
    btn.classList.add('btn');
    btn.classList.add('btn-primary');
    btn.id = id;
    btn.innerText = text;
    btn.onclick = onClickCallback;

    return btn;
};

// nextClick = function(evt){
//     if((currentPage + 1) <= resultPages)
//         currentPage += 1;
    
//     findMovie(currentSearch, currentPage);
// };

// previousClick = function(evt){
//     if((currentPage - 1) > 0)
//         currentPage -= 1;
    
//     findMovie(currentSearch, currentPage);
// };

var clearResults = function(){
    var container = document.getElementById('container');
    container.innerHTML = ' ';
};
