function getPlot(id) {
  // acquiring data from JSON
  d3.json("samples.json").then((data)=> {
      console.log(data)
      var wfreq = data.metadata.map(d => d.wfreq)
      console.log(`Washing Freq: ${wfreq}`)
      
      // filter
      var samples = data.samples.filter(s => s.id.toString() === id)[0];
      
      console.log(samples);

      var samplevalues = samples.sample_values.slice(0, 10).reverse();
      var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
      var OTU_id = OTU_top.map(d => "OTU " + d);
      var labels = samples.otu_labels.slice(0, 10);

      var trace = {
          x: samplevalues,
          y: OTU_id,
          text: labels,
          marker: {
          color: 'navy blue'},
          type:"bar",
          orientation: "h",
      };
  
      var data = [trace];

      // plot
      var layout = {
          title: "Top 10",
          yaxis:{
              tickmode:"linear",
          },
          margin: {
              l: 50,
              r: 50,
              t: 50,
              b: 50
          }
      };

      // plotting bar graph
      Plotly.newPlot("bar", data, layout);
    
      // Bubble chart
      var trace1 = {
          x: samples.otu_ids,
          y: samples.sample_values,
          mode: "markers",
          marker: {
              size: samples.sample_values,
              color: samples.otu_ids
          },
          text: samples.otu_labels
      };

      var data1 = [trace1];

      var layout_b = {
          xaxis:{title: "OTU ID"},
          height: 1000,
          width: 1400
      };
      // plot bubble graph 
      Plotly.newPlot("bubble", data1, layout_b); 
      
      // Gauge Chart 
      var data_g = [
        {
        domain: { x: [0, 1], y: [0, 1] },
        value: parseFloat(wfreq),
        title: { text: `Washing Frequency` },
        subtitle: 'Scrubs per Week',
        type: "indicator",
        mode: "gauge+number", 
        gauge: { axis: { range: [null, 9], tickcolor:"black" },
        steps: [
         { range: [0, 1], color: "gold" },
         { range: [1, 2], color: "green yellow" },
         { range: [2, 3], color: "honeydew" },
         { range: [3, 4], color: "indian red" },
         { range: [4, 5], color: "ivory " },
         { range: [5, 6], color: "khaki" },
         { range: [6, 7], color: "navy" },
         { range: [7, 8], color: "olive" },
         { range: [8, 9], color: "orange" }
       ]}
            
        }
      ];
      var layout_g = { 
          width: 700, 
          height: 600, 
          margin: { t: 20, b: 40, l:100, r:100 } 
        };
      Plotly.newPlot("myDiv", data_g, layout_g);
    });
}  

function getInfo(id) {

  d3.json("samples.json").then((data)=> {

      var metadata = data.metadata;
      console.log(metadata)

      var result = metadata.filter(meta => meta.id.toString() === id)[0];
 
      var demographicInfo = d3.select("#sample-metadata");

      demographicInfo.html("");

      Object.entries(result).forEach((key) => {   
              demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
      });
  });
}

function optionChanged(id) {
  getPlot(id);
  getInfo(id);
}

function init(){
  var dropdown = d3.select('#selDataset');
d3.json("samples.json").then((data)=> {
  console.log(data)

  data.names.forEach(function(name) {
    dropdown.append("option").text(name).property("value");
});

getPlot(data.names[0]);
getInfo(data.names[0]);
});
}
init();
