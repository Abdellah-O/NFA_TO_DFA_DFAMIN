import {State} from './todo';
import {Transition} from './todo';


export class App {

  

  constructor() {

  	/* Initialisation */

    /* Automate initial*/ 

    this.heading = "Enter States";
    this.Transitions = "Add Transitions";
    this.states = [];
    this.stateDescription = '';
    this.transitions = [];
    this.start = false ; 
    this.final = false ;
    this.accepts = [];
    this.symbols = [];




    this.test = [];
    this.test2 = [];
    this.test3 = [];
    this.gamma =[];


    /* Automate déterministe */ 
    this.determinist = null ;

    this.deter_transition = [];
    this.T = [];
    this.Q = [];
    this.Z = [];

    /*Automate AFD à dessiner*/
    this.AFD_T = new Array();
    this.AFD_STATE = new Array() ;
    this.FINALS = new Array() ;
    this.STARTS = new Array();
    this.F = new Array();
    this.S = new Array();


    /*Epsilon Fermeture de Chaque état*/
    this.eps_groupe =[];
    this.eps_state = [];
    this.nbr=0;

    this.debug = 0 ;

    /*Minimisation*/
    this.w= "";
    this.P = new Array();
    this.finale = new Array();
    this.etatfinal = new Array();
    this.etatinit = new Array();
  }

  addState() {
  				// State should be unique // fix it after	
    if (this.stateDescription) {
      if(this.final) this.FINALS.push(this.stateDescription);
      if(this.start) this.S.push(this.stateDescription);
      this.states.push(new State(this.stateDescription,this.start,this.final));
      this.stateDescription = '';
    }
  }


  removeState(state) {
    let index = this.states.indexOf(state);
    if (index !== -1) {
      this.states.splice(index, 1);
    } 
  }


  addTransition() // Suppose that source and target already exist // if not should add them automaticly 
  {
  	if (this.transitionSymbole && this.transitionSource && this.transitionTarget) {
      this.transitions.push(new Transition (this.transitionSource,this.transitionSymbole,this.transitionTarget));
      // Add the symbol to the list of symbols

      var test = true; 

      for(var i = 0; i < this.symbols.length ; i++)
      {
        if(this.symbols[i] == this.transitionSymbole)
          test = false;
      }

      if(test)
      this.symbols.push(this.transitionSymbole);


      this.transitionSymbole = '';
      this.transitionSource = '';
      this.transitionTarget = '';
    }
  }

   removeTransition(transition) {
    let index = this.transitions.indexOf(transition);
    if (index !== -1) {
      this.transitions.splice(index, 1);
    } 
  }


  

  state_fermeture(state){

    var tab = [];

    if(!this.eps_groupe.includes(state)) this.eps_groupe.push(state);
    for(var i=0;i<this.transitions.length;i++){
      if(this.transitions[i].source==state){
        if(this.transitions[i].symbole=='eps'){
              if(!this.eps_groupe.includes(this.transitions[i].target)) 
                this.eps_groupe.push(this.transitions[i].target);
              if(!tab.includes(this.transitions[i].target)) 
              tab.push(this.transitions[i].target);
        }
      }
    }

    this.groupe_fermeture(tab);
  }//end state_fermeture

  groupe_fermeture(table){
    for(var l=0;l<table.length;l++){
      this.state_fermeture(table[l]);
    }
    //var resultat = this.eps_groupe;
    //return resultat;
  }

  vider_eps(){
    while(this.eps_groupe.length > 0) {
      this.eps_groupe.pop();
    }
  }

  /*transformer(){
    for(var i=0;i<this.eps_groupe.length;i++){
      for(var j=0;this.states.length;j++){
        if(this.eps_groupe[i]==this.states[j].description){
          this.eps_state.push(this.states[j]);
          j=this.states.length;
        }
      }
    }
    eps_groupe = [];
  }*/

  state_place(descr){
    
      for(var j=0;this.states.length;j++){
        if(descr==this.states[j].description){
          return this.states[j];
          j=this.states.length;
        }
      }
    
  }

  /*calculer_epsilon(type,state,tab){
    switch(type){
      case 0 : 
              tab=[];state_fermeture(state);break;
      case 1 : 
              state=null;groupe_fermeture(tab);break;
    }
  }*/



  lancer_programme(){
    if(this.symbols.includes('eps')) this.dfa_conversion1();
    else this.dfa_conversion2();
  }


