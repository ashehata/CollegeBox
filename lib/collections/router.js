Router.route("/", function(){
	this.wait(Meteor.subscribe('colleges'));
	if (this.ready()){
		this.render("home");
	}
	else{
		this.render("Loading");
	}
})

Router.route("/home/:universityId", function(){
	this.wait(Meteor.subscribe('classes'));
	this.wait(Meteor.subscribe('colleges'));
		//TO DO, clean up subscriptions
	if (this.ready())																																																																																								if (this.ready()){
		this.render("universityHome");
	}
	else{
		this.render("Loading");
	}
}, {name: "home"});