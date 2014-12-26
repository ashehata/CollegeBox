//Add schema TODO
Colleges = new Meteor.Collection("colleges");

Classes = new Meteor.Collection("classes");

Classes.initEasySearch(['coursePrefix', 'courseNumber', 'courseName'], {
  'limit' : 30
});

Colleges.initEasySearch(['name', 'state']);