 	dfa_conversion1()
 	{

    
    this.start = this.states[0];
    
    length = this.states.length;

    this.accepts.push(this.states[length -1]);


  

    this.groupe_fermeture(this.S);
    var groupes = this.eps_groupe.toString();
    this.debug=1;
    var state = new State(this.eps_groupe.toString());
    this.vider_eps();
    this.T.push(state); 
    this.Q.push(state);
    this.debug = 2; // Checked

    

    while(this.T.length > 0)
    {

      var doubles = false ; 

      var i=  Math.floor(Math.random()*(this.T.length)); // (Math.random()*100)%(this.T.length);

      var alpha = new State(this.T[i].description); // Un état de T (Ensemble temporaire)

      if(alpha.description.includes(","))
      {
        doubles = true;
        this.gamma = alpha.description.split(",");
      }

    this.debug = 3 ; // Checked

        for(var j=0;j<this.symbols.length;j++)
        {
          if(this.symbols[j]!='eps'){

          var beta = []; // L'ensemble des états atteignable par Alpha, avec le symbol courant (symbols[j])

           // Checked 

            for(var k=0;k<this.transitions.length;k++) // On vérifie pour toute les transitions 
            {

              if(this.transitions[k].symbole!='eps'){
                 if(doubles == false)
                {
                  if( this.transitions[k].symbole == this.symbols[j] 
                      && (this.transitions[k].source == alpha.description) ) 
                  {
                      this.state_fermeture(this.transitions[k].target);
                      beta=this.eps_groupe.slice();
                      this.vider_eps();
                  }
                  this.debug = 4;
                }
                else
                {
                  for(var m = 0; m<this.gamma.length; m++)
                  {
                    if(this.transitions[k].symbole == this.symbols[j] && this.transitions[k].source == this.gamma[m] )
                    {
                      this.state_fermeture(this.transitions[k].target);
                      beta=this.eps_groupe.slice();
                      this.vider_eps();
                    }
                  }

                }
              } 
            } 

          // beta = Create new state : la concaténation des états qu'on peut atteindre à partir d'alpha, avec le symbole courant 


       
        if(beta.length != 0)
          {
           // Concaténation  

           var beta1 = beta.filter(function(elem, index, self) {
                return index == self.indexOf(elem);
            })


          var beta_state = new State(beta1.toString());

          this.test3.push(beta_state.description);


          var test = true ; // test if beta_state is already included in the Q 

         
         //this.debug = 7; Checked
           // Si beta n'est pas déjà inclus déjà dans Q 
              // Alors T.push(new state)
              // Q.push(new state)


            for(var l=0;l<this.Q.length;l++)
            {
             if(this.Q[l].description == beta_state.description ) 
             {
              test = false;
             }
            }


          if(test == true)
          {
            this.T.push(beta_state);
            this.Q.push(beta_state);
          }
          
          //this.debug = 8; Checked

          // Création d'une transition : 
          // Ajouter cette transition à la liste des transitions de l'automate déterministe 

          this.deter_transition.push(new Transition(alpha.description,this.symbols[j],beta_state.description));

          //this.debug = 9 ; // Checked


         }
         else
         {
           this.test3.push("No state");
         }
         
         }
        }//end for symbols

      // T.pop(alpha);

       
      this.T.splice(i, 1);

     // this.debug = 10; // Checked 

    }

   // this.determinist = new Automate(Q,Z,deter_transition,null,null);

   
  this.debug = 11; // Double Checked
  
  var dfa_states = new Array();
  var dfa_trans = new Array();

  for(var j=0;j<this.Q.length;j++){
      dfa_states.push(new State('S'+j,this.Q[j].start,this.Q[j].final));
    }

    for(var i=0;i<this.deter_transition.length;i++){
      for(var k=0;k<this.Q.length;k++){
        if(this.deter_transition[i].source==this.Q[k].description){
          for(var l=0;l<this.Q.length;l++){
            if(this.deter_transition[i].target==this.Q[l].description){
              dfa_trans.push(new Transition(dfa_states[k].description,this.deter_transition[i].symbole,dfa_states[l].description));
              l=this.Q.length;
            }
          }
          k=this.Q.length;
        }    
      } 
    }


    this.AFD_STATE=dfa_states.slice();
    this.AFD_T=dfa_trans.slice();

    for(var i=0;i<this.Q.length;i++){
      for(var j=0;j<this.FINALS.length;j++){
        if(this.Q[i].description.includes(this.FINALS[j])){
          this.F.push(this.AFD_STATE[i]);
          j=this.FINALS.length;
        }
        else j=this.FINALS.length;
      }
    }

    for(var i=0;i<this.Q.length;i++){
      for(var j=0;j<this.S.length;j++){
        if(this.Q[i].description.includes(this.S[j])){
          this.STARTS.push(this.AFD_STATE[i]);
          j=this.S.length;
        }
        else j=this.S.length;
      }
    }

 	}

