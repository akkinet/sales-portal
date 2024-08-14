export function sortByFeatureCount(products, ascending = true) {
    return products.sort((a, b) => {
        const featureCountA = a.features.length;
        const featureCountB = b.features.length;

        if (ascending) {
            return featureCountA - featureCountB;
        } else {
            return featureCountB - featureCountA;
        }
    });
}

export function sortByTotalPrice(a, b) {
    return a.totalPrice - b.totalPrice;
}