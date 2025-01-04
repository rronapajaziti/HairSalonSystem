import React from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import ChartOne from '../components/Charts/ChartOne';
import ChartTwo from '../components/Charts/ChartTwo';
import ChartThree from '../components/Charts/ChartThree';

const Chart: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Chart" />

      {/* Grid layout for charts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px', // Add spacing between charts
          margin: '20px',
        }}
      >
        {/* Chart One */}
        <div>
          <ChartOne />
        </div>

        {/* Chart Two */}
        <div>
          <ChartTwo />
        </div>

        {/* Chart Three */}
        <div>
          <ChartThree />
        </div>
      </div>
    </>
  );
};

export default Chart;
