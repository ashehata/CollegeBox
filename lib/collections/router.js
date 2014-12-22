Router.route("/", function(){
	this.render("home");
})

Router.route("/university/:universityId", function(){
	console.log(this.params.universityId);
	this.render("universityHome");
}, {
	name: "universityHome"
});