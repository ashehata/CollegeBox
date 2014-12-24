Template.universityHome.events({
	'click .add-class-btn': function(){
		bootbox.dialog({
		  title: "Add a Class",
		  message: Blaze.toHTML(Blaze.Template.addClassModal),
		  buttons:{
		    submit:{
		      label: "Add Class!",
		      callback: function(result) {
		      	var coursePrefix = $(".course-prefix").val();
		      	var courseNumber = $(".course-number").val();
		        var university = {
		        	id: Router.current().params.universityId,
		        	text: Colleges.findOne(Router.current().params.universityId).name
		        }

		        if (!coursePrefix || ! courseNumber){
		          $('.input-error').show();
		        	Meteor.setTimeout(function(){
		        		$('.input-error').hide();
		        	}, 4000);
		          return false;
		        }
		        if (Classes.findOne({coursePrefix: coursePrefix, courseNumber: courseNumber, university: university})){
		        	$('.already-exists-error').show();
		        	Meteor.setTimeout(function(){
		        		$('.already-exists-error').hide();
		        	}, 4000);
		        	return false;
		        }
		        Classes.insert({coursePrefix: coursePrefix, courseNumber: courseNumber, name: coursePrefix + '-' + courseNumber, university: university })
		      }
		    }
		  }
		});
	},
	'keyup .search-class': function(e){
		Session.set("searchQuery", e.target.value);
	}
})

Template.universityHome.helpers({
	classes: function(){
		var results;
		if (Session.get("searchQuery")){
			EasySearch.search('classes',  Session.get("searchQuery"), function (err, data) {
    			results = data.results
			});
			return results;
		}
		return Classes.find({'university.id': Router.current().params.universityId}).fetch();
	},
	universityName: function(){
		return Colleges.findOne({_id: Router.current().params.universityId}).name;
	}
})