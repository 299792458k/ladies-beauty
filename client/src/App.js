import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
// import { fab } from '@fortawesome/free-brands-svg-icons'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar, faMessage as farMessage, faComment as farComment } from '@fortawesome/free-regular-svg-icons'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DataProvider } from './GlobalState'
import Header from './components/headers/Header'
import MainPages from './components/mainpages/Pages'


function App() {
  library.add(faStar, farStar, farMessage, farComment);
  return (
    <>
      <DataProvider>
        <Router>
          <div className="App">
            <Header />
            <MainPages />
          </div>
        </Router>
      </DataProvider>

      {/* toastify */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      >
      </ToastContainer>
    </>
  );
}

export default App;
