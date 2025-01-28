 class apierrorhandler extends error {
constructor( 
    statusCode,
    message="something went wrong 404-not found ",
    errors=[],
    stack=""
){
super(message)//highlight message
this.statusCode=statusCode;
this.data=null
this.message=message
this.success=false
this.errors=errors
if(stack){
    this.stack=stack
}
else{
    Error.captureStackTrace(this,this.constructor)
}
}
 

 }
 export {apierrorhandler}