import Header from "../components/Header"
import Footer from "../components/Footer"

import Adminsidebar from "../components/adminSidebar"
export default function AdminDashboard(){
    return(
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1">
          <Adminsidebar/>
            <main className="flex-1 p-4">
          <h2 className="text-2xl font-bold mb-4"> Coming Soon!</h2>
        </main>
        </div>
        <Footer />
        </div>
      
   
          
    )
}