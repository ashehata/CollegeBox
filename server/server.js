  Meteor.startup(function () {
	 var colleges = JSON.parse(Assets.getText('collegelist.json'));
	  for (i in colleges){
	    if (Colleges.find( {"name": colleges[i].name}).count() == 0 ){
	      console.log("Inserting new College: " + colleges[i].name)
	      Colleges.insert(colleges[i]);
	    }
	  }
  });