  /**********************************************************************************************/
  /**********************************************************************************************/
  /********************************** SANS E-TANSITION*******************************************/
  /**********************************************************************************************/
  /**********************************************************************************************/
  /**********************************************************************************************/

  dfa_conversion2()
  {

    // Par défaut pour l'instant : Start = first state added, Accept = last state added

    this.start = this.states[0];
    
    length = this.states.length;

    this.accepts.push(this.states[length -1]);


    // Automate avant transformation 

   // this.automate = new Automate (this.states,this.symbols,this.transitions,this.start,this.accepts);
    
    // Transformation : A' = (Q,Z,S,q0,F);

   // this.Q = []; // States of determinist automate
    this.Q.push(new State(this.S.toString())); // Start == 0 

    this.debug =  1; // Checked

    // this.Z = this.symbols; // L'ensemble des symboles 

    // deter_transition :  L'ensemble des transactions de l'automate déterministe; 

    // T : Ensemble temporaire de nouvelles états formé de sous-ensemble d'état de l'automate initial 

    this.T.push(new State(this.S.toString())); 

    this.debug = 2; // Checked

    

    while(this.T.length > 0)
    {

      var doubles = false ; 

      var i=  Math.floor(Math.random()*(this.T.length)); // (Math.random()*100)%(this.T.length);

      var alpha = new State(this.T[i].description); // Un état de T (Ensemble temporaire)

      if(alpha.description.includes(","))
      {
        doubles = true;
        this.gamma = alpha.description.split(",");
      }

    //this.debug = 3 ; // Checked

        for(var j=0;j<this.symbols.length;j++)
        {

          var beta = []; // L'ensemble des états atteignable par Alpha, avec le symbol courant (symbols[j])

          //this.debug = 4; // Checked 


            for(var k=0;k<this.transitions.length;k++) // On vérifie pour toute les transitions 
            {

                  this.test.push(this.transitions[k].symbole.charCodeAt(0));
                  this.test2.push(alpha.description);

                  //this.debug = 5; Checked 

              if(doubles == false)
              {
                if( this.transitions[k].symbole == this.symbols[j] 
                    && (this.transitions[k].source == alpha.description) ) 
                {
                    //this.debug = 6;
                    beta.push(this.transitions[k].target);
                }
              }
              else
              {
                for(var m = 0; m<this.gamma.length; m++)
                {
                  if(this.transitions[k].symbole == this.symbols[j] && this.transitions[k].source == this.gamma[m] )
                  {
                    beta.push(this.transitions[k].target);
                  }
                }

              }
                
        
            } 

          // beta = Create new state : la concaténation des états qu'on peut atteindre à partir d'alpha, avec le symbole courant 


       
        if(beta.length != 0)
          {
           // Concaténation  

          var beta_state = new State(beta.toString());

          this.test3.push(beta_state.description);


          var test = true ; // test if beta_state is already included in the Q 

         
         //this.debug = 7; Checked
           // Si beta n'est pas déjà inclus déjà dans Q 
              // Alors T.push(new state)
              // Q.push(new state)


            for(var l=0;l<this.Q.length;l++)
            {
             if(this.Q[l].description == beta_state.description ) 
             {
              test = false;
             }
            }


          if(test == true)
          {
            this.T.push(beta_state);
            this.Q.push(beta_state);
          }
          
          //this.debug = 8; Checked

          // Création d'une transition : 
          // Ajouter cette transition à la liste des transitions de l'automate déterministe 

          this.deter_transition.push(new Transition(alpha.description,this.symbols[j],beta_state.description));

          //this.debug = 9 ; // Checked


         }
         else
         {
           this.test3.push("No state");
         }
         
         
        }

      // T.pop(alpha);

       
      this.T.splice(i, 1);

     // this.debug = 10; // Checked 

    }

   // this.determinist = new Automate(Q,Z,deter_transition,null,null);

   
  this.debug = 11; // Double Checked


  var dfa_states = new Array();
  var dfa_trans = new Array();

  for(var j=0;j<this.Q.length;j++){
      dfa_states.push(new State('S'+j,this.Q[j].start,this.Q[j].final));
    }

    for(var i=0;i<this.deter_transition.length;i++){
      for(var k=0;k<this.Q.length;k++){
        if(this.deter_transition[i].source==this.Q[k].description){
          for(var l=0;l<this.Q.length;l++){
            if(this.deter_transition[i].target==this.Q[l].description){
              dfa_trans.push(new Transition(dfa_states[k].description,this.deter_transition[i].symbole,dfa_states[l].description));
              l=this.Q.length;
            }
          }
          k=this.Q.length;
        }    
      } 
    }


    this.AFD_STATE=dfa_states.slice();
    this.AFD_T=dfa_trans.slice();

    for(var i=0;i<this.Q.length;i++){
      for(var j=0;j<this.FINALS.length;j++){
        if(this.Q[i].description.includes(this.FINALS[j])){
          this.F.push(this.AFD_STATE[i]);
          j=this.FINALS.length;
        }
        else j=this.FINALS.length;
      }
    }

    for(var i=0;i<this.Q.length;i++){
      for(var j=0;j<this.S.length;j++){
        if(this.Q[i].description.includes(this.S[j])){
          this.STARTS.push(this.AFD_STATE[i]);
          j=this.S.length;
        }
        else j=this.S.length;
      }
    }

  }

