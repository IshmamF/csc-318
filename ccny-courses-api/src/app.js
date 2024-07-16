const express = require('express');
const Courses = require('../models/courseModel.js');
const cors = require('cors');
const allCourses = require('../Fall24Courses.json');

const mongoose = require('mongoose');
const uri = process.env.uri
console.log(uri)
mongoose.connect(uri);
jsonToDatabase();
//console.log(Object.keys(allCourses));

const app = express();

app.use(express.json());
app.use(
    cors({
      methods: 'GET,POST,PUT,DELETE',
      credentials: true,
      exposedHeaders: ['set-cookie'],
    })
  );
  
app.use(express.static('public'));

app.get('/', (req, res) => {
    htmlCode = `<h1>CCNY Course API to retrieve course details for Fall 2024</h1> 
    <br>
    <h2>For JSON body of adding a course, it follows the structure</h2>
    <h3>PLEASE NOTE YOU DO NOT NEED ALL FIELDS TO TEST OUT API</h3>
    <p>{
        'name': string value,
        'status': string value,
        'courseCode': string value,
        'credits': number value,
        'enrollmentPeriod': string value,
        'dayTime': string value,
        'room': string value,
        'instructor': string value,
        'description': string value
    </p>
    <h2>For the JSON body of updating a course, it follows the structure</h2>
    <h3>YOU NEED 'searchName', everything else is optional</h3>
    <p>{
        'searchName': string value,
        'name': string value,
        'status': string value,
        'courseCode': string value,
        'credits': number value,
        'enrollmentPeriod': string value,
        'dayTime': string value,
        'room': string value,
        'instructor': string value,
        'description': string value
    </p>
    <h2>For JSON body of getting related courses and deleting a course use the following:</h2>
    <p>{
        'name': string value
    }
    </p>
    <br>
    <h2>Endpoints:</h2>
    <ul>
        <li>GET /courses - Get all course codes</li>
        <li>GET /courses/:courseID - Get course details for a specific course based on Course Code</li>
        <li>POST /courses/course-details - Get related courses based on course name</li>
        <li>POST /courses/add-course - Add a new course</li>
        <li>POST /courses/update-course - Update an existing course</li>
        <li>DELETE /courses/delete-course - Delete an existing course</li>
    </ul>`;
    res.send(htmlCode);
});

app.get('/courses', async(req, res) => {
    const dbCourses = await Courses.find({});
    const courses = {};
    dbCourses.forEach(course => {
        courses[course.Course['courseCode']] = course.Course['name'];
    });
    res.json(courses);
});

app.get('/courses/:courseID', async (req, res) => {
    const courseID = req.params.courseID;
    const course = await Courses.findOne({'Course.courseCode': courseID});
    res.json(course);
});

app.post('/courses/course-details', async (req, res) => {
    const name = req.body.name;
    const courses = await findRelatedCourses(name);
    const data = Object.assign({}, courses)
    res.json(data);
});

app.post('/courses/add-course', async (req, res) => {
    const formattedCourse = formatCourseData(req.body);
    const course = await Courses.findOne({'Course.name': req.body.name});
    if (course) {
        console.log(`${course.Course.name} already exists in the database`)
        res.json({
            'message': 'Course Already Exists'
        });
    } else { 
        const newCourse = new Courses({
            'Course': formattedCourse
        });
        newCourse.save();
        res.json({
            'message': 'Course added successfully',
            'course details': formattedCourse
        });
    }
});

app.post('/courses/update-course', async (req, res) => {
    const course = await Courses.findOne({'Course.name': req.body.searchName});
    updatedCourse = updateCourseData(course.Course, req.body);
    if (Object.keys(req.body).length === 0) {
        res.json({
            'message': 'No data provided'
        });
    }
    else if (!course) {
        console.log(`${course} does not exist in the database`);
        res.json({
            'message': 'Course Does Not Exist'
        });
    }
    else {
        await Courses.findOneAndUpdate({'Course.name': req.body.searchName}, {'Course': updatedCourse});
        res.json({
            'message': 'Course updated successfully',
            'course details': updatedCourse
        });
    }
});

app.delete('/courses/delete-course', async (req, res) => {
    const course = await Courses.findOne({'Course.name': req.body.name});
    if (!course) {
        console.log(`${course} does not exist in the database`);
        res.json({
            'message': 'Course Does Not Exist'
        });
    }
    else {
        await Courses.findOneAndDelete({'Course.name': req.body.name});
        res.json({
            'message': 'Course deleted successfully',
            'course details': course.Course
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})

module.exports = app;

function formatCourseData(course) {
    const courseName = course['name'] || 'Not Available';
    const status = course['status'] || 'Not Available';
    const courseCode = course['courseCode'] || 'Not Available';
    const credits = course['credits'] || 0;
    const enrollmentPeriod = course['enrollmentPeriod'] || 'Not Available';
    const dayTime = course['dayTime'] || 'Not Available';
    const room = course['room'] || 'Not Available';
    const instructor = course['instructor'] || 'Not Available';
    const description = course['description'] || 'Not Available';

    return {
        'name': courseName,
        'status': status,
        'courseCode': courseCode,
        'credits': credits,
        'enrollmentPeriod': enrollmentPeriod,
        'dayTime': dayTime,
        'room': room,
        'instructor': instructor,
        'description': description
    };
}

function updateCourseData(course, updates) {
    if (updates['name']) {
        course['name'] = updates['name'];
    }
    if (updates['status']) {
        course['status'] = updates['status'];
    }
    if (updates['courseCode']) {
        course['courseCode'] = updates['courseCode'];
    }
    if (updates['credits']) {
        course['credits'] = updates['credits'];
    }
    if (updates['enrollmentPeriod']) {
        course['enrollmentPeriod'] = updates['enrollmentPeriod'];
    }
    if (updates['dayTime']) {
        course['dayTime'] = updates['dayTime'];
    }
    if (updates['room']) {
        course['room'] = updates['room'];
    }
    if (updates['instructor']) {
        course['instructor'] = updates['instructor'];
    }
    if (updates['description']) {
        course['description'] = updates['description'];
    }
    return course;
}

async function findRelatedCourses(name) {
    const relatedCourses = [];
    const dbCourses = await Courses.find({});
    dbCourses.forEach(course => {
        if (course.Course['name'].includes(name)) {
            relatedCourses.push(course.Course)
        }
    });
    return relatedCourses;
}

async function jsonToDatabase () {
    const dbCourses = await Courses.find({});
    dbCourseNames = [];
    dbCourses.forEach(course => {
        dbCourseNames.push(course.Course['name'])
    });

    for (const key in allCourses['Name']) {
        if (dbCourseNames.includes(allCourses['Name'][key])) {
            console.log(`${allCourses['Name'][key]} already exists in the database`)
            continue;
        } 
        else {
            const course = {
                'name': allCourses['Name'][key],
                'status': allCourses['Status'][key],
                'courseCode': allCourses['Course Code'][key],
                'credits': allCourses['Credits'][key],
                'enrollmentPeriod': allCourses['Enrollment Period'][key],
                'dayTime': allCourses['Day Time'][key],
                'room': allCourses['Room'][key],
                'instructor': allCourses['Instructor'][key],
                'description': allCourses['Description'][key],
                'ratings': {
                    'ratingTotal': 0,
                    'ratingCount': 0
                }
            };
            const newCourse = new Courses({
                'Course': course
            });
            newCourse.save();
        }
    }
}
