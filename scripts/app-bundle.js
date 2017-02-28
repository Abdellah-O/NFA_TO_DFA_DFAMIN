define('app',['exports', './todo'], function (exports, _todo) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);

      this.heading = "Enter States";
      this.Transitions = "Add Transitions";
      this.states = [];
      this.stateDescription = '';
      this.transitions = [];
      this.start = false;
      this.final = false;
      this.accepts = [];
      this.symbols = [];

      this.test = [];
      this.test2 = [];
      this.test3 = [];
      this.gamma = [];

      this.determinist = null;

      this.deter_transition = [];
      this.T = [];
      this.Q = [];
      this.Z = [];

      this.AFD_T = new Array();
      this.AFD_STATE = new Array();
      this.FINALS = new Array();
      this.STARTS = new Array();
      this.F = new Array();
      this.S = new Array();

      this.eps_groupe = [];
      this.eps_state = [];
      this.nbr = 0;

      this.debug = 0;

      this.w = "";
      this.P = new Array();
      this.finale = new Array();
      this.etatfinal = new Array();
      this.etatinit = new Array();
    }

    App.prototype.addState = function addState() {
      if (this.stateDescription) {
        if (this.final) this.FINALS.push(this.stateDescription);
        if (this.start) this.S.push(this.stateDescription);
        this.states.push(new _todo.State(this.stateDescription, this.start, this.final));
        this.stateDescription = '';
      }
    };

    App.prototype.removeState = function removeState(state) {
      var index = this.states.indexOf(state);
      if (index !== -1) {
        this.states.splice(index, 1);
      }
    };

    App.prototype.addTransition = function addTransition() {
      if (this.transitionSymbole && this.transitionSource && this.transitionTarget) {
        this.transitions.push(new _todo.Transition(this.transitionSource, this.transitionSymbole, this.transitionTarget));


        var test = true;

        for (var i = 0; i < this.symbols.length; i++) {
          if (this.symbols[i] == this.transitionSymbole) test = false;
        }

        if (test) this.symbols.push(this.transitionSymbole);

        this.transitionSymbole = '';
        this.transitionSource = '';
        this.transitionTarget = '';
      }
    };

    App.prototype.removeTransition = function removeTransition(transition) {
      var index = this.transitions.indexOf(transition);
      if (index !== -1) {
        this.transitions.splice(index, 1);
      }
    };

    App.prototype.state_fermeture = function state_fermeture(state) {

      var tab = [];

      if (!this.eps_groupe.includes(state)) this.eps_groupe.push(state);
      for (var i = 0; i < this.transitions.length; i++) {
        if (this.transitions[i].source == state) {
          if (this.transitions[i].symbole == 'eps') {
            if (!this.eps_groupe.includes(this.transitions[i].target)) this.eps_groupe.push(this.transitions[i].target);
            if (!tab.includes(this.transitions[i].target)) tab.push(this.transitions[i].target);
          }
        }
      }

      this.groupe_fermeture(tab);
    };

    App.prototype.groupe_fermeture = function groupe_fermeture(table) {
      for (var l = 0; l < table.length; l++) {
        this.state_fermeture(table[l]);
      }
    };

    App.prototype.vider_eps = function vider_eps() {
      while (this.eps_groupe.length > 0) {
        this.eps_groupe.pop();
      }
    };

    App.prototype.state_place = function state_place(descr) {

      for (var j = 0; this.states.length; j++) {
        if (descr == this.states[j].description) {
          return this.states[j];
          j = this.states.length;
        }
      }
    };

    App.prototype.lancer_programme = function lancer_programme() {
      if (this.symbols.includes('eps')) this.dfa_conversion1();else this.dfa_conversion2();
    };

    App.prototype.dfa_conversion1 = function dfa_conversion1() {

      this.start = this.states[0];

      length = this.states.length;

      this.accepts.push(this.states[length - 1]);

      this.groupe_fermeture(this.S);
      var groupes = this.eps_groupe.toString();
      this.debug = 1;
      var state = new _todo.State(this.eps_groupe.toString());
      this.vider_eps();
      this.T.push(state);
      this.Q.push(state);
      this.debug = 2;

      while (this.T.length > 0) {

        var doubles = false;

        var i = Math.floor(Math.random() * this.T.length);

        var alpha = new _todo.State(this.T[i].description);

        if (alpha.description.includes(",")) {
          doubles = true;
          this.gamma = alpha.description.split(",");
        }

        this.debug = 3;

        for (var j = 0; j < this.symbols.length; j++) {
          if (this.symbols[j] != 'eps') {

            var beta = [];

            for (var k = 0; k < this.transitions.length; k++) {

              if (this.transitions[k].symbole != 'eps') {
                if (doubles == false) {
                  if (this.transitions[k].symbole == this.symbols[j] && this.transitions[k].source == alpha.description) {
                    this.state_fermeture(this.transitions[k].target);
                    beta = this.eps_groupe.slice();
                    this.vider_eps();
                  }
                  this.debug = 4;
                } else {
                  for (var m = 0; m < this.gamma.length; m++) {
                    if (this.transitions[k].symbole == this.symbols[j] && this.transitions[k].source == this.gamma[m]) {
                      this.state_fermeture(this.transitions[k].target);
                      beta = this.eps_groupe.slice();
                      this.vider_eps();
                    }
                  }
                }
              }
            }

            if (beta.length != 0) {

              var beta1 = beta.filter(function (elem, index, self) {
                return index == self.indexOf(elem);
              });

              var beta_state = new _todo.State(beta1.toString());

              this.test3.push(beta_state.description);

              var test = true;

              for (var l = 0; l < this.Q.length; l++) {
                if (this.Q[l].description == beta_state.description) {
                  test = false;
                }
              }

              if (test == true) {
                this.T.push(beta_state);
                this.Q.push(beta_state);
              }

              this.deter_transition.push(new _todo.Transition(alpha.description, this.symbols[j], beta_state.description));
            } else {
              this.test3.push("No state");
            }
          }
        }

        this.T.splice(i, 1);
      }

      this.debug = 11;

      var dfa_states = new Array();
      var dfa_trans = new Array();

      for (var j = 0; j < this.Q.length; j++) {
        dfa_states.push(new _todo.State('S' + j, this.Q[j].start, this.Q[j].final));
      }

      for (var i = 0; i < this.deter_transition.length; i++) {
        for (var k = 0; k < this.Q.length; k++) {
          if (this.deter_transition[i].source == this.Q[k].description) {
            for (var l = 0; l < this.Q.length; l++) {
              if (this.deter_transition[i].target == this.Q[l].description) {
                dfa_trans.push(new _todo.Transition(dfa_states[k].description, this.deter_transition[i].symbole, dfa_states[l].description));
                l = this.Q.length;
              }
            }
            k = this.Q.length;
          }
        }
      }

      this.AFD_STATE = dfa_states.slice();
      this.AFD_T = dfa_trans.slice();

      for (var i = 0; i < this.Q.length; i++) {
        for (var j = 0; j < this.FINALS.length; j++) {
          if (this.Q[i].description.includes(this.FINALS[j])) {
            this.F.push(this.AFD_STATE[i]);
            j = this.FINALS.length;
          } else j = this.FINALS.length;
        }
      }

      for (var i = 0; i < this.Q.length; i++) {
        for (var j = 0; j < this.S.length; j++) {
          if (this.Q[i].description.includes(this.S[j])) {
            this.STARTS.push(this.AFD_STATE[i]);
            j = this.S.length;
          } else j = this.S.length;
        }
      }
    };

    App.prototype.dfa_conversion2 = function dfa_conversion2() {

      this.start = this.states[0];

      length = this.states.length;

      this.accepts.push(this.states[length - 1]);

      this.Q.push(new _todo.State(this.S.toString()));

      this.debug = 1;

      this.T.push(new _todo.State(this.S.toString()));

      this.debug = 2;

      while (this.T.length > 0) {

        var doubles = false;

        var i = Math.floor(Math.random() * this.T.length);

        var alpha = new _todo.State(this.T[i].description);

        if (alpha.description.includes(",")) {
          doubles = true;
          this.gamma = alpha.description.split(",");
        }

        for (var j = 0; j < this.symbols.length; j++) {

          var beta = [];

          for (var k = 0; k < this.transitions.length; k++) {

            this.test.push(this.transitions[k].symbole.charCodeAt(0));
            this.test2.push(alpha.description);

            if (doubles == false) {
              if (this.transitions[k].symbole == this.symbols[j] && this.transitions[k].source == alpha.description) {
                beta.push(this.transitions[k].target);
              }
            } else {
              for (var m = 0; m < this.gamma.length; m++) {
                if (this.transitions[k].symbole == this.symbols[j] && this.transitions[k].source == this.gamma[m]) {
                  beta.push(this.transitions[k].target);
                }
              }
            }
          }

          if (beta.length != 0) {

            var beta_state = new _todo.State(beta.toString());

            this.test3.push(beta_state.description);

            var test = true;

            for (var l = 0; l < this.Q.length; l++) {
              if (this.Q[l].description == beta_state.description) {
                test = false;
              }
            }

            if (test == true) {
              this.T.push(beta_state);
              this.Q.push(beta_state);
            }

            this.deter_transition.push(new _todo.Transition(alpha.description, this.symbols[j], beta_state.description));
          } else {
            this.test3.push("No state");
          }
        }

        this.T.splice(i, 1);
      }

      this.debug = 11;

      var dfa_states = new Array();
      var dfa_trans = new Array();

      for (var j = 0; j < this.Q.length; j++) {
        dfa_states.push(new _todo.State('S' + j, this.Q[j].start, this.Q[j].final));
      }

      for (var i = 0; i < this.deter_transition.length; i++) {
        for (var k = 0; k < this.Q.length; k++) {
          if (this.deter_transition[i].source == this.Q[k].description) {
            for (var l = 0; l < this.Q.length; l++) {
              if (this.deter_transition[i].target == this.Q[l].description) {
                dfa_trans.push(new _todo.Transition(dfa_states[k].description, this.deter_transition[i].symbole, dfa_states[l].description));
                l = this.Q.length;
              }
            }
            k = this.Q.length;
          }
        }
      }

      this.AFD_STATE = dfa_states.slice();
      this.AFD_T = dfa_trans.slice();

      for (var i = 0; i < this.Q.length; i++) {
        for (var j = 0; j < this.FINALS.length; j++) {
          if (this.Q[i].description.includes(this.FINALS[j])) {
            this.F.push(this.AFD_STATE[i]);
            j = this.FINALS.length;
          } else j = this.FINALS.length;
        }
      }

      for (var i = 0; i < this.Q.length; i++) {
        for (var j = 0; j < this.S.length; j++) {
          if (this.Q[i].description.includes(this.S[j])) {
            this.STARTS.push(this.AFD_STATE[i]);
            j = this.S.length;
          } else j = this.S.length;
        }
      }
    };

    App.prototype.minimization = function minimization() {

      var pos = new Array();
      var ts = 0;

      var nbrpar = 0;
      var t = false;
      var state;
      this.P[0] = new Array();
      this.P[1] = new Array();

      for (var _iterator = this.states, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        if (_isArray) {
          if (_i >= _iterator.length) break;
          state = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          state = _i.value;
        }

        if (!state.final) {

          this.P[0].push(state.description);
        } else {

          this.P[1].push(state.description);
        }
      }
      pos.push([0, 0]);
      pos.push([1, 1]);

      for (var _iterator2 = this.states, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          state = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          state = _i2.value;
        }

        this.s++;
        nbrpar = this.P.length;
        this.deb = 1;

        for (var j = 0; j < nbrpar; j++) {
          this.deb = 2;
          var par = [];
          par = this.P[j].slice();

          for (var i = 0; i < this.P[j].length; i++) {
            this.deb = 3;

            for (var k = 0; k < this.transitions.length; k++) {
              this.deb = 4;

              if (par[i] == this.transitions[k].source) {
                this.deb = 5;

                if (!par.includes(this.transitions[k].target)) {

                  this.deb = 6;
                  for (var n = 0; n < nbrpar; n++) {
                    if (this.getCol(this.P, n).includes(this.transitions[k].target)) {

                      this.deb = 7;
                      for (var q = 2; q < pos.length; q++) {
                        if (pos[q][1] == n) {
                          this.deb = 8;
                          if (!this.P[q].includes(par[i])) {
                            this.P[q].push(par[i]);
                            this.P[j].splice(i, 1);
                            t = true;
                          }
                        }
                      }
                    }
                  }

                  if (t == false) {
                    this.deb = 9;
                    this.P[nbrpar] = new Array();
                    this.P[nbrpar].push(par[i]);
                    this.P[j].splice(i, 1);
                    for (var n = 0; n < nbrpar; n++) {
                      ts = this.transitions[k].target;
                      if (this.getCol(this.P, n).includes(this.transitions[k].target)) pos.push([nbrpar, n]);
                    }
                  } else this.deb = 10;
                }
              }
            }
          }
        }
      }

      for (var i = 0; i < this.P.length; i++) {
        this.finale.push(this.P[i].toString());
      }

      for (var i = 0; i < this.finale.length; i++) {
        for (var _iterator3 = states, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
          if (_isArray3) {
            if (_i3 >= _iterator3.length) break;
            state = _iterator3[_i3++];
          } else {
            _i3 = _iterator3.next();
            if (_i3.done) break;
            state = _i3.value;
          }

          if (state.final) if (finale[i].includes(state.description)) {
            this.etatfinal.push(finale[i]);
            this.finale.splice(i, 1);
          }
        }
      }for (var i = 0; i < this.finale.length; i++) {
        for (var _iterator4 = states, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
          if (_isArray4) {
            if (_i4 >= _iterator4.length) break;
            state = _iterator4[_i4++];
          } else {
            _i4 = _iterator4.next();
            if (_i4.done) break;
            state = _i4.value;
          }

          if (state.start) if (finale[i].includes(state.description)) {
            this.etatinit.push(finale[i]);
            this.finale.splice(i, 1);
          }
        }
      }
    };

    App.prototype.getCol = function getCol(matrix, col) {
      var column = [];
      for (var z = 0; z < matrix[col].length; z++) {
        var ttt = matrix[col][z];
        column.push(matrix[col][z]);
      }
      return column;
    };

    return App;
  }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    longStackTraces: _environment2.default.debug,
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('todo',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var State = exports.State = function State(description, s, f) {
    _classCallCheck(this, State);

    this.description = description;
    this.start = s;
    this.final = f;
  };

  var Transition = exports.Transition = function Transition(source, symbole, target) {
    _classCallCheck(this, Transition);

    this.symbole = symbole;
    this.source = source;
    this.target = target;
  };

  var Partition = exports.Partition = function () {
    function Partition(description) {
      _classCallCheck(this, Partition);

      this.description = description;
    }

    Partition.prototype.addstate = function addstate(e) {
      this.table.push(e);
    };

    return Partition;
  }();
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('text!style.css', ['module'], function(module) { module.exports = "@font-face\r\n{\r\n    font-family: 'Lazy Spring Day';\r\n    src: url('src/font/Lazy Spring Day.ttf') format('truetype');\r\n    font-weight: normal;\r\n    font-style: normal;\r\n}\r\nbody { \r\n  background-image: url(\"src/paper.png\");\r\n  font-family:Lazy Spring Day;\r\n  color: #515151;\r\n}\r\n\r\n#head{\r\n\tmargin-left: 30%;\r\n\tfont-weight: bold;\r\n\tfont-size: 3em;\r\n}\r\n\r\n.blocks_l{\r\n\twidth: 20%;\r\n\tdisplay: inline-block;\r\n\tmargin-right: 6%;\r\n}\r\n\r\n.blocks_r{\r\n\tdisplay: inline-block;\r\n\r\n}\r\n\r\n#info {\r\n  color: #c88;\r\n  font-size: 1em;\r\n  position: absolute;\r\n  z-index: -1;\r\n  left: 1em;\r\n  top: 1em;\r\n}\r\n\r\nbutton {\r\n\tfont-family:Lazy Spring Day;\r\n\tfont-size: 12pt;\r\n    font-size: 1.2rem;\r\n    color: white;\r\n    border: 0;\r\n    cursor: pointer;\r\n    background-color: #515151;\r\n    margin-right: -5%;\r\n}\r\n\r\n.button_l{\r\n\tdisplay: inline-block;\r\n\tmargin-left: 10%;\r\n}\r\n\r\n.button_r{\r\n\tdisplay: inline-block;\r\n\tmargin-left: 35%;\r\n\r\n}\r\n\r\ninput {\r\n\tfont-family:Lazy Spring Day;\r\n\tcolor: #7D7D7D;\r\n\tpadding: 5px 15px 5px 15px;\r\n\tborder: 1px solid #C7C7C7;\r\n\tfont-size: 12pt;\r\n    font-size: 1.2rem;\r\n}\r\n\r\n#automate,#non,#determin2,#st{\r\n\tvisibility:hidden;\r\n}\r\n\r\n.remove{\r\n\tdisplay: inline-block;\r\n\twidth:10%;\r\n}\r\n.dd{\r\n\tdisplay: inline-block;\r\n}"; });
define('text!app.html', ['module'], function(module) { module.exports = "    \r\n<template>\r\n<require from=\"style.css\"></require>\r\n\r\n\r\n  <div id=\"head\">NFA TO DFA PROGRAM</div>\r\n\r\n  <div>\r\n  <h1 class=\"blocks_l\">${heading}</h1>\r\n\r\n  <form class=\"blocks_r\" submit.trigger=\"addState()\">\r\n    <input type=\"text\" placeholder=\"State Name\" value.bind=\"stateDescription\">\r\n    <input type=\"checkbox\" checked.bind=\"start\"> start state?\r\n    <input type=\"checkbox\" checked.bind=\"final\"> final state?\r\n    <button type=\"submit\" onclick=\"document.getElementById('st').style.visibility='visible';\">Add State</button>\r\n  </form>\r\n  </div>\r\n\r\n  <div>\r\n  <h1 class=\"blocks_l\">${Transitions}</h1>\r\n  <form class=\"blocks_r\" submit.trigger=\"addTransition()\">\r\n    <input type=\"text\" placeholder=\"Source\" value.bind=\"transitionSource\"> \r\n    <input type=\"text\" placeholder=\"Symbole\" value.bind=\"transitionSymbole\">\r\n    <input type=\"text\" placeholder=\"Target\" value.bind=\"transitionTarget\">\r\n    <button type=\"submit\" onclick=\"document.getElementById('non').style.visibility='visible';\">Add Transition</button>\r\n  </form>\r\n  </div>\r\n\r\n  <ul id=\"st\">\r\n    <h2>States</h2>\r\n    <li repeat.for=\"state of states\">\r\n      <span class=\"remove\">\r\n         ${state.start ? 'start state:' : ''}\r\n         ${state.final ? 'final state:' : ''}\r\n         \"${state.description}\"\r\n      </span>\r\n      <button  click.trigger=\"removeState(state)\">Remove</button>\r\n    </li>    \r\n  </ul>\r\n\r\n  <ul id=\"non\">\r\n    <h2>Transitions Of (NFA Or DFA ) Automate</h2> \r\n    <li repeat.for=\"transition of transitions\">\r\n      \r\n      Source : <span> ${transition.source} -> </span>\r\n      \r\n      Symbole : <span> ${transition.symbole} -> </span>\r\n      \r\n      Target : <span> ${transition.target} </span>\r\n\r\n      <button click.trigger=\"removeTransition(transition)\">Remove</button>\r\n    </li>    \r\n  </ul>\r\n\r\n\r\n  <form class=\"button_r\" submit.trigger = \"lancer_programme()\">\r\n\r\n  <button type =\"submit\" onclick=\"document.getElementById('automate').style.visibility='visible';\"> Determinisation </button>\r\n\r\n  </form>    \r\n\r\n  <form class=\"button_l\" onclick=\"document.getElementById('determin2').style.visibility='visible';\" submit.trigger = \"minimization()\">\r\n\r\n  <button type =\"submit\"> Minimization </button>    \r\n\r\n  </form>   \r\n\r\n\r\n\r\n<div id=\"automate\">\r\n  \r\n  <h3> L'automate déterministe :  </h3>\r\n\r\n      <h5> Les états : </h5>\r\n      <ul>\r\n          <li repeat.for=\"state of AFD_STATE\"> ${state.description} </li>\r\n      </ul>\r\n\r\n      <h5> Start states </h5>\r\n      <ul>\r\n          <li repeat.for=\"state of STARTS\"> ${state.description} </li>\r\n      </ul>\r\n\r\n      <h5> Final states </h5>\r\n      <ul>\r\n          <li repeat.for=\"state of F\"> ${state.description} </li>\r\n      </ul>\r\n\r\n\r\n      <h5> Les transitions </h5>\r\n      <ul>\r\n          <li repeat.for=\"transition of AFD_T\"> \r\n            \r\n              Source : <span> ${transition.source} -></span>\r\n      \r\n              Symbole : <span> ${transition.symbole} -></span>\r\n              \r\n              Target : <span> ${transition.target} </span>\r\n\r\n\r\n           </li>\r\n      </ul>\r\n\r\n</div>\r\n\r\n\r\n\r\n<div id=\"determin2\">\r\n  <h1>DFA Minimal</h1>\r\n  <div>\r\n    <ul>\r\n      <li>Start States  : <span repeat.for=\"e of etatinit\">${e}</span></li> \r\n      <li>Final States  : <span repeat.for=\"f of etatfinal\">${f}</span></li>\r\n      <li>Middle States : <span repeat.for=\"g of finale\">${g}</span></li>\r\n    </ul>\r\n  </div>\r\n\r\n  <p>the list of transition is under construction</p>\r\n</div>\r\n\r\n\r\n\r\n\r\n</template>\r\n\r\n  "; });
//# sourceMappingURL=app-bundle.js.map