  /***************************************************************************************/
  /************************************** Minimisation ***********************************/
  /***************************************************************************************/

    minimization() {
    
    
    var pos = new Array();
    var ts = 0;
    
    var nbrpar = 0;
    var t=false;
    var state;
    this.P[0]= new Array();
    this.P[1]= new Array();


    for(state of this.states) {
      if(!(state.final)) {
        
        this.P[0].push(state.description);
        
      } else {
        
        this.P[1].push(state.description);
        
      }
    }
    pos.push([0,0]);
    pos.push([1,1]);

  for(state of this.states) {
    this.s++;
    nbrpar=this.P.length;
    this.deb=1;

    for(var j=0;j<nbrpar;j++) { //parcourir les lignes de P
      this.deb=2;
      var par = [];
      par=this.P[j].slice();

      for(var i=0;i<this.P[j].length;i++) { //parcourir les colonnes de P (partition)
        this.deb=3;

        for(var k=0;k<this.transitions.length;k++) { //parcourir les transitions
          this.deb=4;
          
          if(par[i]==this.transitions[k].source) {
            this.deb=5;

            if(!(par.includes(this.transitions[k].target))) {

              this.deb=6;
              for(var n=0;n<nbrpar;n++) { //parcourir P pour chercher s'il y a des partitions qui on la meme target
                if(this.getCol(this.P,n).includes(this.transitions[k].target)) {

                  this.deb=7;
                  for(var q=2;q<pos.length;q++) //parcourir la table pos pour trouver la patition qui a la meme target
                    if(pos[q][1]==n) {
                      this.deb=8;
                      if(!(this.P[q].includes(par[i]))) {
                        this.P[q].push(par[i]);
                        this.P[j].splice(i,1);
                        t=true;
                      }
                    }
                }
              }

              if(t==false) {
                    this.deb=9;
                    this.P[nbrpar]= new Array();
                    this.P[nbrpar].push(par[i]);
                      this.P[j].splice(i,1);
                      for(var n=0;n<nbrpar;n++) {//parcourir P pour chercher s'il y a des partitions qui on la meme target
                        ts=this.transitions[k].target;
                        if(this.getCol(this.P,n).includes(this.transitions[k].target)) 
                          pos.push([nbrpar,n]);
                      }
                    
              } else
                this.deb=10;
            }
          }
        }
      }
    }
  }

   for(var i=0;i<this.P.length;i++){
      this.finale.push(this.P[i].toString());
    }

    for(var i=0;i<this.finale.length;i++)
      for (state of states)
        if(state.final)
          if(finale[i].includes(state.description)) {
            this.etatfinal.push(finale[i]);
            this.finale.splice(i,1);
          }

    for(var i=0;i<this.finale.length;i++)
      for (state of states)
        if(state.start)
          if(finale[i].includes(state.description)) {
            this.etatinit.push(finale[i]);
            this.finale.splice(i,1);
          }

    

  }

  getCol(matrix, col){
       var column = [];
       for(var z=0; z<matrix[col].length; z++){
          //if(typeof matrix[z][col] != 'undefined')
          var ttt=matrix[col][z];
            column.push(matrix[col][z]);
       }
       return column;
    }

  


}