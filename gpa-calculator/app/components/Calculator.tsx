import { useState } from "react";
import { Gpa } from "./Gpa";

interface Course {
  name: string;
  grade: string;
  credits: string;
  selected: boolean;
}

export const Calculator = () => {
  const initialCourses: Course[] = [
    { name: "Course 1", grade: "", credits: "", selected: true },
    { name: "Course 2", grade: "", credits: "", selected: true },
    { name: "Course 3", grade: "", credits: "", selected: true },
  ];

  const [allCourses, setAllCourses] = useState<Course[]>(initialCourses);
  const [gpa, setGpa] = useState(0);

  const handleChange = (index: number, field: keyof Course, value: string | boolean) => {
    const updatedCourses = [...allCourses];
    updatedCourses[index][field] = value as never;
    setAllCourses(updatedCourses);
  };

  const handleRemove = (index: number) => {
    const updatedCourses = allCourses.filter((_, i) => i !== index);
    setAllCourses(updatedCourses);
  };

  const handleAddRow = () => {
    const newRow: Course = {
      name: `Course ${allCourses.length + 1}`,
      grade: "",
      credits: "",
      selected: true,
    };
    setAllCourses([...allCourses, newRow]);
  };

  const handleReset = () => {
    setGpa(0);
    setAllCourses(initialCourses);
  };

  const handleCalculate = () => {
    let totalGradePoints = 0;
    const gradeMap: { [key: string]: number } = {
        "A": 4,
        "B+": 3.5,
        "B": 3,
        "C+": 2.5,
        "C": 2,
        "D": 1,
        "F": 0,
      };
    
    let totalCredits = 0;
      
    allCourses.forEach((course) => {
        if (course.selected && course.grade in gradeMap && course.credits != "") {
            totalGradePoints += gradeMap[course.grade] * parseInt(course.credits);
            totalCredits += parseInt(course.credits);
        }
    });
    const calculatedGpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    setGpa(calculatedGpa);
    
  };

  const grades = ["A", "B+", "B","C+","C", "D", "F"];

  return (
    <>
      <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Select</th>
            <th className="py-2 px-4 border">Course</th>
            <th className="py-2 px-4 border">Grade</th>
            <th className="py-2 px-4 border">Credits</th>
            <th className="py-2 px-4 border">Remove</th>
          </tr>
        </thead>
        <tbody>
          {allCourses.map((course, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border">
                <input
                  type="checkbox"
                  checked={course.selected}
                  onChange={(e) => handleChange(index, "selected", e.target.checked)}
                />
              </td>
              <td className="py-2 px-4 border">
                <input
                  type="text"
                  className="border p-2 w-full"
                  placeholder={`Course ${index + 1}`}
                  value={course.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                />
              </td>
              <td className="py-2 px-4 border">
                <select
                  className="border p-2 w-full"
                  value={course.grade}
                  onChange={(e) => handleChange(index, "grade", e.target.value)}
                >
                  <option value="" disabled>
                    Select Grade
                  </option>
                  {grades.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-2 px-4 border">
                <input
                  type="number"
                  className="border p-2 w-full"
                  placeholder="Credits"
                  value={course.credits}
                  onChange={(e) => handleChange(index, "credits", e.target.value)}
                />
              </td>
              <td className="py-2 px-4 border">
                <button
                  className="bg-red-500 text-white px-4 py-2"
                  onClick={() => handleRemove(index)}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center">
        <button
          className="bg-green-500 text-white px-4 py-2 mr-2"
          onClick={handleAddRow}
        >
          Add Row
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 mr-2"
          onClick={handleCalculate}
        >
          Calculate
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
      <Gpa gpaVal={gpa} />
    </>
  );
};
