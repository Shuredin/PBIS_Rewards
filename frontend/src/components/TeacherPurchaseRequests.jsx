import { useEffect, useState } from "react";


function TeacherPurchaseRequests() {


  const [requests, setRequests] = useState([]);



  async function loadRequests() {

    const response = await fetch(
      "http://127.0.0.1:8000/purchase-requests"
    );


    const data = await response.json();

    setRequests(data);

  }



  useEffect(() => {

    loadRequests();

  }, []);




  async function updateRequest(id, status) {

    const response = await fetch(
      `http://127.0.0.1:8000/purchase-requests/${id}?status=${status}`,
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

                <th>
                  Student
                </th>


                <th>
                  Reward
                </th>


                <th>
                  Cost
                </th>


                <th>
                  Date Requested
                </th>


                <th>
                  Status
                </th>


                <th>
                  Actions
                </th>


              </tr>

            </thead>



            <tbody>


              {
                requests.map((request) => (


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