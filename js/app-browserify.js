// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')

var $ = require('jquery'),
	Backbone = require('backbone'),
	React = require('react')

console.log('all loaded up')

var HomeView = React.createClass({
	render: function(){
	return (
		<div>
			<TitleBar />
			<SearchBar />
			<ListingBox products = {this.props.products}/>
		</div>
		)
	}
})

var DetailsView = React.createClass({
	render: function(){
		return(
			<div>
				<Details products = {this.props.products}/>
			</div>
		)
	}
})


var TitleBar = React.createClass({

	render: function(){
		return (
			<p id="title"> Etsy </p>
		)
	}
})



var SearchBar = React.createClass({

	render: function(){
		return(
			<input type="text" placeholder="Search Handmade Products"/>
		)
	}
})



var ListingBox = React.createClass({
	

	_genListings: function(product){
		console.log(product)
		console.log('ze product console log is above')
		return(
			<img src= {product.attributes.MainImage.url_170x135} />
		)
	},

	render: function(){

		var products = this.props.products

		return(
			<p>
				{products.map(this._genListings)}
			</p>
		)	
	}
})

var Details = React.createClass({


	_genDetails : function(product){
		console.log(product)
		console.log('detail product console is above')
		// return (
		// 	<img src = {product.attributes.MainImage.url_170x135} />
		// 	<p> {product.attributes.price}</p>

		// 	)

	},
	
	render: function(){
		var products = this.props.products
		console.log(products)
		console.log('logging products in render')
		productImg = this.props.products.attributes.MainImage.url_170x135,
		price = this.props.products.attributes.price,
		description = this.props.products.attributes.description
		
		return(
			<div>
				<img src = {productImg} />
				<p> {price} </p>
				<p> {description} </p>
			</div>
		)
	}	
})



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
	apiKey:'3w2bktapp0baml9j70tm7rca',
		
	parse: function(responseData){
		var singleListing = responseData.results[0]
		return singleListing
	}
})

//-----------------ROUTER-----------------------
var EtsyRouter = Backbone.Router.extend({
	
	routes:{
		'home': 'getHome',
		'details': 'getDetails'
	},
		// '*anythingElse': 'runDefault'},

	getData: function(){
		var self = this,
			deferredObj = this.ec.fetch({
				data: {
					api_key: self.ec.apiKey,
					includes: 'MainImage'
					// includes: 'Shop'
				},
				processData: true,
				dataType: 'jsonp'
				})
		location.hash = '#home'
		return deferredObj
	},

	getDetailData: function(listing_id){
		var self = this,
		deferredObj = this.em.fetch ({
			url: `${this.em.url}/${listing_id}/.js`,
			data: {
				api_key: self.em.apiKey,
				includes: 'MainImage'
				// includes: 'Shop'
			},
			processData: true,
			dataType: 'jsonp'
		})
		location.hash = '#details'
		return deferredObj
	},
		

	renderApp: function(){
		console.log('routingggg')
		React.render(<HomeView products={this.ec}/>, document.querySelector('#container'))

	},

	renderDetail: function(){
		console.log('rendering details')
		React.render(<DetailsView products={this.em}/>, document.querySelector('#container'))
		console.log(products)
		
	},

	// runDefault: function(){
	// 	location.hash = "home"
	// },

	getHome: function(){

		var boundRender = this.renderApp.bind(this)

		var deferredObj = this.getData()
		deferredObj.done(boundRender)
	},

	getDetails: function(){
		var boundRender = this.renderDetail.bind(this)

		var deferredObj = this.getDetailData()
		deferredObj.done(boundRender)
	},


	initialize: function(){
		location.hash = "home"
		this.ec = new etsyCollection()
		this.em = new etsyModel()
		Backbone.history.start()
	}
})

var etsy = new EtsyRouter()


//AJAX Version (if not using Backbone):

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




