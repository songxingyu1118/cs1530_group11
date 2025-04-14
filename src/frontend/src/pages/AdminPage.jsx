import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { isInitialized, initializeECDH } from '@/security/ecdhclient';
import { secureApiCall, checkIsAdmin } from '@/utils/secureApi';

import { Upload, AlertCircle, Loader2 } from 'lucide-react';

function AdminPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [securityInitialized, setSecurityInitialized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Menu Item state
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryIds, setCategoryIds] = useState([]);
  const [categoryNamesInput, setCategoryNamesInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePath, setImagePath] = useState('');

  // Category state
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const fileInputRef = useRef(null);

  // Check if user is admin and initialize security
  useEffect(() => {
    const checkAdminAndInitSecurity = async () => {
      try {
        setLoading(true);

        // Check if user is logged in
        if (!localStorage.getItem('token')) {
          setError('You must be logged in to access this page');
          setLoading(false);
          navigate('/login');
          return;
        }

        // Initialize security if needed
        if (!isInitialized()) {
          await initializeECDH();
        }
        setSecurityInitialized(true);

        // Check if user is admin
        const adminStatus = await checkIsAdmin();
        setIsAdmin(adminStatus);

        if (!adminStatus) {
          setError('You do not have permission to access this page');
          setLoading(false);
          return;
        }

        // Fetch data once security is initialized and admin status confirmed
        await fetchData();
        setLoading(false);
      } catch (err) {
        console.error('Setup error:', err);
        setError(`Error setting up admin page: ${err.message}`);
        setLoading(false);
      }
    };

    checkAdminAndInitSecurity();
  }, [navigate]);

  // Fetch all data
  const fetchData = async () => {
    try {
      await Promise.all([fetchMenuItems(), fetchCategories()]);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to fetch data');
    }
  };

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
      throw error;
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
      throw error;
    }
  };

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
  };

  // Create or Update menu item
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!securityInitialized || !isAdmin) {
      setError('Secure connection not established or admin privileges required');
      return;
    }

    try {
      setLoading(true);

      // Create the base payload
      const payload = {
        name,
        description,
        price: parseFloat(price),
        categoryIds
      };

      // Handle image if provided
      if (imageFile) {
        try {
          // Upload file first to get the path
          const formData = new FormData();
          formData.append('file', imageFile);
          formData.append('token', localStorage.getItem('token'));

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });

          if (!uploadResponse.ok) {
            const status = uploadResponse.status;
            if (status === 401) {
              throw new Error('Authentication required to upload images');
            } else if (status === 403) {
              throw new Error('You do not have permission to upload images');
            } else {
              throw new Error('Failed to upload image');
            }
          }

          const uploadData = await uploadResponse.json();
          payload.imagePath = uploadData.path || uploadData.imagePath;
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }
      } else if (imagePath) {
        // Use existing image path if no new file is uploaded
        payload.imagePath = imagePath;
      }

      let result;
      if (editId) {
        // Update existing item
        result = await secureApiCall(`/api/menu/${editId}`, 'PUT', payload);
      } else {
        // Create new item
        result = await secureApiCall('/api/menu/', 'POST', payload);
      }

      console.log('Operation successful:', result);

      // Refresh the lists
      await fetchData();

      // Clear form
      clearForm();
      setLoading(false);
    } catch (error) {
      console.error('Failed to create/update menu item:', error);
      setError(`Failed to ${editId ? 'update' : 'create'} menu item: ${error.message}`);
      setLoading(false);
    }
  };

  // Edit menu item (fill form with existing data)
  const handleEdit = (item) => {
    setEditId(item.id);
    setName(item.name || '');
    setDescription(item.description || '');
    setPrice(item.price?.toString() || '');
    setImagePath(item.imagePath || '');

    if (item.categoryIds) {
      setCategoryIds(item.categoryIds);
      // Convert categoryIds to names, concatenated with commas and backfilled into the input box
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

    if (!securityInitialized || !isAdmin) {
      setError('Secure connection not established or admin privileges required');
      return;
    }

    try {
      setLoading(true);

      // Send secure delete request
      await secureApiCall(`/api/menu/${id}`, 'DELETE', {});

      // Refresh the lists
      await fetchData();

      setLoading(false);
    } catch (error) {
      console.error('Failed to delete menu item:', error);
      setError(`Failed to delete menu item: ${error.message}`);
      setLoading(false);
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
    setImagePath('');
  };

  // File select
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  // Create new category
  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    if (!securityInitialized || !isAdmin) {
      setError('Secure connection not established or admin privileges required');
      return;
    }

    try {
      setLoading(true);

      // Create payload
      const payload = {
        name: categoryName,
        description: categoryDescription
      };

      // Send secure create request
      await secureApiCall('/api/menu/categories', 'POST', payload);

      // Refresh categories
      await fetchCategories();

      // Clear form
      setCategoryName('');
      setCategoryDescription('');

      setLoading(false);
    } catch (error) {
      console.error('Failed to create category:', error);
      setError(`Failed to create category: ${error.message}`);
      setLoading(false);
    }
  };

  // Delete category
  const handleCategoryDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    if (!securityInitialized || !isAdmin) {
      setError('Secure connection not established or admin privileges required');
      return;
    }

    try {
      setLoading(true);

      // Send secure delete request
      await secureApiCall(`/api/menu/categories/${id}`, 'DELETE', {});

      // Refresh categories
      await fetchCategories();

      setLoading(false);
    } catch (error) {
      console.error('Failed to delete category:', error);
      setError(`Failed to delete category: ${error.message}`);
      setLoading(false);
    }
  };

  // If loading, show loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-2">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button className="mt-4" onClick={() => navigate('/')}>Go to Home</Button>
        </Alert>
      </div>
    );
  }

  // If not admin, redirect to home
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You do not have permission to access this page.</AlertDescription>
          <Button className="mt-4" onClick={() => navigate('/')}>Go to Home</Button>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

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
                {!imageFile && imagePath && (
                  <span className="text-sm text-gray-600">Current image: {imagePath.split('/').pop()}</span>
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
              <Button type="submit" disabled={loading || !securityInitialized || !isAdmin}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editId ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editId ? 'Update' : 'Create'
                )}
              </Button>
              {editId && (
                <Button variant="outline" onClick={clearForm} disabled={loading}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Display menu items by category */}
      <div>
        {categories.map((section) => (
          <div key={section.id} id={section.id} className="mb-10 scroll-mt-24">
            <div className="flex items-center mb-4">
              <h2 className="text-2xl font-bold">{section.name}</h2>
              <Separator className="ml-4 flex-1" />
            </div>

            <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-4">
              <div className="flex space-x-4 sm:space-x-6 pb-2 pr-4">
                {section.menuItems && section.menuItems.length > 0 ? (
                  section.menuItems.map((item) => (
                    <div key={item.id} className="w-[180px] sm:w-[220px] md:w-[250px] lg:w-[280px] flex-none">
                      <AdminItemCard
                        item={item}
                        editFunction={() => handleEdit(item)}
                        deleteFunction={() => handleDelete(item.id)}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No menu items in this category</p>
                )}
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
                <Button
                  type="submit"
                  disabled={loading || !securityInitialized || !isAdmin}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Category...
                    </>
                  ) : (
                    'Create Category'
                  )}
                </Button>
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
                    disabled={loading || !securityInitialized || !isAdmin}
                    onClick={() => handleCategoryDelete(category.id)}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
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