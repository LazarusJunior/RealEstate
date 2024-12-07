'use client'

import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../redux/store'
import { fetchUserInvestments } from '../redux/investmentSlice'
import { fetchProperties } from '../redux/propertySlice'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import { Building, DollarSign, TrendingUp, PieChart } from 'lucide-react'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { investments } = useSelector((state: RootState) => state.investments)
  const { properties } = useSelector((state: RootState) => state.properties)

  const [roi, setRoi] = useState<number>(0)

  useEffect(() => {
    dispatch(fetchUserInvestments())
    dispatch(fetchProperties())
  }, [dispatch])

  useEffect(() => {
    if (investments.length > 0 && properties.length > 0) {
      try {
        const totalInvestment = investments.reduce((sum, inv) => sum + Number(inv.amount) || 0, 0)
        const totalValue = investments.reduce((sum, inv) => {
          const property = properties.find(p => p.id === inv.propertyId)
          if (!property || !property.currentValue) return sum
          const propertyShare = Number(inv.amount) / Number(property.targetInvestment)
          return sum + (Number(property.currentValue) * propertyShare)
        }, 0)

        // Only calculate ROI if totalInvestment is greater than 0
        const calculatedRoi = totalInvestment > 0 
          ? ((totalValue - totalInvestment) / totalInvestment) * 100 
          : 0
        
        setRoi(Number.isFinite(calculatedRoi) ? calculatedRoi : 0)
      } catch (error) {
        console.error('Error calculating ROI:', error)
        setRoi(0)
      }
    }
  }, [investments, properties])

  const totalInvestment = investments.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0)
  const totalProperties = [...new Set(investments.map(inv => inv.propertyId))].length

  const pieChartData = properties
    .map(property => {
      const propertyInvestments = investments
        .filter(inv => inv.propertyId === property.id)
        .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0)
      return {
        name: property.name,
        value: propertyInvestments
      }
    })
    .filter(data => data.value > 0) // Only show properties with investments
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  const topProperties = properties
    .map(property => {
      const totalInvestment = investments
        .filter(inv => inv.propertyId === property.id)
        .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0)
      
      let propertyRoi = 0
      if (property.targetInvestment && Number(property.targetInvestment) > 0) {
        propertyRoi = ((Number(property.currentValue || 0) - Number(property.targetInvestment)) / 
          Number(property.targetInvestment)) * 100
      }

      return {
        ...property,
        totalInvestment,
        roi: Number.isFinite(propertyRoi) ? propertyRoi : 0
      }
    })
    .filter(property => property.totalInvestment > 0) // Only show properties with investments
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 3)

  // Calculate monthly change (example calculation - adjust based on your actual data)
  const monthlyChange = investments.reduce((sum, inv) => {
    const isThisMonth = new Date(inv.createdAt).getMonth() === new Date().getMonth()
    return isThisMonth ? sum + (Number(inv.amount) || 0) : sum
  }, 0)

  const monthlyChangePercentage = totalInvestment > 0 
    ? (monthlyChange / totalInvestment) * 100 
    : 0

  return (
    <div className="space-y-6 p-6 bg-white">
      <h1 className="text-3xl font-bold text-blue-950">Welcome, {user?.name || 'Investor'}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-sm font-medium text-blue-950">Total Investment</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-950">
              ${totalInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-blue-600">
              {monthlyChangePercentage > 0 ? '+' : ''}{monthlyChangePercentage.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-sm font-medium text-blue-950">Properties Invested</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-950">{totalProperties}</div>
            <p className="text-xs text-blue-600">
              {investments.filter(inv => {
                const date = new Date(inv.createdAt)
                const thisMonth = new Date().getMonth()
                return date.getMonth() === thisMonth
              }).length} new properties this month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-sm font-medium text-blue-950">Portfolio Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-950">
              {roi > 0 ? '+' : ''}{roi.toFixed(2)}%
            </div>
            <Progress 
              value={Math.max(0, Math.min(100, roi))} 
              className="mt-2 bg-blue-100"
            />
          </CardContent>
        </Card>
        <Card className="bg-white border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-sm font-medium text-blue-950">Investment Distribution</CardTitle>
            <PieChart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={150}>
              <RechartsPieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Investment']}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white border-blue-100 shadow-sm">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-blue-950">Recent Investments</CardTitle>
            <CardDescription className="text-blue-800">Your latest property investments</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {investments.slice(0, 5).map((investment) => (
                <div key={investment.id} className="flex items-center p-3 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                  <Building className="mr-2 h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-950">{investment.property?.name || 'Unknown Property'}</p>
                    <p className="text-xs text-blue-600">
                      {new Date(investment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-blue-950">
                    ${(Number(investment.amount) || 0).toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-blue-100 shadow-sm">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-blue-950">Top Performing Properties</CardTitle>
            <CardDescription className="text-blue-800">Properties with the highest ROI</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {topProperties.map((property) => (
                <div key={property.id} className="flex items-center p-3 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                  <Building className="mr-2 h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-950">{property.name}</p>
                    <p className="text-xs text-blue-600">
                      Total Investment: ${property.totalInvestment.toLocaleString('en-US', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    {property.roi > 0 ? '+' : ''}{property.roi.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard

