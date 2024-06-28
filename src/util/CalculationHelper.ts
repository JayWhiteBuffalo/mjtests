export const calculatePricePerGram = (price, weight, weightUnit) => {
    // Convert weight to grams
    let weightInGrams;
    switch (weightUnit) {
      case 'g':
        weightInGrams = weight;
        break;
      case 'oz':
        weightInGrams = weight * 28.3495;
        break;
      case 'lbs':
        weightInGrams = weight * 453.592;
        break;
      default:
        weightInGrams = weight; // Assume grams if unit is not specified
    }
  
    if (weightInGrams === 0) return 0; // Avoid division by zero
    return price / weightInGrams;
  };