import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../src/App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, description: '', image: '' });
  const [editModalOpen, setEditModalOpen] = useState(false); // State for edit modal

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async () => {
    try {
      await axios.post('http://localhost:5000/api/products', newProduct);
      setNewProduct({ name: '', price: 0, description: '', image: '' });
      fetchProducts(); // Fetch updated product list
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const editProduct = async (id) => {
    try {
      // Fetch existing product data for editing
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      const existingProduct = response.data;
  
      // Check if existingProduct is not empty before updating state
      if (existingProduct) {
        // Populate the form fields with existing product data for editing
        setNewProduct(existingProduct);
  
        // Open the edit modal
        setEditModalOpen(true);
      } else {
        console.error('Product not found.');
      }
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };
  

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts(); // Fetch updated product list
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container"> {/* Added Bootstrap container class */}
      <h2 className="mt-5 mb-3">Ой тамчы</h2>
      <form onSubmit={(e) => { e.preventDefault(); addProduct(); }} className="mb-4">
        <div className="mb-3">
          <input type="text" name="name" placeholder="Аталышы" value={newProduct.name} onChange={handleInputChange} className="form-control" />
        </div>
        <div className="mb-3">
          <input type="text" name="description" placeholder="Мүнөздөмө" value={newProduct.description} onChange={handleInputChange} className="form-control" />
        </div>
        <div className="mb-3">
          <input type="text" name="image" placeholder="Сүрөт" value={newProduct.image} onChange={handleInputChange} className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary">Кошуу</button>
      </form>
      
      <div className="product_block">
        {products.map(product => (
          <div key={product.id} className='card'>
            <img src={product.image} alt={product.name} className="img-fluid" />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <button onClick={() => editProduct(product._id)} className="btn btn-secondary">Edit</button>
            <button onClick={() => deleteProduct(product._id)} className="btn btn-danger">Delete</button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setEditModalOpen(true)}>&times;</span>
            <h2>Edit Product</h2>
            {/* Add your edit form or modal content here */}
            <form onSubmit={(e) => { e.preventDefault(); /* Handle edit form submission */ }}>
              <div className="mb-3">
                <input type="text" name="name" placeholder="Аталышы" value={newProduct.name} onChange={handleInputChange} className="form-control" />
              </div>
              <div className="mb-3">
                <input type="text" name="description" placeholder="Мүнөздөмө" value={newProduct.description} onChange={handleInputChange} className="form-control" />
              </div>
              <div className="mb-3">
                <input type="text" name="image" placeholder="Сүрөт" value={newProduct.image} onChange={handleInputChange} className="form-control" />
              </div>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
