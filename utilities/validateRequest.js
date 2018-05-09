module.exports = function(arr){
  arr.forEach((curr) => {
    if(curr.length < 1){
      return false;
    }
  })
  return true;
}