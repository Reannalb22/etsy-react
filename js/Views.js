
var $ = require('jquery'),
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
	_searchHandler: function(event){
		if (event.keyCode === 13){
			var inputEl = event.target,
				keywords = inputEl.value
			location.hash = `search/${keywords}`
		}
	},

	render: function(){
		return(
			<input type="text" placeholder="Search Handmade Products" onKeyDown = {this._searchHandler} />
		)
	}
})

var Listing = React.createClass({
	
	_genDetails: function(event){
		var detailClick = event.target,
			detailId = detailClick.id;
		location.hash = `details/${detailId}`
	},

	render:function(){
		console.log('data console')
		console.log(this.props.model)
		var theSource
		if (this.props.model.attributes.MainImage) { // if we do have an image
			theSource = this.props.model.attributes.MainImage.url_170x135
		}
		else theSource = "http://33.media.tumblr.com/avatar_bfee0d75c453_128.png" 

		return (
			<div>
				<img src={theSource} onClick = {this._genDetails} id={this.props.model.attributes.listing_id}/>
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
			<Listing model={product} />
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
		var theSource
		if (this.props.model.attributes.results[0].MainImage) { // if we do have an image
			theSource = this.props.model.attributes.results[0].MainImage.url_170x135
		}
		else theSource = "http://33.media.tumblr.com/avatar_bfee0d75c453_128.png" 

		return(
			<div>
				<img src = {theSource} />
				
				<p> ${price} </p>
				<p> {description} </p>
			</div>
		)
	}	
})

export default HomeView

// example_shop_id = 5901338
