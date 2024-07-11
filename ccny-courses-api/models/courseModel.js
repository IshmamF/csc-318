const mongoose = require('mongoose');

const detailSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter course name']
        },
        status: {
            type: String,
            required: true,
            default: 'Not Available'
        },
        courseCode: {
            type: String,
            required: true
        },
        credits: {
            type: Number,
            required: true
        },
        enrollmentPeriod: {
            type: String,
            required: true
        },
        dayTime: {
            type: String,
            required: true
        },
        room: {
            type: String,
            required: true
        },
        instructor: {
            type: String,
        },
        description: {
            type: String,
            required: true
        }
    }
);
    
const courseSchema = mongoose.Schema(
    {
        Course: {
            type: detailSchema,
            required: true
        }
    }
)

const Courses = mongoose.model('courses', courseSchema);
module.exports = Courses;

