var $ = require('jquery-browserify');
var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');


var Wiki = React.createClass({
  getInitialState: function(){
    return{
      pages: []
    };
  },

  componentDidMount: function(){
    this.addPage(this.props.firstPage);
  },

  addPage: function(pageName){
    var newState = this.state.pages;
    this.getPage(pageName, (response)=>{
      newState.push(response);
      this.setState({pages: newState});
      this.addNextPage();
    });
  },

  getPage: function(pageName, callback){
    $.get('/wiki/get-page?page='+pageName).done((response)=>{
      if(!response){
        this.getPage(pageName, callback);
      }
      callback(response);
    });
  },

  addNextPage: function(){
    var pages = this.state.pages;
    var lastPage = pages[pages.length-1];
    var nextPageTitle = this.getNextPageTitle(lastPage);
    this.addPage(nextPageTitle);
  },

  getNextPageTitle: function(page){
    var links = page.links.filter(function( obj ) {
      return obj.ns === 0 && obj.exists === '';
    });
    if (links.length === 0){
      return null;
    }
    var index = Math.floor(Math.random() * (links.length));
    var nextPage = links[index];
    return nextPage['*'];
  },

  render: function(){
    return(
      <Pages pages={this.state.pages}/>
    );
  }
});

var Pages = React.createClass({
  render: function(){
    return(
      <div>
        {
          this.props.pages.map((page,index)=>{
            return(
              <Page page={page} key={index}/>
            );
          })
        }
      </div>
    );
  }
});

var Page = React.createClass({
  componentDidMount: function(){
    $('html, body').animate({
     scrollTop: $(document).height()-$(window).height()},
     100
    );
    mutate(this.props.page.sentiment/60);
  },
  render: function(){
    return(
      <p>{this.props.page.title} <small>{this.props.page.sentiment}</small></p>
    );
  }
});


ReactDOM.render(<Wiki firstPage="Philosophy"/>, document.getElementById('wiki'));



var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

var currentAngle = 0;
var currentMutation = 0;
var centerX = canvas.width/2;
var centerY = canvas.height/2;
var currentX = getX(currentAngle);
var currentY = getY(currentAngle);
var radius = 100;
var arcs = 0;
var dampening = 50;


function mutate(amount){
  currentMutation += amount;
  dampening -= Math.abs(amount);
}

function getDampenedMutation(){
  if (dampening > 0) {
    return currentMutation / dampening;
  }else{
    return currentMutation
  }
}

function drawSegment(){
  context.lineWidth = 1;
  context.strokeStyle = '#00000';
  context.beginPath();
  context.moveTo(currentX, currentY);
  var newX = getX(currentAngle, getDampenedMutation());
  var newY = getY(currentAngle, getDampenedMutation());
  context.lineTo(newX, newY);
  context.stroke();
  currentX = newX;
  currentY = newY;
  currentAngle += 0.05;
  requestAnimationFrame(function(){drawSegment();});
}

function getX(angle, mutation){
  return Math.cos(angle) * (radius+mutation*Math.sin(mutation)^3) + centerX - Math.tan(mutation)/2;
}

function getY(angle, mutation){
  return Math.sin(angle) * (radius+mutation*Math.sin(mutation)^3) + centerY - Math.tan(mutation);
}

drawSegment();
