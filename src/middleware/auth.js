export const adminAuth=(req,res,next)=>{
     const token = "123";
  const isAuthenticated = token ==='123' 
  if(!isAuthenticated){
    res.status(401).send("User not authenticated")
  }else{
    next()
  }
}
export const userAuth=(req,res,next)=>{
     const token = "123";
  const isAuthenticated = token ==='123' 
  if(!isAuthenticated){
    res.status(401).send("User not authenticated")
  }else{
    next()
  }
}