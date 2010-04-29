onmessage = function(event) {
    setTimeout(function(){
        postMessage("503")
    }, 10000)
    
    var request = new XMLHttpRequest()
    request.open("GET","/sync/blog.json",false)

    request.addEventListener("error",function(){
        postMessage("503")
    },false)

    request.send()
    postMessage(request.status)
}