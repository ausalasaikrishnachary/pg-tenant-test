import React, { useState, useEffect } from "react";
import Sidebar from "../../shared/Sidebar";
import MealsTable from "./MealsTable"
import { TENANT_MEALS_GET_URL, TENANT_MEALS_UPDATE_URL, TENANT_MEALS_POST_URL } from "../../services/ApiUrls";
import { useAuth } from './../../context/AuthContext';
import { PDFDownloadLink, Document, Page, Text } from "@react-pdf/renderer";
import { faFileExport, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { View, StyleSheet } from "@react-pdf/renderer";
import "../../styles/components/Meals.scss";

const MealsDetails = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedMeal, setselectedMeal] = useState(null);
  const [meals, setMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mealsPerPage] = useState(8);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            manager_email: user.manager_email,
            building_name: user.building_name,
            tenant_mobile: user.mobile,
          }),
        };
        const response = await fetch(TENANT_MEALS_GET_URL, requestOptions);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);

  const handleOpenForm = (meal = null) => {
    setselectedMeal(meal);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setselectedMeal(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tenant_mobile: user.mobile,
          tenant_email: user.email,
          manager_email: user.manager_email,
          manager_mobile: user.manager_mobile,
          building_name: user.building_name,
          tenant_name: user.name,
        }),
      };

      const url = selectedMeal
        ? TENANT_MEALS_UPDATE_URL
        : TENANT_MEALS_POST_URL;

      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (selectedMeal) {
        setMeals((prev) =>
          prev.map((meal) =>
            meal.id === selectedMeal.id ? data : meal
          )
        );
      } else {
        setMeals([...meals, data]);
      }
      handleCloseForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };


  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this complaint?");
      if (confirmDelete) {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        };

        const response = await fetch("https://iiiqbets.com/pg-management/delete-Meals-API.php", requestOptions);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        setMeals(meals.filter((meal) => meal.id !== id));
      }
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };


  const filteredMeals = meals.filter((meal) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      (meal.id && meal.id.toLowerCase().includes(lowerSearchTerm)) ||
      (meal.breakfast && meal.breakfast.toLowerCase().includes(lowerSearchTerm)) ||
      (meal.lunch && meal.lunch.toLowerCase().includes(lowerSearchTerm)) ||
      (meal.dinner && meal.dinner.toLowerCase().includes(lowerSearchTerm)) ||
      (meal.date && meal.date.toLowerCase().includes(lowerSearchTerm))
    );
  });



  const styles = StyleSheet.create({
    table: {
      display: "table",
      width: "auto",
      borderStyle: "solid",
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: {
      flexDirection: "row",
    },
    tableCol: {
      width: "20%", // Default width for most columns
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    idCol: {
      width: "10%", // Reduced width for ID column
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    descriptionCol: {
      width: "50%", // Increased width for Description column
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCell: {
      margin: "auto",
      marginTop: 5,
      fontSize: 10,
    },
  });

  const MyDocument = ({ meals }) => (
    <Document>
      <Page style={{ padding: 10 }}>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.idCol}>
              <Text style={styles.tableCell}>Id</Text>
            </View>

            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>breakfast</Text>
            </View>
            <View style={styles.descriptionCol}>
              <Text style={styles.tableCell}>lunch</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>dinner</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>comments</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>date</Text>
            </View>
          </View>
          {meals.map((meal, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.idCol}>
                <Text style={styles.tableCell}>{meal.id}</Text>
              </View>

              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{meal.breakfast}</Text>
              </View>
              <View style={styles.descriptionCol}>
                <Text style={styles.tableCell}>{meal.lunch}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{meal.dinner}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{meal.comments}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{meal.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  const IndividualMealDocument = ({ meal }) => (
    <Document>
      <Page style={{ padding: 10 }}>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.idCol}>
              <Text style={styles.tableCell}>Id</Text>
            </View>

            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>breakfast</Text>
            </View>
            <View style={styles.descriptionCol}>
              <Text style={styles.tableCell}>lunch</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>dinner</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>comments</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>date</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.idCol}>
              <Text style={styles.tableCell}>{meal.id}</Text>
            </View>

            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{meal.breakfast}</Text>
            </View>
            <View style={styles.descriptionCol}>
              <Text style={styles.tableCell}>{meal.lunch}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{meal.dinner}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{meal.comments}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{meal.date}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
  const indexOfLastMeal = currentPage * mealsPerPage;
  const indexOfFirstMeal = indexOfLastMeal - mealsPerPage;
  const currentMeals = filteredMeals.slice(indexOfFirstMeal, indexOfLastMeal);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredMeals.length / mealsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div >
      <Sidebar />

      <div className="main">

        <h1 style={{ marginTop: "30px" }} className="text-center flex-grow-1">
          Meals Details
        </h1>

        <div className="container mt-4">
          <div className="pdf-container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>


            <PDFDownloadLink document={<MyDocument meals={filteredMeals} />} fileName="filtered_meals.pdf">
              {({ blob, url, loading, error }) =>
                <button className="e-button-meals" >
                  Export all as Pdf
                </button>

              }
            </PDFDownloadLink>

            <button className="meal_button_style" onClick={() => handleOpenForm()}>
              Add Meal
            </button>
          </div>
          <div className="searchbar-meals">
            <input
              type="text"
              placeholder="Search meal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar-meals"
            />
          </div>

          <div className="meals-list mt-4">
            <h2 style={{ marginBottom: "30px" }}>Meals List</h2>
            <div className="row">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>

              </div>
              {currentMeals.map((meal, index) => (
                <div key={index} className="col-lg-3 col-md-6 col-sm-6 mb-4">
                  <div className="meal-card p-3">
                    <div className="meal-card-content">
                      <div className="card-header" style={{ textAlign: "center", marginLeft: '-10px' }}>
                        ID: {meal.id}
                      </div>

                      <strong>breakfast:</strong> {meal.breakfast}
                      <br />
                      <strong>lunch:</strong> {meal.lunch}
                      <br />
                      <strong>dinner:</strong> {meal.dinner}
                      <br />
                      <strong>comments:</strong> {meal.comments}
                      <br />
                      <strong>date:</strong> {meal.date}
                    </div>
                    <div className="meal-card-actions mt-2">
                      <div className="meal-card-icons">
                        <PDFDownloadLink
                          className="pdf-link"
                          document={<IndividualMealDocument meal={meal} />}
                          fileName={`meal_${meal.id}.pdf`}
                        >
                          {({ blob, url, loading, error }) =>
                            <FontAwesomeIcon icon={faFileExport} />
                          }
                        </PDFDownloadLink>

                        <button className="btn btn-secondary blue me-2" onClick={() => handleOpenForm(meal)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>

                        <button className="btn btn-danger red" onClick={() => handleDelete(meal.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>


                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {showForm && (
              <div className="form-container">
                <MealsTable
                  onCloseForm={handleCloseForm}
                  onSubmit={handleFormSubmit}
                  initialData={selectedMeal}
                />
              </div>
            )}
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={prevPage}>
                    Prev
                  </button>
                </li>
                {[...Array(Math.ceil(filteredMeals.length / mealsPerPage)).keys()].map((number) => (
                  <li key={number} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                    <button onClick={() => paginate(number + 1)} className="page-link">
                      {number + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === Math.ceil(filteredMeals.length / mealsPerPage) ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={nextPage}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealsDetails;
