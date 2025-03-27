import React, { useEffect, useState, useRef } from 'react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

import { Upload } from 'lucide-react';

function AdminPage() {

  const [items, setItems] = useState([]);

  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryIds, setCategoryIds] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const fileInputRef = useRef(null);

  //Fetch items
  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu/items');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  //Create / Update item
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);

      // Append category IDs
      categoryIds.forEach((id) => {
        if (id) formData.append('categoryIds', id);
      });

      // Append image if it exists
      if (imageFile) {
        formData.append('image', imageFile);
      }

      let response;
      if (editId) {
        response = await fetch(`/api/menu/${editId}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        response = await fetch('/api/menu/', {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // After success, reload items and clear the form
      fetchMenuItems();
      clearForm();
    } catch (error) {
      console.error('Failed to create/update menu item:', error);
    }
  };

  //Delete item
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      fetchMenuItems();
    } catch (error) {
      console.error('Failed to delete menu item:', error);
    }
  };

  //Edit item (fill form)
  const handleEdit = (item) => {
    setEditId(item.id);
    setName(item.name || '');
    setDescription(item.description || '');
    setPrice(item.price || '');
    setCategoryIds(item.categoryIds || []);
    setImageFile(null);
  };

  // Clear form
  const clearForm = () => {
    setEditId(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategoryIds([]);
    setImageFile(null);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  // Convert category IDs array to a comma-separated string
  const categoryIdsStr = categoryIds.join(',');

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Page</h1>

      {/* Card for the "Create/Update Menu Item" form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editId ? 'Edit Menu Item' : 'Create Menu Item'}</CardTitle>
          <CardDescription>
            {editId
              ? 'Update an existing menu item.'
              : 'Add a new menu item to the system.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="grid w-full items-center gap-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Margherita Pizza"
              />
            </div>

            {/* Description */}
            <div className="grid w-full items-center gap-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. New York style pizza with fresh mozzarella, tomatoes, and basil"
              />
            </div>

            {/* Price */}
            <div className="grid w-full items-center gap-1">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 10.99"
              />
            </div>

            {/* Category IDs */}
            <div className="grid w-full items-center gap-1">
              <Label htmlFor="categories">Category IDs (comma-separated)</Label>
              <Input
                id="categories"
                value={categoryIdsStr}
                onChange={(e) => {
                  const arr = e.target.value
                    .split(',')
                    .map((id) => id.trim())
                    .filter((id) => id !== '');
                  setCategoryIds(arr);
                }}
                placeholder="e.g. 1,3,5"
              />
            </div>

            {/* Image (button-triggered file input) */}
            <div className="grid w-full items-center gap-1">
              <Label>Image</Label>
              <div className="flex items-center gap-2">
                {/* Button to trigger hidden file input */}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
                {imageFile && (
                  <span className="text-sm text-gray-600">{imageFile.name}</span>
                )}
              </div>
              {/* Hidden file input */}
              <input
                id="image"
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
            </div>

            {/* Submit and Cancel buttons */}
            <div className="flex gap-2 pt-4">
              <Button type="submit">
                {editId ? 'Update' : 'Create'}
              </Button>
              {editId && (
                <Button variant="outline" onClick={clearForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Section to display all existing menu items */}
      <div>
        <h2 className="text-xl font-bold mb-4">All Menu Items</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>
                  {item.name} (￥{item.price})
                </CardTitle>
                {item.description && (
                  <CardDescription>{item.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {item.imagePath && (
                  <img
                    src={item.imagePath}
                    alt={item.name}
                    className="max-w-full h-auto rounded"
                  />
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button onClick={() => handleEdit(item)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(item.id)}>
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
