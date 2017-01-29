 
 $('#keyCodeTool input').on('keyup',function(event){
  event.preventDefault();
  this.value = event.keyCode;
 });
