import { useEffect, useState } from "react";


function TeacherStorefront() {


  const [items, setItems] = useState([]);

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [cost, setCost] = useState("");

  const [editingItem, setEditingItem] = useState(null);


  async function loadItems() {

    const response = await fetch(
      "http://127.0.0.1:8000/storefront/items"
    );


    const data = await response.json();

    setItems(data);

  }



  useEffect(() => {

    loadItems();

  }, []);




  async function createItem() {


    await fetch(
      "http://127.0.0.1:8000/storefront/items",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },


        body: JSON.stringify({

          name: name,

          description: description,

          cost: Number(cost)

        })

      }

    );


    setName("");

    setDescription("");

    setCost("");


    loadItems();


  }


async function deleteItem(item) {

  const confirmed = window.confirm(
    `Remove "${item.name}" from your storefront?`
  );

  if (!confirmed) {
    return;
  }

  await fetch(
    `http://127.0.0.1:8000/storefront/items/${item.id}`,
    {
      method: "DELETE"
    }
  );

  loadItems();

}

function editItem(item) {

  setEditingItem(item);

  setName(item.name);

  setDescription(item.description);

  setCost(item.cost);

}

async function updateItem() {

  const response = await fetch(
    `http://127.0.0.1:8000/storefront/items/${editingItem.id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({

        name: name,

        description: description,

        cost: Number(cost)

      })

    }
  );


  if (response.ok) {

    setEditingItem(null);

    setName("");

    setDescription("");

    setCost("");

    loadItems();

  } else {

    const error = await response.text();

    console.log("Update failed:", error);

  }

}


  return (

    <div className="expanded-panel">


      <h2>
        My Storefront
      </h2>



      <h3>
        Add Reward Item
      </h3>



      <input

        placeholder="Item name"

        value={name}

        onChange={(e)=>setName(e.target.value)}

      />



      <input

        placeholder="Description"

        value={description}

        onChange={(e)=>setDescription(e.target.value)}

      />



      <input

        type="number"

        placeholder="Point Cost"

        value={cost}

        onChange={(e)=>setCost(e.target.value)}

      />



      <button
        onClick={
            editingItem
            ? updateItem
            : createItem
        }
        >

        {
        editingItem
            ? "Update Item"
            : "Add Item"
        }

    </button>




      <h3>
        Current Items
      </h3>



      <table className="student-table">

        <thead>

            <tr>

            <th>
                Item
            </th>

            <th>
                Description
            </th>

            <th>
                Cost
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
            items.map((item)=>(

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
                    {
                    item.active
                        ? "Active"
                        : "Inactive"
                    }
                </td>

                <td>

                <button
                    onClick={() => editItem(item)}
                >
                    Edit
                </button>


                <button
                    onClick={() => deleteItem(item)}
                >
                    Delete
                </button>

                </td>

                </tr>

            ))
            }

        </tbody>

        </table>


    </div>

  );


}


export default TeacherStorefront;