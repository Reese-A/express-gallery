module.exports = function(arr, res, message){
  arr.forEach((curr) => {
    if(curr.length < 1){
      return res.status(400).json({message: message});
    }
    return true;
  })
}