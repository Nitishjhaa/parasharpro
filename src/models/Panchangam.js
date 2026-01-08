import mongoose from "mongoose";

const panchangSchema = new mongoose.Schema({
    nameOfWork: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    time: {
        type: String,
    },
    paksha: {
        type: String,
    },
    tithi: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

})

export default mongoose.models.Panchangam || mongoose.model("Panchangam", panchangSchema)
