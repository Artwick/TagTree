/**
 MIT License
 
 Copyright (c) 2017 Artwick
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 **/

'use strict';

var tagtree = {
    JSONObjects: undefined,
    tags: [],
    minTagId: 0,
    maxTagId: 1,
    /**
     * Read the json file upload
     */
    readJsonFile: function (file) {
        var reader = new FileReader();

        reader.onload = (function (aFile) {
            return function (e) {
                tagtree.JSONObjects = JSON.parse(e.target.result);
                console.log("# of objects: " + tagtree.JSONObjects.length);
//                console.log(this.rawJSON);
                $('#jsontextarea').val(e.target.result);
            };
        })(file[0]);

        reader.readAsText(file[0]);
    },
    buildTree: function () {
        if (!tagtree.JSONObjects) {
            tagtree.JSONObjects = testData;
        }
        console.log("object[0]: ", tagtree.JSONObjects[0]);
        tagtree.countTags();
        tagtree.showAsChart();
    },
    countTags: function () {
        for (var i = 0; i < tagtree.JSONObjects.length; i++) {
            var tagArray = tagtree.JSONObjects[i].tids.split(",");
            for (var ii = 0; ii < tagArray.length; ii++) {
                var tagID = parseInt(tagArray[ii]);

                if ((tagtree.minTagId == 0 && tagID != 0) || tagtree.minTagId > tagID)
                    tagtree.minTagId = tagID;
                if (tagtree.maxTagId < tagID)
                    tagtree.maxTagId = tagID;

                var tag = tagtree.tags[tagID];
                if (tagtree.tags[tagID] > 0)
                    tagtree.tags[tagID] = tagtree.tags[tagID] + 1;
                else
                    tagtree.tags[tagID] = 1;
//                console.log("added +1 to tag " + tagID + " (total: " + tagtree.tags[tagID] + ")");
//                console.log("min " + tagtree.minTagId + " - " + tagtree.maxTagId + " max" + " (length: " + tagtree.tags.length + ")");
            }
        }
    },
    showAsChart: function () {

        console.log("min " + tagtree.minTagId + " - " + tagtree.maxTagId + " max" + " (length: " + tagtree.tags.length + ")");
        // build datset for chart
        var labels = [];
        var chartData = [];
        var bgColors = [];
        for (var i = 0; i < tagtree.JSONObjects.length; i++) {
            var iLabel = "#" + i;
            if (tagtree.tags[i] && tagtree.tags[i] !== 0) {
//                console.log("tag #" + i + " has " + tagtree.tags[i] + " occurrences");
                labels.push(iLabel);
                chartData.push(tagtree.tags[i]);
                // alternate colors
                if (chartData.length % 2 != 0)
                    bgColors.push('rgba(55, 0, 200, 0.8)');
                else
                    bgColors.push('rgba(0, 0, 255, 0.5)');
            }

        }

        var ctx = $("#myChart");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                        label: "# of occurrences",
                        data: chartData,
                        backgroundColor: bgColors,
                        borderWidth: 1,
                    }]
            },
            options: {
                title: {
                    display: true,
                    text: "Occurrences per tag"
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                }
            }
        });

    }

};