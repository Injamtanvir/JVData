// import React from 'react';
// import Navbar from './components/Navbar';
// import DataForm from './components/DataForm';

// function App() {
//   return (
//     <div className="App">
//       <Navbar />
//       <div className="container py-4">
//         <DataForm />
//       </div>
//     </div>
//   );
// }

// export default App;



// client/src/App.js
import React from 'react';
import DataForm from './components/DataForm';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="container py-4">
        <DataForm />
      </div>
    </div>
  );
}

export default App;