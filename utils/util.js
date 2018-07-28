const exportObj = {
  // format date 'yyyy-MM-dd'
  formatDate: function(date) {
    return date.toISOString().substring(0, 10);
  }
}

export default exportObj;