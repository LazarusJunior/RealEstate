'use client'

import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../redux/store'
import { fetchUserInvestments } from '../redux/investmentSlice'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Building, DollarSign, TrendingUp, Calendar, Search } from 'lucide-react'

const Investments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { investments, loading, error } = useSelector((state: RootState) => state.investments)
  const [sortBy, setSortBy] = useState<string>('date')
  const [filterQuery, setFilterQuery] = useState<string>('')
  const [sortedInvestments, setSortedInvestments] = useState(investments)

  useEffect(() => {
    dispatch(fetchUserInvestments())
  }, [dispatch])

  useEffect(() => {
    const filtered = investments.filter(inv => 
      inv.property.name.toLowerCase().includes(filterQuery.toLowerCase())
    )
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === 'amount') return Number(b.amount) - Number(a.amount)
      if (sortBy === 'progress') {
        const progressA = Number(a.amount) / Number(a.property.targetInvestment)
        const progressB = Number(b.amount) / Number(b.property.targetInvestment)
        return progressB - progressA
      }
      return 0
    })
    setSortedInvestments(sorted)
  }, [investments, sortBy, filterQuery])

  const totalInvestment = investments.reduce((sum, inv) => sum + Number(inv.amount), 0)
  const totalProperties = new Set(investments.map(inv => inv.property.id)).size

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (error) return <div className="text-red-500 text-center">Error: {error}</div>

  return (
    <div className="space-y-6 p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-900">Your Investments</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2" />
              Total Investment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalInvestment.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2" />
              Properties Invested
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProperties}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2" />
              Average ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12.5%</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Search className="text-gray-400" />
          <Input
            placeholder="Filter properties..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-64"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
            <SelectItem value="progress">Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedInvestments.map((investment) => (
          <Card key={investment.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-900">{investment.property.name}</CardTitle>
              <CardDescription className="flex items-center text-blue-600">
                <Calendar className="mr-1 h-4 w-4" />
                Invested on {new Date(investment.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-700">${Number(investment.amount).toLocaleString()}</span>
                </div>
                <div className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  {investment.ownershipPercentage}% ownership
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Investment Progress</span>
                  <span className="font-medium text-blue-700">
                    {(Number(investment.amount) / Number(investment.property.targetInvestment) * 100).toFixed(2)}%
                  </span>
                </div>
                <Progress 
                  value={Number(investment.amount) / Number(investment.property.targetInvestment) * 100} 
                  className="h-2 bg-blue-100"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Investments

