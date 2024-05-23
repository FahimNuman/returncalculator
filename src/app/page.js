'use client'
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [initialInvestment, setInitialInvestment] = useState(100);
  const [period, setPeriod] = useState(1);
  const [rentalYield, setRentalYield] = useState(11);
  const [capitalAppreciation, setCapitalAppreciation] = useState(2);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const [selectedOption, setSelectedOption] = useState('Last Month');

  const handleToggle = (option) => {
    setSelectedOption(option);
  };

  const calculateReturn = () => {
    const selectedPropertyRentalYield = selectedProperty ? selectedProperty.rentalYield : rentalYield;
    const rentalIncome = initialInvestment * (selectedPropertyRentalYield / 100) * period;
    const capitalAppreciationAmount = initialInvestment * (capitalAppreciation / 100);
    const totalAmount = initialInvestment + rentalIncome + capitalAppreciationAmount;
    const tokens = totalAmount / 100 * 100; // Assuming 1 USD = 1.0 Tokens
    setTotalAssets(totalAmount);
    setTotalTokens(tokens);
  };

  useEffect(() => {
    fetch('/fakedata/fake.json')
      .then(response => response.json())
      .then(data => setProperties(data))
      .catch(error => console.error('Error fetching properties:', error));
  }, []);

  const handlePropertyChange = (property) => {
    setSelectedProperty(property);
    setRentalYield(property ? property.rentalYield : rentalYield);
  };

  return (
    <>
      <div className='text-center bg-gray-100 p-4'>Return Calculator</div>
      <section className="py-12 flex flex-wrap justify-center bg-teal-100">
        <div className="w-full sm:w-8/12 sm:mr-6 mb-6 sm:mb-0">
          <div className="bg-white rounded-t-2xl rounded-b-lg shadow-md p-4 sm:p-8 bg-green-50">
            <h2 className="text-xs sm:text-2xl font-bold mb-4 text-teal-700">Select Property</h2>
            <select
              id="property"
              className="border border-gray-300 rounded p-2 w-full mb-6"
              onChange={(e) => handlePropertyChange(properties.find(property => property.name === e.target.value))}
            >
              {properties.map((property, index) => (
                <option key={index} value={property.name}>{property.name}</option>
              ))}
            </select>
            <div className="mt-4">
              <label htmlFor="initialInvestment" className="block text-xs sm:text-base font-semibold mb-1 text-teal-700">Initial Purchase Amount (USD)</label>
              <input
                type="number"
                id="initialInvestment"
                className="border border-gray-300 rounded p-2 w-full"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(parseFloat(e.target.value))} />
            </div>
            <div className="mt-4">
              <label htmlFor="period" className="block text-xs sm:text-base font-semibold mb-1 text-teal-700">Period (Years)</label>
              <div className="flex items-center justify-between">
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={period}
                  className="range w-full"
                  step={1}
                  onChange={(e) => setPeriod(parseFloat(e.target.value))}
                />
                <span className="ml-2">{period}</span>
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="rentalYield" className="block text-xs sm:text-base font-semibold mb-1 text-teal-700">Expected Rental Yield (%)</label>
              <input
                type="number"
                id="rentalYield"
                className="border border-gray-300 rounded p-2 w-full"
                value={rentalYield}
                onChange={(e) => setRentalYield(parseFloat(e.target.value))} />
            </div>
            <div className="mt-4">
              <label htmlFor="capitalAppreciation" className="block text-xs sm:text-base font-semibold mb-1 text-teal-700">Expected Capital Appreciation (%)</label>
              <input
                type="number"
                id="capitalAppreciation"
                className="border border-gray-300 rounded p-2 w-full"
                value={capitalAppreciation}
                onChange={(e) => setCapitalAppreciation(parseFloat(e.target.value))} />
            </div>
            <div className="flex justify-between mt-4">
              <button
                className={`toggle-btn ${selectedOption === 'Last Month' ? 'active' : ''}`} 
                onClick={() => handleToggle('Last Month')} 
              >
                Last Month
              </button>
              <button
                className={`toggle-btn ${selectedOption === 'Average' ? 'active' : ''}`} 
                onClick={() => handleToggle('Average')} 
              >
                Average
              </button>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-6 w-full" onClick={calculateReturn}>Calculate</button>
          </div>
        </div>
        <div className="w-full sm:w-auto sm:max-w-lg gap-y-8">
          <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 bg-green-50">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-teal-700 border rounded-lg bg-emerald-100 text-center">Projected Income</h2>
            <p className="text-green-700 text-2xl text-center">Purchase of USD {initialInvestment} = {totalTokens.toFixed(0)} Tokens</p>
            <p className="text-green-700 text-center mt-4">Estimated rental yield to be received in {period} year(s): <span className='text-2xl'>USD {initialInvestment  * (rentalYield / 100) * period}</span> <br /> ({((initialInvestment * (rentalYield / 100) * period) / 100) * 100} Tokens)</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 bg-white-50 mt-6">
            <h2 className="text-sm sm:text-lg font-bold text-gray-700">Total assets in {period} year(s)</h2>
            <p className="text-2xl text-green-700 font-bold"><span className='text-2xl'>USD {totalAssets}</span> <br /> ({totalTokens.toFixed(1)} Tokens)</p>
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 mt-8">
            <div className="text-sm">
              <p className="text-teal-700">Auto purchase with rental income</p>
              <p className="italic text-gray-600">Disclaimer: The calculator is intended solely for illustrative purposes, and the generated information should not be construed as legal or financial advice, nor as a guarantee of any kind. The results produced by this calculator are estimates based on the input provided by the user and do not reflect actual results.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
