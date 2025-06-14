import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const SERVICES = [
  {
    id: 'auth',
    name: 'Authentication Service',
    endpoint: '/api/auth/health',
    description: 'Handles user authentication and authorization',
    port: 3001,
    color: 'var(--primary-color)',
    icon: '🔐'
  },
  {
    id: 'user',
    name: 'User Service',
    endpoint: '/api/users/health',
    description: 'Manages user profiles and data',
    port: 3002,
    color: 'var(--success-color)',
    icon: '👥'
  },
  {
    id: 'product',
    name: 'Product Service',
    endpoint: '/api/products/health',
    description: 'Manages product catalog and inventory',
    port: 3003,
    color: 'var(--warning-color)',
    icon: '📦'
  },
  {
    id: 'order',
    name: 'Order Service',
    endpoint: '/api/orders/health',
    description: 'Processes and tracks orders',
    port: 3004,
    color: 'var(--error-color)',
    icon: '🛒'
  }
];

function App() {
  const [services, setServices] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const checkServiceStatus = async (service) => {
    const startTime = Date.now();
    try {
      const response = await axios.get(service.endpoint, { timeout: 5000 });
      const responseTime = Date.now() - startTime;
      
      return {
        ...service,
        status: 'online',
        statusCode: response.status,
        responseTime,
        version: response.data?.version || '1.0.0',
        timestamp: new Date().toISOString(),
        error: null
      };
    } catch (err) {
      return {
        ...service,
        status: 'offline',
        statusCode: err.response?.status || 0,
        responseTime: null,
        version: 'unavailable',
        timestamp: new Date().toISOString(),
        error: err.message || 'Service unavailable'
      };
    }
  };

  const checkAllServices = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await Promise.all(
        SERVICES.map(service => checkServiceStatus(service))
      );
      
      const servicesMap = results.reduce((acc, service) => {
        acc[service.id] = service;
        return acc;
      }, {});
      
      setServices(servicesMap);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError('Failed to check service statuses. Please try again.');
      console.error('Error checking services:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAllServices();
    
    // Check every 30 seconds
    const interval = setInterval(checkAllServices, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getResponseTimeClass = (time) => {
    if (time === null) return '';
    if (time < 200) return 'text-green-600';
    if (time < 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Microservices Dashboard</h1>
          <div className="flex items-center space-x-4">
            {lastUpdated && (
              <div className="text-sm text-gray-500">
                Last updated: {formatTime(lastUpdated)}
              </div>
            )}
            <button
              onClick={checkAllServices}
              disabled={isLoading}
              className="btn btn-primary flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⟳</span>
                  Refreshing...
                </>
              ) : (
                <>
                  <span>⟳</span>
                  Refresh Status
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => {
            const serviceData = services[service.id] || {};
            const isOnline = serviceData.status === 'online';
            const statusClass = isOnline ? 'status-online' : 'status-offline';
            
            return (
              <div 
                key={service.id} 
                className="card overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Service Header */}
                <div 
                  className="p-4 border-b flex justify-between items-center"
                  style={{ borderBottomColor: service.color, borderBottomWidth: '3px' }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl" style={{ color: service.color }}>
                      {service.icon}
                    </span>
                    <h2 className="font-semibold text-gray-800">{service.name}</h2>
                  </div>
                  <span className={`status ${statusClass} px-3 py-1 rounded-full text-xs font-medium`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                
                {/* Service Details */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Status</span>
                    <div className="flex items-center">
                      <span className={`status-dot ${isOnline ? 'online' : 'offline'} mr-2`}></span>
                      <span className="text-sm font-medium">
                        {isOnline ? 'Operational' : 'Service Disruption'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Version</span>
                    <span className="text-sm font-medium">
                      {serviceData.version || 'N/A'}
                    </span>
                  </div>
                  
                  {isOnline && serviceData.responseTime !== null && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Response Time</span>
                      <span className={`text-sm font-medium ${getResponseTimeClass(serviceData.responseTime)}`}>
                        {serviceData.responseTime}ms
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Last Checked</span>
                    <span className="text-sm text-gray-700">
                      {serviceData.timestamp ? formatTime(serviceData.timestamp) : 'Never'}
                    </span>
                  </div>
                </div>
                
                {/* Service Footer */}
                <div className="bg-gray-50 p-4 border-t">
                  <p className="text-xs text-gray-500 mb-2">{service.description}</p>
                  <a 
                    href={service.endpoint} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline break-all"
                    title={service.endpoint}
                  >
                    {service.endpoint}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-8 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>Microservices Dashboard &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
