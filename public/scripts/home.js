window.onload = function () {
    var questionsChartsDiv = document.getElementById('questionsChartsDiv')
    // var ctx = document.getElementById('questionsChart').getContext('2d');
    var canvasCTXs = []
    class ChartData {
        constructor(question, choices) {
            this.question = question
            this.choicesAndNumOfTimesPicked = {}
            for(let i = 0; i < choices.length; i++) {
                this.choicesAndNumOfTimesPicked[choices[i]] = 0
            }
        }
    }

    function addCanvases(numToAdd) {
        for(let i = 0; i < numToAdd; i++){
            var newCanvas = document.createElement("CANVAS");
            let newId = "canvas" + i
            newCanvas.setAttribute('id', newId)
            canvasCTXs.push(newCanvas.getContext('2d'))
            questionsChartsDiv.appendChild(newCanvas)
            console.log(newCanvas)
        }
    }

    function makeApiRequest(url, method = "GET") {
        var request = new XMLHttpRequest();
        let promise = new Promise(function (resolve, reject) {
            request.onreadystatechange = function () {
                if (request.readyState !== 4) return;
                
                if (request.status >= 200 && request.status < 300) {
                    // Successful
                    resolve(request);
                } else {
                    // Failed
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                }
            };
    
            // Send our request
            request.open(method, url, true);
            request.send();
        });
        promise.catch(function(error) {      
          });
        return promise
    };    

    let getQuestionsPromise = makeApiRequest("http://localhost:3000/question/questions")
    getQuestionsPromise.then((req) => {
        let chartDataObjects = []
        let questionJson = JSON.parse(req.responseText)
        let getResponsesPromise = makeApiRequest("http://localhost:3000/question/responses")
        getResponsesPromise.then((req)=> {
            let responsesJson = JSON.parse(req.responseText)
            addCanvases(3)
            for(let i = 0; i < questionJson.length; i++) {
                let newChartData = new ChartData(questionJson[i].prompt, questionJson[i].choices)
                console.log(newChartData)
                chartDataObjects.push(newChartData)
            }
            for(let i = 0; i < responsesJson.length; i++){
                for(let j = 0; j < chartDataObjects.length; j++){
                    if (chartDataObjects[j].question == responsesJson[i].question) {
                        chartDataObjects[j].choicesAndNumOfTimesPicked[responsesJson[i].choice]++
                    }
                }
            }
            
            for(let i = 0; i < canvasCTXs.length; i++){
                var chart = new Chart(canvasCTXs[i], {
                    // The type of chart we want to create
                    type: 'bar',
                
                    // The data for our dataset
                    data: {
                        labels: Object.keys(chartDataObjects[i].choicesAndNumOfTimesPicked),
                        datasets: [{
                            label: chartDataObjects[i].question,
                            backgroundColor: 'rgb(255, 99, 132)',
                            borderColor: 'rgb(255, 99, 132)',
                            data: Object.values(chartDataObjects[i].choicesAndNumOfTimesPicked)
                        }]
                    },
                
                    // Configuration options go here
                    options: {}
                });
                console.log(chartDataObjects)
            }
            
        })
    })
   

}