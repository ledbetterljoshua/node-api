function Group(name, id, owner) {  
  this.name = name;
  this.id = id;
  this.owner = owner;
  this.people = [];
  this.status = "available";
};

Group.prototype.addPerson = function(personID) {  
  if (this.status === "available") {
    this.people.push(personID);
  }
};

module.exports = Group;