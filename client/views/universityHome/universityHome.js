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
	'click .add-semester-btn': function(e){
		bootbox.dialog({
		  title: "Add a Semester to " + Colleges.findOne(Router.current().params.universityId).name,
		  message: Blaze.toHTML(Blaze.Template.addSemesterModal),
		  buttons:{
		    submit:{
		      label: "Add Semester!",
		      callback: function(result) {
		      	var season = $( ".season option:selected" ).text();
		      	var year = $( ".year option:selected" ).text();
		        var semester = {
		        	season: season,
		        	year: year
		        }  
		        if (Colleges.findOne({_id: Router.current().params.universityId, semesters: {$in: [semester]}})){
		         	$('.already-exists-error').show();
		         	Meteor.setTimeout(function(){
		         		$('.already-exists-error').hide();
		         	}, 4000);
		         	return false;
		        }
		        Colleges.update(Router.current().params.universityId, {$push: {semesters: semester}});
		    }
		   }
		  }
		});
	},
	'keyup .search-class': function(e){
		Session.set("searchQuery", e.target.value);
	}
})

Template.semester.events({
	'change .file-uploader': function(e, tmpl){
		var file = tmpl.find(".file-uploader").files[0];
		var selectedFileName = tmpl.find(".selected-file");
		$(selectedFileName).text(file.name).show();
		if (file.name){
			$(tmpl.find(".upload-btn")).show();
		}
		else{
			$(tmpl.find(".upload-btn")).hide();
		}
	},
	'click .select-btn': function(e, tmpl){
		console.log(this);
		tmpl.find('.file-uploader').click();
	},
	'click .upload-btn': function(e, tmpl){
		var file = tmpl.find(".file-uploader").files[0];
		uploadFile(file, this.season + this.year, Router.current().params.className, Router.current().params.universityId);
		$(tmpl.find(".upload-btn")).hide();
		$(tmpl.find(".selected-file")).hide();

	},
	'dropped .sub-header': function(e){
		console.log("Dropped file");
		console.log(e);
    	e.preventDefault();
    	e.stopPropagation();
    	var files = event.originalEvent.dataTransfer.files;
    	console.log(files);

	}
})

Template.semester.helpers({
	files: function(){
		return Files.find({
			universityId: Router.current().params.universityId,
			semester: this.season + this.year,
			className: Router.current().params.className
		});
	
	},
	tooltipText: function(){
 	  Meteor.defer(function(){$('.upload-tooltip').tooltip('fixTitle');})
	  return "Upload material to " + Router.current().params.className + " (" + this.season + "-" + this.year + ")";
	},
	universityId: function(){
		return Router.current().params.universityId;
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
	},
	className: function(){
		return Router.current().params.className || "Please select a class to get started";
	},
	currentUniversityId: function(){
		return Router.current().params.universityId;
	},
	semesters: function(){
		return Colleges.findOne({_id: Router.current().params.universityId}).semesters;
	},
	classSelected: function(){
		if (Router.current().params.className)
			return true;
		return false;
	}

})

Template.universityHome.rendered = function(){
}


var uploadFile;

uploadFile = function(file, semester, className, universityId) {
  var reader, uploaded;
  console.log(file);
  uploaded = false;
  reader = new FileReader;
  reader.onloadend = function(e) {
    var blob;
    console.log("File read!!");
    blob = new Uint8Array(this.result);
    Meteor.call("upload", file.name, blob, semester, className, universityId);
    $('.fileselect').val('');
    Session.set("selectedFileName", "File Uploaded Successfully");
  };
  return reader.readAsArrayBuffer(file);
};

Template.homeFeed.helpers({
	feedFiles: function(){
		return Files.find({universityId: Router.current().params.universityId});
	}
})