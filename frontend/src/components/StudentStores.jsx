import { useEffect, useState } from "react";

function StudentStores({ studentId }) {

    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const [items, setItems] = useState([]);
    const [error, setError] = useState("");


    async function loadStores() {

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/stores`
            );

            const data = await response.json();

            if (!response.ok) {
                setError("Unable to load stores.");
                return;
            }

            setStores(data);

        } catch (error) {

            console.error("Error loading stores:", error);
            setError("Unable to connect to the server.");

        }

    }


    async function loadItems(storeId) {

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/stores/${storeId}/items`
            );

            const data = await response.json();

            if (!response.ok) {
                setError("Unable to load store items.");
                return;
            }

            setItems(data);

        } catch (error) {

            console.error("Error loading store items:", error);
            setError("Unable to connect to the server.");

        }

    }


    useEffect(() => {

        loadStores();

    }, []);


    function openStore(store) {

        setSelectedStore(store);
        setError("");
        loadItems(store.id);

    }


    function closeStore() {

        setSelectedStore(null);
        setItems([]);

    }


    async function purchaseItem(item) {

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/purchase-request`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        student_id: studentId,
                        reward_item_id: item.id
                    })

                }
            );

            const data = await response.json();

            if (!response.ok || data.error) {

                alert(
                    data.error ||
                    "Unable to submit purchase request."
                );

                return;

            }

            alert(
                `Purchase request submitted for ${item.name}.`
            );

        } catch (error) {

            console.error(
                "Error submitting purchase request:",
                error
            );

            alert(
                "Unable to connect to the server."
            );

        }

    }


    return (

        <div>

            {error && (
                <p>
                    {error}
                </p>
            )}


            {!selectedStore && (

                <div className="store-grid">

                    {stores.map((store) => (

                        <div
                            key={store.id}
                            className="card"
                            onClick={() => openStore(store)}
                        >

                            <h3>
                                {store.name}
                            </h3>

                            <p>
                                {store.description}
                            </p>

                            <p>
                                Click to view rewards
                            </p>

                        </div>

                    ))}


                    {stores.length === 0 && !error && (

                        <p>
                            No stores are currently available.
                        </p>

                    )}

                </div>

            )}


            {selectedStore && (

                <div>

                    <button onClick={closeStore}>
                        Back to Stores
                    </button>


                    <h2>
                        {selectedStore.name} Rewards
                    </h2>


                    {items.length === 0 ? (

                        <p>
                            No rewards are currently available
                            in this store.
                        </p>

                    ) : (

                        <table className="student-table">

                            <thead>

                                <tr>

                                    <th>
                                        Reward
                                    </th>

                                    <th>
                                        Description
                                    </th>

                                    <th>
                                        Cost
                                    </th>

                                    <th>
                                        Purchase
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {items.map((item) => (

                                    <tr key={item.id}>

                                        <td>
                                            {item.name}
                                        </td>

                                        <td>
                                            {item.description}
                                        </td>

                                        <td>
                                            {item.cost} points
                                        </td>

                                        <td>

                                            <button
                                                onClick={() =>
                                                    purchaseItem(item)
                                                }
                                            >
                                                Purchase
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

                </div>

            )}

        </div>

    );

}

export default StudentStores;
