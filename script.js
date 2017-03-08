//scatterplot variables
var width = 750;
var height = 430;
var margin = {top: 15, right: 15, bottom: 15, left: 60};
    var w = width - margin.left - margin.right;
    var h = height - margin.top - margin.bottom;

var dataset; //the full dataset

var filters = {gender: "all", major: "all", yearMin: 2000, yearMax: 2013, ta: "all", industry: "all"};


//barchart variables
var barMargin = {top: 15, right: 15, bottom: 20, left: 60},
    // barWidth = 750 - barMargin.left - barMargin.right,
    // barHeight = 450 - barMargin.top - barMargin.bottom;
    barWidth = 750;
    barHeight = 270;
    var barW = barWidth - barMargin.left - barMargin.right;
    var barH = barHeight - barMargin.top - barMargin.bottom;




//load the data
d3.csv("capstone_alumni.csv", function(error, alumni) {
//read in the data
  if (error) return console.warn(error);
     alumni.forEach(function(d) {
     	d.year = +d.year;
     	d.years_in_industry = +d.years_in_industry;
     	//d.name = +d.name;
  });
//dataset is the full dataset -- maintain a copy of this at all times
  dataset = alumni;


//all the data is now loaded, so draw the initial vis
  drawVis(dataset);

});



//none of these depend on the data being loaded so fine to define here

var col = d3.scaleOrdinal(d3.schemeCategory10);


var chart = d3.select(".chart")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom+15)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .html("This is the tooltip");

var profile = d3.select("#profile");

//barX.domain(testArray.map(function(d) { return d.category; }));

var x = d3.scaleLinear()
        .domain([2000, 2013])
        .range([0, w]);

var y = d3.scaleLinear()
        .domain([0, 20])
        .range([h, 0]);

var xAxis = d3.axisBottom()
    .ticks(14)
    .scale(x)
    .tickFormat(d3.format("d"));

chart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis)
     .append("text")
      .attr("x", w)
      .attr("y", -2)
      .style("text-anchor", "end")
      .text("Capstone Year");

var yAxis = d3.axisLeft()
    .scale(y);

chart.append("g")
   .attr("class", "axis")
   .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 2)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Years in Industry");



//bar chart graph set-up

var barChart = d3.select("#visualization").append("svg")
    .attr("width", barW + barMargin.left + barMargin.right)
    .attr("height", barH + barMargin.top + barMargin.bottom+15)
    .append("g")
    .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");


var testArray = [{category: "Software", value: 0}, {category: "Technical", value: 0}, {category: "Lighting", value: 0}, {category: "Character", value: 0}, {category: "Modeling", value: 0}, {category: "Production", value: 0}, {category: "Art", value: 0}, {category: "Other", value: 0}];



// set the ranges
var barX = d3.scaleBand()
          .range([0, barW])
          .padding(0.1);
var barY = d3.scaleLinear()
          .range([barH, 0]);
          
 // Scale the range of the data in the domains
barX.domain(testArray.map(function(d) { return d.category; }));
  //y1.domain([0, d3.max(testArray, function(d) { return d.value; })]);
barY.domain([0, 18]);

//set up x-axis
var barXAxis = d3.axisBottom()
    .ticks(4)
    .scale(barX);

barChart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + barH + ")")
    .call(barXAxis)
     .append("text")
      .attr("x", barW)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Part of Pipeline");


//set up y-axis
var barYAxis = d3.axisLeft()
    .scale(barY);

