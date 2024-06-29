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
    return price / weightInGrams.toFixed(2);
  };


export const formatWeight = (weight) => {
    switch (weight) {
      case 1:
        return '1g';
      case 3.5:
        return '3.5g (1/8oz)';
      case 7:
        return '7g (1/4oz)';
      case 14:
        return '14g (1/2oz)';
      case 28:
        return '28g (1oz)';
      default:
        return `${weight}g`;
    }
  };

  export  const priceBreaks = [1, 3.5, 7, 14, 28];