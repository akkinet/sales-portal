import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    description: String,
    features: [String],
    price: Number,
    group: String,
    product_id: String,
    price_id: String,
    metadata: mongoose.Schema.Types.Mixed
})

export default mongoose.models.Product || mongoose.model("Product", productSchema);