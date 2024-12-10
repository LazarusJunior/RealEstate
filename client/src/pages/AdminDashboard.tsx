"use client"

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import { fetchProperties, createProperty, deleteProperty } from '../redux/propertySlice'
import { fetchAllUsers, deleteUser, assignAdminRole } from '../redux/userSlice'
import { fetchAllInvestments } from '../redux/investmentSlice'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Switch } from '../components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import { Building, Users, MapPin, DollarSign, Trash2, UserPlus, Plus } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { toast } from 'react-hot-toast'

interface Investment {
  id: number
  propertyId: number
  amount: number
}

interface Property {
  id: number
  name: string
  description: string
  location: string
  targetInvestment: number
  investments?: Investment[]
}

interface User {
  id: number
  name: string
  email: string
  role: string
}

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { properties } = useSelector((state: RootState) => state.properties)
  const { users } = useSelector((state: RootState) => state.users)
  const { investments } = useSelector((state: RootState) => state.investments)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [darkMode, setDarkMode] = useState(false)
  const [newProperty, setNewProperty] = useState<Partial<Property>>({
    name: '',
    description: '',
    location: '',
    targetInvestment: 0
  })

  useEffect(() => {
    dispatch(fetchProperties())
    dispatch(fetchAllUsers())
    dispatch(fetchAllInvestments())
  }, [dispatch])

  // Calculate total investments per property
  const propertyInvestments = properties.map(property => {
    const propertyInvestments = investments.filter(inv => inv.propertyId === property.id)
    const totalInvestment = propertyInvestments.reduce((sum, inv) => sum + Number(inv.amount), 0)
    return {
      ...property,
      currentValue: totalInvestment
    }
  })

  // Calculate total investment across all properties
  const totalInvestment = propertyInvestments.reduce((sum, property) => sum + (property.currentValue || 0), 0)
  const totalTargetInvestment = properties.reduce((sum, property) => sum + Number(property.targetInvestment), 0)
