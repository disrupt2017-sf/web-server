function determineCrisis(string) {
  if(string.indexOf('fire')) {
    return 'fire';
  } else if(string.indexOf('flood')) {
    return 'flood';
  } else if(string.indexOf('earthquake')){
    return 'earthquake';
  }
}

module.exports = determineCrisis;