"use client"

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import { fetchProperties, createProperty, deleteProperty } from '../redux/propertySlice'
import { fetchAllUsers, deleteUser, assignAdminRole } from '../redux/userSlice'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import { Building, Users, Trash2, Plus, MapPin, DollarSign } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Property {
  id: number
  name: string
  description: string
  location: string
  targetInvestment: number
  totalInvestments: number
}


const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const properties = useSelector((state: RootState) => state.properties.properties)
  const propertiesLoading = useSelector((state: RootState) => state.properties.loading)
  const propertiesError = useSelector((state: RootState) => state.properties.error)
  const users = useSelector((state: RootState) => state.users.users)
  const usersLoading = useSelector((state: RootState) => state.users.loading)
  const usersError = useSelector((state: RootState) => state.users.error)

  const [activeTab, setActiveTab] = useState('properties')
  const [newProperty, setNewProperty] = useState<Partial<Property>>({})

  useEffect(() => {
    dispatch(fetchProperties())
    dispatch(fetchAllUsers())
  }, [dispatch])

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (newProperty.name && newProperty.description && newProperty.location && newProperty.targetInvestment !== undefined) {
        await dispatch(createProperty(newProperty as Omit<Property, "id" | "totalInvestments">)).unwrap()
        toast.success('Property added successfully')
        setNewProperty({})
      } else {
        toast.error('Please fill in all required fields')
      }
    } catch (error) {
      toast.error('Failed to add property')
    }
  }

  const handleDeleteProperty = async (propertyId: number) => {
    try {
      await dispatch(deleteProperty(propertyId)).unwrap()
      toast.success('Property deleted successfully')
    } catch (error) {
      toast.error('Failed to delete property')
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      await dispatch(deleteUser(userId)).unwrap()
      toast.success('User deleted successfully')
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  const handleAssignAdmin = async (userId: number) => {
    try {
      await dispatch(assignAdminRole(userId)).unwrap()
      toast.success('Admin role assigned successfully')
    } catch (error) {
      toast.error('Failed to assign admin role')
    }
  }

  if (propertiesLoading || usersLoading) {
    return <div className="text-center py-10">Loading...</div>
  }

  if (propertiesError || usersError) {
    return <div className="text-center py-10 text-red-500">Error: {propertiesError || usersError}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name || 'Admin'}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {users?.length || 0} Users
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            {properties?.length || 0} Properties
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="properties" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Properties
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Property</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProperty} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyName">Property Name</Label>
                    <Input
                      id="propertyName"
                      value={newProperty.name || ''}
                      onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                      placeholder="Enter property name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newProperty.location || ''}
                      onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
                      placeholder="Enter location"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetInvestment">Target Investment ($)</Label>
                    <Input
                      id="targetInvestment"
                      type="number"
                      value={newProperty.targetInvestment || ''}
                      onChange={(e) => setNewProperty({ ...newProperty, targetInvestment: Number(e.target.value) })}
                      placeholder="Enter target investment"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProperty.description || ''}
                      onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                      placeholder="Enter property description"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Properties</CardTitle>
            </CardHeader>
            <CardContent>
              {properties && properties.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Target Investment</TableHead>
                      <TableHead>Current Investment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">{property.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            {property.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-green-600">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {(property.targetInvestment || 0).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-blue-600">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {(property.totalInvestments || 0).toLocaleString()}
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
              ) : (
                <p className="text-center py-4">No properties found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              {users && users.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
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
                                Assign Admin
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-4">No users found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminDashboard