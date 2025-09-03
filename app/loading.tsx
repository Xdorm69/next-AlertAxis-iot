import { Loader } from 'lucide-react';
import React from 'react';

const LoadingPage = () => (
  <div className="bg-background h-screen flex items-center justify-center">
    <Loader className="h-12 w-12 animate-spin text-primary" />
  </div>
);

export default LoadingPage;
