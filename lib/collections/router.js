Router.route("/", function(){
	this.wait(Meteor.subscribe('colleges'));
	if (this.ready()){
		this.render("home");
	}
	else{
		this.render("Loading");
	}
})

Router.route("/home/:universityId/:className?", function(){
	this.wait(Meteor.subscribe('classes'));
	this.wait(Meteor.subscribe('colleges'));
	this.wait(Meteor.subscribe('files'));
		//TO DO, clean up subscriptions
	if (this.ready())																																																																																								if (this.ready()){
		this.render("universityHome");
	}
	else{
		this.render("Loading");
	}
}, {name: "home"});



Router.route('/download/:universityId/:semester/:className/:filename', function () {
      var path = this.params.path;
      var headers = {
        'Content-Disposition': "attachment"
      };

      this.response.writeHead(200, headers);

      var fs = Npm.require('fs');
      if (process.cwd().indexOf('.meteor/local') > -1)
        process.chdir('../../../../')
      var file = fs.readFileSync('./files/' + this.params.universityId + '/' + this.params.semester + '/' + this.params.className + '/' + this.params.filename);
      return this.response.end(file)
}, {where: 'server'});