Template.universityHome.events({
	'click .add-class-btn': function(){
		bootbox.prompt("Class Name?", function(result) {                
		  if (result === null) {                                             
		    //Show Error
		  } else {
		  	var university = {
		  		id : Router.current().params.universityId,
		  		text: Colleges.find(Router.current().params.universityId).name
		  	};
		    Classes.insert({university: university, name: result});                          
		  }
		});
	}
})

Template.universityHome.helpers({
	classes: function(){
		return Classes.find({'university.id': Router.current().params.universityId}).fetch();
	},
	universityName: function(){
		return Colleges.findOne({_id: Router.current().params.universityId}).name;
	}
})