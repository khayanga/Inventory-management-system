import { Weapon, WeaponStatus } from '@prisma/client';
import { Button } from "@/components/ui/button";
import { Check, X, Wrench, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React from 'react'

interface WeaponTableProps {
    weapons: (Weapon & {
      checkouts: {
        officer: { militaryId: string; username: string };
      }[];
    })[];
  }

const WeaponTable = ({weapons}:WeaponTableProps) => {
    const getStatusIcon = (status: WeaponStatus) => {
        switch (status) {
          case "AVAILABLE": return <Check className="h-4 w-4 text-green-500" />;
          case "CHECKED_OUT": return <Shield className="h-4 w-4 text-blue-500" />;
          case "MAINTENANCE": return <Wrench className="h-4 w-4 text-yellow-500" />;
          case "DECOMMISSIONED": return <X className="h-4 w-4 text-red-500" />;
          default: return null;
        }
      };
  return (
    <div className="border rounded-lg overflow-hidden mt-5 max-w-7xl mx-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Acquired</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {weapons.map((weapon) => (
          <tr key={weapon.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm">{weapon.serialNumber}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">{weapon.model}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">{weapon.type}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <div className="flex items-center">
                {getStatusIcon(weapon.status)}
                <span className="ml-2">{weapon.status}</span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <Badge variant={weapon.condition === "EXCELLENT" ? "default" : 
                            weapon.condition === "GOOD" ? "secondary" : 
                            "destructive"}>
                {weapon.condition}
              </Badge>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              {weapon.checkouts[0]?.officer.username || "N/A"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
            {weapon.dateAcquired
                ? new Date(weapon.dateAcquired).toLocaleDateString()
                : "N/A"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <Button variant="ghost" size="sm">
                Details
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default WeaponTable