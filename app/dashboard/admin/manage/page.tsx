'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  MapPin, Hotel, Utensils, Calendar, Plus, Edit, Trash2, 
  Shield, LogOut, ArrowLeft, Save, X, Upload, Image as ImageIcon
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

type ResourceType = 'places' | 'hotels' | 'restaurants' | 'events'

interface FormData {
  [key: string]: any
}

export default function AdminManagePage() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<ResourceType>('places')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState<FormData>({})
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (!userData || !token) {
      router.push('/auth')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'admin') {
      router.push('/auth')
      return
    }

    setUser(parsedUser)
    fetchItems(activeTab)
  }, [router, activeTab])

  const fetchItems = async (type: ResourceType) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/${type}`)
      const data = await response.json()
      setItems(data[type] || [])
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const handleCreate = () => {
    setEditingItem(null)
    setFormData(getEmptyFormData(activeTab))
    setSelectedFiles([])
    setShowForm(true)
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setFormData(item)
    setSelectedFiles([])
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/${activeTab}?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setNotification({ type: 'success', message: 'Item deleted successfully!' })
        fetchItems(activeTab)
        setTimeout(() => setNotification(null), 3000)
      } else {
        throw new Error('Failed to delete item')
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      setNotification({ type: 'error', message: 'Failed to delete item. Please try again.' })
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setUploading(true)
      const token = localStorage.getItem('token')
      
      // Upload images first if any files are selected
      let uploadedImageUrls: string[] = []
      if (selectedFiles.length > 0) {
        const uploadFormData = new FormData()
        selectedFiles.forEach(file => {
          uploadFormData.append('images', file)
        })

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: uploadFormData
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          uploadedImageUrls = uploadData.urls
        } else {
          const errorData = await uploadResponse.json()
          console.error('Upload error response:', errorData)
          throw new Error(errorData.error || 'Failed to upload images')
        }
      }

      // Combine existing images with newly uploaded ones
      const allImages = [...(formData.images || []), ...uploadedImageUrls]
      const dataToSubmit = { ...formData, images: allImages }

      const method = editingItem ? 'PUT' : 'POST'
      const body = editingItem ? { ...dataToSubmit, id: editingItem.id || editingItem._id } : dataToSubmit

      const response = await fetch(`/api/admin/${activeTab}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        setShowForm(false)
        setSelectedFiles([])
        setNotification({ 
          type: 'success', 
          message: `${editingItem ? 'Updated' : 'Created'} successfully!` 
        })
        fetchItems(activeTab)
        setTimeout(() => setNotification(null), 3000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save item')
      }
    } catch (error: any) {
      console.error('Error saving item:', error)
      setNotification({ type: 'error', message: error.message || 'Failed to save item. Please try again.' })
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setUploading(false)
    }
  }

  const getEmptyFormData = (type: ResourceType): FormData => {
    switch (type) {
      case 'places':
        return {
          name: '', location: '', description: '', category: '', rating: 0,
          reviews: 0, bestTime: '', entryFee: '', timings: '', images: [],
          coordinates: [], highlights: [], facilities: [], howToReach: '',
          weather: { summer: '', winter: '', monsoon: '' }, featured: false
        }
      case 'hotels':
        return {
          name: '', type: 'hotel', location: '', address: '', description: '',
          rating: 0, reviews: 0, priceRange: { min: 0, max: 0 }, amenities: [],
          images: [], coordinates: [], rooms: [], 
          contactDetails: { phone: '', email: '', website: '' }, featured: false
        }
      case 'restaurants':
        return {
          name: '', cuisineType: [], location: '', address: '', description: '',
          rating: 0, reviews: 0, priceRange: { min: 0, max: 0 }, specialties: [],
          images: [], coordinates: [], 
          timings: { open: '', close: '', daysOpen: [] },
          contactDetails: { phone: '', email: '', website: '' },
          seatingCapacity: 0, featured: false
        }
      case 'events':
        return {
          title: '', description: '', category: '', location: '', address: '',
          startDate: '', endDate: '', startTime: '', endTime: '', images: [],
          coordinates: [], organizer: { name: '', contact: '', email: '' },
          ticketPrice: { free: true, min: 0, max: 0 }, capacity: 0,
          registeredCount: 0, highlights: [], featured: false
        }
    }
  }

  const renderForm = () => {
    switch (activeTab) {
      case 'places':
        return <PlaceForm formData={formData} setFormData={setFormData} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
      case 'hotels':
        return <HotelForm formData={formData} setFormData={setFormData} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
      case 'restaurants':
        return <RestaurantForm formData={formData} setFormData={setFormData} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
      case 'events':
        return <EventForm formData={formData} setFormData={setFormData} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/admin" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back to Dashboard</span>
              </Link>
              <div className="bg-primary-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Manage Resources</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        {notification && (
          <div className={`mb-4 p-4 rounded-lg ${
            notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {notification.message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'places' as ResourceType, label: 'Tourist Places', icon: MapPin },
                { id: 'hotels' as ResourceType, label: 'Hotels', icon: Hotel },
                { id: 'restaurants' as ResourceType, label: 'Restaurants', icon: Utensils },
                { id: 'events' as ResourceType, label: 'Events', icon: Calendar }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              <button
                onClick={handleCreate}
                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                <Plus className="h-4 w-4" />
                <span>Add New</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No {activeTab} found. Click "Add New" to create one.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id || item._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.name || item.title}
                          </h3>
                          {item.featured && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              Featured
                            </span>
                          )}
                          {item.isActive === false && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.location || item.address}</p>
                        <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                        <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                          {item.rating !== undefined && (
                            <span>⭐ {item.rating.toFixed(1)}</span>
                          )}
                          {item.category && (
                            <span className="px-2 py-1 bg-gray-100 rounded">{item.category}</span>
                          )}
                          {item.type && (
                            <span className="px-2 py-1 bg-gray-100 rounded capitalize">{item.type}</span>
                          )}
                          {item.priceRange && (
                            <span>₹{item.priceRange.min} - ₹{item.priceRange.max}</span>
                          )}
                          {(item.priceRangeMin !== undefined && item.priceRangeMax !== undefined) && (
                            <span>₹{item.priceRangeMin} - ₹{item.priceRangeMax}</span>
                          )}
                          {item.startDate && (
                            <span>📅 {new Date(item.startDate).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id || item._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingItem ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {renderForm()}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// Image Upload Component
interface ImageUploadProps {
  formData: FormData
  setFormData: (data: FormData) => void
  selectedFiles: File[]
  setSelectedFiles: (files: File[]) => void
}

function ImageUpload({ formData, setFormData, selectedFiles, setSelectedFiles }: ImageUploadProps) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles([...selectedFiles, ...filesArray])
    }
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    const updatedImages = (formData.images || []).filter((_: any, i: number) => i !== index)
    setFormData({ ...formData, images: updatedImages })
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Images</label>
      
      {/* Existing Images */}
      {formData.images && formData.images.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {formData.images.map((url: string, index: number) => (
            <div key={index} className="relative group">
              <Image
                src={url}
                alt={`Existing ${index + 1}`}
                width={150}
                height={150}
                className="w-full h-24 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => removeExistingImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* New Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative group">
              <div className="w-full h-24 bg-gray-100 rounded-lg border flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
              <button
                type="button"
                onClick={() => removeSelectedFile(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <label className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 cursor-pointer transition-colors">
        <Upload className="h-5 w-5 text-gray-400" />
        <span className="text-sm text-gray-600">Click to upload images</span>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </label>
      <p className="text-xs text-gray-500">Upload multiple images (JPG, PNG, WebP)</p>
    </div>
  )
}

// Form Components
function PlaceForm({ formData, setFormData, selectedFiles, setSelectedFiles }: ImageUploadProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Name *"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
          required
        />
        <input
          type="text"
          placeholder="Location *"
          value={formData.location || ''}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
          required
        />
      </div>
      <textarea
        placeholder="Description *"
        value={formData.description || ''}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
        rows={3}
        required
      />
      <div className="grid grid-cols-3 gap-4">
        <select
          value={formData.category || ''}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900"
          required
        >
          <option value="">Select Category *</option>
          <option value="Temple">Temple</option>
          <option value="Historical">Historical</option>
          <option value="Nature">Nature</option>
          <option value="Adventure">Adventure</option>
          <option value="Beach">Beach</option>
          <option value="Mountain">Mountain</option>
          <option value="Wildlife">Wildlife</option>
          <option value="Museum">Museum</option>
          <option value="Park">Park</option>
          <option value="Monument">Monument</option>
          <option value="Fort">Fort</option>
          <option value="Palace">Palace</option>
          <option value="Lake">Lake</option>
          <option value="Waterfall">Waterfall</option>
          <option value="Religious">Religious</option>
          <option value="Cultural">Cultural</option>
        </select>
        <input
          type="text"
          placeholder="Best Time"
          value={formData.bestTime || ''}
          onChange={(e) => setFormData({ ...formData, bestTime: e.target.value })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Entry Fee"
          value={formData.entryFee || ''}
          onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Timings (e.g., 9 AM - 6 PM)"
          value={formData.timings || ''}
          onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="How to Reach"
          value={formData.howToReach || ''}
          onChange={(e) => setFormData({ ...formData, howToReach: e.target.value })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          step="0.1"
          placeholder="Rating (0-5)"
          value={formData.rating || ''}
          onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
          min="0"
          max="5"
        />
        <label className="flex items-center space-x-2 px-3 py-2 border rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured || false}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm">Featured Place</span>
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Highlights (comma-separated)</label>
        <input
          type="text"
          placeholder="e.g., Scenic Views, Trekking, Photography"
          value={Array.isArray(formData.highlights) ? formData.highlights.join(', ') : ''}
          onChange={(e) => setFormData({ ...formData, highlights: e.target.value.split(',').map(s => s.trim()) })}
          className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Facilities (comma-separated)</label>
        <input
          type="text"
          placeholder="e.g., Parking, Restrooms, Food Court"
          value={Array.isArray(formData.facilities) ? formData.facilities.join(', ') : ''}
          onChange={(e) => setFormData({ ...formData, facilities: e.target.value.split(',').map(s => s.trim()) })}
          className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
        />
      </div>
      <ImageUpload 
        formData={formData} 
        setFormData={setFormData}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
      />
    </div>
  )
}

function HotelForm({ formData, setFormData, selectedFiles, setSelectedFiles }: ImageUploadProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Hotel Name *"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
          required
        />
        <select
          value={formData.type || ''}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900"
          required
        >
          <option value="">Select Type *</option>
          <option value="hotel">Hotel</option>
          <option value="resort">Resort</option>
          <option value="guesthouse">Guesthouse</option>
          <option value="lodge">Lodge</option>
          <option value="homestay">Homestay</option>
          <option value="hostel">Hostel</option>
          <option value="villa">Villa</option>
          <option value="apartment">Apartment</option>
          <option value="boutique">Boutique Hotel</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Location *"
          value={formData.location || ''}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
          required
        />
        <input
          type="text"
          placeholder="Address *"
          value={formData.address || ''}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
          required
        />
      </div>
      <textarea
        placeholder="Description *"
        value={formData.description || ''}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
        rows={3}
        required
      />
      <div className="grid grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Min Price *"
          value={formData.priceRange?.min || ''}
          onChange={(e) => setFormData({ ...formData, priceRange: { ...formData.priceRange, min: Number(e.target.value) } })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
          required
        />
        <input
          type="number"
          placeholder="Max Price *"
          value={formData.priceRange?.max || ''}
          onChange={(e) => setFormData({ ...formData, priceRange: { ...formData.priceRange, max: Number(e.target.value) } })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
          required
        />
        <input
          type="number"
          step="0.1"
          placeholder="Rating (0-5)"
          value={formData.rating || ''}
          onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
          min="0"
          max="5"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="tel"
          placeholder="Phone *"
          value={formData.contactDetails?.phone || ''}
          onChange={(e) => setFormData({ ...formData, contactDetails: { ...formData.contactDetails, phone: e.target.value } })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
          required
        />
        <input
          type="email"
          placeholder="Email *"
          value={formData.contactDetails?.email || ''}
          onChange={(e) => setFormData({ ...formData, contactDetails: { ...formData.contactDetails, email: e.target.value } })}
          className="px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <input
        type="url"
        placeholder="Website (optional)"
        value={formData.contactDetails?.website || ''}
        onChange={(e) => setFormData({ ...formData, contactDetails: { ...formData.contactDetails, website: e.target.value } })}
        className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Amenities (comma-separated)</label>
        <input
          type="text"
          placeholder="e.g., WiFi, Pool, Gym, Restaurant, Parking"
          value={Array.isArray(formData.amenities) ? formData.amenities.join(', ') : ''}
          onChange={(e) => setFormData({ ...formData, amenities: e.target.value.split(',').map(s => s.trim()) })}
          className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
        />
      </div>
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2 px-3 py-2 border rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured || false}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm">Featured Hotel</span>
        </label>
        <label className="flex items-center space-x-2 px-3 py-2 border rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isActive !== false}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm">Active</span>
        </label>
      </div>
      <ImageUpload 
        formData={formData} 
        setFormData={setFormData}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
      />
    </div>
  )
}

function RestaurantForm({ formData, setFormData, selectedFiles, setSelectedFiles }: ImageUploadProps) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Restaurant Name *"
        value={formData.name || ''}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Location *"
          value={formData.location || ''}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
          required
        />
        <input
          type="text"
          placeholder="Address *"
          value={formData.address || ''}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
          required
        />
      </div>
      <textarea
        placeholder="Description *"
        value={formData.description || ''}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
        rows={3}
        required
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Types *</label>
        <select
          multiple
          value={Array.isArray(formData.cuisineType) ? formData.cuisineType : []}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, option => option.value)
            setFormData({ ...formData, cuisineType: selected })
          }}
          className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900"
          size={5}
          required
        >
          <option value="Indian">Indian</option>
          <option value="Chinese">Chinese</option>
          <option value="Continental">Continental</option>
          <option value="Italian">Italian</option>
          <option value="Mexican">Mexican</option>
          <option value="Thai">Thai</option>
          <option value="Japanese">Japanese</option>
          <option value="Korean">Korean</option>
          <option value="Mediterranean">Mediterranean</option>
          <option value="American">American</option>
          <option value="Fast Food">Fast Food</option>
          <option value="Seafood">Seafood</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Vegan">Vegan</option>
          <option value="Street Food">Street Food</option>
          <option value="Cafe">Cafe</option>
          <option value="Bakery">Bakery</option>
          <option value="Desserts">Desserts</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple cuisines</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Min Price *"
          value={formData.priceRange?.min || ''}
          onChange={(e) => setFormData({ ...formData, priceRange: { ...formData.priceRange, min: Number(e.target.value) } })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
          required
        />
        <input
          type="number"
          placeholder="Max Price *"
          value={formData.priceRange?.max || ''}
          onChange={(e) => setFormData({ ...formData, priceRange: { ...formData.priceRange, max: Number(e.target.value) } })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
          required
        />
        <input
          type="number"
          placeholder="Seating Capacity *"
          value={formData.seatingCapacity || ''}
          onChange={(e) => setFormData({ ...formData, seatingCapacity: Number(e.target.value) } )}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Operating Hours</label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="time"
            placeholder="Opening Time"
            value={formData.timings?.open || ''}
            onChange={(e) => setFormData({ ...formData, timings: { ...formData.timings, open: e.target.value } })}
            className="px-3 py-2 border rounded-lg bg-white text-gray-900"
            required
          />
          <input
            type="time"
            placeholder="Closing Time"
            value={formData.timings?.close || ''}
            onChange={(e) => setFormData({ ...formData, timings: { ...formData.timings, close: e.target.value } })}
            className="px-3 py-2 border rounded-lg bg-white text-gray-900"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="tel"
          placeholder="Phone *"
          value={formData.contactDetails?.phone || ''}
          onChange={(e) => setFormData({ ...formData, contactDetails: { ...formData.contactDetails, phone: e.target.value } })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
          required
        />
        <input
          type="email"
          placeholder="Email *"
          value={formData.contactDetails?.email || ''}
          onChange={(e) => setFormData({ ...formData, contactDetails: { ...formData.contactDetails, email: e.target.value } })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Specialties (comma-separated)</label>
        <input
          type="text"
          placeholder="e.g., Biryani, Tandoori, Seafood"
          value={Array.isArray(formData.specialties) ? formData.specialties.join(', ') : ''}
          onChange={(e) => setFormData({ ...formData, specialties: e.target.value.split(',').map(s => s.trim()) })}
          className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
        />
      </div>
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2 px-3 py-2 border rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured || false}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm">Featured Restaurant</span>
        </label>
        <label className="flex items-center space-x-2 px-3 py-2 border rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isActive !== false}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm">Active</span>
        </label>
      </div>
      <ImageUpload 
        formData={formData} 
        setFormData={setFormData}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
      />
    </div>
  )
}

function EventForm({ formData, setFormData, selectedFiles, setSelectedFiles }: ImageUploadProps) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Event Title *"
        value={formData.title || ''}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
        required
      />
      <textarea
        placeholder="Description *"
        value={formData.description || ''}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
        rows={3}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <select
          value={formData.category || ''}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900"
          required
        >
          <option value="">Select Category *</option>
          <option value="Festival">Festival</option>
          <option value="Concert">Concert</option>
          <option value="Cultural">Cultural</option>
          <option value="Sports">Sports</option>
          <option value="Exhibition">Exhibition</option>
          <option value="Workshop">Workshop</option>
          <option value="Conference">Conference</option>
          <option value="Food Festival">Food Festival</option>
          <option value="Music">Music</option>
          <option value="Art">Art</option>
          <option value="Religious">Religious</option>
          <option value="Community">Community</option>
          <option value="Educational">Educational</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Charity">Charity</option>
          <option value="Trade Show">Trade Show</option>
        </select>
        <input
          type="text"
          placeholder="Location *"
          value={formData.location || ''}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
          required
        />
      </div>
      <input
        type="text"
        placeholder="Address *"
        value={formData.address || ''}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
          <input
            type="date"
            value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ''}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
          <input
            type="date"
            value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ''}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <input
          type="time"
          placeholder="Start Time *"
          value={formData.startTime || ''}
          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900"
          required
        />
        <input
          type="time"
          placeholder="End Time *"
          value={formData.endTime || ''}
          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900"
          required
        />
        <input
          type="number"
          placeholder="Capacity *"
          value={formData.capacity || ''}
          onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
          className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
          required
        />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Organizer Details</h4>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Organizer Name *"
            value={formData.organizer?.name || ''}
            onChange={(e) => setFormData({ ...formData, organizer: { ...formData.organizer, name: e.target.value } })}
            className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
            required
          />
          <input
            type="tel"
            placeholder="Contact *"
            value={formData.organizer?.contact || ''}
            onChange={(e) => setFormData({ ...formData, organizer: { ...formData.organizer, contact: e.target.value } })}
            className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
            required
          />
          <input
            type="email"
            placeholder="Email *"
            value={formData.organizer?.email || ''}
            onChange={(e) => setFormData({ ...formData, organizer: { ...formData.organizer, email: e.target.value } })}
            className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
            required
          />
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Ticket Pricing</h4>
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center space-x-2 px-3 py-2 border rounded-lg cursor-pointer bg-white">
            <input
              type="checkbox"
              checked={formData.ticketPrice?.free || false}
              onChange={(e) => setFormData({ 
                ...formData, 
                ticketPrice: { ...formData.ticketPrice, free: e.target.checked, min: 0, max: 0 } 
              })}
              className="rounded"
            />
            <span className="text-sm text-gray-900">Free Event</span>
          </label>
          {!formData.ticketPrice?.free && (
            <>
              <input
                type="number"
                placeholder="Min Price"
                value={formData.ticketPrice?.min || ''}
                onChange={(e) => setFormData({ ...formData, ticketPrice: { ...formData.ticketPrice, min: Number(e.target.value) } })}
                className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={formData.ticketPrice?.max || ''}
                onChange={(e) => setFormData({ ...formData, ticketPrice: { ...formData.ticketPrice, max: Number(e.target.value) } })}
                className="px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
              />
            </>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Highlights (comma-separated)</label>
        <input
          type="text"
          placeholder="e.g., Live Music, Food Stalls, Cultural Programs"
          value={Array.isArray(formData.highlights) ? formData.highlights.join(', ') : ''}
          onChange={(e) => setFormData({ ...formData, highlights: e.target.value.split(',').map(s => s.trim()) })}
          className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400"
        />
      </div>
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2 px-3 py-2 border rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured || false}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm">Featured Event</span>
        </label>
        <label className="flex items-center space-x-2 px-3 py-2 border rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isActive !== false}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm">Active</span>
        </label>
      </div>
      <ImageUpload 
        formData={formData} 
        setFormData={setFormData}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
      />
    </div>
  )
}
