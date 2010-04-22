onmessage = function(event) {
    //max working time for thread
    setTimeout(function(){
        postMessage("503")
    }, 10000)

    var url = event.data.url
    var method = event.data.method
    var params = null
    var request = new XMLHttpRequest()

    request.open(method,"/sync/" + url,false)

    if(method=="POST") {
        params = event.data.params
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    }

    request.send(params)

    if(request.status == 200 && method == "GET") {
        postMessage([request.status, eval('(' + request.responseText + ')')])
    } else {
        postMessage(request.status)
    }
}