const handleCreateProperty = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    if (
      newProperty.name &&
      newProperty.description &&
      newProperty.location &&
      newProperty.targetInvestment !== undefined
    ) {
      const propertyData: Omit<Property, "id" | "investments"> = {
        name: newProperty.name,
        description: newProperty.description,
        location: newProperty.location,
        targetInvestment: newProperty.targetInvestment,
      };
      await dispatch(createProperty(propertyData)).unwrap();
      toast.success("Property created successfully");
      setNewProperty({
        name: "",
        description: "",
        location: "",
        targetInvestment: 0,
      });
    } else {
      toast.error("Please fill in all fields");
    }
  } catch (error) {
    toast.error("Failed to create property");
  }
};

  const handleDeleteProperty = async (id: number) => {
    try {
      await dispatch(deleteProperty(id)).unwrap()
      toast.success('Property deleted successfully')
    } catch (error) {
      toast.error('Failed to delete property')
    }
  }

  const handleDeleteUser = async (id: number) => {
    try {
      await dispatch(deleteUser(id)).unwrap()
      toast.success('User deleted successfully')
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  const handleAssignAdmin = async (id: number) => {
    try {
      await dispatch(assignAdminRole(id)).unwrap()
      toast.success('Admin role assigned successfully')
    } catch (error) {
      toast.error('Failed to assign admin role')
    }
  }

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <span>{darkMode ? 'Dark' : 'Light'} Mode</span>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">
            <Building className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="properties">
            <Building className="h-4 w-4 mr-2" />
            Properties
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="create-property">
            <Plus className="h-4 w-4 mr-2" />
            Create Property
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className={darkMode ? 'bg-gray-800' : ''}>
              <CardHeader>
                <CardTitle className={`text-lg ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>
                  Total Properties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {properties.length}
                </div>
              </CardContent>
            </Card>
            
            <Card className={darkMode ? 'bg-gray-800' : ''}>
              <CardHeader>
                <CardTitle className={`text-lg ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {users.length}
                </div>
              </CardContent>
            </Card>
            
            <Card className={darkMode ? 'bg-gray-800' : ''}>
              <CardHeader>
                <CardTitle className={`text-lg ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>
                  Total Investment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  ${totalInvestment.toLocaleString()}
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Target: ${totalTargetInvestment.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="properties" className="space-y-6">
          <Card className={darkMode ? 'bg-gray-800' : ''}>
            <CardHeader>
              <CardTitle className={darkMode ? 'text-white' : ''}>All Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={darkMode ? 'text-gray-300' : ''}>Property</TableHead>
                    <TableHead className={darkMode ? 'text-gray-300' : ''}>Location</TableHead>
                    <TableHead className={darkMode ? 'text-gray-300' : ''}>Target Investment</TableHead>
                    <TableHead className={darkMode ? 'text-gray-300' : ''}>Current Investment</TableHead>
                    <TableHead className={darkMode ? 'text-gray-300' : ''}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {propertyInvestments.map((property) => (
                    <TableRow key={property.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}>
                      <TableCell className={`font-medium ${darkMode ? 'text-white' : ''}`}>
                        {property.name}
                      </TableCell>
                      <TableCell className={darkMode ? 'text-gray-300' : ''}>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          {property.location}
                        </div>
                      </TableCell>
                      <TableCell className={darkMode ? 'text-gray-300' : ''}>
                        <div className={`flex items-center ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                          <DollarSign className="h-4 w-4 mr-1" />
                          {Number(property.targetInvestment).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className={darkMode ? 'text-gray-300' : ''}>
                        <div className={`flex items-center ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          <DollarSign className="h-4 w-4 mr-1" />
                          {(property.currentValue || 0).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProperty(property.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className={darkMode ? 'bg-gray-800' : ''}>
            <CardHeader>
              <CardTitle className={darkMode ? 'text-white' : ''}>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={darkMode ? 'text-gray-300' : ''}>Name</TableHead>
                    <TableHead className={darkMode ? 'text-gray-300' : ''}>Email</TableHead>
                    <TableHead className={darkMode ? 'text-gray-300' : ''}>Role</TableHead>
                    <TableHead className={darkMode ? 'text-gray-300' : ''}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: User) => (
                    <TableRow key={user.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}>
                      <TableCell className={`font-medium ${darkMode ? 'text-white' : ''}`}>
                        {user.name}
                      </TableCell>
                      <TableCell className={darkMode ? 'text-gray-300' : ''}>{user.email}</TableCell>
                      <TableCell className={darkMode ? 'text-gray-300' : ''}>{user.role}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {user.role !== 'ADMIN' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAssignAdmin(user.id)}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create-property" className="space-y-6">
          <Card className={darkMode ? 'bg-gray-800' : ''}>
            <CardHeader>
              <CardTitle className={darkMode ? 'text-white' : ''}>Create New Property</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProperty} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className={darkMode ? 'text-gray-300' : ''}>Property Name</Label>
                  <Input
                    id="name"
                    value={newProperty.name}
                    onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                    className={darkMode ? 'bg-gray-700 text-white' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className={darkMode ? 'text-gray-300' : ''}>Description</Label>
                  <Textarea
                    id="description"
                    value={newProperty.description}
                    onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                    className={darkMode ? 'bg-gray-700 text-white' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className={darkMode ? 'text-gray-300' : ''}>Location</Label>
                  <Input
                    id="location"
                    value={newProperty.location}
                    onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
                    className={darkMode ? 'bg-gray-700 text-white' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetInvestment" className={darkMode ? 'text-gray-300' : ''}>Target Investment</Label>
                  <Input
                    id="targetInvestment"
                    type="number"
                    value={newProperty.targetInvestment}
                    onChange={(e) => setNewProperty({ ...newProperty, targetInvestment: Number(e.target.value) })}
                    className={darkMode ? 'bg-gray-700 text-white' : ''}
                  />
                </div>
                <Button type="submit" className={darkMode ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                  Create Property
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminDashboard

