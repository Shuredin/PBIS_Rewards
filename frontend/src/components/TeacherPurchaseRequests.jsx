import { useEffect, useState } from "react";


function TeacherPurchaseRequests() {


  const [requests, setRequests] = useState([]);

  const [sortColumn, setSortColumn] = useState("requested_date");

  const [sortDirection, setSortDirection] = useState("desc");



  async function loadRequests() {

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/purchase-requests`
    );


    const data = await response.json();

    setRequests(data);

  }



  useEffect(() => {

    loadRequests();

  }, []);




  async function updateRequest(id, status) {

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/purchase-requests/${id}?status=${status}`,
      {
        method: "PUT"
      }
    );


    const data = await response.json();



    if (!response.ok || data.error) {

      alert(
        data.error || "Unable to update purchase request."
      );

      return;

    }


    await loadRequests();

  }

function handleSort(column) {

  if (sortColumn === column) {

    setSortDirection(
      sortDirection === "asc"
        ? "desc"
        : "asc"
    );

  } else {

    setSortColumn(column);

    setSortDirection("asc");

  }

}

function getSortArrow(column) {
    if (sortColumn !== column) {
        return "↕";
    }

    return sortDirection === "asc"
        ? "↑"
        : "↓";
}

const sortedRequests = [...requests].sort((a, b) => {


  let valueA;
  let valueB;


  switch(sortColumn) {


    case "student":

      valueA = `${a.student.last_name} ${a.student.first_name}`;

      valueB = `${b.student.last_name} ${b.student.first_name}`;

      break;



    case "reward":

      valueA = a.reward_item.name;

      valueB = b.reward_item.name;

      break;



    case "cost":

      valueA = a.reward_item.cost;

      valueB = b.reward_item.cost;

      break;



    case "requested_date":

      valueA = new Date(a.requested_date);

      valueB = new Date(b.requested_date);

      break;



    case "status":

      valueA = a.status;

      valueB = b.status;

      break;



    default:

      return 0;

  }



  if (typeof valueA === "string") {

    return sortDirection === "asc"

      ? valueA.localeCompare(valueB)

      : valueB.localeCompare(valueA);

  }



  return sortDirection === "asc"

    ? valueA - valueB

    : valueB - valueA;


});


  return (

    <div className="expanded-panel">


      <h2>
        Purchase Requests
      </h2>



      {
        requests.length === 0 ? (

          <p>
            No purchase requests.
          </p>

        ) : (


          <table className="student-table">


            <thead>

              <tr>

                  <th onClick={() => handleSort("student")}>
                      Student {getSortArrow("student")}
                  </th>

                  <th onClick={() => handleSort("reward")}>
                      Reward {getSortArrow("reward")}
                  </th>

                  <th onClick={() => handleSort("cost")}>
                      Cost {getSortArrow("cost")}
                  </th>

                  <th onClick={() => handleSort("requested_date")}>
                      Date Requested {getSortArrow("requested_date")}
                  </th>

                  <th onClick={() => handleSort("status")}>
                      Status {getSortArrow("status")}
                  </th>

                  <th>
                      Actions
                  </th>

              </tr>

          </thead>



            <tbody>


              {
                sortedRequests.map((request) => (


                  <tr key={request.id}>


                    <td>

                      {request.student.first_name}

                      {" "}

                      {request.student.last_name}

                    </td>



                    <td>

                      {request.reward_item.name}

                    </td>



                    <td>

                      {request.reward_item.cost}

                      {" "}

                      points

                    </td>



                    <td>

                      {
                        new Date(
                          request.requested_date
                        ).toLocaleDateString()
                      }

                    </td>



                    <td>

                      {request.status}

                    </td>



                    <td>


                      {
                        request.status === "Pending" && (

                          <>


                            <button

                              onClick={() => {

                                if (

                                  window.confirm(

                                    `Approve ${request.student.first_name}'s request for ${request.reward_item.name} for ${request.reward_item.cost} points?`

                                  )

                                ) {

                                  updateRequest(

                                    request.id,

                                    "Approved"

                                  );

                                }

                              }}

                            >

                              Approve

                            </button>



                            <button

                              onClick={() => {

                                if (

                                  window.confirm(

                                    `Deny ${request.student.first_name}'s request for ${request.reward_item.name}?`

                                  )

                                ) {

                                  updateRequest(

                                    request.id,

                                    "Denied"

                                  );

                                }

                              }}

                            >

                              Deny

                            </button>


                          </>

                        )

                      }


                    </td>


                  </tr>


                ))

              }


            </tbody>


          </table>


        )

      }


    </div>

  );

}


export default TeacherPurchaseRequests;