// // client/src/App.js
// import React from 'react';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './styles.css';
// import Navbar from './components/Navbar';
// import DataForm from './components/DataForm';

// function App() {
//   return (
//     <div className="app">
//       <Navbar />
//       <main className="container">
//         <DataForm />
//       </main>
//       <ToastContainer position="bottom-right" />
//     </div>
//   );
// }

// export default App;




// client/src/App.js
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';
import Navbar from './components/Navbar';
import DataForm from './components/DataForm';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <DataForm />
      </main>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;
