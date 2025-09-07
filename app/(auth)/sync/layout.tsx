import React, { ReactNode } from 'react'
import { Loader } from 'lucide-react'

const layout = ({children}: {children: ReactNode}) => {
  return (
    <div className="w-screen h-screen absolute top-0 left-0 flex items-center justify-center z-50 bg-background">
      <Loader className="h-12 w-12 animate-spin text-primary" />
      <div>{children}</div>
    </div>
  );
}

export default layout