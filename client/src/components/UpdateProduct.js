import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const UpdateProduct = () => {
  const { productId } = useParams(); // Get productId from route params
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || {
    id: '',
    name: '',
    price: '',
    description: '',
    photo: ''
  });
  const [imageFile, setImageFile] = useState(null); // State to hold the uploaded image file

  useEffect(() => {
    if (!location.state?.product) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/products/${productId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          setProduct(response.data);
        } catch (err) {
          console.error('Error fetching product:', err);
        }
      };
      fetchProduct();
    }
  }, [productId, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('price', product.price);
      formData.append('description', product.description);
      if (imageFile) {
        formData.append('photo', imageFile);
      }

      await axios.put(`http://localhost:5000/products/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Product updated successfully!');
      navigate('/products'); // Redirect to the products table after successful update
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Product</h2>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
          <input type="text" id="name" name="name" value={product.name} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full" />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price:</label>
          <input type="text" id="price" name="price" value={product.price} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full" />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
          <textarea id="description" name="description" value={product.description} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full"></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Upload Photo:</label>
          <input type="file" id="photo" name="photo" onChange={handleImageChange} className="border border-gray-300 rounded-md p-2 w-full" />
        </div>
        <div className="flex justify-center">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">Update</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
