import React, { useState, useEffect } from "react";
import "../../styles/components/MealsTable.scss";

const MealsTable = ({ onSubmit, onCloseForm, initialData }) => {
  const [id, setId] = useState("");
  const [tenant_name, setTenantname] = useState("");
  const [breakfast, setBreakfast] = useState("No");
  const [lunch, setLunch] = useState("No");
  const [dinner, setDinner] = useState("No");
  const [date, setDate] = useState("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      console.log("Initial Data:", initialData); // Debugging line
      setId(initialData.id || "");
      setTenantname(initialData.tenant_name || "");
      setBreakfast(initialData.breakfast || "No");
      setLunch(initialData.lunch || "No");
      setDinner(initialData.dinner || "No");

      if (initialData.date) {
        const formattedDate = formatDate(initialData.date);
        console.log("Formatted Date:", formattedDate); // Debugging line
        setDate(formattedDate);
      } else {
        setDate("");
      }

      setComments(initialData.comments || "");
    }
  }, [initialData]);

  const formatDate = (dateString) => {
    // Handle the non-ISO date format (e.g., "16-10-2017")
    const [day, month, year] = dateString.split("-");
    if (!day || !month || !year) {
      console.error("Invalid Date:", dateString); // Debugging line
      return "";
    }
    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime())) {
      console.error("Invalid Date:", dateString); // Debugging line
      return "";
    }
    const formattedYear = date.getFullYear();
    const formattedMonth = String(date.getMonth() + 1).padStart(2, '0');
    const formattedDay = String(date.getDate()).padStart(2, '0');
    return `${formattedYear}-${formattedMonth}-${formattedDay}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    onSubmit({
      id: id,
      tenant_name: tenant_name,
      breakfast: breakfast,
      lunch: lunch,
      dinner: dinner,
      date: date,
      comments: comments
    });

    alert(initialData ? "Meals updated Successfully" : "Meals added Successfully");

    setLoading(false);

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="meals_1">
      <div className="meals_2">
        <h2>{initialData ? "Edit Meal" : "Add Meal"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="meal-option">
            <input
              type="checkbox"
              id="breakfast"
              className="input1"
              checked={breakfast === "Yes"}
              onChange={(e) => setBreakfast(e.target.checked ? "Yes" : "No")}
            />
            <label className="abc" htmlFor="breakfast">Breakfast</label>
          </div>
          <div className="meal-option">
            <input
              type="checkbox"
              id="lunch"
              className="input2"
              checked={lunch === "Yes"}
              onChange={(e) => setLunch(e.target.checked ? "Yes" : "No")}
            />
            <label className="def" htmlFor="lunch">Lunch</label>
          </div>
          <div className="meal-option">
            <input
              type="checkbox"
              id="dinner"
              className="input3"
              checked={dinner === "Yes"}
              onChange={(e) => setDinner(e.target.checked ? "Yes" : "No")}
            />
            <label className="ghi" htmlFor="dinner">Dinner</label>
          </div>
          <div>
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <label htmlFor="comments">Comments:</label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            required
          ></textarea>
          <div className="form_div">
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : initialData ? "Update" : "Submit"}
            </button>
            <button className="close-button" type="button" onClick={onCloseForm}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MealsTable;
