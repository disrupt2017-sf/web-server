function determineCrisis(string) {
  console.log('string is');
  console.log(string);
  string = string.toLowerCase();
  if(string.indexOf('fire') > -1) {
    return 'fire';
  } else if(string.indexOf('flood') > -1) {
    return 'flood';
  } else if(string.indexOf('earthquake') > -1){
    return 'earthquake';
  } else if(string.indexOf('hospital') > -1){
    return 'hospital';
  } else {
    return null;
  }
}

module.exports = determineCrisis;