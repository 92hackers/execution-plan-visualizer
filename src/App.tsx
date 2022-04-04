import React, { useState, useEffect } from 'react';

import Plan from '@/components/Plan';

// Plan data
import rawPlanData from '@/test-data/with-cte.txt'

function App() {
  const [planData, setPlanData] = useState<string>('')
  useEffect(() => {
    // import(rawPlanData).then((data) => console.log(data))
    console.log(rawPlanData)
    setPlanData(rawPlanData)
  }, [])

  return (
    <div className="App">
      {
        planData && (
          <Plan
            planSource={planData}
            planQuery={''}
          />
        )
      }
    </div>
  );
}

export default App;
