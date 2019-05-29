var id = 0;
var cluster_y = 0;
var cluster_x = 0;
var mpsoc_x = 0;
var mpsoc_y = 0;
var tasks_per_pe = 0;
var processesArray = [];
var processors = [];
var arrayProcessors = [];
var a;

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
function ItemArray(x, y, load) {
	this.x = x;
  this.y = y;
  this.load = load;
}

function start(){
  $("#tables").empty();
  doWork();
}
function doWork(){
 for(a = 0; a < tests.length; a++){
  getTasks();
  distributeTasks();
  distributeMissingTasks();
  drawTable();
 }
}
function getTasks(){
  id = tests[a].id;
  cluster_y = tests[a].cluster_y;
  cluster_x = tests[a].cluster_x;
  mpsoc_x = tests[a].mpsoc_x;
  mpsoc_y = tests[a].mpsoc_y;
  tasks_per_pe = tests[a].tasks_per_pe;
  processesArray = [];
  processors = [];
  arrayProcessors = [];
  for(var b = 0; b < tests[a].apps.length; b ++){
    var qtd_apps = tests[a].apps[b].qtd_apps;
    var app_name = tests[a].apps[b].app_name;
    for(var c = 0; c < apps.length; c ++){
      if(apps[c].name == app_name){
        for(var d = 0; d < qtd_apps; d ++){
          for(var e = 0; e < apps[c].tasks.length; e ++){
            var itemProcess = new Process(apps[c].tasks[e], app_name + ":" + apps[c].tasks[e].id);
            processesArray.push(itemProcess);
          }
        }
      }
    }
  }
}
function distributeTasks(){
 var gmpsOk = false;
 var gmpsNumber = 0;
 for(var f = 0; f < mpsoc_x; f++){
   processors[f] = [];
   for(var g = 0; g < mpsoc_y; g++){
     if(gmpsOk){
       if(processesArray.length > 0){
         itemProcessor = new Processor(processesArray[0].title, 1, processesArray[0].processObject.load,true);
         processors[f].push(itemProcessor);
         processesArray.shift();
         if(processors[f][g].processors >= tasks_per_pe){
           processors[f][g].enabled = false;
         }
         itemArray = new ItemArray(f,g,processors[f][g].load);
         arrayProcessors.push(itemArray);
       }else{
         itemProcessor = new Processor("-", 0, 0,true);
         processors[f].push(itemProcessor);
       }
     }else{
       gmpsNumber++;
       itemProcessor = new Processor("GMP", 0, "-",false);
       processors[f].push(itemProcessor);
       if(gmpsNumber >= ((mpsoc_y * mpsoc_x)/(cluster_x * cluster_y))){
         gmpsOk=true;
       }
     }
   }
 }
}
function distributeMissingTasks(){
 arrayProcessors.sort(compareLoad);
 while(processesArray.length > 0){
    var index = 0;
    var alocatted = false;
    arrayProcessors.sort(compareLoad);
    while(!alocatted){
      var x = arrayProcessors[index].x;
      var y = arrayProcessors[index].y;
      var load = processesArray[0].processObject.load;
      if(processors[x][y].enabled){
        processors[x][y].processors = processors[x][y].processors + 1;
        processors[x][y].load = processors[x][y].load + load;
        processors[x][y].activity = processors[x][y].activity + " / " + processesArray[0].title;
        arrayProcessors[index].load = processors[x][y].load;
        if(processors[x][y].processors >= tasks_per_pe){
          processors[x][y].enabled = false;
        }
        alocatted = true;
        processesArray.shift();
      }else{
        index++;
      }
    }
  }
}
function drawTable(){
 $('#tables').append("<h1> Teste #" + id + "</h1>");
 $('#tables').append("<h5> Tarefas por processador: " + tasks_per_pe + "</h5>");
 $('#tables').append("<h5> Matriz de Processadores: " + mpsoc_y + "X" + mpsoc_x + "</h5>");
 $('#tables').append("<h5> Matriz do Cluster: " + cluster_x + "X" + cluster_x + "</h5>");
 $('#tables').append("<table class='table table-hover'><tbody id='table" + id + "'></tbody></table>");
 for(var h = 0; h < mpsoc_x; h++){
   $('#table'+id).append("<tr>");
   for(var i = 0; i < mpsoc_y; i++){
     var hasContent = processors[h][i].enabled;
     if(processors[h][i].load <= 0){
       hasContent = "noContent";
     }
     if(processors[h][i].activity == "GMP"){
       hasContent = "GMP";
     }
     if(processors[h][i] != null){
       $('#table'+id).append("<td id='row"+ h + "_"+ i +"' class='"+ hasContent +"' >"+ processors[h][i].activity +"</br> Load: " + processors[h][i].load +"</td>");
     }
   }
 }
}
function compareLoad(processorA,processorB){
  if (processorA.load < processorB.load)
     return -1;
  if (processorA.load > processorB.load)
    return 1;
  return 0;
}