barChart.append("g")
   .attr("class", "axis")
   .call(barYAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Alumni");





function drawVis(dataset) { //draw the circiles initially and on each interaction with a control

  console.log("a".charCodeAt(0));
  console.log("A".charCodeAt(0));
  console.log("Z".charCodeAt(0));

  //draw scatterplot
	var circle = chart.selectAll("circle")
	   .data(dataset);

	circle
    	  .attr("cx", function(d) { return x(d.year);  })
    	  .attr("cy", function(d) { return y(noise(d.name, d.years_in_industry));  })
     	  .style("fill", function(d) { return col(d.gender); });

	circle.exit()
        .transition()
        .style("opacity", 0)
        .remove();

	circle.enter().append("circle")
    	  .attr("cx", function(d) { return x(d.year);  })
    	  .attr("cy", function(d) { return y(noise(d.name, d.years_in_industry));  })
        .attr("class", function(d) {return pipelineCategory(d.pipeline); })
        .attr("r", 4)
    	  .style("stroke", "black")
     	   .style("fill", function(d) { return col(d.gender); })
    	   .style("opacity", 0.5)
         .on("mouseover", function(d) {
            d3.selectAll(".bar").filter("."+pipelineCategory(d.pipeline))
              .transition()
              .duration(200)
              .style("fill", "#FFD700");
            tooltip.transition()
            .duration(200)
            .style("opacity", .9);
            tooltip.html(d.name + " (" + d.year + "), " + "\n" + d.years_in_industry + " years in Industry")
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px");

            //show the alumni's profile in the toolbar
            profile.transition()
            .duration(200)
            .style("opacity", 1);
            d3.select("#name").html(d.name);
            d3.select("#capstone").html(d.year);
            d3.select("#major").html(d.major);
            d3.select("#taStatus").html(d.TA);
            d3.select("#industry").html(d.industry);
            d3.select("#experience").html(d.years_in_industry);
            d3.select("#pipeline").html(d.pipeline);
            d3.select("#school").html(d.school);
            })
          .on("mouseout", function(d) {
            d3.selectAll(".bar").filter("."+pipelineCategory(d.pipeline))
              .transition()
              .duration(200)
              .style("fill", "purple");
            tooltip.transition()
            .duration(500)
            .style("opacity", 0);

            profile.transition()
            .duration(500)
            .style("opacity", 0);
            });


  //draw bar chart
  testArray = [{category: "Software", value: 0}, {category: "Technical", value: 0}, {category: "Lighting", value: 0}, {category: "Character", value: 0}, {category: "Modeling", value: 0}, {category: "Production", value: 0}, {category: "Art", value: 0}, {category: "Other", value: 0}];

  //get the counts of people in different fields within the animation industry using a for loop
  dataset.forEach(function(d){
    if(pipelineCategory(d.pipeline) != "NA"){
      testArray[arrayId(pipelineCategory(d.pipeline))].value = +testArray[arrayId(pipelineCategory(d.pipeline))].value + 1;
    }
  });


  //connect count data to "bars"
  barChart.selectAll(".bar")
    .data(testArray)
    .enter().append("rect")
      .attr("class", function(d){return "bar "+ d.category; })
      .attr("x", function(d){return barX(d.category); })
      .attr("y", function(d){ return barY(d.value); })
      .attr("height", function(d){ return barH - barY(d.value); })
      .attr("width", barX.bandwidth())
      .style("fill", "purple")
      .on("mouseover", function(d) {
            d3.selectAll("." + d.category).transition()
            .duration(200)
            .attr("r", 10)
            .style("stroke", "purple")
            .style("lineWidth", "5");
            })
      .on("mouseout", function(d) {
            d3.selectAll("." + d.category).transition()
            .duration(200)
            .attr("r", 4)
            .style("stroke", "black")
            .style("lineWidth", "1");
            });

  var bar = barChart.selectAll(".bar")
            .data(testArray, function(d){ return d.category; })


  bar.exit().remove();

  bar.attr("y", function(d){ return barY(d.value); })
      .transition()
      .duration(500) 
      .attr("height", function(d) {return barH - barY(d.value); });

}


$(function(){
  $("#year").slider({
    range:true,
    min: 2000,
    max: 2013,
    values: [2000, 2013],
    slide:function(event, ui){
      $("#capstoneyear").val(ui.values[0] + "-" + ui.values[1]);
      //filterYear(ui.values); 
      filter("year", ui.values);
    } //end slider function
  }); //end slider
  $("#capstoneyear").val($("#year").slider("values", 0) +
    "-" + $("#year").slider("values", 1));
  
});



//filters data based on user inputs
function filter(filtername, filtervalue){

  if(filtername == "year"){
    filters["yearMin"] = filtervalue[0];
    filters["yearMax"] = filtervalue[1];
  }else{
    filters[filtername] = filtervalue;
  }


  var filteredData = dataset.filter(function(d){
    return (filters["gender"] == "all" || d["gender"] == filters["gender"]) 
          && (filters["major"] == "all" || d["major"] == filters["major"]) 
          && (d["year"] >= filters["yearMin"] && d["year"] <= filters["yearMax"]) 
          && (filters["ta"] == "all" || d["TA"] == filters["ta"])
          && (filters["industry"] == "all" || d["industry"] == filters["industry"]);
  })
  drawVis(filteredData);
}


//helper function to give the array id of a certain pipeline category for the bar chart
function arrayId(category){
  var ids = {Software:0, Technical:1, Lighting:2, Character:3, Modeling:4, Production:5, Art:6, Other:7}
  return ids[category];
}


//helper function to classify jobs into categories corresponding to certain parts of the animation pipeline
function pipelineCategory(partOfPipeline){
  if(partOfPipeline == "Software Engineer"){
      return "Software";
    } else if(partOfPipeline == "Technical Director" || partOfPipeline == "Rigging" || partOfPipeline == "R&D" || partOfPipeline == "FX"){
      return "Technical";
    } else if(partOfPipeline == "Lighting" || partOfPipeline == "Lighting/Compositing"){
      return "Lighting";
    } else if(partOfPipeline == "Character Animation"){
      return "Character";
    } else if(partOfPipeline == "Modeling" || partOfPipeline == "AutoCAD" || partOfPipeline == "Environment" || partOfPipeline == "3D Artist"){
      return "Modeling";
    } else if(partOfPipeline == "Director" || partOfPipeline == "Producer"){
      return "Production";
    } else if(partOfPipeline == "Artist" || partOfPipeline == "Art Supervisor" || partOfPipeline == "Storyboard Artist" || partOfPipeline == "Illustrator"){
      return "Art";
    } else if(partOfPipeline != "N/A"){
      return "Other";
    } else {
      return "NA";
    }
}


//adds a little bit of noise to the years of experience to offset a bit of the overlap
function noise(name, years){
  //A = 65
  //Z = 90
  var offset = (name.charAt(0).charCodeAt(0)-65.0)/26.0;
  if(years == 0){
    return years + (offset*0.5);
  }else if(years == 20){
    return years - (offset*0.5);
  }else{
    return years + (offset-0.5);
  }
}