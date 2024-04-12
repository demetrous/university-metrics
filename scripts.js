(function () {
  let loaderDiv =
    $(`<div id="loaderDiv" class="d-flex justify-content-center p-4">
                                                      <div class="spinner-border text-danger" role="status">
                                                          <span class="sr-only">Loading...</span>
                                                      </div>
                                                  </div>`); //WIP: Image to local res
  $("#reportContent").append(loaderDiv);
})();

const initReportContainers = (title, index) => {
  let bsGrid = `
  <div class="row"><div class="col"><h4 class="right-menu-header">${title}</h4></div></div>
  <div class="row mb-5">
    <div id="UMTableContainer${index}" class="col-xl-12 mb-4"></div>
    <div id="UMChartContainer${index}" class="col-xl-12"></div>
  </div>
  <div class="row my-4 py-4"></div>`;

  $("#reportContent").append(bsGrid);

  //  let table = `<table id="UMTable${index}" style="width:100%" class="hover">
  //        <thead>
  //            <tr>
  //<th>Term</th>
  //<th>Type</th>
  //<th>Undup</th>
  //<th>Underg</th>
  //<th>Grad</th>
  //<th>Prof</th>
  //            </tr>
  //        </thead>
  //      <tbody></tbody>
  //    </table>`;

  let table = `<table id="UMTable${index}"  class="hover"><thead></thead>
     <tbody></tbody></table>`;

  $(`#UMTableContainer${index}`).append(table);
};

//const chartData = {};

const extractCharData = (data, columns, percent = false) => {
  const chartData = {};

  columns.map((item) => {
    chartData[item] = [];
  });

  //console.log({ data, columns, percent });

  data.map((item) => {
    columns.map((col) => {
      if (col.toLowerCase() === "term") chartData[col].push(item[col]);
      else if (percent)
        chartData[col].push(Number(item[col].replace(/%/g, "")));
      else chartData[col].push(Number(item[col].replace(/,/g, "")));
    });

    //chartData["Term"].push(item["Term"]);
    //chartData["Undergraduate"].push(Number(item["Undergraduate"].replace(/,/g, '')));
    //chartData["Graduate"].push(Number(item["Graduate"].replace(/,/g, '')));
    //chartData["Professional"].push(Number(item["Professional"].replace(/,/g, '')));
  });

  return chartData;
};

const buildChart = (container, chartData, category, columns, percent) => {
  const series = columns
    .filter((s) => s !== "Term")
    .map((item) => ({
      name: item,
      data: chartData[item],
    }));

  //console.log(series);

  Highcharts.chart(container, {
    title: {
      text: "", //'Sample title'
    },

    //subtitle: {
    //  text: 'Source: ir.unlv.edu'
    //},

    yAxis: {
      title: {
        text: "", //'Number of Students'
      },
      labels: {
        format: `{value}${percent ? "%" : ""}`,
      },
    },

    //xAxis: {
    //  accessibility: {
    //    rangeDescription: 'Range: 2010 to 2017'
    //  }
    //},

    xAxis: {
      categories: chartData[category],
    },

    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },

    //plotOptions: {
    //  series: {
    //    label: {
    //      connectorAllowed: false
    //    },
    //    pointStart: 2015
    //  }
    //},

    series: series,

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  });
};

const combineTableChat = (data, index, percent) => {
  const series = data[index].header.filter((s) => s !== "Type");

  initReportContainers(data[index].title, index);

  const tableColumns = data[index].header.map((h) => ({
    title: h,
    data: h,
    width: "5%",
  }));
  //console.log(tableColumns);
  //console.log(data[index].header);

  $(`#UMTable${index}`).DataTable({
    data: data[index].rows,
    paging: false,
    info: false,
    searching: false,
    columns: tableColumns,
  });

  const chartData = extractCharData(data[index].rows, series, percent);

  buildChart(`UMChartContainer${index}`, chartData, "Term", series, percent);
};

