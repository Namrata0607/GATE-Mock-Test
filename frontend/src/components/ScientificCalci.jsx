// import React from 'react';

// const ScientificCalculator = () => {
//   const openCalculator = () => {
//     window.open(
//       'https://www.tcsion.com/OnlineAssessment/ScientificCalculator/Calculator.html',
//       '_blank',
//       'width=800,height=600,top=100,left=100,toolbar=no,menubar=no,scrollbars=no,resizable=no'
//     );
//   };

//   // Automatically open the calculator when this component is rendered
//   React.useEffect(() => {
//     openCalculator();
//   }, []);

//   return null; // No UI is rendered for this component
// };

// export default ScientificCalculator;

import React, { useState } from 'react';
import Modal from 'react-modal';

const ScientificCalculator = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to open the modal
  const openModal = () => setIsOpen(true);

  // Function to close the modal
  const closeModal = () => setIsOpen(false);

  return (
    <div>
      <button onClick={openModal}>Open Calculator</button>

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Calculator Modal"
        ariaHideApp={false}
      >
        <button onClick={closeModal}>Close</button>
        <div style={{ height: '80vh', overflow: 'auto' }}>
          <iframe 
            src="https://www.tcsion.com/OnlineAssessment/ScientificCalculator/Calculator.html"
            width="100%"
            height="100%"
            title="Calculator"
          />
        </div>
      </Modal>
    </div>
  );
};

export default ScientificCalculator;
