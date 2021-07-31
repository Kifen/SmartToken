const getBuyPrice = (supply, amount) => {
  return ((1/2)*(amount + supply)**2) - ((1/2)*supply**2);
}

const getSellPrice = (supply, amount) => {
  return ((1/2)*supply **2) - ((1/2)*(supply - amount)**2);
}

module.exports = {
  getSellPrice,
  getBuyPrice
}