var id = 0;
var cluster_y = 0;
var cluster_x = 0;
var mpsoc_x = 0;
var mpsoc_y = 0;
var tasks_per_pe = 0;

function start(){
  getProcesses();
}
function Process(processObject, title) {
	this.processObject = processObject;
  this.title = title;
}
function Processor(activity, processors, load, enabled) {
	this.activity = activity;
  this.processors = processors;
  this.load = load;
  this.enabled = enabled;
}
function getProcesses(){
   for(var a = 0; a < tests.length; a++){
     id = tests[a].id;
     cluster_y = tests[a].cluster_y;
     cluster_x = tests[a].cluster_x;
     mpsoc_x = tests[a].mpsoc_x;
     mpsoc_y = tests[a].mpsoc_y;
     tasks_per_pe = tests[a].tasks_per_pe;
     var processesArray = [];
     var processors = [];
     for(var b = 0; b < tests[a].apps.length; b ++){
       var qtd_apps = tests[a].apps[b].qtd_apps;
       var app_name = tests[a].apps[b].app_name;
       for(var c = 0; c < apps.length; c ++){
         if(apps[c].name == app_name){
           for(var d = 0; d < qtd_apps; d ++){
             for(var e = 0; e < apps[c].tasks.length; e ++){
               var itemProcess = new Process(apps[c].tasks[e], app_name + " : " + apps[c].tasks[e].id);
               processesArray.push(itemProcess);
             }
           }
         }
       }
     }
    for(var f = 0; f < mpsoc_x; f++){
      processors[f] = [];
      for(var g = 0; g < mpsoc_y; g++){
        if(processesArray.length > 0){
          itemProcessor = new Processor(processesArray[0].title, 1, processesArray[0].processObject.load,true);
          processors[f].push(itemProcessor);
          processesArray.shift();
          if(processors[f][g].processors >= tasks_per_pe){
            processors[f][g].enabled = false;
          }
        }else{
          itemProcessor = new Processor("-", 0, 0,true);
          processors[f].push(itemProcessor);
        }
      }
    }
    console.log("montando");
    drawTable(processors);
   }
 }
 function drawTable(matriz){
   $('#tables').append("<h1> Teste " + id + "</h1>");
   $('#tables').append("<table class='table table-hover'><tbody id='table" + id + "'></tbody></table>");
   for(var h = 0; h < mpsoc_x; h++){
     $('#table'+id).append("<tr>");
     for(var i = 0; i < mpsoc_y; i++){
       if(matriz[h][i] != null){
         $('#table'+id).append("<td id='row"+ h + "_"+ i +"' class='"+ matriz[h][i].enabled +"' >"+ matriz[h][i].activity +"</br> Load: " + matriz[h][i].load +"</td>");
       }
     }
   }
 }
