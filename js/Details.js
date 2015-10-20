// var $ = require('jquery'),
// 	React = require('react')

// var APP_ID = 'c4PIFD1Bz4mMk8VrgNd1lmEtisFwDBdNGViVY0lv'
// 	JS_KEY = 'kl9qSSHjhdgGY496DFTwl4f39IL8Owv22SypRAxE'

// Parse.initialize(APP_ID, JS_KEY)


// var DetailsView = React.createClass({

// 	render: function(){
// 		console.log('here comes product in the DetailsView')
// 		console.log(this)
// 		return(
// 			<div>
// 				<Details model = {this.props.model} />
// 			</div>
// 		)
// 	}
// })

// var Details = React.createClass({

// 	render: function(){
// 		// var productImg = this.props.model.attributes.results.MainImage.url_170x135,
// 		var	price = this.props.model.attributes.results[0].price,
// 			description = this.props.model.attributes.results[0].description
// 		var theSource
// 		if (this.props.model.attributes.results[0].MainImage) { // if we do have an image
// 			theSource = this.props.model.attributes.results[0].MainImage.url_170x135
// 		}
// 		else theSource = "http://33.media.tumblr.com/avatar_bfee0d75c453_128.png" 

// 		return(
// 			<div>
// 				<img src = {theSource} />
// 				<input type = "image" src = 'images/favorites.png' />
// 				<p> ${price} </p>
// 				<p> {description} </p>
// 			</div>
// 		)
// 	}	
// })




