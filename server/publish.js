Meteor.publish("colleges", function(){
	return Colleges.find();
})

Meteor.publish("classes", function(){
	return Classes.find();
});

Meteor.publish("files", function(){
	return Files.find();
})