'use client';

import React, { useState } from 'react';
import { ShipmentDetails } from '../lib/types';

interface ShipmentFormProps {
  onSubmit: (data: ShipmentDetails) => Promise<void>;
  isLoading: boolean;
}

export const ShipmentForm: React.FC<ShipmentFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<ShipmentDetails>({
    shipmentTypes: [],
    weight: 0,
    weightUnit: 'kg',
    volume: 0,
    commodity: '',
    hsCode: '',
    hazardous: false,
    temperatureControlled: false,
    origin: '',
    destination: '',
    departureWindow: '',
    incoterms: 'CIF',
    customsClearance: false,
    insurance: false,
    lastMileDelivery: false,
    warehousing: false,
  });

  const handleShipmentTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      shipmentTypes: prev.shipmentTypes.includes(type)
        ? prev.shipmentTypes.filter(t => t !== type)
        : [...prev.shipmentTypes, type],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Shipment Details</h2>

      {/* Shipment Types */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Shipment Types</label>
        <div className="flex gap-4 flex-wrap">
          {['Ocean (FCL)', 'Ocean (LCL)', 'Air Cargo', 'FTL Trucking', 'LTL Trucking'].map(type => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.shipmentTypes.includes(type)}
                onChange={() => handleShipmentTypeToggle(type)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cargo Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Weight</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="0.1"
              className="flex-1 px-4 py-2 border rounded border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <select
              name="weightUnit"
              value={formData.weightUnit}
              onChange={handleChange}
              className="px-4 py-2 border rounded border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="kg">kg</option>
              <option value="tons">tons</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Volume (CBM)</label>
          <input
            type="number"
            name="volume"
            value={formData.volume}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="0.1"
            className="w-full px-4 py-2 border rounded border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Commodity</label>
          <input
            type="text"
            name="commodity"
            value={formData.commodity}
            onChange={handleChange}
            placeholder="e.g., Electronics, Textiles"
            className="w-full px-4 py-2 border rounded border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">HS Code</label>
          <input
            type="text"
            name="hsCode"
            value={formData.hsCode}
            onChange={handleChange}
            placeholder="e.g., 850231"
            className="w-full px-4 py-2 border rounded border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Special Handling */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer mb-3">
          <input
            type="checkbox"
            name="hazardous"
            checked={formData.hazardous}
            onChange={handleChange}
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-gray-700">Hazardous Material</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="temperatureControlled"
            checked={formData.temperatureControlled}
            onChange={handleChange}
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-gray-700">Temperature Controlled</span>
        </label>
      </div>

      {/* Route Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Origin (Address/Port/Airport)</label>
          <input
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            placeholder="e.g., Shanghai, China"
            className="w-full px-4 py-2 border rounded border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Destination (Address/Port/Airport)</label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="e.g., Rotterdam, Netherlands"
            className="w-full px-4 py-2 border rounded border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Departure Window</label>
          <input
            type="date"
            name="departureWindow"
            value={formData.departureWindow}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Incoterms</label>
          <select
            name="incoterms"
            value={formData.incoterms}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="EXW">EXW (Ex Works)</option>
            <option value="FOB">FOB (Free On Board)</option>
            <option value="CIF">CIF (Cost, Insurance & Freight)</option>
            <option value="DDP">DDP (Delivered Duty Paid)</option>
          </select>
        </div>
      </div>

      {/* Extra Services */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Extra Services</label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="customsClearance"
              checked={formData.customsClearance}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-gray-700">Customs Clearance</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="insurance"
              checked={formData.insurance}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-gray-700">Insurance</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="lastMileDelivery"
              checked={formData.lastMileDelivery}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-gray-700">Last-Mile Delivery</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="warehousing"
              checked={formData.warehousing}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-gray-700">Warehousing</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
      >
        {isLoading ? 'Getting Quotes...' : 'Get Freight Quotes'}
      </button>
    </form>
  );
};
