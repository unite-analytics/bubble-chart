/*
 THIS FILE HAS CLASS DEFINATION OF THE BUBBLE CHART
 */

/*
 EXPECTED CONFIGURATION PROPERTIES

 * renderTo(Javascript object) - The Area object where the chart should be rendered

 * rawDataArray(json array) - Raw data (JSON) object

 * onGetBubbleColor (function) - A function supposed to passed by the owner of the object,
 this function will return color for the bubble by default would be '#777777'

 * onGetBubbleRadius (function) - A function supposed to passed by the owner of the object,
 this function will return radius for the bubble, by default the radius would be '5px'
 */

//Add all the required javasript resources
document.write("<script src='constBubbleChart.js'></script>");
document.write("<script src='libBubbleChart.js'></script>");

function clsBubbleChart(p_Config)
{
    //PROPERTIES ---------------------------------------
    var LMe = this;

    //renderTo(Javascript object) - The Area object where the chart should be rendered
    LMe.renderTo = null;

    //rawDataArray(json array) - Raw data (JSON) object
    LMe.rawDataArray = [];

    //Direct parnet div container for the chart
    LMe.ChartContainerDiv = null;

    //Collision padding
    LMe.collisionPadding = G_BUBBLE_CHART_CONST.DEFAULT_COLLISION_PADDING;

    //Width of the chart SVG
    LMe.width = G_BUBBLE_CHART_CONST.DEFAULT_SVG_WIDTH;

    //Height of the chart SVG
    LMe.height = G_BUBBLE_CHART_CONST.DEFAULT_SVG_HEIGHT;

    //Complete data set of the mapped raw data
    LMe.dataSet = [];

    //List of previous sections created
    LMe.previousSectionArray = [];


    //EVENTS -----------------------------------------
    //A function to map raw data to chart data object
    LMe.onMapRawDataToChartData = null;

    //A function to get radius of the buble, the function should return integer value for the buble
    LMe.onGetBubbleRadius = null;

    //A function to check if the node or record belongs to the passed catagory
    LMe.belongsToTheCatagory = null;

    //On circle mouse over event
    LMe.onCircleMouseHover = null;

    //On circles mouse out
    LMe.onCircleMouseOut = null;

    //Function which will get the text to be displayed as title
    LMe.onGetSectionText = null;


    //---------------------------------------------------------------------------------------------------------
    //onGetBubbleColor (function) - A function supposed to passed by the owner of the object,
    //this function will return color for the bubble by default would be '#777777'
    LMe.onGetBubbleColor = function(p_Data)
    {
        return G_BUBBLE_CHART_CONST.DEFAULT_CIRCLE_COLOR;
    };

    //---------------------------------------------------------------------------------------------------------
    //onGetBubbleRadius (function) - A function supposed to passed by the owner of the object,
    //this function will return radius for the bubble, by default the radius would be '5px'
    LMe.onGetBubbleRadius = function(p_Data)
    {
        return G_BUBBLE_CHART_CONST.DEFAULT_CIRCLE_RADIUS;
    };

    //--------------------------------------------------------------------------------------------------------
    //Function will add a parent div to the element and SVG element where chart is supposed to be rendered
    LMe.pvtInitializeCanvas = function()
    {
        //Careate and append the chart div
        //this div could be useful to display any chart related HTML data
        LMe.ChartContainerDiv = LMe.renderTo.append('div');

        //Create and append the SVG element in which chart will be displayed
        LMe.SVG = LMe.ChartContainerDiv.append('svg:svg')
            .attr("width", LMe.width)
            .attr("height", LMe.height);
    };

    //---------------------------------------------------------------------------------------------------------
    //Function will parse the raw data element and will map it to the chart data
    LMe.pvtMapData = function () {
        var LMe = this,
            LColor = '';
        //debugger;
        //Generate the data map
        LMe.dataSet = LMe.rawDataArray.map(function (p_RawDataItem) {
            var LObject = p_RawDataItem,
                LMappedDataObject;

            //Get user customized data object
            LMappedDataObject = LMe.onMapRawDataToChartData(p_RawDataItem);

            if (!LMappedDataObject.color) {
                //There was no color assigned to the bubble assign the default bubble
                LMappedDataObject.color = LMe.onGetBubbleColor(p_RawDataItem);
            }

            //get radius of the data bubble
            LMappedDataObject.radius = LMe.onGetBubbleRadius(p_RawDataItem);

            //returning the mapped data object
            return LMappedDataObject;
        });

        //return the dataset created
        return LMe.dataSet;
    };

    //---------------------------------------------------------------------------------------------------------
    //Function will return the dataset
    LMe.getDataSet = function ()
    {
        return LMe.dataSet;
    };

    //---------------------------------------------------------------------------------------------------------
    LMe.displayBubbles = function (p_DataSet) {
        //debugger;
        //Update the dataset
        //Remove absent node data bubbles
        var LCircle = LMe.SVG.selectAll("circle.node");
        LCircle.data([])
            .exit()
            .remove();

        //Create new node data bubles
        LCircle = LMe.SVG.selectAll("circle.node")
            .data(p_DataSet)
        LCircle.enter()
            .append("svg:circle")
            .attr("class", "node")
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
            .attr("r", function (d) { return d.radius; })
            .style("fill", function (d, i) { return d.color; })
            .style("stroke", function (d, i) { return d3.rgb(d.color).darker(2); })
            .style("stroke-width", 1.5)
            .on("mouseover", function (d, i) {
                //On mouse over trigger event
                if (LMe.onCircleMouseHover) {
                    LMe.onCircleMouseHover(this, d, i);
                }
            })
            .on("mouseout", function (d, i) {
                //On mouse over trigger event
                if (LMe.onCircleMouseOut) {
                    LMe.onCircleMouseOut(this, d, i);
                }
            });
    };

    //---------------------------------------------------------------------------------------------------------
    //Function return charge for the bubble data
    LMe.handleOnGetCharge = function(p_Data)
    {
        var LMe = this;
        if (p_Data.radius < 0)
        {
            //Radius is 0 so there would be no charge
            return 0;
        }
        else
        {
            //Return the repulsion value
            //the charge here should be reupulsive...
            return -((Math.pow(p_Data.radius,2.0))/8);
        }
    };

    //---------------------------------------------------------------------------------------------------------
    //function will create section headers for chart
    LMe.pvtCreateSectionHeaders = function()
    {
        var LLoopIndex = 0,
            LCount = LMe.previousSectionArray.length;

        //traverse all the sections and add them to the SVG chart
        for(; LLoopIndex < LCount; LLoopIndex++)
        {
            var LText,
                LSection = LMe.previousSectionArray[LLoopIndex];

            //Add the text label to the SVG
            LTextEl = LMe.SVG.append('svg:text')
                .attr('width', 500)
                .attr('width', 100)
                .attr('x', LSection.HeaderX + 20)
                .attr('y', LSection.HeaderY + 20)
                .attr('class', 'chart-title');

            if(LMe.onGetSectionText)
            {
                //get selection text by the owner
                LText = LMe.onGetSectionText(LSection, LTextEl);
            }
            else
            {
                //Selection text is section name
                LText = LSection.Name;

                //set the text to label
                LTextEl.text(LText);
            }
        }
    };

    //---------------------------------------------------------------------------------------------------------
    //Function will remove the section header
    LMe.pvtRemoveSectionHeaders = function()
    {
        var LSectionHeaders = d3.selectAll('text');
        if(LSectionHeaders)
        {
            //There are headers, remove them
            LSectionHeaders.remove();
        }
    };

    //---------------------------------------------------------------------------------------------------------
    //This funciton will create the catagories and display its data
    LMe.displayCategorised = function (p_CatagoryList) {
        var LMe = this,
            LCompleteDataSet = LMe.dataSet,
            LCatagoryCount = p_CatagoryList.length,
            LNewDataSet = [],
            LPartitionCount = 1,
            LGravity,
            LDataSections = [];

        //clear and stop previous section forces
        var LLoopIndex4 = 0;
        for (; LLoopIndex4 < LMe.previousSectionArray.length; LLoopIndex4++) {
            var LSection = LMe.previousSectionArray[LLoopIndex4];
            LSection.Force.nodes([]).stop();
        }

        //Get the sections index, number in which sections will be divided equally
        while (LCatagoryCount > Math.pow(LPartitionCount, 2)) {
            LPartitionCount++;
        }

        //Remove previous section headers
        LMe.pvtRemoveSectionHeaders();

        LCompleteDataSet.forEach(function (p_Data) {
            //Make display flag of the data to false
            //This flag will be set if the data belongs to a certain category
            p_Data.display = false;
        });

        //Compute sections and their focus
        var LXFixed = 0,
            LYFixed = 0,
            LSectionLoopIndex = 0;

        for (var LLoopIndex1 = 0; LLoopIndex1 < LPartitionCount; LLoopIndex1++) {
            if (LSectionLoopIndex >= LCatagoryCount) {
                //Sections for all available catoagories have be created
                break;
            }

            //Set X axis position of the section
            LXFixed = 0;

            for (var LLoopIndex2 = 0; LLoopIndex2 < LPartitionCount; LLoopIndex2++) {
                // debugger;
                var LSection = {};

                //Get focus of the section
                LSection.FocusX = LXFixed + LMe.width / (LPartitionCount * 2);
                LSection.FocusY = LYFixed + LMe.height / (LPartitionCount * 2);

                //Get headers section value
                LSection.HeaderX = LXFixed;
                LSection.HeaderY = LYFixed;

                //Get height and width of the section
                LSection.height = LMe.height / LPartitionCount;
                LSection.width = LMe.width / LPartitionCount;

                //Get name of the section
                LSection.Name = p_CatagoryList[LSectionLoopIndex];
                LSection.Id = p_CatagoryList[LSectionLoopIndex];
                //debugger;
                //Get nodes for the section
                LSection.DataCollection = LCompleteDataSet.filter(function (p_DataObject) {
                    //debugger;
                    var LLoopIndex = 0,
                        LCount;
                    var LCatagoryName = p_CatagoryList[LLoopIndex];
                    if (LMe.belongsToTheCatagory(p_DataObject, LSection.Id, LISelectedItem)) {
                        //The data belongs to the current catagory
                        //Set its display value
                        p_DataObject.display = true;
                        return true;
                    }
                    else {
                        return false;
                    }
                });
                //debugger;
                //Add data section to the list
                LDataSections.push(LSection);

                //Increment the X axis for the next section
                LXFixed = LXFixed + LMe.width / LPartitionCount;

                //Increment section's loop index
                LSectionLoopIndex++;
                if (LSectionLoopIndex >= LCatagoryCount) {
                    //Sections for all available catoagories have be created
                    break;
                }
            }

            //Increment the Y axis value for the next section
            LYFixed = LYFixed + LMe.height / LPartitionCount;
        }

        if (LDataSections.length == 0) {
            //debugger;
            //there are no sections, display complete data
            var LSection = {};
            //Get focus of the section
            LSection.FocusX = LXFixed + LMe.width / 3;
            LSection.FocusY = LYFixed + LMe.height / 3;

            //Get header position
            LSection.HeaderX = LXFixed;
            LSection.HeaderY = LYFixed;

            //Get name of the section
            LSection.Name = '';

            //Get nodes for the section
            LSection.DataCollection = LCompleteDataSet.filter(function (p_DataObject) {
                return true;
            });

            //Add the section to data section
            LDataSections.push(LSection);
            //debugger;
        }

        //Set all the data sections to the previous section array
        LMe.previousSectionArray = LDataSections;

        //Create forces for each section
        var LLoopIndex3 = 0,
            LCount3 = LDataSections.length;
        console.log(LCount3);
        for (; LLoopIndex3 < LCount3; LLoopIndex3++) {
            var LSection = LDataSections[LLoopIndex3],
                LForce;
            //debugger;
            LForce = d3.layout.force()
                .nodes(LSection.DataCollection)//Set data collection of the force
                .gravity(0.1)//Set the gravity
                .charge(LMe.handleOnGetCharge) //Set charge for the bubbles
                .friction(0.9)//Set friction
                .links([]) //There are no links set blank array
                .size([LSection.FocusX * 2, LSection.FocusY * 2]) //Set gravity center of the force
                .start(); //Start force

            //Assign section its force
            LSection.Force = LForce;

            //Handle the tick event
            LForce.on("tick", function (e) {
                var LCircle = LMe.SVG.selectAll("circle.node");
                //Get circles and set their [x y] co-ordinates
                LCircle.attr("cx", function (d) { return d.x; })
                    .attr("cy", function (d) { return d.y; })
            });

        }

        //Update data
        if ((!p_CatagoryList) || (p_CatagoryList.length < 1)) {
            //There are no catagories defined so display all data bubbles
            LNewDataSet = LCompleteDataSet.filter(function (p_DataObject) {
                //select all objects
                return true;
            });
        }
        else {
            LNewDataSet = LCompleteDataSet.filter(function (p_DataObject) {
                //Filter the objects if it is in the selection section
                return p_DataObject.display;
            });
        }

        //Create and display bubbles
        LMe.displayBubbles(LNewDataSet);

        //Create section headers
        LMe.pvtCreateSectionHeaders();
    };

    //---------------------------------------------------------------------------------------------------------
    LMe.drawChart = function()
    {
        //Map the data
        LMe.pvtMapData();

        //Display all the data
        LMe.displayCategorised([]);
    };

    //---------------------------------------------------------------------------------------------------------
    //Constructor of the bubble chart object, this will initiallize chart parameters and will render the chart
    LMe.constructor = function()
    {
        //Assign the configuration attributes
        for (p_Name in p_Config)
        {
            var LValue = null;
            LValue = p_Config[p_Name];
            LMe[p_Name] = LValue;
        }

        //Add a parent container for the chart
        LMe.pvtInitializeCanvas();

        //Draw the chart
        LMe.drawChart();
    };

    //---------------------------------------------------------------------------------------------------------

    //Invoke the constructor
    LMe.constructor();

    return LMe;
};