// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')

var $ = require('jquery'),
	Backbone = require('backbone'),
	React = require('react')

console.log('all loaded up')

var HomeView = React.createClass({


	render: function(){
	console.log(this)
	return (
		<div>
			<TitleBar />
			<SearchBar />
			<ListingsBox collection = {this.props.collection}/>
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

var Listing = React.createClass({

	render:function(){
		console.log('data console')
		console.log(this.props.model)
		var theSource
		if (this.props.model.attributes.MainImage) { // if we do have an image
			theSource = this.props.model.attributes.MainImage.url_170x135
		}
		else theSource = "http://33.media.tumblr.com/avatar_bfee0d75c453_128.png" 

		return(
			<div>
				<img src={theSource} />
			</div>
			)
		}
})

var ListingsBox = React.createClass({
	
	_genListing: function(product){
		console.log(product)
		console.log('ze product console log is above')
		console.log(product.attributes)
		
		return(
			<Listing model={product} name="reanna" />
		)
	},

	// var john = new Student({'hobby':'studying'})

	render: function(){

		var models = this.props.collection.models

		return(
			<p>
				{models.map(this._genListing)}
			</p>
		)	
	}
})


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
		
		return(
			<div>
				<p> {price} </p>
				<p> {description} </p>
			</div>
		)
	}	
})

// example_shop_id = 5901338


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
		
	// parse: function(responseData){
	// 	var singleListing = responseData.results
	// 	return singleListing
	// }
})

//-----------------ROUTER-----------------------
var EtsyRouter = Backbone.Router.extend({
	
	routes:{
		'home': 'getHome',
		'details/:Shop_Id': 'getDetails'
	},
		// '*anythingElse': 'runDefault'},

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

	getDetailData: function(Shop_id){
		var self = this,
		deferredObj = this.em.fetch ({
			url: `${this.em.url}/${Shop_id}/.js`,
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
		

	renderApp: function(){
		console.log('routingggg')
		React.render(<HomeView collection={this.ec}/>, document.querySelector('#container'))

	},

	renderDetail: function(){
		console.log('rendering details')
		React.render(<DetailsView model={this.em}/>, document.querySelector('#container'))
		
	},

	// runDefault: function(){
	// 	location.hash = "home"
	// },

	getHome: function(){

		var boundRender = this.renderApp.bind(this)

		var deferredObj = this.getData()
		deferredObj.done(boundRender)
	},

	getDetails: function(Shop_id){
		var boundRender = this.renderDetail.bind(this)
		var self = this
		var deferredObj = this.getDetailData(Shop_id)
		deferredObj.done(function(){
			console.log('here comes the model in the done callback')
			console.log(self.em)
			boundRender()
		})
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



//making into separate images???  

// var Listing=React.createClass({
// 	render:function(){
// 		console.log(this.props.data)
// 		return(
// 			<div>
// 				<img src={this.props.data.MainImage.url_170x135} />
// 			</div>
// 			)
// 		}
// })

// var ListingsBox = React.createClass({
	

// 	_genListing: function(product){
// 		console.log(product)
// 		console.log('ze product console log is above')
// 		console.log(product.attributes)
		
// 		return(
// 			<Listing data={product}/>
// 		)
// 	},

// 	render: function(){

// 		var products = this.props.products

// 		return(
// 			<p>
// 				{products.map(this._genListing)}
// 			</p>
// 		)	
// 	}
// })


