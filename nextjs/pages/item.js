// pages/items.js
import { useState, useEffect } from "react";
import axios from "axios";

export default function Items() {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null); // Yangilanish uchun tanlangan item
  const [deleteId, setDeleteId] = useState(""); // O'chirish uchun id

  // Itemlarni olish funksiyasi
  const fetchItems = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/items");
      setItems(response.data); // Itemlarni ro'yxatga olish
    } catch (error) {
      console.error("Xatolik yuz berdi:", error.response?.data || error.message);
    }
  };

  // Itemni yangilash funktsiyasi
  const updateItem = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/items/${editItem.id}`,
        editItem
      );
      setItems(
        items.map((item) =>
          item.id === editItem.id ? response.data : item
        )
      );
      setEditItem(null); // Formani tozalash
    } catch (error) {
      console.error("Xatolik yuz berdi:", error.response?.data || error.message);
    }
  };

  // Itemni o'chirish funktsiyasi
  const deleteItem = async () => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/items/${deleteId}`
      );
      setItems(items.filter((item) => item.id !== deleteId)); // Ro'yxatdan o'chirish
      setDeleteId(""); // O'chirish uchun idni tozalash
    } catch (error) {
      console.error("Xatolik yuz berdi:", error.response?.data || error.message);
    }
  };

  // useEffect hook - sahifa yuklanganda itemlarni olish
  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div>
      <h1>Items List</h1>

      {/* Itemlarni ko'rsatish */}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - {item.price}$
            <button onClick={() => setDeleteId(item.id)}>Delete</button>
            <button onClick={() => setEditItem(item)}>Edit</button>
          </li>
        ))}
      </ul>

      {/* Edit Item Form */}
      {editItem && (
        <div>
          <h2>Edit Item</h2>
          <input
            type="number"
            value={editItem.id}
            onChange={(e) => setEditItem({ ...editItem, id: e.target.value })}
            placeholder="ID"
          />
          <input
            type="text"
            value={editItem.name}
            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
            placeholder="Name"
          />
          <input
            type="text"
            value={editItem.description}
            onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
            placeholder="Description"
          />
          <input
            type="number"
            value={editItem.price}
            onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
            placeholder="Price"
          />
          <button onClick={updateItem}>Update Item</button>
          <button onClick={() => setEditItem(null)}>Cancel</button>
        </div>
      )}

      {/* Delete Item Confirmation */}
      {deleteId && (
        <div>
          <h2>Delete Item</h2>
          <p>Are you sure you want to delete item with ID {deleteId}?</p>
          <button onClick={deleteItem}>Delete</button>
          <button onClick={() => setDeleteId("")}>Cancel</button>
        </div>
      )}
    </div>
  );
}
