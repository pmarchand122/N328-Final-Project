async function processData(csv) {
  const response = await fetch(csv);
  return await response.text();
}

processData("./titanic.csv").then((text) => {
  var chartWidth = 800;
  var chartHeight = 800;
  var maxBarHeight = 700;

  var data = d3.csvParse(text);
  var objectArray = [];
  var statArray = [];

  var class1 = [];
  var class2 = [];
  var class3 = [];

  var class1Stats = {
    class: 1,
    survived: 0,
    male: 0,
    female: 0,
    count: class1.length,
  };

  var class2Stats = {
    class: 2,
    survived: 0,
    male: 0,
    female: 0,
    count: class2.length,
  };

  var class3Stats = {
    class: 3,
    survived: 0,
    male: 0,
    female: 0,
    count: class3.length,
  };

  var g = d3.select("svg").select("g");
  for (var i = 0; i < data.length; i++) {
    if (Number(data[i].Pclass) == 1) {
      class1.push(data[i]);
    } else if (Number(data[i].Pclass) == 2) {
      class2.push(data[i]);
    } else {
      class3.push(data[i]);
    }
  }

  class1.forEach((object) => {
    class1Stats.count = class1.length;
    class1Stats.survived += Number(object.Survived);
    if (object.Sex == "male" && object.Survived == 1) {
      class1Stats.male += 1;
    } else if (object.Sex == "female" && object.Survived == 1) {
      class1Stats.female += 1;
    }
  });

  class2.forEach((object) => {
    class2Stats.count = class2.length;
    class2Stats.survived += Number(object.Survived);
    if (object.Sex == "male" && object.Survived == 1) {
      class2Stats.male += 1;
    } else if (object.Sex == "female" && object.Survived == 1) {
      class2Stats.female += 1;
    }
  });

  class3.forEach((object) => {
    class3Stats.count = class3.length;
    class3Stats.survived += Number(object.Survived);
    if (object.Sex == "male" && object.Survived == 1) {
      class3Stats.male += 1;
    } else if (object.Sex == "female" && object.Survived == 1) {
      class3Stats.female += 1;
    }
  });

  statArray.push(class1Stats, class2Stats, class3Stats);
  console.log(statArray);
  console.log(statArray[0].survived / statArray[0].count);

  var xScale = d3.scaleLinear();
  var yScale = d3.scaleLinear();

  xScale.domain([0, 4]).range([0, chartWidth]);
  yScale.domain([1, 0]).range([0, chartHeight]);

  var xAxis = d3
    .axisBottom(xScale)
    .tickValues([1, 2, 3])
    .tickFormat((d, i) => ["First Class", "Second Class", "Third Class"][i]);

  var yAxis = d3
    .axisLeft(yScale)
    .tickValues([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1])
    .tickFormat(
      (d, i) =>
        ["10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"][
          i
        ]
    );

  g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + chartHeight + ")")
    .call(xAxis);

  g.append("g")
    .attr("class", "axis")

    .call(yAxis);

  g.selectAll("rect")
    .data(statArray)
    .enter()
    .append("rect")
    .style("fill", "coral")
    .on("mouseover", function (d, i) {
      d3.select("#femaleDetails").text(
        `%${Math.round(
          (i.female / i.survived) * 100
        )} who survived were female.`
      );
      d3.select("#maleDetails").text(
        `%${Math.round((i.male / i.survived) * 100)} who survived were male`
      );
      d3.select("#survivedDetails").text(
        `Class Survival Rate: %${Math.round((i.survived / i.count) * 100)}`
      );
      d3.select("#totalSurvivedDetails").text(
        `Total Who Survived: ${i.survived}`
      );
      d3.select("#totalDetails").text(`Total In Class: ${i.count}`);
    })
    .on("mouseout", function (d) {
      d3.select("#classDetails").text("");
    })
    .attr("height", function (d) {
      return (d.survived / d.count) * chartHeight;
    })
    .attr("width", 40)
    .attr("y", function (d) {
      return maxBarHeight - (d.survived / d.count) * chartHeight + 100;
    })
    .attr("x", function (d) {
      return d.class * 200 - 20;
    });
});
