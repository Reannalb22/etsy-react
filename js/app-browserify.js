// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')

var $ = require('jquery'),
	Backbone = require('backbone'),
	React = require('react'),
	Parse = require('parse')

console.log('all loaded up')

import HomeView from "./HomeView.js"
// import DetailsView from "./Details.js"



//-----------------COLLECTION----------------------------

var etsyCollection = Backbone.Collection.extend({
	url: 'https://openapi.etsy.com/v2/listings/active.js',
	apiKey:'3w2bktapp0baml9j70tm7rca',
		
	parse: function(responseData){
		var startingArray = responseData.results
		console.log(responseData)
		return startingArray
	} 
})


//---------------------MODEL-----------------------

var etsyModel = Backbone.Model.extend({
	
	url: 'https://openapi.etsy.com/v2/listings',
	apiKey:'3w2bktapp0baml9j70tm7rca'
		
})

//-----------------ROUTER-----------------------
var EtsyRouter = Backbone.Router.extend({
	
	routes:{
		
		'search/:keywords': 'showSearch',
		'details/:listing_id': 'getDetails',
		'favorites': 'showFavorites',
		'home': 'getHome'
		// 'login': 'showLogIn',
		// 'signup': 'showSignUp'
		},
		

	getData: function(){
		var self = this,
			deferredObj = this.ec.fetch({
				data: {
					api_key: self.ec.apiKey,
					includes: 'MainImage,Shop'
				},
				processData: true,
				dataType: 'jsonp'
				})
		// location.hash = '#home'
		return deferredObj
	},

	getDetailData: function(listing_id){
		var self = this,
		deferredObj = this.em.fetch ({
			url: `${this.em.url}/${listing_id}/.js`,
			data: {
				api_key: self.em.apiKey,
				includes: 'MainImage,Shop'
			},
			processData: true,
			dataType: 'jsonp'
		})
		// location.hash = '#details'
		return deferredObj
	},

	getSearchResults: function(keyword){
		var self = this,
		deferredObj = this.ec.fetch({
			data: {
				keywords: keyword,
				api_key: this.ec.apiKey,
				includes: 'MainImage,Shop'
			},
			processData: true,
			dataType: 'jsonp'
		})
		return deferredObj
	},
		

	renderApp: function(){
		console.log('routingggg')
		React.render(<HomeView collection={this.ec}/>, document.querySelector('#container'))

	},

	renderDetail: function(){
		console.log('rendering details')
		React.render(<DetailsView model={this.em}/>, document.querySelector('#container'))
		
	},

	runDefault: function(){
		location.hash = "home"
	},

	getHome: function(){

		var boundRender = this.renderApp.bind(this)

		var deferredObj = this.getData()
		deferredObj.done(boundRender)
	},

	getDetails: function(listing_id){
		var boundRender = this.renderDetail.bind(this)
		var self = this
		var deferredObj = this.getDetailData(listing_id)
		deferredObj.done(function(){
			console.log('here comes the model in the done callback')
			console.log(self.em)
			boundRender()
		})
	},

	showSearch: function(keyword){
		var boundRender = this.renderApp.bind(this)
		var self = this
		var deferredObj = this.getSearchResults(keyword)
		deferredObj.done(boundRender)
	},

	showFavorites: function(){
		var query = new Parse.Query("Listing")
		query.find().then(this.renderFavorites.bind(this))
	},

	renderFavorites: function(responseData){
		console.log(responseData)
		React.render(<FavoritesView listings={responseData}/>, document.querySelector('#container'))
	},

	// showLogIn: function(){

	// },

	// showSignUp: function(){

	// },

	initialize: function(){
		location.hash = "home"
		this.ec = new etsyCollection()
		this.em = new etsyModel()
		Backbone.history.start()
	}
})

var etsy = new EtsyRouter()

////////////////////////////////////////////////////////

var APP_ID = 'c4PIFD1Bz4mMk8VrgNd1lmEtisFwDBdNGViVY0lv',
	JS_KEY = 'kl9qSSHjhdgGY496DFTwl4f39IL8Owv22SypRAxE'

Parse.initialize(APP_ID, JS_KEY)

// var logInView = React.createClass({

// })

// var signupView = React.createClass({

// })


var DetailsView = React.createClass({

	render: function(){
		console.log('here comes product in the DetailsView')
		console.log(this)
		return(
			<div>
				<Details model = {this.props.model} />
			</div>
		)
	}
})

var Details = React.createClass({

	render: function(){
		// var productImg = this.props.model.attributes.results.MainImage.url_170x135,
		var	price = this.props.model.attributes.results[0].price,
			description = this.props.model.attributes.results[0].description
		var theSource
		if (this.props.model.attributes.results[0].MainImage) { // if we do have an image
			theSource = this.props.model.attributes.results[0].MainImage.url_170x135
		}
		else theSource = "http://33.media.tumblr.com/avatar_bfee0d75c453_128.png" 

		return(
			<div>
				<img src = {theSource} id="detailImg"/>
				<Favorites listingData = {this.props.model.attributes.results[0]}/>
				<p> ${price} </p>
				<p> {description} </p>
			</div>
		)
	}	
})

var Favorites = React.createClass({
	_clickHandler: function(e){
		var listingObj = this.props.listingData
		var db_listing = new Parse.Object('Listing')
			window.listing = this
			for(var prop in listingObj){
				db_listing.set(prop,listingObj[prop])
			}
			db_listing.save().then(function(){alert('Favorited!')})
		},

	render: function(){
		return(
			<div>
				<input type = "image" src = 'images/favorites.png' onClick = {this._clickHandler} id="favoriteButton" />
			</div>
		)
	}
})

var FavoritesView = React.createClass({
	render: function(){
		return(
			<ListingsBox listing = {this.props.listings}/>
		)
	}
})

var ListingsBox = React.createClass({
	
	_genListing: function(product){
		
		return(
			<Listing listingData={product} />
		)
	},

	// var john = new Student({'hobby':'studying'})

	render: function(){

		var models = this.props.listing

		return(
			<p>
				{models.map(this._genListing)}
			</p>
		)	
	}
})

var Listing = React.createClass({
	
	render: function(){
		return(
			<div>
				<p>{this.props.listingData.get("title")}</p>
				<img src = {this.props.listingData.get("MainImage").url_170x135}/>
			</div>
		)
	}
})


// AJAX Version (if not using Backbone):

// var deferredObj = $.ajax({
// 	url: 'https://openapi.etsy.com/v2/listings/active.js',
// 	data: {
// 		api_key: '3w2bktapp0baml9j70tm7rca',
// 		includes: 'MainImage'
// 	},
// 	dataType: 'jsonp'
// })

// deferredObj.done(function(data){
// 	console.log('ajax call')
// 	console.log(data)
// 	React.render(<HomeView products = {data.results} />, document.querySelector('#container'))
// })



