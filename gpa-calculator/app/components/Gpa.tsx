interface GpaProps {
    gpaVal: number;
  }
  
  export const Gpa: React.FC<GpaProps> = ({ gpaVal }) => {
    return (
      <div className="mt-4 text-center">
        <h1 className="text-xl font-bold">GPA</h1>
        <h1 className="text-lg">
          {gpaVal !== 0 ? gpaVal.toFixed(2) : ""}
        </h1>
      </div>
    );
  };
  