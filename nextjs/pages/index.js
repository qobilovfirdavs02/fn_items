import { useState, useEffect } from "react";
import axios from "axios";

// FastAPI URL
const API_URL = "http://127.0.0.1:8000/items";

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    on_offer: false,
  });
  const [updatedItem, setUpdatedItem] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    on_offer: false,
  });
  const [showItems, setShowItems] = useState(false);  // Show/Hide Items holati

  // Itemlarni olish
  const fetchItems = async () => {
    try {
      const response = await axios.get(API_URL); // GET so'rovi
      setItems(response.data); // Javobni olish va holatda saqlash
    } catch (error) {
      console.error("Xatolik yuz berdi:", error.message);
    }
  };

  // Yangi item qo'shish
  const addItem = async () => {
    if (!newItem.name || !newItem.price) {
      return;
    }

    try {
      const response = await axios.post(API_URL, newItem); // POST so'rovi
      setItems((prevItems) => [...prevItems, response.data]); // Yangi itemni qo'shish
      setNewItem({
        id: "",
        name: "",
        description: "",
        price: "",
        on_offer: false,
      }); // Inputni tozalash
    } catch (error) {
      console.error("Xatolik yuz berdi:", error.message);
    }
  };

  // Itemni yangilash
  const updateItem = async () => {
    if (!updatedItem.id) {
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/${updatedItem.id}`,
        updatedItem
      ); // PUT so'rovi
      const updatedItems = items.map((item) =>
        item.id === updatedItem.id ? response.data : item
      );
      setItems(updatedItems); // Yangilangan itemni qo'shish
      setUpdatedItem({
        id: "",
        name: "",
        description: "",
        price: "",
        on_offer: false,
      }); // Inputni tozalash
    } catch (error) {
      console.error("Xatolik yuz berdi:", error.message);
    }
  };

  // Itemni o'chirish
  const deleteItem = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`); // DELETE so'rovi
      setItems(items.filter((item) => item.id !== id)); // O'chirilgan itemni ro'yxatdan olib tashlash
    } catch (error) {
      console.error("Xatolik yuz berdi:", error.message);
    }
  };

  useEffect(() => {
    fetchItems(); // Komponent yuklanganda itemlarni olish
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Item List</h1>
      
      {/* Show Items tugmasi */}
      <button onClick={() => setShowItems(!showItems)}>
        {showItems ? "Hide Items" : "Show Items"}
      </button>

      {/* Itemlar ro'yxati faqat showItems holati true bo'lsa ko'rsatiladi */}
      {showItems && (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price}
              <button onClick={() => deleteItem(item.id)}>Delete</button>
              <button
                onClick={() =>
                  setUpdatedItem({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    on_offer: item.on_offer,
                  })
                }
              >
                Update
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2>Add New Item</h2>
      <input
        type="number"
        value={newItem.id}
        onChange={(e) => setNewItem({ ...newItem, id: e.target.value })}
        placeholder="Item ID"
      />
      <input
        type="text"
        value={newItem.name}
        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        placeholder="Name"
      />
      <input
        type="text"
        value={newItem.description}
        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
        placeholder="Description"
      />
      <input
        type="number"
        value={newItem.price}
        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        placeholder="Price"
      />
      <button onClick={addItem}>Add Item</button>

      <h2>Update Item</h2>
      <input
        type="number"
        value={updatedItem.id}
        onChange={(e) =>
          setUpdatedItem({ ...updatedItem, id: e.target.value })
        }
        placeholder="Item ID"
      />
      <input
        type="text"
        value={updatedItem.name}
        onChange={(e) =>
          setUpdatedItem({ ...updatedItem, name: e.target.value })
        }
        placeholder="Name"
      />
      <input
        type="text"
        value={updatedItem.description}
        onChange={(e) =>
          setUpdatedItem({ ...updatedItem, description: e.target.value })
        }
        placeholder="Description"
      />
      <input
        type="number"
        value={updatedItem.price}
        onChange={(e) =>
          setUpdatedItem({ ...updatedItem, price: e.target.value })
        }
        placeholder="Price"
      />
      <button onClick={updateItem}>Update Item</button>

      <h2>Delete Items</h2>
      <input
        type="number"
        value={updatedItem.id}
        onChange={(e) =>
          setUpdatedItem({ ...updatedItem, id: e.target.value })
        }
        placeholder="Item ID"
      />
      <button onClick={() => deleteItem(updatedItem.id)}>Delete Item</button>
    </div>
  );
}
