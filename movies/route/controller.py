from flask import Blueprint, render_template
from flask import Flask, request, jsonify
from flask_cors import cross_origin
from random import randint

from movies.models.models import db, Movie, Review
import urllib
import os

main = Blueprint('main', __name__, template_folder='static')

@main.route('/', methods=['GET', 'POST'])
def createMovies():
  if request.method == 'POST':
    data = request.get_json()
    print(data)
    q = Movie.query.filter_by(name=data["title"]).first() 
    if q == None:
      if 'poster_path' in data:
        posterUrl = "https://image.tmdb.org/t/p/w500" + data["poster_path"]
        localUrl = os.path.abspath(os.path.join(os.getcwd(), os.pardir)) + "/myproject/movies/static/images/" +  str(data["id"]) + ".jpg"
        urllib.urlretrieve(posterUrl, localUrl)
        movie = Movie(data["id"], data["title"], data["overview"], data["poster_path"])
      else:
        movie = Movie(data["id"], data["title"], data["overview"], None)
      db.session.add(movie)
      db.session.commit()
      return "SAVED!"
    else:
      id = q.name
      return id
  if request.method == 'GET':
    return render_template('index.html')

@main.route('review', methods=['GET', 'POST'])
def createReview():
  if request.method == 'POST':
    data = request.form.to_dict()
    print(data)
    
    reviewID = randint(1, 1000)
    check = Review.query.filter_by(id=reviewID, movie_id=data["movie_id"]).first()
    while(check):
      reviewID = randint(1, 1000)
      check = Review.query.filter_by(id=reviewID, movie_id=data["movie_id"]).first()

    review = Review(reviewID, data["movie_id"], data["movie_name"], data["description"], data["rating"], data["user"], "deviceID")

    db.session.add(review)
    db.session.commit()
    return "SAVED!"
  if request.method == 'GET':
    return render_template('review.html')

@main.route('details', methods=['GET'])
def getMovieDetails():
  return render_template('details.html')

@main.route('find', methods=['GET'])
def findMoviesByName():
  moviename = request.args.get('name')
  str(moviename)
  results = Movie.query.filter(Movie.name.like("%"+moviename+"%")).count()
  if results>0:
    movies = Movie.query.filter(Movie.name.like("%"+moviename+"%")).all()
    # response = jsonify(movies.as_dict())
    response = [movie.as_dict() for movie in movies]
    return jsonify(response)
  else:
    return 404

@main.route('find/movies', methods=['GET'])
def findAllMovies():
  if request.method == 'GET':
    movies = Movie.query.all()
    movies = [movie.as_dict() for movie in movies]
    return jsonify(movies)

@main.route('find/reviews', methods=['GET'])
def findAllReviews():
  if request.method == 'GET':
    reviews = Review.query.all()
    reviews = [review.as_dict() for review in reviews]
    return jsonify(reviews)

@main.route('find/reviewed', methods=['GET'])
def findAllMoviesReviewd():
  if request.method == 'GET':
    reviews = Review.query.all()
    reviews = [review.as_dict() for review in reviews]

    response = []

    for review in reviews:
      movie = Movie.query.filter_by(id=review["movie_id"]).first()
      if not movie.as_dict() in response:
        response.append(movie.as_dict())

    return jsonify(response)

@main.route('find/review', methods=['GET'])
def reviewsByID():
  if request.method == 'GET':
    review_id = request.args.get('reviewid')
    movie_id = request.args.get('movieid')
    reviews = Review.query.filter_by(id=review_id, movie_id=movie_id).first()
    return jsonify(reviews.as_dict())

@main.route('find/reviews/<movieid>', methods=["GET"])
def reviewsByMovie(movieid):
  if request.method == 'GET':
    reviews = Review.query.filter_by(movie_id=movieid).all()
    response = [review.as_dict() for review in reviews]
    return jsonify(response)

@main.route('find/movies/<movieid>', methods=['GET'])
def moviesReviewed(movieid):
  if request.method == 'GET':
    movie = Movie.query.filter_by(id=movieid).first()
    response = movie.as_dict()
    return jsonify(response)
