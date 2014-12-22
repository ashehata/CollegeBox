Template.home.rendered = function(){
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
		//Chose university _id and name available
		Session.set("university", chosenUniversity);
		Session.set("universityName", chosenUniversity.text);
		var routeParameters = {universityId: chosenUniversity.id};
		Router.go("universityHome", routeParameters);
	}
})