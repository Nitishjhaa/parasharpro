import mongoose from 'mongoose';

const SharedKundaliSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
    },
    data: {
        type: Object,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400, // Automatically delete after 24 hours (optional feature, remove if persistence is needed forever)
    },
});

export default mongoose.models.SharedKundali || mongoose.model('SharedKundali', SharedKundaliSchema);