const rebuildRightMenuHeaders = () => {
  //get right side menu ul
  var rightMenuChildList = $(".child-list-container.right-side .child-list");

  //regex for tags
  var regRemoveTags = /<[^>]+>/g;

  //regex for multi whitespaces
  var regRemoveMultSpaces = /\s+/g;

  //select paragraphs in main container, filter by strong tag only
  //var headers = $(".main-content-fluid .content p")
  var headers = $("#reportContent .right-menu-header");

  //for each header generate id, assign it to header, generate list onpage links
  $.each(headers, function (i, item) {
    //generate id for the particular Content Header
    var headerId = "content_header_" + i;

    //assign id to Content Header
    $(item).attr("id", headerId);

    //removing tags and mult whitespaces
    var innerHtml = $(item)
      .html()
      .replace(regRemoveTags, "")
      .replace(regRemoveMultSpaces, " ");

    $(rightMenuChildList).append(
      '<li><a class="child-list-item" href="#' +
        headerId +
        '">' +
        innerHtml +
        "</a></li>"
    );
  });
};

const smoothScroll = () => {
  // init nav object from dom
  var nav = $("#navbar-top");

  //additional offset from top
  var additOffset = 100;

  // get heigth of the nav
  var navHeight = nav.outerHeight() + additOffset;

  // Select all links with hashes
  $('.child-list-container.right-side .child-list a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function (event) {
      // On-page links
      if (
        location.pathname.replace(/^\//, "") ==
          this.pathname.replace(/^\//, "") &&
        location.hostname == this.hostname
      ) {
        // Figure out element to scroll to
        var target = $(this.hash);
        target = target.length
          ? target
          : $("[name=" + this.hash.slice(1) + "]");
        // Does a scroll target exist?
        if (target.length) {
          // Only prevent default if animation is actually gonna happen
          event.preventDefault();
          $("html, body").animate(
            {
              scrollTop: target.offset().top - navHeight,
            },
            800
          );
        }
      }
    });
};

// updateAll = () => {
//   //fetch('https://secret-basin-35762.herokuapp.com/')
//   //fetch('http://ia-msiis-wsd-01.ad.unlv.edu/rest-tut')
//   //fetch('http://ia-msiis-wsd-01.ad.unlv.edu/university-metrics-api')
//   //fetch('https://ir.unlv.edu/university-metrics-api')
//   //fetch('http://localhost:3500/')
//   //fetch('https://localhost:7000/api/GoogleSheets')
//   //fetch('https://ir.unlv.edu/university-metrics-api')
//   //fetch('https://ia-msiis-wsd-01.ad.unlv.edu/GoogleSheetsApi/api/GoogleSheets')
//   fetch("https://ir.unlv.edu/UniversityMetricsGoogleSheetsApi/api/GoogleSheets")
//     .then((result) => {
//       return result.json();
//     })
//     .then((response) => {
//       var data = response.value;

//       $("#loaderDiv").remove();

//       combineTableChat(data, 0);
//       combineTableChat(data, 1);

//       combineTableChat(data, 2, true);
//       combineTableChat(data, 3, true);
//       combineTableChat(data, 4, true);
//       combineTableChat(data, 5, true);

//       combineTableChat(data, 6);

//       combineTableChat(data, 7);

//       rebuildRightMenuHeaders();
//       smoothScroll();
//     });
// };

updateAllLocalDS = () => {
  var data = UMData;

  $("#loaderDiv").remove();

  combineTableChat(data, 0);
  combineTableChat(data, 1);

  combineTableChat(data, 2, true);
  combineTableChat(data, 3, true);
  combineTableChat(data, 4, true);
  combineTableChat(data, 5, true);

  combineTableChat(data, 6);

  combineTableChat(data, 7);

  rebuildRightMenuHeaders();
  smoothScroll();
};

UMData = [
  {
    title: "Enrollment",
    header: [
      "Term",
      "Type",
      "UNLV unduplicated",
      "Undergraduate",
      "Graduate",
      "Professional",
    ],
    rows: [
      {
        Term: "Fall 2016",
        Type: "Official",
        "UNLV unduplicated": "29,702",
        Undergraduate: "24,715",
        Graduate: "4,288",
        Professional: "717",
      },
      {
        Term: "Fall 2017",
        Type: "Official",
        "UNLV unduplicated": "30,471",
        Undergraduate: "25,282",
        Graduate: "4,429",
        Professional: "776",
      },
      {
        Term: "Fall 2018",
        Type: "Official",
        "UNLV unduplicated": "30,457",
        Undergraduate: "25,288",
        Graduate: "4,298",
        Professional: "888",
      },
      {
        Term: "Fall 2019",
        Type: "Official",
        "UNLV unduplicated": "31,171",
        Undergraduate: "25,830",
        Graduate: "4,387",
        Professional: "977",
      },
      {
        Term: "Fall 2020",
        Type: "Official",
        "UNLV unduplicated": "31,142",
        Undergraduate: "25,869",
        Graduate: "4,261",
        Professional: "1,043",
      },
      {
        Term: "Fall 2021",
        Type: "Official",
        "UNLV unduplicated": "30,679",
        Undergraduate: "25,412",
        Graduate: "4,237",
        Professional: "1,054",
      },
    ],
  },
  {
    title: "Enrollment - Race/Ethnicity",
    header: [
      "Term",
      "Type",
      "American Indian or Alaska Native",
      "Asian",
      "Black or African American",
      "Hispanic",
      "Native Hawaiian or Other pacific Islander",
      "Nonresident Alien",
      "Two or more races",
      "Unknown race and ethnicity",
      "White",
    ],
    rows: [
      {
        Term: "Fall 2016",
        Type: "Official",
        "American Indian or Alaska Native": "79",
        Asian: "4,198",
        "Black or African American": "2,240",
        Hispanic: "7,428",
        "Native Hawaiian or Other pacific Islander": "290",
        "Nonresident Alien": "1,225",
        "Two or more races": "2,766",
        "Unknown race and ethnicity": "741",
        White: "10,735",
      },
      {
        Term: "Fall 2017",
        Type: "Official",
        "American Indian or Alaska Native": "76",
        Asian: "4,344",
        "Black or African American": "2,322",
        Hispanic: "8,146",
        "Native Hawaiian or Other pacific Islander": "258",
        "Nonresident Alien": "1,237",
        "Two or more races": "2,851",
        "Unknown race and ethnicity": "692",
        White: "10,545",
      },
      {
        Term: "Fall 2018",
        Type: "Official",
        "American Indian or Alaska Native": "99",
        Asian: "4,460",
        "Black or African American": "2,291",
        Hispanic: "8,521",
        "Native Hawaiian or Other pacific Islander": "240",
        "Nonresident Alien": "1,222",
        "Two or more races": "2,995",
        "Unknown race and ethnicity": "645",
        White: "9,984",
      },
      {
        Term: "Fall 2019",
        Type: "Official",
        "American Indian or Alaska Native": "90",
        Asian: "4,809",
        "Black or African American": "2,446",
        Hispanic: "8,969",
        "Native Hawaiian or Other pacific Islander": "265",
        "Nonresident Alien": "1,055",
        "Two or more races": "3,139",
        "Unknown race and ethnicity": "563",
        White: "9,835",
      },
      {
        Term: "Fall 2020",
        Type: "Official",
        "American Indian or Alaska Native": "84",
        Asian: "4,876",
        "Black or African American": "2,496",
        Hispanic: "9,289",
        "Native Hawaiian or Other pacific Islander": "250",
        "Nonresident Alien": "914",
        "Two or more races": "3,229",
        "Unknown race and ethnicity": "397",
        White: "9,607",
      },
      {
        Term: "Fall 2021",
        Type: "Official",
        "American Indian or Alaska Native": "76",
        Asian: "4,759",
        "Black or African American": "2,636",
        Hispanic: "9,467",
        "Native Hawaiian or Other pacific Islander": "240",
        "Nonresident Alien": "819",
        "Two or more races": "3,347",
        "Unknown race and ethnicity": "370",
        White: "8,965",
      },
    ],
  },
  {
    title: "First Year Retention",
    header: [
      "Term",
      "Type",
      "University",
      "American Indian or Alaska Native",
      "Asian",
      "Black or African American",
      "Hispanic",
      "Native Hawaiian or Other pacific Islander",
      "Nonresident Alien",
      "Two or more races",
      "Unknown race and ethnicity",
      "White",
    ],
    rows: [
      {
        Term: "Fall 2016",
        Type: "Official",
        University: "77.1%",
        "American Indian or Alaska Native": "55.6%",
        Asian: "87.3%",
        "Black or African American": "64.5%",
        Hispanic: "77.5%",
        "Native Hawaiian or Other pacific Islander": "69.8%",
        "Nonresident Alien": "84.5%",
        "Two or more races": "73.9%",
        "Unknown race and ethnicity": "77.8%",
        White: "75.0%",
      },
      {
        Term: "Fall 2017",
        Type: "Official",
        University: "74.4%",
        "American Indian or Alaska Native": "50.0%",
        Asian: "85.1%",
        "Black or African American": "62.6%",
        Hispanic: "73.0%",
        "Native Hawaiian or Other pacific Islander": "56.3%",
        "Nonresident Alien": "87.2%",
        "Two or more races": "74.5%",
        "Unknown race and ethnicity": "60.0%",
        White: "72.8%",
      },
      {
        Term: "Fall 2018",
        Type: "Official",
        University: "75.9%",
        "American Indian or Alaska Native": "66.7%",
        Asian: "87.6%",
        "Black or African American": "68.8%",
        Hispanic: "73.2%",
        "Native Hawaiian or Other pacific Islander": "68.3%",
        "Nonresident Alien": "86.6%",
        "Two or more races": "71.4%",
        "Unknown race and ethnicity": "66.7%",
        White: "74.9%",
      },
      {
        Term: "Fall 2019",
        Type: "Official",
        University: "79.4%",
        "American Indian or Alaska Native": "80.0%",
        Asian: "86.0%",
        "Black or African American": "74.3%",
        Hispanic: "78.8%",
        "Native Hawaiian or Other pacific Islander": "75.6%",
        "Nonresident Alien": "82.5%",
        "Two or more races": "79.7%",
        "Unknown race and ethnicity": "91.7%",
        White: "76.6%",
      },
      {
        Term: "Fall 2020",
        Type: "Official",
        University: "79.8%",
        "American Indian or Alaska Native": "61.5%",
        Asian: "88.7%",
        "Black or African American": "72.0%",
        Hispanic: "78.8%",
        "Native Hawaiian or Other pacific Islander": "72.6%",
        "Nonresident Alien": "75.0%",
        "Two or more races": "79.8%",
        "Unknown race and ethnicity": "71.4%",
        White: "77.5%",
      },
      {
        Term: "Fall 2021",
        Type: "Official",
        University: "77.4%",
        "American Indian or Alaska Native": "72.7%",
        Asian: "87.0%",
        "Black or African American": "69.8%",
        Hispanic: "75.1%",
        "Native Hawaiian or Other pacific Islander": "76.7%",
        "Nonresident Alien": "91.4%",
        "Two or more races": "76.0%",
        "Unknown race and ethnicity": "80.0%",
        White: "76.5%",
      },
    ],
  },
  {
    title: "Second Year Retention",
    header: [
      "Term",
      "Type",
      "University",
      "American Indian or Alaska Native",
      "Asian",
      "Black or African American",
      "Hispanic",
      "Native Hawaiian or Other pacific Islander",
      "Nonresident Alien",
      "Two or more races",
      "Unknown race and ethnicity",
      "White",
    ],
    rows: [
      {
        Term: "Fall 2016",
        Type: "Official",
        University: "66.2%",
        "American Indian or Alaska Native": "12.5%",
        Asian: "81.7%",
        "Black or African American": "53.2%",
        Hispanic: "63.6%",
        "Native Hawaiian or Other pacific Islander": "55.9%",
        "Nonresident Alien": "74.4%",
        "Two or more races": "65.1%",
        "Unknown race and ethnicity": "65.2%",
        White: "64.0%",
      },
      {
        Term: "Fall 2017",
        Type: "Official",
        University: "67.2%",
        "American Indian or Alaska Native": "11.1%",
        Asian: "80.1%",
        "Black or African American": "56.0%",
        Hispanic: "68.4%",
        "Native Hawaiian or Other pacific Islander": "58.5%",
        "Nonresident Alien": "75.0%",
        "Two or more races": "60.8%",
        "Unknown race and ethnicity": "66.7%",
        White: "63.8%",
      },
      {
        Term: "Fall 2018",
        Type: "Official",
        University: "63.8%",
        "American Indian or Alaska Native": "50.0%",
        Asian: "76.6%",
        "Black or African American": "50.3%",
        Hispanic: "63.3%",
        "Native Hawaiian or Other pacific Islander": "43.8%",
        "Nonresident Alien": "79.8%",
        "Two or more races": "60.3%",
        "Unknown race and ethnicity": "60.0%",
        White: "61.3%",
      },
      {
        Term: "Fall 2019",
        Type: "Official",
        University: "67.2%",
        "American Indian or Alaska Native": "66.7%",
        Asian: "79.9%",
        "Black or African American": "61.4%",
        Hispanic: "64.6%",
        "Native Hawaiian or Other pacific Islander": "53.7%",
        "Nonresident Alien": "72.2%",
        "Two or more races": "63.0%",
        "Unknown race and ethnicity": "66.7%",
        White: "65.7%",
      },
      {
        Term: "Fall 2020",
        Type: "Official",
        University: "69.7%",
        "American Indian or Alaska Native": "75.0%",
        Asian: "81.4%",
        "Black or African American": "66.0%",
        Hispanic: "68.5%",
        "Native Hawaiian or Other pacific Islander": "60.0%",
        "Nonresident Alien": "67.0%",
        "Two or more races": "68.6%",
        "Unknown race and ethnicity": "91.7%",
        White: "65.2%",
      },
      {
        Term: "Fall 2021",
        Type: "Official",
        University: "69.5%",
        "American Indian or Alaska Native": "61.5%",
        Asian: "81.4%",
        "Black or African American": "59.9%",
        Hispanic: "67.2%",
        "Native Hawaiian or Other pacific Islander": "62.9%",
        "Nonresident Alien": "69.1%",
        "Two or more races": "69.6%",
        "Unknown race and ethnicity": "57.1%",
        White: "66.7%",
      },
    ],
  },
  {
    title: "Four-Year Graduation Rate",
    header: [
      "Term",
      "Type",
      "University",
      "American Indian or Alaska Native",
      "Asian",
      "Black or African American",
      "Hispanic",
      "Native Hawaiian or Other pacific Islander",
      "Nonresident Alien",
      "Two or more races",
      "Unknown race and ethnicity",
      "White",
    ],
    rows: [
      {
        Term: "Fall 2015",
        Type: "Official",
        University: "13.4%",
        "American Indian or Alaska Native": "10.0%",
        Asian: "15.1%",
        "Black or African American": "7.4%",
        Hispanic: "9.2%",
        "Native Hawaiian or Other pacific Islander": "16.7%",
        "Nonresident Alien": "31.6%",
        "Two or more races": "12.7%",
        "Unknown race and ethnicity": "24.4%",
        White: "15.5%",
      },
      {
        Term: "Fall 2016",
        Type: "Official",
        University: "12.9%",
        "American Indian or Alaska Native": "0.0%",
        Asian: "14.0%",
        "Black or African American": "11.4%",
        Hispanic: "9.6%",
        "Native Hawaiian or Other pacific Islander": "8.2%",
        "Nonresident Alien": "37.8%",
        "Two or more races": "8.3%",
        "Unknown race and ethnicity": "26.1%",
        White: "15.0%",
      },
      {
        Term: "Fall 2017",
        Type: "Official",
        University: "16.8%",
        "American Indian or Alaska Native": "0.0%",
        Asian: "23.3%",
        "Black or African American": "7.2%",
        Hispanic: "13.8%",
        "Native Hawaiian or Other pacific Islander": "2.2%",
        "Nonresident Alien": "49.2%",
        "Two or more races": "12.6%",
        "Unknown race and ethnicity": "9.1%",
        White: "18.9%",
      },
      {
        Term: "Fall 2018",
        Type: "Official",
        University: "17.2%",
        "American Indian or Alaska Native": "0.0%",
        Asian: "22.9%",
        "Black or African American": "13.0%",
        Hispanic: "13.6%",
        "Native Hawaiian or Other pacific Islander": "8.5%",
        "Nonresident Alien": "36.6%",
        "Two or more races": "15.6%",
        "Unknown race and ethnicity": "17.4%",
        White: "18.2%",
      },
      {
        Term: "Fall 2019",
        Type: "Official",
        University: "19.4%",
        "American Indian or Alaska Native": "11.1%",
        Asian: "22.1%",
        "Black or African American": "11.7%",
        Hispanic: "16.7%",
        "Native Hawaiian or Other pacific Islander": "20.8%",
        "Nonresident Alien": "51.2%",
        "Two or more races": "15.7%",
        "Unknown race and ethnicity": "33.3%",
        White: "21.2%",
      },
      {
        Term: "Fall 2020",
        Type: "Official",
        University: "22.1%",
        "American Indian or Alaska Native": "8.3%",
        Asian: "30.6%",
        "Black or African American": "14.4%",
        Hispanic: "18.5%",
        "Native Hawaiian or Other pacific Islander": "12.5%",
        "Nonresident Alien": "50.0%",
        "Two or more races": "16.3%",
        "Unknown race and ethnicity": "0.0%",
        White: "23.6%",
      },
      {
        Term: "Fall 2021",
        Type: "Official",
        University: "25.3%",
        "American Indian or Alaska Native": "16.7%",
        Asian: "32.5%",
        "Black or African American": "17.8%",
        Hispanic: "19.7%",
        "Native Hawaiian or Other pacific Islander": "7.3%",
        "Nonresident Alien": "57.7%",
        "Two or more races": "22.5%",
        "Unknown race and ethnicity": "33.3%",
        White: "28.3%",
      },
    ],
  },
  {
    title: "Six-Year Graduation Rate",
    header: [
      "Term",
      "Type",
      "University",
      "American Indian or Alaska Native",
      "Asian",
      "Black or African American",
      "Hispanic",
      "Native Hawaiian or Other pacific Islander",
      "Nonresident Alien",
      "Two or more races",
      "Unknown race and ethnicity",
      "White",
    ],
    rows: [
      {
        Term: "Fall 2015",
        Type: "Official",
        University: "40.5%",
        "American Indian or Alaska Native": "10.5%",
        Asian: "47.3%",
        "Black or African American": "26.1%",
        Hispanic: "34.6%",
        "Native Hawaiian or Other pacific Islander": "31.3%",
        "Nonresident Alien": "56.4%",
        "Two or more races": "47.1%",
        "Unknown race and ethnicity": "49.0%",
        White: "43.0%",
      },
      {
        Term: "Fall 2016",
        Type: "Official",
        University: "40.7%",
        "American Indian or Alaska Native": "14.3%",
        Asian: "49.5%",
        "Black or African American": "31.5%",
        Hispanic: "35.5%",
        "Native Hawaiian or Other pacific Islander": "31.9%",
        "Nonresident Alien": "50.8%",
        "Two or more races": "36.8%",
        "Unknown race and ethnicity": "41.9%",
        White: "43.2%",
      },
      {
        Term: "Fall 2017",
        Type: "Official",
        University: "41.6%",
        "American Indian or Alaska Native": "20.0%",
        Asian: "48.4%",
        "Black or African American": "24.7%",
        Hispanic: "39.5%",
        "Native Hawaiian or Other pacific Islander": "60.4%",
        "Nonresident Alien": "56.1%",
        "Two or more races": "37.1%",
        "Unknown race and ethnicity": "51.2%",
        White: "42.9%",
      },
      {
        Term: "Fall 2018",
        Type: "Official",
        University: "42.9%",
        "American Indian or Alaska Native": "22.2%",
        Asian: "50.2%",
        "Black or African American": "35.7%",
        Hispanic: "38.6%",
        "Native Hawaiian or Other pacific Islander": "36.1%",
        "Nonresident Alien": "70.3%",
        "Two or more races": "38.6%",
        "Unknown race and ethnicity": "56.5%",
        White: "44.6%",
      },
      {
        Term: "Fall 2019",
        Type: "Official",
        University: "44.9%",
        "American Indian or Alaska Native": "0.0%",
        Asian: "53.7%",
        "Black or African American": "26.1%",
        Hispanic: "41.5%",
        "Native Hawaiian or Other pacific Islander": "31.1%",
        "Nonresident Alien": "74.6%",
        "Two or more races": "37.3%",
        "Unknown race and ethnicity": "48.5%",
        White: "49.2%",
      },
      {
        Term: "Fall 2020",
        Type: "Official",
        University: "44.3%",
        "American Indian or Alaska Native": "12.5%",
        Asian: "58.7%",
        "Black or African American": "35.7%",
        Hispanic: "39.3%",
        "Native Hawaiian or Other pacific Islander": "30.5%",
        "Nonresident Alien": "68.3%",
        "Two or more races": "39.5%",
        "Unknown race and ethnicity": "47.8%",
        White: "44.1%",
      },
      {
        Term: "Fall 2021",
        Type: "Official",
        University: "47.1%",
        "American Indian or Alaska Native": "11.1%",
        Asian: "57.3%",
        "Black or African American": "33.7%",
        Hispanic: "45.1%",
        "Native Hawaiian or Other pacific Islander": "41.5%",
        "Nonresident Alien": "77.4%",
        "Two or more races": "39.5%",
        "Unknown race and ethnicity": "66.7%",
        White: "47.3%",
      },
    ],
  },
  {
    title: "Degrees",
    header: [
      "Term",
      "Type",
      "Total",
      "Bachelors",
      "Masters",
      "Certificate",
      "Specialist",
      "Doctoral Research",
      "Doctoral Professional",
    ],
    rows: [
      {
        Term: "2015-16",
        Type: "Official",
        Total: "5,325",
        Bachelors: "3,892",
        Masters: "1,039",
        Certificate: "33",
        Specialist: "6",
        "Doctoral Research": "166",
        "Doctoral Professional": "189",
      },
      {
        Term: "2016-17",
        Type: "Official",
        Total: "5,538",
        Bachelors: "4,053",
        Masters: "1,068",
        Certificate: "52",
        Specialist: "5",
        "Doctoral Research": "155",
        "Doctoral Professional": "205",
      },
      {
        Term: "2017-18",
        Type: "Official",
        Total: "5,619",
        Bachelors: "4,163",
        Masters: "1,054",
        Certificate: "59",
        Specialist: "10",
        "Doctoral Research": "162",
        "Doctoral Professional": "171",
      },
      {
        Term: "2018-19",
        Type: "Official",
        Total: "5,782",
        Bachelors: "4,270",
        Masters: "1,078",
        Certificate: "50",
        Specialist: "6",
        "Doctoral Research": "160",
        "Doctoral Professional": "218",
      },
      {
        Term: "2019-20",
        Type: "Official",
        Total: "5,951",
        Bachelors: "4,353",
        Masters: "1,107",
        Certificate: "65",
        Specialist: "11",
        "Doctoral Research": "210",
        "Doctoral Professional": "205",
      },
      {
        Term: "2020-21",
        Type: "Official",
        Total: "6,511",
        Bachelors: "4,823",
        Masters: "1,130",
        Certificate: "58",
        Specialist: "15",
        "Doctoral Research": "180",
        "Doctoral Professional": "305",
      },
    ],
  },
  {
    title: "Degrees - Race/Ethnicity",
    header: [
      "Term",
      "Type",
      "American Indian or Alaska Native",
      "Asian",
      "Black or African American",
      "Hispanic",
      "Native Hawaiian or Other pacific Islander",
      "Nonresident Alien",
      "Two or more races",
      "Unknown race and ethnicity",
      "White",
    ],
    rows: [
      {
        Term: "2015-16",
        Type: "Official",
        "American Indian or Alaska Native": "17",
        Asian: "618",
        "Black or African American": "348",
        Hispanic: "985",
        "Native Hawaiian or Other pacific Islander": "53",
        "Nonresident Alien": "448",
        "Two or more races": "383",
        "Unknown race and ethnicity": "97",
        White: "2,376",
      },
      {
        Term: "2016-17",
        Type: "Official",
        "American Indian or Alaska Native": "13",
        Asian: "703",
        "Black or African American": "355",
        Hispanic: "1,182",
        "Native Hawaiian or Other pacific Islander": "55",
        "Nonresident Alien": "327",
        "Two or more races": "423",
        "Unknown race and ethnicity": "113",
        White: "2,367",
      },
      {
        Term: "2017-18",
        Type: "Official",
        "American Indian or Alaska Native": "11",
        Asian: "743",
        "Black or African American": "382",
        Hispanic: "1,290",
        "Native Hawaiian or Other pacific Islander": "43",
        "Nonresident Alien": "355",
        "Two or more races": "481",
        "Unknown race and ethnicity": "126",
        White: "2,188",
      },
      {
        Term: "2018-19",
        Type: "Official",
        "American Indian or Alaska Native": "15",
        Asian: "753",
        "Black or African American": "382",
        Hispanic: "1,354",
        "Native Hawaiian or Other pacific Islander": "44",
        "Nonresident Alien": "352",
        "Two or more races": "553",
        "Unknown race and ethnicity": "129",
        White: "2,200",
      },
      {
        Term: "2019-20",
        Type: "Official",
        "American Indian or Alaska Native": "12",
        Asian: "863",
        "Black or African American": "422",
        Hispanic: "1,505",
        "Native Hawaiian or Other pacific Islander": "33",
        "Nonresident Alien": "343",
        "Two or more races": "538",
        "Unknown race and ethnicity": "135",
        White: "2,100",
      },
      {
        Term: "2020-21",
        Type: "Official",
        "American Indian or Alaska Native": "16",
        Asian: "978",
        "Black or African American": "461",
        Hispanic: "1,711",
        "Native Hawaiian or Other pacific Islander": "42",
        "Nonresident Alien": "338",
        "Two or more races": "594",
        "Unknown race and ethnicity": "105",
        White: "2,266",
      },
    ],
  },
];
