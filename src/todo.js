    

export class State {
  constructor(description,s,f) {
    this.description = description;
    this.start = s ;  
    this.final = f ;
  }
}

export class Transition{
	constructor(source,symbole,target)
	{
		this.symbole = symbole;
		this.source = source ;
		this.target = target; 
	}
}



export class Partition {
  constructor(description) {
    this.description = description;
  }
  addstate(e) {
  	this.table.push(e);
  }
}


  