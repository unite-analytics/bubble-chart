/*
 This file creates a bubble chart for the data loaded from "gen.txt" file
 */
var Customer_data_chart;
var docByAge = [];
var docByOrganization = [];
var docByCountry = [];
var LISelectedItem;
d3.json("document.json", function (error, root) {
    //d3.json("gen.txt", function(error, root) {
    //The raw data json has been loaded successfully
    var LArr = [];

    var LiList = ["15-30", "31-40","41-50","51-60","60+"];
    LiList.forEach(function (d) {
        var byAge = d;
        docByAge.push(byAge);
    })

    docByAge = docByAge.filter(function (elem, pos) {
        return docByAge.indexOf(elem) == pos;
    });
    docByAge.sort();
    console.log(docByAge);

    root.forEach(function (d) {
        var byCountry = d.CountryName;
        docByCountry.push(byCountry);
    })

    docByCountry = docByCountry.filter(function (elem, pos) {
        return docByCountry.indexOf(elem) == pos;
    });
    docByCountry.sort();
    console.log(docByCountry);


    root.forEach(function (d) {

        var byCountry = d["Organization Name"];
        docByOrganization.push(byCountry);
    })

    docByOrganization = docByOrganization.filter(function (elem, pos) {
        return docByOrganization.indexOf(elem) == pos;
    });
    docByOrganization.sort();
    console.log(docByOrganization);

    //--------------------------------------------------------------------------------------
    //function will return formatted number
    function L_FormatNumber(n, decimals) {
        var s, remainder, num, negativePrefix, negativeSuffix, prefix, suffix;
        suffix = ""
        negativePrefix = ""
        negativeSuffix = ""
        if (n < 0) {
            negativePrefix = "";
            negativeSuffix = " in income"
            n = -n
        };

        if (n >= 1000000000000) {
            suffix = " trillion"
            n = n / 1000000000000
            decimals = 2
        } else if (n >= 1000000000) {
            suffix = " billion"
            n = n / 1000000000
            decimals = 1
        } else if (n >= 1000000) {
            suffix = " million"
            n = n / 1000000
            decimals = 1
        }


        prefix = ""
        if (decimals > 0) {
            if (n < 1) { prefix = "0" };
            s = String(Math.round(n * (Math.pow(10, decimals))));
            if (s < 10) {
                remainder = "0" + s.substr(s.length - (decimals), decimals);
                num = "";
            } else {
                remainder = s.substr(s.length - (decimals), decimals);
                num = s.substr(0, s.length - decimals);
            }


            return negativePrefix + prefix + num.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "." + remainder + suffix + negativeSuffix;
        } else {
            s = String(Math.round(n));
            s = s.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            return negativePrefix + s + suffix + negativeSuffix;
        }
    };

    //--------------------------------------------------------------------------------------
    //Function to traverse the tree data nodes
    function L_TraverseTree(p_node, p_IsRootNode, p_ParentArray) {
        if (!p_node.Children) {
            // debugger;
            //The node is a data node (leaf node) so add it's object to the array
            var LLeafObject = {};
            //set parents array
            //LLeafObject.ParentArray = p_ParentArray;
            //set the disbursement value
            //LLeafObject.Disbursement = p_node.Disbursement;
            //set name of the data
            // LLeafObject.Name = p_node.Name;
            //Push the new object to the array
            LArr.push(p_node);
            return;
        }
        else {
            //The node is parent node (non leaf node) so traverse its children
            var LLoopIndex = 0,
                LCount = p_node.Children.length;

            if (p_IsRootNode !== true) {
                //The node is not root node so push the name of this node to the parent array
                p_ParentArray.push(p_node.Id);
            }

            var LTempParentArray;
            //traverse the child nodes of the current node
            for (; LLoopIndex < LCount; LLoopIndex++) {
                if (p_IsRootNode === true) {
                    //The tree is root node
                    p_ParentArray = [];
                }

                //clone the parent array
                LTempParentArray = p_ParentArray.slice(0);
                //Traverse the child tree
                L_TraverseTree(p_node.Children[LLoopIndex], false, p_ParentArray);
                //Reset the parent array
                p_ParentArray = LTempParentArray.slice(0);
            }
        }
    }

    //--------------------------------------------------------------------------------------
    //Function draws level buttons to the buttons element
    function L_DrawLevelButtons() {
        /*function L_L_GetArrayElements(p_Array)
         {
         var LIndex = 0,
         LCnt = p_Array.length,
         LString = '';

         for(; LIndex < LCnt; LIndex++)
         {
         LString = LString + '\'' + p_Array[LIndex] + '\'';

         if(LIndex < (LCnt - 1))
         {
         LString = LString + ',';
         }
         }
         return LString;
         }*/

        function L_L_GetCategorisString(p_CatagoryArray) {
            //debugger;
            var LIndex = 0,
                LCnt = p_CatagoryArray.length,
                LString = '';

            for (; LIndex < LCnt; LIndex++) {
                LString = LString + '\'' + p_CatagoryArray[LIndex] + '\'';

                if (LIndex < (LCnt - 1)) {
                    LString = LString + ',';
                }
            }
            return LString;
        }
        var LiList = ["Total Staff ", "Staff by Organization", "Staff by Country", "Staff by Age"];
        //Get buttons container div
        var LButtonsContainerDiv = d3.selectAll('#div-level-btn-cntnr-list'),
            LLoopIndex = 0,
            LCount = LiList.length,
            LHTML = '';

        //Traverse the sections/catagories node
        for (; LLoopIndex < LCount; LLoopIndex++) {
            var LLevel = LiList[LLoopIndex],
                LData = [];
            LData[0] = LLevel;
            //debugger;
            //Create buttons
            LButtonsContainerDiv.append('li')
                .text(LLevel)
                .attr('title', LData[0])
                .data(LData)
                .on('click', function (d, i) {

                    LISelectedItem = d;
                    if (d == "Staff by Country") {

                        //On click display the catagorized data
                        Customer_data_chart.displayCategorised(docByCountry);
                    }
                    else if (d == "Staff by Organization") {
                        Customer_data_chart.displayCategorised(docByOrganization);
                    }
                    else if (d == "Staff by Age") {

                        Customer_data_chart.displayCategorised(docByAge);
                    }
                    else {
                        Customer_data_chart.displayCategorised("");
                    }
                });
        }
        //debugger;
        //Set the inner HTML of the buttons container div
        LButtonsContainerDiv.innerHTML = LHTML;
    }

    //------------------------------------------------------------------------------------------------------

    //Draw Level buttons
    L_DrawLevelButtons();
    //debugger;
    //Invoke the traversal logic and get data into the array
    L_TraverseTree(root, true, []);

    //Create configure object for the chart
    var LChartConfig = {};
    LChartConfig.renderTo = d3.select(".div-svg-cntnr");
    LChartConfig.rawDataArray = root;
    LChartConfig.onGetBubbleColor = function (p_Data) {

        if (p_Data.Age >= 15 && p_Data.Age <= 30) {

            return '#6666A3';
        }
        else if (p_Data.Age >= 31 && p_Data.Age <= 40) {

            return '#4D4D94';
        }
        else if (p_Data.Age >= 41 && p_Data.Age <= 50) {

            return '#333385';
        }
        else if (p_Data.Age >= 51 && p_Data.Age <= 60) {

            return '#191975';
        }
        else {

            return '#000066';
        }
        //		if(p_Data.ParentArray.indexOf(11) != -1)
        //		{
        //			return '#0F243E';
        //		}
        //		else if(p_Data.ParentArray.indexOf(12) != -1)
        //		{
        //			return '#17365D';
        //		}
        //		else if(p_Data.ParentArray.indexOf(13) != -1)
        //		{
        //			return '#548DD4';
        //		}
        //		else if(p_Data.ParentArray.indexOf(14) != -1)
        //		{
        //			return '#548DD4';
        //		}
        //		else if(p_Data.ParentArray.indexOf(21) != -1)
        //		{
        //			return '#4F6128';
        //		}
        //		else if(p_Data.ParentArray.indexOf(22) != -1)
        //		{
        //			return '#76923C';
        //		}
        //		else if(p_Data.ParentArray.indexOf(23) != -1)
        //		{
        //			return '#C3D69B';
        //		}
        //		else if(p_Data.ParentArray.indexOf(24) != -1)
        //		{
        //			return '#D7E3BC';
        //		}
        //		else
        //		{
        //			return '#000000';
        //		}


    };

    //Handle mapping of raw data to chart data
    LChartConfig.onMapRawDataToChartData = function (p_SomeObj) {
        var LObject = p_SomeObj;
        // debugger;
        //return the object
        return {
            //            Name: LObject.Name,
            //            Disbursement: LObject.Disbursement,
            //            ParentArray: LObject.ParentArray

            Year: LObject.Year,
            //Organization_Name:LObject.,
            GRADE: LObject.GRADE,
            SEX: LObject.SEX,
            Age: LObject.Age,
            ORGLOC: LObject.ORGLOC,
            DSCTRYCD: LObject.DSCTRYCD,
            DSCITYCD: LObject.DSCITYCD,
            CountryName: LObject.CountryName,
            CITY_NME: LObject.CITY_NME,
            Organization_Name: LObject["Organization Name"]
        };
    };

    //A function to get radius of the buble, the function should return integer value for the buble
    LChartConfig.onGetBubbleRadius = function (p_data, p_Index) {
        var LMe = this;
        var LValue = p_data.Disbursement;
        return 6;
        //		if(LValue < 1)
        //		{
        //			return 2;
        //		}
        //		if(LValue > 1 && LValue < 1000000)
        //		{
        //			return 10;
        //		}
        //		else if(LValue > 1000000 && LValue < 10000000)
        //		{
        //			return 10;
        //		}
        //		else if(LValue > 10000000 && LValue < 100000000)
        //		{
        //			return 15;
        //		}
        //		else if(LValue > 100000000 && LValue < 1000000000)
        //		{
        //			return 20;
        //		}
        //		else if(LValue > 1000000000 && LValue < 10000000000)
        //		{
        //			return 25;
        //		}
        //		else if(LValue > 10000000000 && LValue < 100000000000)
        //		{
        //			return 30;
        //		}
        //		else if (LValue > 100000000000)
        //		{
        //			return 50;
        //		}
        //		else
        //		{
        //			return 100;
        //		}
    };

    //Function to check if the data object belongs to a catagory or not
    LChartConfig.belongsToTheCatagory = function (p_DataObject, p_CatagoryName, li_SelecteItem) {
        //debugger;
        if (li_SelecteItem == "Staff by Country") {
            if (p_DataObject.CountryName == p_CatagoryName) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (li_SelecteItem == "Staff by Age") {
            //            if (p_DataObject.Age >= p_CatagoryName) {
            //                return true;
            //            }
            //            else {
            //                return false;
            //            }

            if (p_CatagoryName == "15-30") {
                if (p_DataObject.Age >= 15 && p_DataObject.Age <= 30) {

                    return true;
                }
                else {
                    return false;
                }
            }
            else if (p_CatagoryName == "31-40") {
                if (p_DataObject.Age >= 31 && p_DataObject.Age <= 40) {

                    return true;
                }
                else {
                    return false;
                }
            }
            else if (p_CatagoryName == "41-50") {
                if (p_DataObject.Age >= 41 && p_DataObject.Age <= 50) {

                    return true;
                }
                else {
                    return false;
                }
            }
            else if (p_CatagoryName == "51-60") {
                if (p_DataObject.Age >= 51 && p_DataObject.Age <= 60) {

                    return true;
                }
                else {

                    return false;
                }
            }
            else if (p_CatagoryName == "60+") {
                if (p_DataObject.Age >= 61) {

                    return true;
                }
                else {

                    return false;
                }
            }


        }
        else if (li_SelecteItem == "Staff by Organization") {
            //debugger;
            if (p_DataObject.Organization_Name == p_CatagoryName) {
                return true;
            }
            else {
                return false;
            }
        }

        //        var LBelongsToCatagory = (p_DataObject.ParentArray.indexOf(p_CatagoryName) != -1);
        //        return LBelongsToCatagory;
    };

    //Handle on mouse hover of bubble
    LChartConfig.onCircleMouseHover = function (p_Circle, p_Data, p_Index) {
        var el = d3.select(p_Circle);
        var xpos = Number(el.attr('cx') + p_Data.radius);
        var ypos = (el.attr('cy') - p_Data.radius - 10 + 80);

        //Highlight the bubble border
        el.style("stroke", "#000").style("stroke-width", 3);

        //display tool tip
        //d3.select("#jay-tooltip .jay-department").text(p_Data.Name);
        //d3.select("#jay-tooltip .jay-value").html("$" + L_FormatNumber(p_Data.Disbursement));
        //d3.select("#jay-tooltip").style('top', ypos + "px").style('left', xpos + "px").style('display', 'block');
    };

    //Handle on mouse out event of the bubble
    LChartConfig.onCircleMouseOut = function (p_Circle, p_Data, p_Index) {
        //Hide the hint
        d3.select("#jay-tooltip").style('display', 'none');

        //Remove the highlighting of the bubble
        var el = d3.select(p_Circle)
        d3.select(p_Circle)
            .style("stroke-width", 1)
            .style("stroke", function (p_Data) { return d3.rgb(p_Data.color).darker(2); });
    };

    //Handle on section of the text
    //This method will be invoked whenever the section is being created
    LChartConfig.onGetSectionText = function (p_SectionObj, p_TitleTextObj) {
        var LText = p_SectionObj.Name,
            LTotal = 0;

        //Compute total disbursement of the section
        p_SectionObj.DataCollection.forEach(function (p_Data) {
            LTotal = LTotal + p_Data.Disbursement;
        });

        //Display the total disbursement number
        //p_TitleTextObj.append('tspan').attr('x', p_SectionObj.HeaderX).attr('id', 'spval').text('$' + L_FormatNumber(LTotal));

        //Display the section text
        p_TitleTextObj.append('tspan').attr('x', p_SectionObj.HeaderX).attr('id', 'spcatagory').attr('dy', '20').text(LText);
    };

    //Set height of the chart
    LChartConfig.height = 800;

    //Set width of the chart
    LChartConfig.width = 1000;

    //Create a new chart
    Customer_data_chart = new clsBubbleChart(LChartConfig);
});
