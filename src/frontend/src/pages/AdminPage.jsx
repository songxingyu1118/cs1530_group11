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
import { AdminItemCard } from '@/components/AdminItemCard';

import { Upload } from 'lucide-react';

function AdminPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  // Menu Item state
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryIds, setCategoryIds] = useState([]);
  const [categoryNamesInput, setCategoryNamesInput] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // Category state
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const fileInputRef = useRef(null);

  // -------------------- Data Fetching --------------------

  // Fetch all menu items
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

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/menu/categories?includeMenuItems=true');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  // -------------------- Menu Item Handlers --------------------

  // Handle category name input -> convert to category IDs
  const handleCategoryNamesChange = (e) => {
    const inputValue = e.target.value;
    setCategoryNamesInput(inputValue);

    // Split the string entered by the user into category names
    const names = inputValue
      .split(',')
      .map((n) => n.trim())
      .filter((n) => n !== '');

    // match categories ID
    const matchedIds = [];
    for (const n of names) {
      const found = categories.find(
        (cat) => cat.name.toLowerCase() === n.toLowerCase()
      );
      if (found) {
        matchedIds.push(found.id);
      }
    }

    setCategoryIds(matchedIds);
    fetchCategories();
    fetchMenuItems();
  };

  // Create or Update menu item
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // FormData ready to submit
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      categoryIds.forEach((id) => formData.append('categoryIds', id));
      if (imageFile) {
        formData.append('image', imageFile);
      }

      let response;
      if (editId) {
        // Update existing item
        response = await fetch(`/api/menu/${editId}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        // Create new item
        response = await fetch('/api/menu/', {
          method: 'POST',
          body: formData
        });
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // clean form
      fetchMenuItems();
      fetchCategories();
      clearForm();
    } catch (error) {
      console.error('Failed to create/update menu item:', error);
    }
  };

  // Edit menu item (fill form with existing data)
  const handleEdit = (item) => {
    setEditId(item.id);
    setName(item.name || '');
    setDescription(item.description || '');
    setPrice(item.price || '');

    if (item.categoryIds) {
      setCategoryIds(item.categoryIds);
      // convert categoryIds to a name, concatenated with commas and backfilled into the input box
      const names = item.categoryIds
        .map((id) => {
          const cat = categories.find((c) => c.id === id);
          return cat ? cat.name : '';
        })
        .filter((name) => name !== '')
        .join(', ');
      setCategoryNamesInput(names);
    } else {
      setCategoryNamesInput('');
    }

    setImageFile(null);
  };

  // Delete menu item
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      const response = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchMenuItems();
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete menu item:', error);
    }
  };

  // Clear form after create/update
  const clearForm = () => {
    setEditId(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategoryIds([]);
    setCategoryNamesInput('');
    setImageFile(null);
  };

  // File select
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  // -------------------- Category --------------------

  // Create new category
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', categoryName);
      formData.append('description', categoryDescription);

      const response = await fetch('/api/menu/categories', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      fetchCategories();
      setCategoryName('');
      setCategoryDescription('');
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  // Delete category
  const handleCategoryDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const response = await fetch(`/api/menu/categories/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  return (
    <div>
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

            {/* Category Names (comma-separated) */}
            <div className="grid w-full items-center gap-1">
              <Label htmlFor="categoryNames">Category Names (comma-separated)</Label>
              <Input
                id="categoryNames"
                value={categoryNamesInput}
                onChange={handleCategoryNamesChange}
                placeholder="e.g. Pizza, Drinks"
              />
            </div>

            {/* Image */}
            <div className="grid w-full items-center gap-1">
              <Label>Image</Label>
              <div className="flex items-center gap-2">
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
              <input
                id="image"
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
            </div>

            {/* Submit & Cancel */}
            <div className="flex gap-2 pt-4">
              <Button type="submit">{editId ? 'Update' : 'Create'}</Button>
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
      {/* <div>
        <h2 className="text-xl font-bold mb-4">All Menu Items</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>
                  {item.name} (${item.price})
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
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div> */}

      <div>
        {categories.map((section) => (
          <div key={section.id} id={section.id} className="mb-10 scroll-mt-24">
            <div className="flex items-center mb-4">
              <h2 className="text-2xl font-bold">{section.name}</h2>
              <Separator className="ml-4 flex-1" />
            </div>

            <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-4">
              <div className="flex space-x-4 sm:space-x-6 pb-2 pr-4">
                {section.menuItems.map((item) => (
                  <div key={item.id} className="w-[180px] sm:w-[220px] md:w-[250px] lg:w-[280px] flex-none">
                    <AdminItemCard item={item} editFunction={() => handleEdit(item)} deleteFunction={() => handleDelete(item.id)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-8" />

      {/* Category Management Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Category Management</h2>
        {/* Form to create a new category */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create Category</CardTitle>
            <CardDescription>Add a new category.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div className="grid w-full items-center gap-1">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Pizza"
                />
              </div>
              <div className="grid w-full items-center gap-1">
                <Label htmlFor="categoryDescription">Category Description</Label>
                <Textarea
                  id="categoryDescription"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  placeholder="e.g. Delicious pizza"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit">Create Category</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* List of all categories */}
        <div>
          <h3 className="text-lg font-bold mb-2">All Categories</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  {category.description && (
                    <CardDescription>{category.description}</CardDescription>
                  )}
                </CardHeader>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => handleCategoryDelete(category.id)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
