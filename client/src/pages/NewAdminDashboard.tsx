"use client"

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import { fetchProperties } from '../redux/propertySlice'
import { fetchAllUsers } from '../redux/userSlice'
import { fetchAllInvestments } from '../redux/investmentSlice' // New import
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
import { Building, Users, MapPin, DollarSign } from 'lucide-react'

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

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { properties } = useSelector((state: RootState) => state.properties)
  const { users } = useSelector((state: RootState) => state.users)
  const { investments } = useSelector((state: RootState) => state.investments)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [darkMode, setDarkMode] = useState(false)

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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminDashboard

