Template.home.rendered = function(){
	console.log(Colleges.find().fetch());
  $(".university-select").select2({
    placeholder: 'Select Your University',
    data: Colleges.find().map(function(doc){
          return {id: doc._id, text: doc.name}
      }),
    width:'400px'
  });
}

Template.home.events({
	'change .university-select': function(e){
		var chosenUniversity = $(".university-select").select2("data");	
		//Chosen university _id and name available
		var routeParameters = {universityId: chosenUniversity.id};
		Router.go("home", routeParameters);
	}
})