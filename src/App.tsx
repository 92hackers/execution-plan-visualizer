import React from 'react';

import Plan from '@/components/Plan';

// Plan data
import data from '@/plan.json'

const stringData = JSON.stringify(data)

function App() {
  return (
    <div className="App">
      <Plan
        planSource={stringData}
        planQuery={''}
      />
    </div>
  );
}

export default App;
